/* Audit: every data-referenced asset exists; every asset file is referenced. */
const fs = require('fs'), path = require('path');
const ROOT = 'D:\\Workspace\\Cantonese';
global.window = global;
for(const f of ['data/lesson01.js','data/lesson02.js','data/lesson03.js'])
  eval(fs.readFileSync(path.join(ROOT,f),'utf8'));

const courses = [window.COURSE_DATA, window.COURSE_DATA_02, window.COURSE_DATA_03];
const refs = new Set();
function walk(o){
  if(!o || typeof o !== 'object') return;
  for(const [k,v] of Object.entries(o)){
    if(typeof v === 'string' && /^(audio|img)\//.test(v)) refs.add(v);
    else walk(v);
  }
}
courses.forEach(walk);

let missing = 0;
for(const r of refs){
  if(!fs.existsSync(path.join(ROOT, r))){ console.log('MISSING ON DISK:', r); missing++; }
}

const files = [];
function scan(dir){
  for(const e of fs.readdirSync(dir, {withFileTypes:true})){
    const p = path.join(dir, e.name);
    if(e.isDirectory()) scan(p);
    else files.push(path.relative(ROOT, p).replace(/\\/g,'/'));
  }
}
scan(path.join(ROOT,'audio','lesson02'));
scan(path.join(ROOT,'audio','lesson03'));
scan(path.join(ROOT,'img','lesson02'));
scan(path.join(ROOT,'img','lesson03'));

const unref = files.filter(f=>!refs.has(f));
console.log('---');
console.log('total refs:', refs.size, '| missing on disk:', missing);
console.log('asset files:', files.length, '| unreferenced:', unref.length);
unref.forEach(f=>console.log('UNREFERENCED:', f));
