"use strict";
/* ================= 出題池（遊樂場共用，跟隨課次多選） ================= */
let QPOOL = [], QPOOL_AUD = [], PPAIRS = [], PSEG = [];
function rebuildQuizPools(){
  const cs = pracCourses();
  QPOOL = []; PPAIRS = []; PSEG = [];
  cs.forEach(course=>{
    (course.sections||[]).forEach(sec=>{
      const pushQ = (it, tag) => {
        if(it.zh && it.jyut && it.en) QPOOL.push({zh:it.zh, jyut:it.jyut, en:it.en, audio:it.audio||'', tag});
      };
      if(sec.type==='vocab'){
        const items = sec.groups ? sec.groups.flatMap(g=>g.items) : (sec.items||[]);
        items.forEach(it=>pushQ(it, sec.title));
      }
      if(sec.type==='dialog'){
        (sec.vocab||[]).forEach(it=>pushQ(it, '生字'));
        (sec.supp||[]).forEach(it=>pushQ(it, '傢俬'));
      }
      if(sec.type==='tongue') sec.words.forEach(it=>pushQ(it, sec.title));
    });
    PPAIRS.push(...(course.pairs||[]));
    PSEG.push(...(course.seg||[]));
  });
  QPOOL_AUD = QPOOL.filter(x=>x.audio);
}
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

/* ================= playground 遊樂場 ================= */
const GAMES = [
  {id:'roleplay', ic:'🎭', t:'角色扮演對話', d:'你演答句，我演問句，開口講！'},
  {id:'dictation', ic:'👂', t:'聽寫挑戰', d:'聽發音，揀出正確嘅詞'},
  {id:'builder', ic:'🧩', t:'句子重組', d:'打亂嘅粵拼，排返正確語序'},
  {id:'blitz', ic:'⚡', t:'限時閃電戰', d:'60 秒瘋狂連擊，越答越快'},
  {id:'chain', ic:'🎵', t:'問答接龍', d:'聽問句，揀出正確答句'}
];
let hiScores = store.get('hiScores', {});
let playGame = null;
let blitzTimer = null;

/* 当前范围下游戏是否有素材 */
function pgHasMaterial(id){
  if(id==='roleplay'||id==='chain') return PPAIRS.length>0;
  if(id==='builder') return PSEG.length>0;
  return QPOOL_AUD.length>=4;
}
function pgNoMaterialHTML(g){
  return `<div class="q-result q-card"><div style="font-size:44px">🏜️</div>
    <div class="msg">而家嘅出題範圍冇「${g.t}」素材</div>
    <div style="font-size:13px;color:var(--dim);margin-bottom:18px;line-height:1.7">試吓喺上面加選其他堂，或者去玩「👂 聽寫挑戰」練詞彙！</div>
    <div class="rp-ctl"><button class="primary" onclick="pgQuit()">← 返回遊樂場</button></div></div>`;
}

