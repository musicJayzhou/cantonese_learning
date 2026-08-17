"use strict";
/* ================= 發音板块（普通話與廣東話音標對應表） ================= */
/* 长期工具书：聲母 / 韻母 / 對比 / 學習重點 / 聲調，独立于课次 */
const PH_SECS = [
  {id:'initials',   ic:'🅱️', t:'聲母',     sub:'19 Initials'},
  {id:'finals',     ic:'🅰️', t:'韻母',     sub:'51+2 Finals'},
  {id:'comparison', ic:'⚖️', t:'對比練習', sub:'易混韻母'},
  {id:'focus',      ic:'🎯', t:'學習重點', sub:'變音 · 例外'},
  {id:'tones',      ic:'🎼', t:'聲調',     sub:'六聲'}
];
let phSec = store.get('phSec', 'initials');
if(!PH_SECS.some(s=>s.id===phSec)) phSec = 'initials';
window.setPhSec = id => {
  if(!PH_SECS.some(s=>s.id===id)) return;
  phSec = id; store.set('phSec', id); renderPhonics(); scrollTo(0,0);
};

function phRow(jyut, zh, audio, extra){
  /* 通用点读行：▶ 粤拼 + 中文 (+附注) */
  return `<div class="srow">
    ${audio?`<button class="pi" data-audio="${audio}">▶</button>`:''}
    <div class="tx"><div class="zh">${esc(jyut)}${zh?` <span class="ph-zh">${esc(zh)}</span>`:''}</div>
    ${extra?`<div class="jy">${esc(extra)}</div>`:''}</div></div>`;
}

