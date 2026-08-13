"use strict";
/* ================= 学习视图 ================= */
function cardHTML(secKey, it){
  const id = secKey + '|' + it.zh;
  const mk = markOf(id);
  const sw = SWATCH[it.zh] ? `<div class="sw" style="--c:${SWATCH[it.zh]};background:${SWATCH[it.zh]}"></div>` : '';
  const ic = SHAPE_IC[it.zh] ? `<div class="shape-ic">${SHAPE_IC[it.zh]}</div>` : '';
  const audioBtn = it.audio ? `<span class="playmini">🔊</span>` : '';
  const audioAttr = it.audio ? `data-audio="${it.audio}"` : '';
  return `<div class="card ${mk}" ${audioAttr} data-mkid="${esc(id)}">
    ${audioBtn}<span class="mk"></span>${sw}${ic}
    <div class="zh">${esc(it.zh)}</div>
    <div class="jy">${esc(it.jyut)}</div>
    <div class="en">${esc(it.en||'')}</div>
    ${it.cls?`<div class="cls">${esc(it.cls)}</div>`:''}
  </div>`;
}
function sentHTML(s){
  return `<div class="srow">
    <button class="pi" data-audio="${s.audio}">▶</button>
    <div class="tx"><div class="zh">${esc(s.zh)}</div><div class="jy">${esc(s.jyut)}</div><div class="en">${esc(s.en)}</div></div>
  </div>`;
}

