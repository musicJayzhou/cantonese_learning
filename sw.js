"use strict";
/* ================= Service Worker：媒体缓存 =================
 * 目标：重复访问秒开、省流量；已学内容弱网/离线可用。
 * 策略：
 *  - audio/ img/ 媒体 → stale-while-revalidate：先回缓存，后台带 ETag 条件请求更新
 *  - 页面 / JS / CSS / data → network-first：保证代码与数据新鲜，离线回退缓存
 *  - iOS Safari 的 <audio> 会发 Range 请求 → 命中缓存时由完整 body 合成 206
 *  - 存储配额：超预算时按缓存时间从旧到新清理（FIFO 近似；iOS 配额紧张会整站驱逐，自控更安全）
 * 兼容：GitHub Pages 子路径 / dorami.vip 根路径同构，相对注册自动适配 scope；
 *       注册失败（如 iOS 无痕）时站点完全不经过本文件，功能不受影响。
 * 注意：保持 ES2018 语法（不用 ?. 和 ??），兼容较旧 iOS Safari。
 */

var VERSION = 'v1';
var PAGES = 'cl-pages-' + VERSION;
var MEDIA = 'cl-media-' + VERSION;

/* 媒体缓存预算：超出后从最旧条目开始清理 */
var MEDIA_BUDGET = 250 * 1024 * 1024;   // 250MB
/* 同一 URL 条件重验证的最小间隔，避免连点卡片产生 304 风暴 */
var REVAL_INTERVAL = 300 * 1000;        // 5 分钟

var _lastReval = {};                    // url -> ts（SW 重启即清空，可接受）

self.addEventListener('install', function (e) { self.skipWaiting(); });

self.addEventListener('activate', function (e) {
  e.waitUntil((async function () {
    var names = await caches.keys();
    await Promise.all(names.filter(function (n) {
      return n.indexOf('cl-') === 0 && n !== PAGES && n !== MEDIA;
    }).map(function (n) { return caches.delete(n); }));
    await self.clients.claim();
  })());
});

/* ---------- 工具 ---------- */

/* 重新封装响应：记录缓存时间；剥掉 content-encoding / vary，
   避免 Cache API 存下「已解码 body + 压缩头」的不一致组合及 Vary 匹配失败 */
function _stamp(res, buf) {
  var h = new Headers(res.headers);
  h.delete('content-encoding');
  h.delete('content-length');
  h.delete('vary');
  h.set('x-sw-cached-at', String(Date.now()));
  h.set('content-length', String(buf.byteLength));
  return new Response(buf, { status: res.status, statusText: res.statusText, headers: h });
}

/* 后台条件重验证（命中缓存时调用）：304 不动；200 换新；失败保留旧缓存 */
async function _revalidate(url, cache, etag) {
  var now = Date.now();
  if (now - (_lastReval[url] || 0) < REVAL_INTERVAL) return;
  _lastReval[url] = now;
  try {
    var headers = new Headers();
    if (etag) headers.set('If-None-Match', etag);
    /* no-cache：强制回源校验；HTTP 缓存有副本时浏览器会带条件头（304 很便宜） */
    var res = await fetch(new Request(url, { headers: headers, cache: 'no-cache' }));
    if (res.status === 200 && res.ok) {
      var buf = await res.arrayBuffer();
      await cache.put(url, _stamp(res, buf));
    }
  } catch (e) { /* 离线等情况：保留旧缓存 */ }
}

