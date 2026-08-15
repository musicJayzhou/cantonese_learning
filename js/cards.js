"use strict";
/* ================= 记忆卡 (flashcards) ================= */
let fcPool = [], fcIdx = 0, fcSec = 'all';

/* 汇总指定课程的全部闪卡条目；mk 为与学习页共用的标记 ID */
function flashItemsOf(courses){
  const out = [];
  const push = (cid, secTitle, secKey, it) => out.push({
    cid, sec: secTitle, mk: mkid(cid, secKey, it.zh),
    zh: it.zh, jyut: it.jyut, en: it.en || '', audio: it.audio || '', img: it.img || ''
  });
  courses.forEach(course=>{
    const cid = course.meta.id;
    (course.sections||[]).forEach(sec=>{
      if(sec.type==='vocab'){
        const items = sec.groups ? sec.groups.flatMap(g=>g.items) : (sec.items||[]);
        items.forEach(it=>push(cid, sec.title, sec.id, it));
        (sec.sentences||[]).forEach(s=>push(cid, sec.title+'·句', sec.title+'·句', s));
      }
      if(sec.type==='dialog'){
        (sec.vocab||[]).forEach(it=>push(cid, sec.title, cid==='lesson01'?'lesson1-v':sec.id+'-v', it));
        (sec.classifiers||[]).forEach(it=>push(cid, '第一課·量詞', 'lesson1-c', it));
        (sec.supp||[]).forEach(it=>push(cid, '第一課·傢俬', 'lesson1-s', it));
      }
      if(sec.type==='suyu') sec.items.forEach(it=>push(cid, sec.title, '俗語', {zh:it.zh, jyut:it.jyut, en:it.scene, audio:it.audio}));
      if(sec.type==='tongue') sec.words.forEach(it=>push(cid, sec.title, cid==='lesson01'?'急口令':sec.id, it));
    });
  });
  return out;
}

/* 当前练习范围内的条目与分类 */
function scopedFlashItems(){ return flashItemsOf(pracCourses()); }
function fcSecsOf(items){
  const secs = [...new Set(items.map(x=>x.sec))];
  return ['all', ...secs];
}

function fcBuildPool(){
  const all = scopedFlashItems();
  let pool = fcSec==='all' ? all.slice() : all.filter(x=>x.sec===fcSec);
  // 优先出"需加强"的卡（与学习页共用的标记 ID）
  pool.sort((a,b)=>{
    const ma = marks[a.mk]==='hard'?-1:0, mb = marks[b.mk]==='hard'?-1:0;
    return ma-mb || Math.random()-.5;
  });
  fcPool = pool; fcIdx = 0;
}
function renderCards(){
  const v = $('#view-cards');
  const items = scopedFlashItems();
  const secs = fcSecsOf(items);
  if(fcSec!=='all' && !secs.includes(fcSec)) fcSec = 'all';
  let h = pracChipsHTML();
  h += `<div class="fc-sec-row">` + secs.map(s=>`<button class="tab ${fcSec===s?'on':''}" onclick="fcSetSec('${s.replace(/'/g,"\\'")}')">${s==='all'?'🌈 全部':esc(s)}</button>`).join('') + `</div>`;
  if(!fcPool.length){ fcBuildPool(); }
  if(!fcPool.length){ h += `<div class="empty-tip">呢個分類冇卡片 😅</div>`; v.innerHTML=h; return; }
  const c = fcPool[fcIdx];
  h += `<div class="fc-nav"><button onclick="fcMove(-1)">← 上一張</button><span>${fcIdx+1} / ${fcPool.length} · ${esc(c.sec)}</span><button onclick="fcMove(1)">下一張 →</button></div>`;
  h += `<div class="fc-wrap"><div class="fc" id="fcCard" onclick="this.classList.toggle('flip')">
    <div class="face front">
      ${c.img?`<img class="fimg" src="${c.img}" alt="">`:''}
      <div class="big">${esc(c.zh)}</div>
      ${c.audio?`<button type="button" class="chip fc-audio" data-audio="${c.audio}" onclick="event.stopPropagation()">🔊 聽發音</button>`:''}
      <div class="hint">👆 點擊卡面翻面睇答案</div>
    </div>
    <div class="face back">
      ${c.img?`<img class="fimg" src="${c.img}" alt="">`:''}
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
  const el = ev && ev.currentTarget;
  if(m==='known'){ marks[c.mk]='known'; addStars(1, el); toast('✅ 已掌握 +1⭐'); }
  else { marks[c.mk]='hard'; toast('❗ 加入重點複習'); }
  store.set('marks', marks);
  fcMove(1);
};
