"use strict";
/* ================= sw.js 冒烟测试（Node ≥18，无浏览器） =================
 * 在 node 里模拟 Service Worker 环境（caches / fetch / self / 事件），
 * 验证 sw.js 的核心缓存行为：
 *   1. 媒体完整 GET：未命中回源并写缓存；命中直返缓存
 *   2. 命中后后台条件重验证（带 If-None-Match，304 不动 / 200 换新）
 *   3. Range 请求：命中合成 206（字节正确）；未命中回源透传
 *   4. 离线：媒体/页面回退缓存；导航回退站点根
 *   5. _stamp 剥除 content-encoding / vary，记录 x-sw-cached-at
 * 运行：node scripts/test-sw.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

/* ---------- Cache API mock ---------- */
function makeCaches() {
  const stores = new Map();   // name -> Map(url -> Response)
  return {
    open: async (name) => {
      if (!stores.has(name)) stores.set(name, new Map());
      const m = stores.get(name);
      return {
        match: async (req) => {
          const u = typeof req === 'string' ? req : req.url;
          const r = m.get(u);
          return r ? r.clone() : undefined;
        },
        put: async (req, res) => {
          /* 真实 Cache API 的 put 会消费 body——mock 必须同样消费，
             否则测不出「put 后再 clone/使用原响应」的回归 */
          const buf = await res.arrayBuffer();
          m.set(typeof req === 'string' ? req : req.url,
            new Response(buf, { status: res.status, statusText: res.statusText, headers: res.headers }));
        },
        delete: async (req) => m.delete(typeof req === 'string' ? req : req.url),
        keys: async () => [...m.keys()].map(u => new Request(u)),
      };
    },
    keys: async () => [...stores.keys()],
    delete: async (name) => stores.delete(name),
  };
}

/* ---------- 网络 mock ---------- */
const network = {
  files: new Map(),   // url -> {body: Uint8Array, etag, headers}
  calls: [],
  fail: false,
};
function setFile(url, text, etag, extraHeaders) {
  network.files.set(url, {
    body: new TextEncoder().encode(text),
    etag,
    headers: extraHeaders || {},
  });
}
async function mockFetch(input, init) {
  const req = input instanceof Request ? input : new Request(input, init);
  network.calls.push({
    url: req.url,
    inm: req.headers.get('if-none-match'),
    range: req.headers.get('range'),
    cache: req.cache,
  });
  if (network.fail) throw new TypeError('offline');
  const f = network.files.get(req.url);
  if (!f) return new Response('not found', { status: 404 });
  if (req.headers.get('if-none-match') === f.etag) {
    return new Response(null, { status: 304 });
  }
  const range = req.headers.get('range');
  if (range) {
    const m = /^bytes=(\d+)-(\d*)$/.exec(range);
    const s = +m[1], e = m[2] ? +m[2] : f.body.length - 1;
    return new Response(f.body.slice(s, e + 1), {
      status: 206,
      headers: { 'Content-Range': `bytes ${s}-${e}/${f.body.length}` },
    });
  }
  return new Response(f.body, {
    status: 200,
    headers: Object.assign({ ETag: f.etag, 'Content-Type': 'audio/mpeg' }, f.headers),
  });
}

/* ---------- SW 环境 mock ---------- */
const listeners = {};
const selfMock = {
  location: { origin: 'https://test.local' },
  registration: { scope: 'https://test.local/' },
  addEventListener: (type, fn) => { listeners[type] = fn; },
  skipWaiting: () => {},
  clients: { claim: async () => {} },
};
const cachesMock = makeCaches();

const sandbox = {
  self: selfMock,
  caches: cachesMock,
  fetch: mockFetch,
  URL, Request, Response, Headers, TextEncoder, console,
};
vm.createContext(sandbox);
const swSrc = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');
vm.runInContext(swSrc, sandbox, { filename: 'sw.js' });

function navRequest(url) {
  const r = new Request(url);
  Object.defineProperty(r, 'mode', { value: 'navigate' });   // undici 不允许构造 navigate，实例上覆盖
  return r;
}
function makeEvent(req) {
  const ev = { request: req, _wait: [], _res: null,
    respondWith(p) { this._res = p; },
    waitUntil(p) { this._wait.push(Promise.resolve(p).catch(() => {})); },
    async settled() { const r = await this._res; await Promise.all(this._wait); return r; },
  };
  return ev;
}
const fire = (req) => { const ev = makeEvent(req); listeners.fetch(ev); return ev; };
const bodyText = (res) => res.text().then(t => t);