function renderPhonics(){
  const v = $('#view-phonics');
  if(!v) return;
  const D = window.PHONICS_DATA;
  const sec = PH_SECS.find(s=>s.id===phSec);
  let h = `<div class="sec-head"><span class="ic">🗣️</span><h2>發音 · 音標對應表</h2><span class="jp">Yale 耶魯音標</span></div>`;
  h += `<div class="tabs" style="margin:0 2px 12px">` + PH_SECS.map(s=>
    `<button class="tab ${s.id===phSec?'on':''}" onclick="setPhSec('${s.id}')">${s.ic} ${s.t}</button>`).join('') + `</div>`;

  /* ---------- 聲母 ---------- */
  if(phSec==='initials'){
    const I = D.initials;
    h += `<div class="sec-block"><div class="sub-h">19 聲母 · 點 🔊 聽併讀同例詞</div>`;
    h += bigPlayHTML(I.allInOne, '聲母連讀', 'All-in-one') + bigPlayHTML(I.exAllInOne, '例詞連讀', 'Examples all-in-one');
    h += `<div class="ph-table">`;
    I.rows.forEach(r=>{
      h += `<div class="ph-row">
        <div class="ph-c"><b>${esc(r.c)}</b><span class="ph-mand">普:${esc(r.mand)}</span></div>
        <div class="ph-cell">${r.a?`<button class="pi sm" data-audio="${r.a}">▶</button>`:''}<span>${esc(r.syl)} ${esc(r.zh)}</span>${r.a2?`<button class="pi sm" data-audio="${r.a2}">▶</button>`:''}</div>
        <div class="ph-cell">${r.ex?`<button class="pi sm" data-audio="${r.ex.a}">▶</button><span>${esc(r.ex.zh)} <span class="jy">${esc(r.ex.jyut)}</span>${r.ex.mand&&r.ex.mand!=='-'?` <span class="ph-mand">${esc(r.ex.mand)}</span>`:''}</span>`:''}
          ${r.ex2?`<button class="pi sm" data-audio="${r.ex2.a}">▶</button><span>${esc(r.ex2.zh)} <span class="jy">${esc(r.ex2.jyut)}</span></span>`:''}</div>
      </div>`;
    });
    h += `</div></div>`;
  }
  /* ---------- 韻母 ---------- */
  else if(phSec==='finals'){
    const F = D.finals;
    h += `<div class="sec-block"><div class="sub-h">韻母家族 · 連讀</div><div class="ph-fams">` +
      F.families.map(f=>`<button class="chip" data-audio="${f.audio}">${esc(f.label)}</button>`).join('') + `</div>`;
    h += `<div class="sub-h" style="margin-top:12px">例詞家族連讀（每家族首例 ↔ 尾例）</div><div class="ph-fams">` +
      F.exFamilies.map(f=>`<button class="chip" data-audio="${f.audio}">🔊 ${esc(f.label)}</button>`).join('') + `</div></div>`;
    h += `<div class="sec-block"><div class="sub-h">51+2 韻母 · 併讀 🔊 / 例詞 🔊 / 純韻母音 🔊</div>`;
    h += bigPlayHTML(F.allInOne, '韻母連讀（唔帶聲母）', 'All-in-one')
       + bigPlayHTML(F.allInOneW, '韻母連讀（帶聲母）', 'With initials')
       + bigPlayHTML(F.exAllInOne, '例詞連讀', 'Examples all-in-one');
    h += `<div class="ph-table">`;
    F.rows.forEach(r=>{
      const nn = String(r.n).padStart(2,'0');
      const sylA = r.sylA || `audio/phonics/exfinals/items/${nn}a.mp3`;
      const wordA = r.wordA || `audio/phonics/exfinals/items/${nn}b.mp3`;
      const fA = `audio/phonics/finals/items/${r.f==='m'?'mh':r.f}.m4a`;
      h += `<div class="ph-row">
        <div class="ph-c"><b>${esc(r.f)}</b><span class="ph-mand">普:${esc(r.mand)}</span></div>
        <div class="ph-cell"><button class="pi sm" data-audio="${sylA}">▶</button><span>${esc(r.syl)} ${esc(r.zh)}</span></div>
        <div class="ph-cell"><button class="pi sm" data-audio="${wordA}">▶</button><span>${esc(r.word.zh)} <span class="jy">${esc(r.word.jyut)}</span>${r.word.mand&&r.word.mand!=='-'?` <span class="ph-mand">${esc(r.word.mand)}</span>`:''}</span></div>
        <div class="ph-cell ph-pure"><button class="pi sm" data-audio="${fA}">▶</button><span class="jy">${esc(r.f)}</span></div>
      </div>`;
    });
    h += `</div></div>`;
  }
  /* ---------- 對比 ---------- */
  else if(phSec==='comparison'){
    const C = D.comparison;
    h += `<div class="sec-block"><div class="sub-h">易混韻母對照 · 跟讀对比</div>`;
    h += bigPlayHTML(C.allInOne, '全部對照連讀', 'All-in-one');
    h += C.rows.map(r=>phRow(r.label, '', r.audio)).join('');
    h += `</div>`;
    h += `<div class="sec-block"><div class="sub-h">帶聲母對照（例字）· 跟讀对比</div>`;
    h += bigPlayHTML(C.initialAllInOne, '全部連讀', 'All-in-one');
    h += C.initialRows.map(r=>phRow(r.cells.map(c=>c[0]).join(' / '), r.cells.map(c=>c[1]).join(' / '), r.audio)).join('');
    h += `</div>`;
  }
  /* ---------- 學習重點 ---------- */
  else if(phSec==='focus'){
    D.focus.blocks.forEach(b=>{
      h += `<div class="sec-block"><div class="sub-h">${esc(b.label)}</div>`;
      if(b.audio) h += bigPlayHTML(b.audio, '連續播放', 'All-in-one');
      if(b.note) h += `<div class="grammar">${esc(b.note)}</div>`;
      if(b.kind==='chips') h += `<div class="ph-fams">` + b.chips.map(c=>
        c.audio ? `<button class="chip" data-audio="${c.audio}">🔊 ${esc(c.jyut)} ${esc(c.zh)}</button>`
                : `<span class="chip ph-noaudio">${esc(c.jyut)} ${esc(c.zh)}</span>`).join('') + `</div>`;
      if(b.kind==='pairs') h += b.rows.map(r=>phRow(r.label, '', r.audio)).join('');
      h += `</div>`;
    });
  }
  /* ---------- 聲調 ---------- */
  else if(phSec==='tones'){
    const T = D.tones;
    h += `<div class="sec-block"><div class="sub-h">廣東話六聲 · 聽住跟讀</div>`;
    h += T.audios.map(a=>bigPlayHTML(a.audio, a.label, '點擊播放')).join('');
    h += `<div class="ph-table">`;
    T.rows.forEach(r=>{
      h += `<div class="ph-row">
        <div class="ph-c"><b>${r.n} 聲</b><span class="ph-mand">${esc(r.val)}</span></div>
        <div class="ph-cell"><span>${esc(r.name)}</span></div>
        <div class="ph-cell"><span>${esc(r.eg)} ・ ${esc(r.num)}${r.yin?` ・ ${esc(r.yin)}`:''}</span></div>
      </div>`;
    });
    h += `</div><div class="grammar">💡 標調方法：主要元音後加調號；入聲（7/8/9）歸入 1/3/6 聲。</div></div>`;
  }
  v.innerHTML = h;
}