function renderPlay(){
  const v = $('#view-play');
  if(!playGame){
    const scopeNames = pracCourses().map(c=>c.meta.lesson).join('＋');
    v.innerHTML = `<div class="sec-head"><span class="ic">🎮</span><h2>遊樂場</h2><span class="jp">邊玩邊學</span></div>`
    + pracChipsHTML()
    + `<div class="pg-scope">出題範圍：${scopeNames}${pracIsFollow()?'（跟住學習頁）':''}</div>`
    + `<div class="pg-menu">` + GAMES.map(g=>{
      const hi = hiScores[g.id];
      const ok = pgHasMaterial(g.id);
      return `<button class="pg-game ${ok?'':'dim'}" onclick="pgStart('${g.id}')">
        <div class="gi">${g.ic}</div>
        <div class="gt"><b>${g.t}</b><small>${g.d}</small></div>
        ${ok ? (hi!==undefined?`<div class="hi">🏅 ${hi}</div>`:'') : '<div class="hi">冇素材</div>'}
      </button>`;
    }).join('') + `</div>`;
    return;
  }
  const g = GAMES.find(x=>x.id===playGame);
  let h = `<button class="pg-back" onclick="pgQuit()">← 返回遊樂場</button>
    <div class="sec-head"><span class="ic">${g.ic}</span><h2>${g.t}</h2></div>`;
  if(!pgHasMaterial(playGame)){ v.innerHTML = h + pgNoMaterialHTML(g); return; }
  if(playGame==='roleplay') h += rpHTML();
  else if(playGame==='dictation') h += dtHTML();
  else if(playGame==='builder') h += bdHTML();
  else if(playGame==='blitz') h += bzHTML();
  else if(playGame==='chain') h += chHTML();
  v.innerHTML = h;
}
window.pgStart = id => {
  playGame = id;
  if(!pgHasMaterial(id)){ renderPlay(); return; }
  pgInitGame(); renderPlay(); pgAfterRender();
};
window.pgQuit = () => { stopBlitz(); playGame = null; renderPlay(); };
function pgInitGame(){
  if(playGame==='roleplay') rp = {order: shuffle(PPAIRS.slice()), i:0, phase:'q', done:0};
  if(playGame==='dictation') dt = {list: shuffle(QPOOL_AUD.slice()).slice(0,8), i:0, score:0, answered:false};
  if(playGame==='builder') bd = {list: shuffle(PSEG.slice()).slice(0,6), i:0, score:0, picked:[], done:false};
  if(playGame==='blitz') bz = {left:60, score:0, combo:0, best:0, over:false, q:null, lock:false};
  if(playGame==='chain') ch = {list: shuffle(PPAIRS.slice()).slice(0,6), i:0, score:0, answered:false};
}
function pgAfterRender(){
  if(playGame==='roleplay') setTimeout(()=>{ if(rp && rp.i < rp.order.length) play(rp.order[rp.i].qa); }, 400);
  if(playGame==='dictation') setTimeout(dtPlay, 400);
  if(playGame==='blitz') startBlitz();
  if(playGame==='chain') setTimeout(chPlay, 400);
}
function saveHi(id, score){
  if(hiScores[id]===undefined || score > hiScores[id]){
    hiScores[id] = score; store.set('hiScores', hiScores); return true;
  }
  return false;
}

/* ---------- 🎭 roleplay ---------- */
let rp = null;
function rpHTML(){
  if(!rp || rp.i >= rp.order.length){
    if(rp) saveHi('roleplay', rp.done);
    return `<div class="q-result q-card"><div style="font-size:44px">🎭</div>
      <div class="msg">完成 ${rp?rp.done:0} 組對話！開口講咗未？</div>
      <div class="rp-ctl"><button class="primary" onclick="pgStart('roleplay')">🔁 再演一次</button></div></div>`;
  }
  const p = rp.order[rp.i];
  let h = `<div class="q-top"><span>對話 ${rp.i+1} / ${rp.order.length}</span><span>🎬 你演「答」嘅一方</span></div>`;
  h += `<div class="rp-row them"><div class="bubble"><b>🗣️ 對方問：</b>${esc(p.qzh)}<span class="jy">${esc(p.qjy)}</span>
    <button class="chip" data-audio="${p.qa}">🔊 重聽</button></div></div>`;
  if(rp.phase==='q'){
    h += `<div class="rp-turn"><div class="tip">🎤 輪到你喇！睇住下面提示，大聲講出答案</div>
      <div style="font-size:13px;color:var(--dim);margin-bottom:12px">${esc(p.azh)}</div>
      <div class="rp-ctl"><button class="primary" onclick="rpReveal(this)">✅ 講完喇，聽原聲</button>
      <button onclick="rpHint()">💡 提示</button></div></div>`;
  } else {
    h += `<div class="rp-row me"><div class="bubble"><b>🙋 你答：</b>${esc(p.azh)}<span class="jy">${esc(p.ajy)}</span>
      <button class="chip" data-audio="${p.aa}">🔊 原聲對比</button></div></div>`;
    h += `<div class="rp-ctl" style="margin-bottom:14px"><button class="primary" onclick="rpNext(true)">😎 講得啱 +2⭐</button>
      <button onclick="rpNext(false)">😅 再練吓</button></div>`;
  }
  return h;
}
window.rpReveal = btn => { rp.phase='a'; renderPlay(); play(rp.order[rp.i].aa); };
window.rpHint = () => { toast('💡 ' + rp.order[rp.i].ajy); };
window.rpNext = good => {
  if(good){ addStars(2); rp.done++; }
  rp.i++; rp.phase='q'; renderPlay();
  if(rp.i < rp.order.length) setTimeout(()=>play(rp.order[rp.i].qa), 400);
  else confetti(80);
};