/* ---------- 测试 ---------- */
(async () => {
  // activate：旧版本缓存应被清理
  await cachesMock.open('cl-media-v0');
  await new Promise((resolve) => listeners.activate({ waitUntil(p) { Promise.resolve(p).then(resolve); } }));
  assert.deepStrictEqual(await cachesMock.keys(), [], 'activate 应清理 cl-* 旧缓存');
  console.log('PASS 1  activate 清理旧缓存');

  // 2. 媒体完整 GET 未命中：回源 200 并写缓存（_stamp 剥头 + 记录时间）
  setFile('https://test.local/audio/lesson01/a.mp3', 'AUDIO-DATA-0123456789', 'E1',
    { 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' });
  let ev = fire(new Request('https://test.local/audio/lesson01/a.mp3'));
  let res = await ev.settled();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(await bodyText(res), 'AUDIO-DATA-0123456789');
  assert.strictEqual(res.headers.get('content-encoding'), null, '缓存副本不应带 content-encoding');
  assert.strictEqual(res.headers.get('vary'), null);
  assert.ok(res.headers.get('x-sw-cached-at'), '应记录缓存时间');
  console.log('PASS 2  媒体未命中：回源 + _stamp 剥头');

  // 3. 命中：直返缓存，后台带 If-None-Match 重验证（304 不动）
  const callsBefore = network.calls.length;
  ev = fire(new Request('https://test.local/audio/lesson01/a.mp3'));
  res = await ev.settled();
  assert.strictEqual(await bodyText(res), 'AUDIO-DATA-0123456789');
  const reval = network.calls.slice(callsBefore);
  assert.strictEqual(reval.length, 1, '命中只触发一次后台重验证');
  assert.strictEqual(reval[0].inm, 'E1', '重验证应带 If-None-Match');
  assert.strictEqual(reval[0].cache, 'no-cache');
  console.log('PASS 3  命中直返缓存 + ETag 条件重验证');

  // 4. Range 命中：合成 206，字节正确
  ev = fire(new Request('https://test.local/audio/lesson01/a.mp3', { headers: { Range: 'bytes=0-9' } }));
  res = await ev.settled();
  assert.strictEqual(res.status, 206);
  assert.strictEqual(res.headers.get('content-range'), 'bytes 0-9/21');
  assert.strictEqual(res.headers.get('content-length'), '10');
  assert.strictEqual(await bodyText(res), 'AUDIO-DATA');
  console.log('PASS 4  Range 命中合成 206（含 Content-Range/Length）');

  // 5. Range 未命中：回源透传（不缓存分段）
  setFile('https://test.local/audio/lesson01/b.mp3', 'B-MP3-BODY', 'E2');
  const callsBefore5 = network.calls.length;
  ev = fire(new Request('https://test.local/audio/lesson01/b.mp3', { headers: { Range: 'bytes=0-1' } }));
  res = await ev.settled();
  assert.strictEqual(res.status, 206, '未命中 Range 应透传回源 206');
  assert.ok(network.calls.slice(callsBefore5).some(c => c.range === 'bytes=0-1'));
  const mediaCache = await cachesMock.open('cl-media-v1');
  assert.strictEqual(await mediaCache.match('https://test.local/audio/lesson01/b.mp3'), undefined,
    '分段响应不应写入缓存');
  console.log('PASS 5  Range 未命中透传且不缓存分段');

  // 6. 重验证 200（内容变了）：下次命中返回新内容（用新 URL 避开 5 分钟重验证去重）
  setFile('https://test.local/audio/lesson01/c.mp3', 'OLD', 'E3');
  ev = fire(new Request('https://test.local/audio/lesson01/c.mp3'));
  await ev.settled();
  setFile('https://test.local/audio/lesson01/c.mp3', 'NEW-CONTENT', 'E4');
  ev = fire(new Request('https://test.local/audio/lesson01/c.mp3'));   // 本次仍回 OLD，但后台换新
  res = await ev.settled();
  assert.strictEqual(await bodyText(res), 'OLD', 'SWR 本次先回旧缓存');
  ev = fire(new Request('https://test.local/audio/lesson01/c.mp3'));
  res = await ev.settled();
  assert.strictEqual(await bodyText(res), 'NEW-CONTENT', '后台重验证后应返回新内容');
  console.log('PASS 6  SWR：先旧后新，自动更新');

  // 7. 离线：媒体命中缓存仍可播
  network.fail = true;
  ev = fire(new Request('https://test.local/audio/lesson01/a.mp3'));
  res = await ev.settled();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(await bodyText(res), 'AUDIO-DATA-0123456789');
  console.log('PASS 7  离线媒体回退缓存');

  // 8. 页面 network-first：在线缓存；离线回退；导航带参数回退站点根
  network.fail = false;
  setFile('https://test.local/', '<html>首页</html>', 'H1');
  ev = fire(navRequest('https://test.local/'));
  res = await ev.settled();
  assert.strictEqual(await bodyText(res), '<html>首页</html>');
  network.fail = true;
  ev = fire(navRequest('https://test.local/'));
  res = await ev.settled();
  assert.strictEqual(await bodyText(res), '<html>首页</html>', '离线导航应回退缓存首页');
  console.log('PASS 8  页面 network-first + 离线回退');

  // 9. 离线且无缓存的媒体：返回 504（页面 error 事件接管提示）
  ev = fire(new Request('https://test.local/audio/lesson99/x.mp3'));
  res = await ev.settled();
  assert.strictEqual(res.status, 504);
  console.log('PASS 9  离线未缓存媒体返回 504');

  console.log('\n全部通过 ✔');
})().catch((e) => { console.error('FAIL:', e); process.exit(1); });