/* 从缓存的完整 body 合成 206 分段响应（iOS <audio> 的 Range 请求） */
async function _range206(stored, rangeHeader) {
  var buf = await stored.arrayBuffer();
  var size = buf.byteLength;
  var m = /^bytes=(\d*)-(\d*)$/.exec((rangeHeader || '').trim());
  if (!m) return new Response(buf, { status: 200, headers: stored.headers });
  var start, end;
  if (m[1] === '') {                            // bytes=-500（尾部）
    start = Math.max(0, size - (+m[2] || 0)); end = size - 1;
  } else {                                      // bytes=0-1 / bytes=100-
    start = +m[1];
    end = m[2] === '' ? size - 1 : Math.min(+m[2], size - 1);
  }
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + size } });
  }
  var h = new Headers(stored.headers);
  h.set('Content-Range', 'bytes ' + start + '-' + end + '/' + size);
  h.set('Accept-Ranges', 'bytes');
  h.set('Content-Length', String(end - start + 1));
  return new Response(buf.slice(start, end + 1), { status: 206, headers: h });
}

/* ---------- 媒体：SWR ---------- */
async function _media(req, event) {
  var cache = await caches.open(MEDIA);
  var range = req.headers.get('range');
  var hit = await cache.match(req.url);       // Cache API 按 URL 匹配，忽略 Range 头
  if (hit) {
    event.waitUntil(_revalidate(req.url, cache, hit.headers.get('etag')));
    return range ? _range206(hit, range) : hit;
  }
  if (range) return fetch(req);               // Range 未命中：回源透传（不缓存分段）
  try {
    var res = await fetch(req);
    if (res.status === 200 && res.ok) {
      var buf = await res.arrayBuffer();
      var stored = _stamp(res, buf);
      /* 注意顺序：cache.put 会消费 body，必须先克隆再 put，克隆过的留给自己返回 */
      try { await cache.put(req.url, stored.clone()); } catch (e) { /* 配额满：本次不缓存 */ }
      event.waitUntil(_trimMaybe());
      return stored;
    }
    return res;
  } catch (e) {
    return new Response('', { status: 504 });  // 离线且无缓存：audio 的 error 事件会接管提示
  }
}

/* ---------- 页面/代码：network-first ---------- */
async function _pages(req) {
  var cache = await caches.open(PAGES);
  try {
    var res = await fetch(req);
    if (res.ok) cache.put(req, res.clone()).catch(function () {});
    return res;
  } catch (e) {
    var hit = await cache.match(req);
    if (!hit && req.mode === 'navigate') {
      /* 带参数/直接访问子路径时，回退到站点根（已缓存的首页） */
      hit = await cache.match(new URL('./', self.registration.scope).href);
    }
    if (hit) return hit;
    throw e;
  }
}

/* ---------- 配额清理（约每分钟最多检查一次） ---------- */
var _lastTrim = 0;
async function _trimMaybe() {
  var now = Date.now();
  if (now - _lastTrim < 60 * 1000) return;
  _lastTrim = now;
  try {
    if (!self.navigator || !navigator.storage || !navigator.storage.estimate) return;
    var est = await navigator.storage.estimate();
    var usage = est.usage || 0;
    var budget = Math.min(MEDIA_BUDGET, (est.quota || Infinity) * 0.5);
    if (!usage || usage <= budget) return;
    var cache = await caches.open(MEDIA);
    var keys = await cache.keys();
    var entries = [];
    for (var i = 0; i < keys.length; i++) {
      var r = await cache.match(keys[i]);
      if (!r) continue;
      entries.push({
        k: keys[i],
        t: +(r.headers.get('x-sw-cached-at') || 0),
        s: +(r.headers.get('content-length') || 0)
      });
    }
    entries.sort(function (a, b) { return a.t - b.t; });   // 最旧先清
    var freed = 0;
    var target = usage - budget * 0.8;                     // 留 20% 余量，避免频繁触发
    for (var j = 0; j < entries.length && freed < target; j++) {
      await cache.delete(entries[j].k);
      freed += entries[j].s;
    }
  } catch (e) { /* 清理失败不影响主流程 */ }
}

/* ---------- 路由 ---------- */
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  var p = url.pathname;
  if (/\/(audio|img)\//.test(p)) { e.respondWith(_media(req, e)); return; }
  if (req.mode === 'navigate' || p.endsWith('/') || /\.(html?|js|css|json|webmanifest)$/.test(p)) {
    e.respondWith(_pages(req));
  }
});