/* ---------- 👂 dictation ---------- */
let dt = null;
function dtHTML(){
  if(dt.i >= dt.list.length){
    const newHi = saveHi('dictation', dt.score);
    const perfect = dt.score === dt.list.length;
    if(perfect){ confetti(150); addStars(10); }
    return `<div class="q-result q-card"><div style="font-size:44px">${perfect?'🏆':'👂'}</div>
      <div class="score">${dt.score} / ${dt.list.length}</div>
      <div class="msg">${perfect?'滿分！+10⭐ 大獎！🎉':newHi?'🎉 新紀錄！':dt.score>=6?'耳力過人！':'多聽幾次就得啦！'}</div>
      <div class="rp-ctl"><button class="primary" onclick="pgStart('dictation')">🔁 再挑戰</button></div></div>`;
  }
  const it = dt.list[dt.i];
  const distract = shuffle(QPOOL.filter(x=>x.zh!==it.zh)).slice(0,3);
  dt.opts = shuffle([it, ...distract]);
  return `<div class="q-top"><span>第 ${dt.i+1} / ${dt.list.length} 題</span><span>得分 <b style="color:var(--acc)">${dt.score}</b></span></div>
    <div class="q-card">
      <button class="pi" style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--acc2),#5a3ee0);display:grid;place-items:center;font-size:26px;margin:6px auto 14px" data-audio="${it.audio}">▶</button>
      <div class="q-sub">聽發音，揀出正確嘅詞（${esc(it.tag)}）</div>
      <div class="q-opts" id="dtOpts">` + dt.opts.map((o,i)=>`<button class="q-opt" onclick="dtAnswer(this,${i})">${esc(o.zh)}</button>`).join('') + `</div>
    </div>`;
}
function dtPlay(){ const it = dt && dt.list[dt.i]; if(it) play(it.audio); }
window.dtAnswer = (btn, i) => {
  if(dt.answered) return; dt.answered = true;
  const it = dt.list[dt.i];
  const right = dt.opts[i] === it;
  btn.parentElement.dataset.lock = 1;
  if(right){ btn.classList.add('right'); dt.score++; addStars(2, btn); toast('耳仔好靈！+2⭐'); }
  else{
    btn.classList.add('wrong');
    [...btn.parentElement.children][dt.opts.indexOf(it)].classList.add('right');
    toast('正解：' + it.zh + ' ' + it.jyut);
  }
  if(navigator.vibrate) navigator.vibrate(right?30:[60,40,60]);
  setTimeout(()=>{ dt.i++; dt.answered=false; renderPlay(); setTimeout(dtPlay, 400); }, right?700:1800);
};

