"use strict";
/* ================= audio 音频播放 ================= */
let curAudio = null, curBtn = null;

/* iOS Safari: 首次交互时解锁音频引擎，避免后续 setTimeout 自动播放被拦截 */
let _au = false;
function _unlockAudio(){
  if(_au) return; _au = true;
  const a = new Audio();
  a.muted = true;
  a.play().then(()=>{ a.pause(); }).catch(()=>{});
  /* 解锁后后台预载当前区块音频（延迟启动，不与首次点击抢带宽） */
  setTimeout(preloadSectionAudio, 800);
}
document.addEventListener('click', _unlockAudio, {once:true});
document.addEventListener('touchstart', _unlockAudio, {once:true, passive:true});

function _clearBtn(btn){ if(btn) btn.classList.remove('playing','loading'); }

/* 播放状态机：点击 → loading（脉冲，等待网络）→ playing（出声）→ 清除 */
function play(src, btn){
  if(!src) return;
  if(curAudio){ curAudio.pause(); curAudio = null; }
  if(curBtn){ _clearBtn(curBtn); curBtn = null; }
  const a = new Audio();
  a.preload = 'auto';
  a.src = src;
  curAudio = a;
  curBtn = btn || null;
  if(btn) btn.classList.add('loading');
  const done = () => {
    if(btn && curBtn===btn){ _clearBtn(btn); curBtn = null; }
    if(curAudio===a) curAudio = null;
  };
  a.addEventListener('playing', ()=>{
    if(curAudio!==a || !btn) return;
    btn.classList.remove('loading'); btn.classList.add('playing');
  });
  a.addEventListener('ended', done);
  a.addEventListener('error', ()=>{
    if(curAudio!==a) return;
    done(); toast('🔇 呢段音頻播唔到');
  });
  const pr = a.play();
  if(pr && pr.catch) pr.catch(err=>{
    if(err && err.name==='AbortError') return;   // 被下一次點擊打斷，屬正常
    if(curAudio!==a) return;
    done();
    if(err && err.name==='NotAllowedError') toast('🔇 瀏覽器攔截咗播放，請再點一次');
    else toast('🔇 呢段音頻播唔到');
  });
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-audio]');
  if(!t) return;
  e.stopPropagation();
  // 同帧去重：委托与直绑都触发时只播一次
  const now = Date.now();
  if(t.dataset.lastPlay && now - t.dataset.lastPlay < 250) return;
  t.dataset.lastPlay = now;
  play(t.dataset.audio, t);
});

/* ================= 后台预载 ================= */
/* 首次交互后，串行低速拉取当前学习页区块的短音频（词汇/句型/急口令词），
   排除 all-in-one 等大文件；进 HTTP 缓存，之后点卡即点即响 */
const PRELOAD_OK = /\/(items|words|pairs|dialog|sentences|speeds|vocab)\//;
let _plKey = '';
function preloadSectionAudio(){
  if(!_au) return;   // 音频引擎解锁后才预载（移动端策略要求）
  const v = document.querySelector('#view-learn');
  if(!v) return;
  const srcs = [...new Set(
    [...v.querySelectorAll('[data-audio]')].map(e=>e.dataset.audio).filter(s=>s && PRELOAD_OK.test(s))
  )];
  const key = curLesson + '|' + srcs.length;
  if(key===_plKey || !srcs.length) return;
  _plKey = key;
  let i = 0;
  const step = () => {
    if(i >= srcs.length) return;
    fetch(srcs[i++], {priority:'low'})
      .then(r=>{ if(r.ok) return r.blob(); })
      .catch(()=>{})
      .finally(()=>setTimeout(step, 120));
  };
  step();
}
window.preloadSectionAudio = preloadSectionAudio;
