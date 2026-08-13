"use strict";
/* ================= 数据与常量 ================= */
const DATA = window.COURSE_DATA;

/* 颜色色板（卡片底部色条） */
const SWATCH = {"紅色":"#e63946","橙色":"#f48c06","黃色":"#ffd60a","綠色":"#52b788","青色":"#43aa8b","藍色":"#3a86ff","紫色":"#9d4edd","黑色":"#222","白色":"#eee","灰色":"#8d99ae","米色":"#e6d3a3","啡色":"#7f5539","咖啡色":"#6f4e37","金色":"#d4af37","銀色":"#c0c0c0","深色":"#3a3a55","淺色":"#b8c0ff","粉色":"#ffb3c6","金屬色":"linear-gradient(135deg,#bbb,#666)"};

/* 形状图标 */
const SHAPE_IC = {"圓形":"⭕","正方形":"⬛","長方形":"▭","橢圓形":"⬭","三角形":"🔺","梯形":"⏢","四邊形":"▱","平行四邊形":"▰","六角形":"⬡","長條形":"➖","箭咀":"➡️","菱形":"🔶","心形":"❤️","星形":"⭐","圓柱體":"🛢️","球體":"🔮","球形":"🏀","三角錐體":"🔻","立方體":"🧊"};

/* 学习页 tab 列表 */
const SEC_TABS = [
  {id:'colour', label:'🎨 顏色'}, {id:'shape', label:'🔷 形狀'},
  {id:'lesson1', label:'🛍️ 去買嘢'}, {id:'suyu', label:'💬 俗語'}, {id:'tongue', label:'🌪️ 急口令'}
];
let curSec = 'colour';

/* HTML 转义 & 标记查询 */
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
function markOf(id){ return marks[id] || ''; }