/* ---------- 🧩 builder ---------- */
let bd = null;
/* 原句音频：先查问答对，再查急口令完整句 */
function bdAudioOf(s){
  const pair = PPAIRS.find(x=>x.qzh===s.zh || x.azh===s.zh);
  if(pair) return pair.qzh===s.zh ? pair.qa : pair.aa;
  for(const c of pracCourses()){
    for(const sec of (c.sections||[])){
      if(sec.type==='tongue' && sec.full && sec.full.zh===s.zh && sec.full.audio) return sec.full.audio;
    }
  }
  return '';
}
function bdHTML(){
  if(bd.i >= bd.list.length){
    const newHi = saveHi('builder', bd.score);
    const perfect = bd.score === bd.list.length;
    if(perfect){ confetti(150); addStars(10); }
    return `<div class="q-result q-card"><div style="font-size:44px">🧩</div>
      <div class="score">${bd.score} / ${bd.list.length}</div>
      <div class="msg">${perfect?'滿分！+10⭐ 大獎！🎉':newHi?'🎉 新紀錄！':bd.score>=5?'語感一流！':'語序多練就熟！'}</div>
      <div class="rp-ctl"><button class="primary" onclick="pgStart('builder')">🔁 再玩一次</button></div></div>`;
  }
  const s = bd.list[bd.i];
  if(!bd.cands) bd.cands = shuffle(s.parts.map((p,idx)=>({p, idx})));
  const audio = bdAudioOf(s);
  return `<div class="q-top"><span>句子 ${bd.i+1} / ${bd.list.length}</span><span>得分 <b style="color:var(--acc)">${bd.score}</b></span></div>
    <div class="q-card">
      <div class="q-main" style="font-size:22px">${esc(s.zh)}</div>
      ${audio?`<button class="chip" data-audio="${audio}" style="margin-top:8px">🔊 聽原句</button>`:''}
      <div class="bld-hint">按正確語序點選粵拼 👇（點已放嘅詞可以拎返出嚟）</div>
      <div class="bld-slot" id="bdSlot">` + bd.picked.map(c=>`<button class="dt-cand" onclick="bdUnpick(${c.idx})">${esc(c.p)}</button>`).join('') + `</div>
      <div class="dt-cands">` + bd.cands.filter(c=>!bd.picked.includes(c)).map(c=>`<button class="dt-cand" onclick="bdPick(${c.idx})">${esc(c.p)}</button>`).join('') + `</div>
      <div class="rp-ctl" style="margin-top:16px"><button class="primary" onclick="bdCheck(this)">✅ 排好喇</button>
      <button onclick="bdReset()">🔄 重排</button></div>
    </div>`;
}
window.bdPick = idx => {
  const c = bd.cands.find(x=>x.idx===idx);
  if(c && !bd.picked.includes(c)){ bd.picked.push(c); renderPlay(); }
};
window.bdUnpick = idx => {
  bd.picked = bd.picked.filter(x=>x.idx!==idx); renderPlay();
};
window.bdReset = () => { bd.picked = []; renderPlay(); };
window.bdCheck = btn => {
  const s = bd.list[bd.i];
  const slot = $('#bdSlot');
  const right = bd.picked.length===s.parts.length && bd.picked.every((c,i)=>c.p===s.parts[i]);
  if(right){
    slot.classList.add('good'); bd.score++; addStars(3, btn); toast('語序完美！+3⭐'); confetti(40);
    if(navigator.vibrate) navigator.vibrate(30);
    setTimeout(()=>{ bd.i++; bd.picked=[]; bd.cands=null; renderPlay(); }, 1000);
  } else {
    slot.classList.add('bad'); toast('語序唔啱，再試吓！');
    if(navigator.vibrate) navigator.vibrate([60,40,60]);
    setTimeout(()=>{ slot.classList.remove('bad'); }, 500);
  }
};

/* ---------- ⚡ blitz ---------- */
let bz = null;
function stopBlitz(){ if(blitzTimer){ clearInterval(blitzTimer); blitzTimer = null; } }
function startBlitz(){
  stopBlitz(); bzNewQ();
  blitzTimer = setInterval(()=>{
    bz.left--;
    const bar = $('#bzBar'); if(bar) bar.style.width = (bz.left/60*100)+'%';
    const t = $('#bzTime'); if(t) t.textContent = bz.left;
    if(bz.left<=0) bzEnd();
  }, 1000);
}
function bzNewQ(){
  const ans = QPOOL_AUD[Math.floor(Math.random()*QPOOL_AUD.length)];
  const distract = shuffle(QPOOL.filter(x=>x.zh!==ans.zh)).slice(0,3);
  bz.q = {ans, opts: shuffle([ans, ...distract])}; bz.lock = false;
  const c = $('#bzQ'); if(c){
    c.innerHTML = `<div class="q-main" style="font-size:24px">${esc(ans.zh)}</div>
      <div class="q-sub">${esc(ans.jyut)}</div>
      <div class="q-opts">` + bz.q.opts.map((o,i)=>`<button class="q-opt" style="padding:12px;font-size:15px" onclick="bzAnswer(this,${i})">${esc(o.en.split(/[;(]/)[0])}</button>`).join('') + `</div>`;
  }
}
function bzHTML(){
  if(bz.over){
    const newHi = saveHi('blitz', bz.score);
    return `<div class="q-result q-card"><div style="font-size:44px">⚡</div>
      <div class="score">${bz.score}</div>
      <div class="msg">${newHi?'🎉 新紀錄！最勁連擊 x'+bz.best:'最勁連擊 x'+bz.best}</div>
      <div class="rp-ctl"><button class="primary" onclick="pgStart('blitz')">🔁 再衝一次</button></div></div>`;
  }
  return `<div class="q-top"><span>⏱️ <b id="bzTime" style="color:var(--acc);font-size:18px">${bz.left}</b>s</span><span>得分 <b style="color:var(--acc)" id="bzScore">${bz.score}</b></span></div>
    <div class="blitz-timer"><i id="bzBar" style="width:${bz.left/60*100}%"></i></div>
    <div class="blitz-combo" id="bzCombo"></div>
    <div class="q-card" id="bzQ"></div>`;
}
window.bzAnswer = (btn, i) => {
  if(bz.lock || bz.over) return; bz.lock = true;
  const right = bz.q.opts[i] === bz.q.ans;
  if(right){
    bz.combo++; bz.best = Math.max(bz.best, bz.combo);
    const gain = bz.combo>=5 ? 3 : bz.combo>=3 ? 2 : 1;
    bz.score += gain; addStars(1, btn);
    btn.classList.add('right');
    $('#bzScore').textContent = bz.score;
    const cb = $('#bzCombo');
    cb.textContent = bz.combo>=2 ? `🔥 連擊 x${bz.combo}${gain>1?' 得分x'+gain:''}` : '';
    cb.classList.remove('hot'); void cb.offsetWidth; cb.classList.add('hot');
    setTimeout(bzNewQ, 220);
  } else {
    bz.combo = 0; btn.classList.add('wrong');
    $('#bzCombo').textContent = '💥 斷連擊';
    const idx = bz.q.opts.indexOf(bz.q.ans);
    btn.parentElement.children[idx].classList.add('right');
    if(navigator.vibrate) navigator.vibrate([60,40,60]);
    setTimeout(bzNewQ, 800);
  }
};
function bzEnd(){
  stopBlitz(); bz.over = true;
  if(bz.score >= 15) confetti(120); else if(bz.score >= 8) confetti(60);
  renderPlay();
}