function renderLearn(){
  const v = $('#view-learn');
  const sec = DATA.sections.find(s=>s.id===curSec);
  let h = '';
  h += `<div class="sec-head"><span class="ic">${sec.icon}</span><h2>${esc(sec.title)}</h2><span class="jp">${esc(sec.jyut)}</span></div>`;
  h += `<div class="tabs" style="margin:0 2px 12px" id="secTabs"></div>`;
  if(sec.grammar) h += `<div class="grammar"><b>📌 重點</b><br>${esc(sec.grammar)}</div>`;

  if(curSec==='colour' || curSec==='shape'){
    h += `<div class="learn-cols"><div class="learn-col">`;
    h += `<div class="sec-block">`;
    h += `<button class="big-play" data-audio="${sec.allInOne}"><span class="pi">▶</span><span>連續播放全部<small>All-in-one 一遍過</small></span></button>`;
    h += `<div class="sub-h">詞彙 · 點卡發音 🔊</div><div class="grid">` + sec.items.map(it=>cardHTML(curSec,it)).join('') + `</div>`;
    h += `</div></div><div class="learn-col">`;
    h += `<div class="sec-block">`;
    h += `<div class="sub-h">句型對話 · 點讀</div>` + sec.sentences.map(sentHTML).join('');
    h += `</div></div></div>`;
  }
  else if(curSec==='lesson1'){
    h += `<div class="sec-block">`;
    h += `<div class="sub-h">生字 26 個</div>`;
    h += `<button class="big-play" data-audio="${sec.audioVocab}"><span class="pi">▶</span><span>生字朗讀<small>Vocabulary all-in-one</small></span></button>`;
    h += `<div class="grid">` + sec.vocab.map(it=>cardHTML('lesson1-v',it)).join('') + `</div>`;
    h += `</div>`;
    h += `<div class="sec-block">`;
    h += `<div class="sub-h">對話 · 去買嘢 🗣️</div>`;
    h += `<button class="big-play" data-audio="${sec.audioDialogue}"><span class="pi">▶</span><span>整段對話<small>Dialogue all-in-one</small></span></button>`;
    h += sec.dialogue.map(d=>`<div class="srow"><div class="tx">
      <div class="zh">【${d.tag}】${esc(d.zh)}</div><div class="jy">${esc(d.jyut)}</div><div class="en">${esc(d.en)}</div></div></div>`).join('');
    h += `</div>`;
    h += `<div class="sec-block">`;
    h += `<div class="sub-h">理解短文 📖</div>`;
    h += `<button class="big-play" data-audio="${sec.audioComp}"><span class="pi">▶</span><span>短文朗讀<small>Comprehension all-in-one</small></span></button>`;
    h += `<div class="comp-box">${esc(sec.comprehension)}</div>`;
    h += `</div>`;
    h += `<div class="sec-block">`;
    h += `<div class="sub-h">係唔係呀？判斷題（答啱 +2⭐）</div>`;
    h += sec.compQA.map((q,i)=>`<div class="tf-row" data-i="${i}"><div class="q">${esc(q.s)}<div class="ans">${esc(q.a)}</div></div>
      <button class="b-y" onclick="tfAnswer(this,true)">係 ✓</button><button class="b-n" onclick="tfAnswer(this,false)">唔係 ✗</button></div>`).join('');
    h += `</div>`;
    h += `<div class="sec-block">`;
    h += `<div class="sub-h">量詞 10 個 🧮</div>`;
    h += `<button class="big-play" data-audio="${sec.audioClassifier}"><span class="pi">▶</span><span>量詞朗讀<small>Classifier all-in-one</small></span></button>`;
    h += `<div class="grid">` + sec.classifiers.map(it=>cardHTML('lesson1-c',it)).join('') + `</div>`;
    h += `</div>`;
    h += `<div class="sec-block">`;
    h += `<div class="sub-h">補充生字 · 傢俬 🛋️</div>`;
    h += `<button class="big-play" data-audio="${sec.audioSupp}"><span class="pi">▶</span><span>傢俬詞彙朗讀<small>Supplementary all-in-one</small></span></button>`;
    h += `<div class="grid">` + sec.supp.map(it=>cardHTML('lesson1-s',it)).join('') + `</div>`;
    h += `</div>`;
  }
  else if(curSec==='suyu'){
    h += `<div class="sec-block">`;
    h += `<button class="big-play" data-audio="${sec.allInOne}"><span class="pi">▶</span><span>全部俗語朗讀<small>All-in-one</small></span></button>`;
    h += `<div class="suyu-list">`;
    h += sec.items.map((it,i)=>`<div class="suyu-card" id="suyu${i}">
      <div class="suyu-head">
        <div class="no">${i+1}</div>
        <div class="t"><div class="zh">${esc(it.zh)}</div><div class="jy">${esc(it.jyut)}</div></div>
        <button class="pi" style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--acc2),#5a3ee0);display:grid;place-items:center;flex:none" data-audio="${it.audio}">▶</button>
      </div>
      <div style="margin-top:10px"><button class="chip" onclick="this.closest('.suyu-card').classList.toggle('open')">📖 情景 · 例句 · 解釋</button></div>
      <div class="suyu-body">
        <div class="lbl">情景</div><p>${esc(it.scene)}</p>
        <div class="lbl">例句</div><p>${esc(it.example)}</p>
        <div class="lbl">解釋</div><p>${esc(it.note)}</p>
        ${it.variants?`<div class="lbl">「××聲」系列 · 點讀</div>`+it.variants.map(v=>`<button class="chip" data-audio="${v.audio}">🔊 ${esc((v.zh+' '+v.jyut).trim())}</button>`).join(''):''}
      </div>
    </div>`).join('');
    h += `</div></div>`;
  }
  else if(curSec==='tongue'){
    const t = sec;
    h += `<div class="sec-block">`;
    h += `<div class="tt-big">${esc(t.full.zh)}</div><div class="tt-jy">${esc(t.full.jyut)}</div>`;
    h += `<div class="tt-words">` + t.words.map(w=>`<button class="tt-word" data-audio="${w.audio}"><div class="z">${esc(w.zh)}</div><div class="j">${esc(w.jyut)}</div></button>`).join('') + `</div>`;
    h += `<button class="big-play" data-audio="${t.full.audio}"><span class="pi">▶</span><span>完整句點讀<small>逐詞跟讀後挑戰下面三檔速度！</small></span></button>`;
    h += `<div class="sub-h">速度挑戰 🏁（聽完即跟讀）</div><div class="speed-row">` +
      t.speeds.map((s,i)=>`<button class="speed-btn ${i===2?'hot':''}" data-audio="${s.audio}" onclick="speedDone('${s.label}')">${['🐢','🐇','🚀'][i]} ${s.label}</button>`).join('') + `</div>`;
    h += `<div class="grammar">💡 秘笈：先逐詞讀準 <b>yahp / saht-yihm-sāt / gahm / gán-gāp-jai</b>，再連讀。快速檔能一口氣讀 3 遍就畢業啦！</div>`;
    h += `</div>`;
  }
  v.innerHTML = h;
  renderSecTabs();
}
function renderSecTabs(){
  const el = $('#secTabs');
  if(!el) return;
  el.innerHTML = SEC_TABS.map(t=>`<button class="tab ${t.id===curSec?'on':''}" data-s="${t.id}">${t.label}</button>`).join('');
}
function speedDone(label){
  if(label==='快速'){ confetti(60); toast('🚀 快速挑戰！跟得上就勁！'); }
}
window.tfAnswer = function(btn, saidYes){
  const row = btn.closest('.tf-row');
  if(row.classList.contains('done')) return;
  row.classList.add('done');
  // 所有句子都是錯的（課文判斷題設計），正確答案是「唔係」
  const correct = !saidYes;
  if(correct){ addStars(2, btn); btn.style.outline='2px solid var(--good)'; toast('答啱咗！+2⭐'); }
  else { btn.style.outline='2px solid var(--bad)'; toast('唔啱，睇吓解釋👀'); }
};

/* 长按/右键 卡片标记 掌握/困难 */
function cycleMark(c){
  const id = c.dataset.mkid;
  const cur = marks[id];
  c.classList.remove('pop-in'); void c.offsetWidth; c.classList.add('pop-in');
  if(!cur){ marks[id]='known'; c.classList.remove('hard'); c.classList.add('known'); addStars(1, c); toast('✅ 標記為已掌握 +1⭐'); }
  else if(cur==='known'){ marks[id]='hard'; c.classList.remove('known'); c.classList.add('hard'); toast('❗ 標記為需加強'); }
  else { delete marks[id]; c.classList.remove('hard'); toast('↩️ 已取消標記'); }
  store.set('marks', marks);
}
let pressTimer = null;
document.addEventListener('touchstart', e=>{
  const c = e.target.closest('[data-mkid]'); if(!c) return;
  pressTimer = setTimeout(()=>cycleMark(c), 550);
}, {passive:true});
document.addEventListener('touchend', ()=>clearTimeout(pressTimer));
document.addEventListener('touchmove', ()=>clearTimeout(pressTimer));
document.addEventListener('contextmenu', e=>{
  const c = e.target.closest('[data-mkid]'); if(!c) return;
  e.preventDefault(); clearTimeout(pressTimer); cycleMark(c);
});
