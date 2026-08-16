"use strict";
/* ================= 学习视图 ================= */
/* 词汇卡：图文 / 色条 / 形状图标 / 变体发音 chips；长按或右键标记 */
function cardHTML(courseId, secKey, it){
  const id = mkid(courseId, secKey, it.zh);
  const mk = markOf(id);
  const sw = SWATCH[it.zh] ? `<div class="sw" style="--c:${SWATCH[it.zh]};background:${SWATCH[it.zh]}"></div>` : '';
  const ic = SHAPE_IC[it.zh] ? `<div class="shape-ic">${SHAPE_IC[it.zh]}</div>` : '';
  const audioBtn = it.audio ? `<span class="playmini">🔊</span>` : '';
  const audioAttr = it.audio ? `data-audio="${it.audio}"` : '';
  const img = it.img ? `<img class="cimg" src="${it.img}" loading="lazy" alt="${esc(it.zh)}">` : '';
  const vchips = (it.variants||[]).filter(v=>v.audio).map(v=>
    `<span class="vchip" data-audio="${v.audio}">🔊 ${esc(v.jyut)}</span>`).join('');
  return `<div class="card ${mk}${it.img?' has-img':''}" ${audioAttr} data-mkid="${esc(id)}">
    ${audioBtn}<span class="mk"></span>${sw}${ic}${img}
    <div class="zh">${esc(it.zh)}</div>
    <div class="jy">${esc(it.jyut)}</div>
    <div class="en">${esc(it.en||'')}</div>
    ${it.cls?`<div class="cls">${esc(it.cls)}</div>`:''}
    ${it.note?`<div class="note">${esc(it.note)}</div>`:''}
    ${vchips?`<div class="vchips">${vchips}</div>`:''}
  </div>`;
}
function sentHTML(s){
  return `<div class="srow">
    <button class="pi" data-audio="${s.audio}">▶</button>
    <div class="tx"><div class="zh">${esc(s.zh)}</div><div class="jy">${esc(s.jyut)}</div><div class="en">${esc(s.en)}</div></div>
  </div>`;
}
function bigPlayHTML(audio, label, sub){
  return `<button class="big-play" data-audio="${audio}"><span class="pi">▶</span><span>${label}<small>${sub}</small></span></button>`;
}

function lessonTabsHTML(){
  return `<div class="tabs lesson-tabs" id="lessonTabs">` + COURSES.map(c=>
    `<button class="tab ${c.meta.id===curLesson?'on':''}" data-l="${c.meta.id}">${c.meta.lesson}</button>`).join('') + `</div>`;
}