/* ---------- 🎵 chain ---------- */
let ch = null;
function chHTML(){
  if(ch.i >= ch.list.length){
    const newHi = saveHi('chain', ch.score);
    const perfect = ch.score === ch.list.length;
    if(perfect){ confetti(150); addStars(10); }
    return `<div class="q-result q-card"><div style="font-size:44px">🎵</div>
      <div class="score">${ch.score} / ${ch.list.length}</div>
      <div class="msg">${perfect?'滿分！+10⭐ 大獎！🎉':newHi?'🎉 新紀錄！':ch.score>=5?'聽力接龍王！':'問答多聽就熟！'}</div>
      <div class="rp-ctl"><button class="primary" onclick="pgStart('chain')">🔁 再接一次</button></div></div>`;
  }
  const p = ch.list[ch.i];
  const distract = shuffle(PPAIRS.filter(x=>x.azh!==p.azh)).slice(0,3);
  ch.opts = shuffle([p, ...distract]);
  return `<div class="q-top"><span>接龍 ${ch.i+1} / ${ch.list.length} 題</span><span>得分 <b style="color:var(--acc)">${ch.score}</b></span></div>
    <div class="chain-q">
      <button class="pi" data-audio="${p.qa}">▶</button>
      <div><b>聽問句 👂</b><div style="font-size:12px;color:var(--dim);margin-top:3px">揀出對應嘅答句</div></div>
    </div>
    <div class="q-opts">` + ch.opts.map((o,i)=>`<button class="q-opt" style="font-size:15px;padding:14px" onclick="chAnswer(this,${i})">${esc(o.azh)}</button>`).join('') + `</div>`;
}
function chPlay(){ const p = ch && ch.list[ch.i]; if(p) play(p.qa); }
window.chAnswer = (btn, i) => {
  if(ch.answered) return; ch.answered = true;
  const p = ch.list[ch.i];
  const right = ch.opts[i] === p;
  if(right){ btn.classList.add('right'); ch.score++; addStars(2, btn); toast('接得上！+2⭐'); play(p.aa); }
  else{
    btn.classList.add('wrong');
    [...btn.parentElement.children][ch.opts.indexOf(p)].classList.add('right');
    toast('正解：' + p.azh);
    if(navigator.vibrate) navigator.vibrate([60,40,60]);
  }
  setTimeout(()=>{ ch.i++; ch.answered=false; renderPlay(); setTimeout(chPlay, right?1200:400); }, right?1500:1800);
};
