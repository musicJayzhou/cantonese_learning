/* Audit: every data-referenced asset exists; every asset file is referenced. */
const fs = require('fs'), path = require('path');
const ROOT = 'D:\\Workspace\\Cantonese';
global.window = global;
const dataFiles = ['data/lesson01.js','data/lesson02.js','data/lesson03.js'];
for(let n=4; n<=12; n++){
  const f = 'data/lesson' + String(n).padStart(2,'0') + '.js';
  if(fs.existsSync(path.join(ROOT, f))) dataFiles.push(f);
}
dataFiles.push('data/phonics.js');
for(const f of dataFiles) eval(fs.readFileSync(path.join(ROOT,f),'utf8'));

const courses = [window.COURSE_DATA];
for(let n=2; n<=12; n++) courses.push(window['COURSE_DATA_' + String(n).padStart(2,'0')]);
courses.push(window.PHONICS_DATA);

const refs = new Set();
function walk(o){
  if(!o || typeof o !== 'object') return;
  for(const [k,v] of Object.entries(o)){
    if(typeof v === 'string' && /^(audio|img)\//.test(v)) refs.add(v);
    else walk(v);
  }
}
courses.filter(Boolean).forEach(walk);
/* phonics renderer 默认推导路径（非显式字段） */
if(window.PHONICS_DATA){
  for(const r of window.PHONICS_DATA.finals.rows){
    const nn = String(r.n).padStart(2,'0');
    if(!r.sylA) refs.add('audio/phonics/exfinals/items/'+nn+'a.mp3');
    if(!r.wordA) refs.add('audio/phonics/exfinals/items/'+nn+'b.mp3');
    refs.add('audio/phonics/finals/items/' + (r.f==='m'?'mh':r.f) + '.m4a');
  }
}

let missing = 0;
for(const r of refs){
  if(!fs.existsSync(path.join(ROOT, r))){ console.log('MISSING ON DISK:', r); missing++; }
}

const files = [];
function scan(dir){
  if(!fs.existsSync(dir)) return;
  for(const e of fs.readdirSync(dir, {withFileTypes:true})){
    const p = path.join(dir, e.name);
    if(e.isDirectory()) scan(p);
    else files.push(path.relative(ROOT, p).replace(/\\/g,'/'));
  }
}
scan(path.join(ROOT,'audio'));
scan(path.join(ROOT,'img'));

const unref = files.filter(f=>!refs.has(f));
console.log('---');
console.log('total refs:', refs.size, '| missing on disk:', missing);
console.log('asset files:', files.length, '| unreferenced:', unref.length);
unref.forEach(f=>console.log('UNREFERENCED:', f));
