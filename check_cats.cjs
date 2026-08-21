const fs = require('fs');
const lines = fs.readFileSync('c:/Users/Admin/.antigravity-ide/MINORA/src/data/products.ts', 'utf8').split('\n');

const cats = new Set();
for(let line of lines) {
  const m = line.match(/category:\s*"([^"]+)"/);
  if(m) cats.add(m[1]);
}
console.log(Array.from(cats));

let lehengas = [];
for(let i=0; i<lines.length; i++) {
  if (lines[i].includes('Lehenga') || lines[i].includes('lehenga') || lines[i].includes('ethnic') || lines[i].includes('kids')) {
    lehengas.push({line: i+1, content: lines[i]});
    if(lehengas.length === 10) break;
  }
}
console.log(lehengas);
