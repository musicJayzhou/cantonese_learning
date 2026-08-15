"use strict";
/* ================= 导航 & 初始化 ================= */

/* 底部 nav 切换 */
$$('nav button').forEach(b=>b.addEventListener('click', ()=>{
  $$('nav button').forEach(x=>x.classList.remove('on')); b.classList.add('on');
  $$('.view').forEach(x=>x.classList.remove('on'));
  $('#view-'+b.dataset.v).classList.add('on');
  if(b.dataset.v==='cards'){ fcBuildPool(); renderCards(); }
  if(b.dataset.v==='play') renderPlay();
  if(b.dataset.v!=='play') stopBlitz();
  scrollTo(0,0);
}));

/* 学习页内点击：课次切换 + section tabs（事件委托常驻） */
$('#view-learn').addEventListener('click', e=>{
  const lb = e.target.closest('#lessonTabs [data-l]');
  if(lb){ setLesson(lb.dataset.l); return; }
  const b = e.target.closest('#secTabs [data-s]'); if(!b) return;
  curSec = b.dataset.s;
  renderLearn(); scrollTo(0,0);
});

/* 练习范围（记忆卡/游乐场课次多选）变更 */
window.onPracticeScopeChange = () => {
  stopBlitz();
  rebuildQuizPools();
  fcBuildPool();
  if($('#view-cards').classList.contains('on')) renderCards();
  if($('#view-play').classList.contains('on')) renderPlay();
};

/* ================= 引导层 ================= */
function coachHTML(){
  return `<div class="coach-box">
    <h3>👋 歡迎嚟到複習寶！</h3>
    <div class="coach-row"><div class="ci">📚</div><div><b>課次切換</b>：學習頁頂部揀堂；記憶卡同遊樂場可以<b>多選幾堂</b>一齊出題！</div></div>
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
(function init(){
  const sm = document.querySelector('h1 small');
  if(sm) sm.textContent = curCourse().meta.lesson + ' · ' + curCourse().meta.short;
  rebuildQuizPools();
  renderLearn();
  fcBuildPool();
  /* hash 直达链接：#lesson02 / #lesson03.grammar / #lesson02.play / #cards */
  const h = location.hash.slice(1);
  if(h){
    const [l, s] = h.split('.');
    if(COURSES.some(c=>c.meta.id===l)){
      setLesson(l);
      if(s && curCourse().sections.some(x=>x.id===s)){ curSec = s; renderLearn(); }
      else { const nb = document.querySelector('nav button[data-v="'+s+'"]'); if(nb) nb.click(); }
    } else {
      const nb = document.querySelector('nav button[data-v="'+l+'"]');
      if(nb) nb.click();
    }
  }
})();