function renderLearn(){
  const v = $('#view-learn');
  const course = curCourse();
  let sec = course.sections.find(s=>s.id===curSec);
  if(!sec){ sec = course.sections[0]; curSec = sec.id; }
  const cid = course.meta.id;
  let h = lessonTabsHTML();
  h += `<div class="sec-head"><span class="ic">${sec.icon}</span><h2>${esc(sec.title)}</h2><span class="jp">${esc(sec.jyut)}</span></div>`;
  h += `<div class="tabs" style="margin:0 2px 12px" id="secTabs"></div>`;
  if(sec.grammar) h += `<div class="grammar"><b>📌 重點</b><br>${esc(sec.grammar)}</div>`;

  /* ---------- 词汇型（顏色/形狀/生果/蔬菜） ---------- */
  if(sec.type==='vocab'){
    const hasSent = sec.sentences && sec.sentences.length;
    if(sec.groups){
      /* 分组词汇（蔬菜） */
      h += `<div class="sec-block">`;
      if(sec.allInOne) h += bigPlayHTML(sec.allInOne, '連續播放全部', 'All-in-one 一遍過');
      h += `<div class="sub-h">詞彙 · 點卡發音 🔊（長按標記） · 共 ${sec.groups.reduce((n,g)=>n+g.items.length,0)} 詞</div></div>`;
      sec.groups.forEach(g=>{
        h += `<div class="sec-block"><div class="sub-h">${esc(g.name)}</div><div class="grid">`
          + g.items.map(it=>cardHTML(cid, sec.id, it)).join('') + `</div></div>`;
      });
    }
    else if(hasSent){
      /* 词汇 + 句型双栏（顏色/形狀） */
      h += `<div class="learn-cols"><div class="learn-col">`;
      h += `<div class="sec-block">`;
      if(sec.allInOne) h += bigPlayHTML(sec.allInOne, '連續播放全部', 'All-in-one 一遍過');
      h += `<div class="sub-h">詞彙 · 點卡發音 🔊</div><div class="grid">` + sec.items.map(it=>cardHTML(cid, sec.id, it)).join('') + `</div>`;
      h += `</div></div><div class="learn-col">`;
      h += `<div class="sec-block">`;
      h += `<div class="sub-h">句型對話 · 點讀</div>` + sec.sentences.map(sentHTML).join('');
      h += `</div></div></div>`;
    }
    else {
      /* 纯词汇（生果） */
      h += `<div class="sec-block">`;
      if(sec.allInOne) h += bigPlayHTML(sec.allInOne, '連續播放全部', 'All-in-one 一遍過');
      h += `<div class="sub-h">詞彙 · 點卡發音 🔊（長按標記） · 共 ${sec.items.length} 詞</div>`;
      h += `<div class="grid">` + sec.items.map(it=>cardHTML(cid, sec.id, it)).join('') + `</div>`;
      h += `</div>`;
    }
  }
  /* ---------- 对话课文型（去買嘢 / 買雜果沙律） ---------- */
  else if(sec.type==='dialog'){
    if(sec.blocks){
      /* 动态 blocks（第02堂沙律对话） */
      sec.blocks.forEach(b=>{
        if(b.kind==='vocab'){
          h += `<div class="sec-block"><div class="sub-h">${esc(b.label)}</div>`;
          if(sec.audioVocab) h += bigPlayHTML(sec.audioVocab, '生字朗讀', 'Vocabulary all-in-one');
          h += `<div class="grid">` + sec[b.key].map(it=>cardHTML(cid, sec.id+'-v', it)).join('') + `</div></div>`;
        }
        else if(b.kind==='dialogue'){
          h += `<div class="sec-block"><div class="sub-h">${esc(b.label)}</div>`;
          if(sec.audioDialogue) h += bigPlayHTML(sec.audioDialogue, '整段對話', 'Dialogue all-in-one');
          h += sec[b.key].map(d=>`<div class="srow">
            ${d.audio?`<button class="pi" data-audio="${d.audio}">▶</button>`:''}
            <div class="tx"><div class="zh">【${d.tag}】${esc(d.zh)}</div><div class="jy">${esc(d.jyut)}</div><div class="en">${esc(d.en)}</div>
            ${(d.variants||[]).length?`<div class="vchips">`+d.variants.map(x=>`<span class="vchip" data-audio="${x.audio}">🔊 ${esc(x.jyut)}</span>`).join('')+`</div>`:''}
            </div></div>`).join('');
          h += `</div>`;
        }
        else if(b.kind==='note'){
          h += `<div class="sec-block"><div class="sub-h">${esc(b.label)}</div><div class="comp-box">${esc(sec[b.key])}</div></div>`;
        }
      });
    }
    else {
      /* 第01堂去買嘢：固定布局 */
      h += `<div class="sec-block">`;
      h += `<div class="sub-h">生字 26 個</div>`;
      h += bigPlayHTML(sec.audioVocab, '生字朗讀', 'Vocabulary all-in-one');
      h += `<div class="grid">` + sec.vocab.map(it=>cardHTML(cid,'lesson1-v',it)).join('') + `</div>`;
      h += `</div>`;
      h += `<div class="sec-block">`;
      h += `<div class="sub-h">對話 · 去買嘢 🗣️</div>`;
      h += bigPlayHTML(sec.audioDialogue, '整段對話', 'Dialogue all-in-one');
      h += sec.dialogue.map(d=>`<div class="srow"><div class="tx">
        <div class="zh">【${d.tag}】${esc(d.zh)}</div><div class="jy">${esc(d.jyut)}</div><div class="en">${esc(d.en)}</div></div></div>`).join('');
      h += `</div>`;
      h += `<div class="sec-block">`;
      h += `<div class="sub-h">理解短文 📖</div>`;
      h += bigPlayHTML(sec.audioComp, '短文朗讀', 'Comprehension all-in-one');
      h += `<div class="comp-box">${esc(sec.comprehension)}</div>`;
      h += `</div>`;
      h += `<div class="sec-block">`;
      h += `<div class="sub-h">係唔係呀？判斷題（答啱 +2⭐）</div>`;
      h += sec.compQA.map((q,i)=>`<div class="tf-row" data-i="${i}"><div class="q">${esc(q.s)}<div class="ans">${esc(q.a)}</div></div>
        <button class="b-y" onclick="tfAnswer(this,true)">係 ✓</button><button class="b-n" onclick="tfAnswer(this,false)">唔係 ✗</button></div>`).join('');
      h += `</div>`;
      h += `<div class="sec-block">`;
      h += `<div class="sub-h">量詞 10 個 🧮</div>`;
      h += bigPlayHTML(sec.audioClassifier, '量詞朗讀', 'Classifier all-in-one');
      h += `<div class="grid">` + sec.classifiers.map(it=>cardHTML(cid,'lesson1-c',it)).join('') + `</div>`;
      h += `</div>`;
      h += `<div class="sec-block">`;
      h += `<div class="sub-h">補充生字 · 傢俬 🛋️</div>`;
      h += bigPlayHTML(sec.audioSupp, '傢俬詞彙朗讀', 'Supplementary all-in-one');
      h += `<div class="grid">` + sec.supp.map(it=>cardHTML(cid,'lesson1-s',it)).join('') + `</div>`;
      h += `</div>`;
    }
  }
  /* ---------- 俗语型（第01堂） ---------- */
  else if(sec.type==='suyu'){
    h += `<div class="sec-block">`;
    h += bigPlayHTML(sec.allInOne, '全部俗語朗讀', 'All-in-one');
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
  /* ---------- 急口令型（N 档速度） ---------- */
  else if(sec.type==='tongue'){
    const t = sec;
    const EMO = ['🐢','🐇','🚀','🔥','⚡'];
    const last = t.speeds.length - 1;
    h += `<div class="sec-block">`;
    h += `<div class="tt-big">${esc(t.full.zh)}</div><div class="tt-jy">${esc(t.full.jyut)}</div>`;
    h += `<div class="tt-words">` + t.words.map(w=>`<button class="tt-word" data-audio="${w.audio}"><div class="z">${esc(w.zh)}</div><div class="j">${esc(w.jyut)}</div></button>`).join('') + `</div>`;
    if(t.full.audio) h += bigPlayHTML(t.full.audio, '完整句點讀', '逐詞跟讀後挑戰下面嘅速度！');
    h += `<div class="sub-h">速度挑戰 🏁（聽完即跟讀）</div><div class="speed-row">` +
      t.speeds.map((s,i)=>`<button class="speed-btn ${i===last?'hot':''}" data-audio="${s.audio}" onclick="speedDone(${i===last})">${EMO[i]||'⚡'} ${s.label}</button>`).join('') + `</div>`;
    h += `<div class="grammar">${t.tip || '💡 秘笈：先逐詞讀準，再連讀。最快檔能一口氣跟讀就畢業啦！'}</div>`;
    h += `</div>`;
  }
  /* ---------- 文法型（纯阅读，无音频） ---------- */
  else if(sec.type==='grammar'){
    sec.groups.forEach(g=>{
      h += `<div class="sec-block"><div class="sub-h">${esc(g.name)}</div>`;
      h += g.items.map((it,i)=>`<div class="g-card">
        <div class="g-no">${i+1}</div>
        <div class="g-tx"><div class="zh">${esc(it.zh)}</div><div class="jy">${esc(it.jyut)}</div><div class="mand">🗨 ${esc(it.mand)}</div></div>
      </div>`).join('');
      h += `</div>`;
    });
  }
  v.innerHTML = h;
  renderSecTabs();
  /* 后台预载本区块短音频（未解锁时静默跳过，解锁时会自动补一次） */
  if(window.preloadSectionAudio) preloadSectionAudio();
}
function renderSecTabs(){
  const el = $('#secTabs');
  if(!el) return;
  el.innerHTML = curCourse().sections.map(t=>
    `<button class="tab ${t.id===curSec?'on':''}" data-s="${t.id}">${t.icon} ${esc(t.title.split(' ')[0])}</button>`).join('');
}
function speedDone(isLast){
  if(isLast===true || isLast==='快速'){ confetti(60); toast('🚀 最快速度挑戰！跟得上就勁！'); }
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
