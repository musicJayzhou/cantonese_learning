"use strict";
/* ================= 记忆卡 (flashcards) ================= */
let fcPool = [], fcIdx = 0, fcSec = 'all';
function allFlashItems(){
  const out = [];
  const push = (sec, it) => out.push({sec, zh:it.zh, jyut:it.jyut, en:it.en||'', audio:it.audio||''});
  DATA.sections.forEach(sec=>{
    if(sec.id==='colour'||sec.id==='shape'){
      sec.items.forEach(it=>push(sec.title,it));
      sec.sentences.forEach(s=>push(sec.title+'·句', {zh:s.zh, jyut:s.jyut, en:s.en, audio:s.audio}));
    }
    if(sec.id==='lesson1'){
      sec.vocab.forEach(it=>push('第一課·生字',it));
      sec.classifiers.forEach(it=>push('第一課·量詞',it));
      sec.supp.forEach(it=>push('第一課·傢俬',it));
    }
    if(sec.id==='suyu') sec.items.forEach(it=>push('俗語', {zh:it.zh, jyut:it.jyut, en:it.scene, audio:it.audio}));
    if(sec.id==='tongue') sec.words.forEach(it=>push('急口令',it));
  });
  return out;
}
const FC_ALL = allFlashItems();
const FC_SECS = ['all','顏色 Colour','形狀 Shape','第一課·生字','第一課·量詞','第一課·傢俬','俗語'];
/* 记忆卡/学习页标记共用的 ID 前缀映射 */
const MARK_PREFIX = {'顏色 Colour':'colour','形狀 Shape':'shape','第一課·生字':'lesson1-v','第一課·量詞':'lesson1-c','第一課·傢俬':'lesson1-s'};

function fcBuildPool(){
  let pool = fcSec==='all' ? FC_ALL.slice() : FC_ALL.filter(x=>x.sec===fcSec);
  // 优先出"需加强"的卡（按学习页共用的标记 ID 判断）
  pool.sort((a,b)=>{
    const pa = (MARK_PREFIX[a.sec]||a.sec)+'|'+a.zh, pb = (MARK_PREFIX[b.sec]||b.sec)+'|'+b.zh;
    const ma = marks[pa]==='hard'?-1:0, mb = marks[pb]==='hard'?-1:0;
    return ma-mb || Math.random()-.5;
  });
  fcPool = pool; fcIdx = 0;
}
function renderCards(){
  const v = $('#view-cards');
  let h = `<div class="fc-sec-row">` + FC_SECS.map(s=>`<button class="tab ${fcSec===s?'on':''}" onclick="fcSetSec('${s}')">${s==='all'?'🌈 全部':s}</button>`).join('') + `</div>`;
  if(!fcPool.length){ h += `<div class="empty-tip">呢個分類冇卡片 😅</div>`; v.innerHTML=h; return; }
  const c = fcPool[fcIdx];
  h += `<div class="fc-nav"><button onclick="fcMove(-1)">← 上一張</button><span>${fcIdx+1} / ${fcPool.length} · ${esc(c.sec)}</span><button onclick="fcMove(1)">下一張 →</button></div>`;
  h += `<div class="fc-wrap"><div class="fc" id="fcCard" onclick="this.classList.toggle('flip')">
    <div class="face front">
      <div class="big">${esc(c.zh)}</div>
      ${c.audio?`<button type="button" class="chip fc-audio" data-audio="${c.audio}" onclick="event.stopPropagation()">🔊 聽發音</button>`:''}
      <div class="hint">👆 點擊卡面翻面睇答案</div>
    </div>
    <div class="face back">
      <div class="big-jy">${esc(c.jyut)}</div>
      <div class="en-line">${esc(c.en)}</div>
      ${c.audio?`<button type="button" class="chip fc-audio" data-audio="${c.audio}" onclick="event.stopPropagation()">🔊 播放發音</button>`:`<div class="hint">（呢類詞暫無單獨音頻）</div>`}
    </div>
  </div></div>`;
  h += `<div class="fc-tools">
    <button type="button" class="btn-flip" onclick="document.getElementById('fcCard').classList.toggle('flip')">🔄 翻面</button>
    <button type="button" class="btn-good" onclick="fcMark('known',event)">✅ 識喇</button>
    <button type="button" class="btn-bad" onclick="fcMark('hard',event)">❗ 未熟</button>
  </div>`;
  v.innerHTML = h;
  // 专用直绑做双保险；全局委托内有 250ms 去重，不会重复播放
  v.querySelectorAll('.fc-audio').forEach(ab=>{
    ab.addEventListener('click', e=>{
      e.stopPropagation();
      const now = Date.now();
      if(ab.dataset.lastPlay && now - ab.dataset.lastPlay < 250) return;
      ab.dataset.lastPlay = now;
      play(ab.dataset.audio, ab);
    });
  });
}
window.fcSetSec = s => { fcSec = s; fcBuildPool(); renderCards(); };
window.fcMove = d => { fcIdx = (fcIdx + d + fcPool.length) % fcPool.length; renderCards(); };
window.fcMark = (m, ev) => {
  const c = fcPool[fcIdx];
  const id = (MARK_PREFIX[c.sec] || c.sec) + '|' + c.zh;
  const el = ev && ev.currentTarget;
  if(m==='known'){ marks[id]='known'; addStars(1, el); toast('✅ 已掌握 +1⭐'); }
  else { marks[id]='hard'; toast('❗ 加入重點複習'); }
  store.set('marks', marks);
  fcMove(1);
};
