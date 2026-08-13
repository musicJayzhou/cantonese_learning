"use strict";
/* ================= confetti 庆祝动画 ================= */
const cv = $('#confetti'), ctx = cv.getContext('2d');
let parts = [], confRunning = false;
function confetti(n=80){
  cv.width = innerWidth; cv.height = innerHeight;
  const colors = ['#ffd166','#7c5cff','#3ddc97','#4cc9f0','#ff6b8a'];
  for(let i=0;i<n;i++) parts.push({
    x: innerWidth/2 + (Math.random()-.5)*120, y: innerHeight*0.35,
    vx:(Math.random()-.5)*9, vy:-Math.random()*9-3, g:.28,
    s:Math.random()*7+4, c:colors[i%colors.length], r:Math.random()*Math.PI, vr:(Math.random()-.5)*.3, life:1
  });
  if(!confRunning){ confRunning = true; requestAnimationFrame(confTick); }
}
function confTick(){
  ctx.clearRect(0,0,cv.width,cv.height);
  parts = parts.filter(p=>p.life>0 && p.y<cv.height+30);
  for(const p of parts){
    p.x+=p.vx; p.y+=p.vy; p.vy+=p.g; p.r+=p.vr; p.life-=.008;
    ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r);
    ctx.globalAlpha = Math.max(p.life,0); ctx.fillStyle = p.c;
    ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*0.62); ctx.restore();
  }
  if(parts.length){ requestAnimationFrame(confTick); } else { confRunning=false; ctx.clearRect(0,0,cv.width,cv.height); }
}
