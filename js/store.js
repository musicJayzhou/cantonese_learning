"use strict";
/* ================= store & UI helpers ================= */
/* DOM 简写 */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* LocalStorage 持久化 */
const store = {
  get(k, d){ try{ return JSON.parse(localStorage.getItem('cantonese_'+k)) ?? d; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem('cantonese_'+k, JSON.stringify(v)); }catch(e){} }
};
let stars = store.get('stars', 0);
let marks = store.get('marks', {});   // id -> 'known' | 'hard'
let streakDays = store.get('streakDays', {count:0, last:''});

function todayStr(){ return new Date().toISOString().slice(0,10); }
(function initStreak(){
  const t = todayStr();
  if(streakDays.last !== t){
    const y = new Date(Date.now()-864e5).toISOString().slice(0,10);
    streakDays.count = (streakDays.last === y) ? streakDays.count + 1 : 1;
    streakDays.last = t;
    store.set('streakDays', streakDays);
  }
  $('#streakN').textContent = streakDays.count;
  renderStars();
})();
function addStars(n, fromEl){
  stars += n; store.set('stars', stars);
  const starEl = $('#starN'), old = starEl.textContent;
  starEl.textContent = stars;
  const pill = $('#pillStar');
  pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump');
  if(fromEl){
    const r1 = fromEl.getBoundingClientRect(), r2 = pill.getBoundingClientRect();
    const fly = $('#fly');
    fly.textContent = '+'+n+'⭐';
    fly.style.left = r1.left + r1.width/2 - 20 + 'px';
    fly.style.top = r1.top + 'px';
    fly.style.transform = 'none'; fly.style.opacity = '1';
    void fly.offsetWidth;
    fly.style.transform = `translate(${r2.left + r2.width/2 - (r1.left + r1.width/2)}px, ${r2.top - r1.top}px) scale(.3)`;
    fly.style.opacity = '0';
  }
}
function renderStars(){ $('#starN').textContent = stars; }

/* toast */
let toastTimer;
function toast(msg){
  const el = $('#toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>el.classList.remove('show'), 1600);
}
