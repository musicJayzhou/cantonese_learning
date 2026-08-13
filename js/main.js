"use strict";
/* ================= 导航 & 初始化 ================= */

/* 底部 nav 切换 */
$$('nav button').forEach(b=>b.addEventListener('click', ()=>{
  $$('nav button').forEach(x=>x.classList.remove('on')); b.classList.add('on');
  $$('.view').forEach(x=>x.classList.remove('on'));
  $('#view-'+b.dataset.v).classList.add('on');
  if(b.dataset.v==='cards' && !fcPool.length){ fcBuildPool(); renderCards(); }
  if(b.dataset.v==='cards') renderCards();
  if(b.dataset.v==='play') renderPlay();
  if(b.dataset.v!=='play') stopBlitz();
  scrollTo(0,0);
}));

/* section tabs（学习页内，事件委托常驻） */
$('#view-learn').addEventListener('click', e=>{
  const b = e.target.closest('#secTabs [data-s]'); if(!b) return;
  curSec = b.dataset.s;
  renderLearn(); scrollTo(0,0);
});

/* ================= 引导层 ================= */
function coachHTML(){
  return `<div class="coach-box">
    <h3>👋 歡迎嚟到複習寶！</h3>
    <div class="coach-row"><div class="ci">🔥</div><div><b>學習連擊</b>：每日打開學習 +1 天，堅持唔斷更！</div></div>
    <div class="coach-row"><div class="ci">⭐</div><div><b>學習星星</b>：答啱題、標記掌握都可以賺星星！</div></div>
    <div class="coach-row"><div class="ci">👆</div><div><b>點讀</b>：點詞彙卡同 ▶ 按鈕即可聽發音</div></div>
    <div class="coach-row"><div class="ci">✋</div><div><b>長按詞卡</b>：標記「已掌握🟢 / 需加強🔴」，重點複習</div></div>
    <button class="coach-start" onclick="closeCoach()">開始學習 🚀</button>
  </div>`;
}
window.closeCoach = ()=>{ $('#coach').classList.add('hide'); store.set('seenCoach', true); };
function openCoach(){ $('#coach').innerHTML = coachHTML(); $('#coach').classList.remove('hide'); }
$('#pillStreak').addEventListener('click', openCoach);
$('#pillStar').addEventListener('click', openCoach);
if(!store.get('seenCoach', false)) openCoach();

/* 首次渲染 */
renderLearn();
fcBuildPool();
