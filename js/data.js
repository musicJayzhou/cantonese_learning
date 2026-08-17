"use strict";
/* ================= 多课数据装载 ================= */
/* 兼容：lesson01.js 设 window.COURSE_DATA（无 meta.id/type），新课设 COURSE_DATA_NN */
const COURSES = [window.COURSE_DATA,
  window.COURSE_DATA_02, window.COURSE_DATA_03, window.COURSE_DATA_04, window.COURSE_DATA_05,
  window.COURSE_DATA_06, window.COURSE_DATA_07, window.COURSE_DATA_08, window.COURSE_DATA_09,
  window.COURSE_DATA_10, window.COURSE_DATA_11, window.COURSE_DATA_12].filter(Boolean);
COURSES.forEach((c, i) => {
  c.meta = c.meta || {};
  if(!c.meta.id) c.meta.id = 'lesson0' + (i+1);
  if(!c.meta.lesson) c.meta.lesson = '第0' + (i+1) + '堂';
  if(!c.meta.short) c.meta.short = '顏色 / 形狀 / 去買嘢 / 俗語 / 急口令';
});
/* lesson01 无 type 字段，按 id 推断 */
const LEGACY_TYPE = {colour:'vocab', shape:'vocab', lesson1:'dialog', suyu:'suyu', tongue:'tongue'};
COURSES.forEach(c => (c.sections||[]).forEach(s => { if(!s.type) s.type = LEGACY_TYPE[s.id] || 'vocab'; }));
COURSES.forEach(c => { c.pairs = c.pairs || []; c.seg = c.seg || []; });

/* ================= 课次状态 ================= */
/* 学习页：单课聚焦 */
let curLesson = store.get('curLesson', 'lesson01');
if(!COURSES.some(c=>c.meta.id===curLesson)) curLesson = COURSES[0].meta.id;
function curCourse(){ return COURSES.find(c=>c.meta.id===curLesson) || COURSES[0]; }
window.setLesson = id => {
  if(!COURSES.some(c=>c.meta.id===id) || id===curLesson) return;
  curLesson = id; store.set('curLesson', id);
  curSec = curCourse().sections[0].id;
  rebuildQuizPools();   // 跟随模式下练习池随当前课更新
  const sm = document.querySelector('h1 small');
  if(sm) sm.textContent = curCourse().meta.lesson + ' · ' + curCourse().meta.short;
  renderLearn(); scrollTo(0,0);
};

/* 练习（记忆卡/游乐场）：课次多选；null = 跟随学习页当前课 */
let pracSel = store.get('pracLessons', null);
if(pracSel && (!Array.isArray(pracSel) || !pracSel.length)) pracSel = null;
function pracCourses(){
  if(!pracSel) return [curCourse()];
  const list = COURSES.filter(c=>pracSel.includes(c.meta.id));
  return list.length ? list : [curCourse()];
}
function pracIsFollow(){ return !pracSel; }
window.togglePrac = id => {
  if(!pracSel) pracSel = [curLesson];           // 从“跟随”转为显式选择
  if(pracSel.includes(id)) pracSel = pracSel.filter(x=>x!==id);
  else pracSel.push(id);
  if(!pracSel.length) pracSel = null;           // 全不选 → 回到跟随
  store.set('pracLessons', pracSel);
  onPracticeScopeChange();
};
window.resetPracFollow = () => { pracSel = null; store.set('pracLessons', null); onPracticeScopeChange(); };
window.pracSelectAll = () => { pracSel = COURSES.map(c=>c.meta.id); store.set('pracLessons', pracSel); onPracticeScopeChange(); };

/* 课次多选 chips（记忆卡/游乐场共用） */
function pracChipsHTML(){
  let h = `<div class="fc-sec-row prac-row">`;
  h += `<button class="tab prac-follow ${pracIsFollow()?'on':''}" onclick="resetPracFollow()">📌 跟住學習頁</button>`;
  COURSES.forEach(c=>{
    const on = pracSel ? pracSel.includes(c.meta.id) : c.meta.id===curLesson;
    h += `<button class="tab ${on?'on':''}" onclick="togglePrac('${c.meta.id}')">${c.meta.lesson}</button>`;
  });
  h += `<button class="tab" onclick="pracSelectAll()">✓ 全選</button>`;
  return h + `</div>`;
}

/* ================= 数据与常量 ================= */
const DATA = window.COURSE_DATA;   // 兼容旧引用（第01堂）

/* 颜色色板（卡片底部色条） */
const SWATCH = {"紅色":"#e63946","橙色":"#f48c06","黃色":"#ffd60a","綠色":"#52b788","青色":"#43aa8b","藍色":"#3a86ff","紫色":"#9d4edd","黑色":"#222","白色":"#eee","灰色":"#8d99ae","米色":"#e6d3a3","啡色":"#7f5539","咖啡色":"#6f4e37","金色":"#d4af37","銀色":"#c0c0c0","深色":"#3a3a55","淺色":"#b8c0ff","粉色":"#ffb3c6","金屬色":"linear-gradient(135deg,#bbb,#666)"};

/* 形状图标 */
const SHAPE_IC = {"圓形":"⭕","正方形":"⬛","長方形":"▭","橢圓形":"⬭","三角形":"🔺","梯形":"⏢","四邊形":"▱","平行四邊形":"▰","六角形":"⬡","長條形":"➖","箭咀":"➡️","菱形":"🔶","心形":"❤️","星形":"⭐","圓柱體":"🛢️","球體":"🔮","球形":"🏀","三角錐體":"🔻","立方體":"🧊"};

/* 学习页状态：当前 section */
let curSec = curCourse().sections[0].id;

/* ================= 标记 ID ================= */
/* 第01堂保留旧格式 "secKey|zh" 以兼容已有进度；新课用 "courseId|secKey|zh" */
function mkid(courseId, secKey, zh){
  return courseId==='lesson01' ? `${secKey}|${zh}` : `${courseId}|${secKey}|${zh}`;
}

/* HTML 转义 & 标记查询 */
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
function markOf(id){ return marks[id] || ''; }
