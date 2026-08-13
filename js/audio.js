"use strict";
/* ================= audio 音频播放 ================= */
let curAudio = null, curBtn = null;
function play(src, btn){
  if(!src) return;
  if(curAudio){ curAudio.pause(); curAudio = null; }
  if(curBtn){ curBtn.classList.remove('playing'); curBtn = null; }
  curAudio = new Audio();
  curAudio.src = src;
  if(btn){ btn.classList.add('playing'); curBtn = btn; }
  const done = () => { if(curBtn) curBtn.classList.remove('playing'); curBtn = null; };
  curAudio.onended = done;
  curAudio.onerror = () => { done(); toast('🔇 呢段音頻播唔到'); };
  const pr = curAudio.play();
  if(pr && pr.catch) pr.catch(()=>{ done(); toast('🔇 呢段音頻播唔到'); });
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
