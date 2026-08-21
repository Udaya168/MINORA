const fs = require('fs');
const lines = fs.readFileSync('c:/Users/Admin/.antigravity-ide/MINORA/src/data/products.ts', 'utf8').split('\n');

let lehengas = [];
for(let i=0; i<lines.length; i++) {
  if (lines[i].includes('category: "lehengas"')) {
    lehengas.push({line: i+1, content: lines[i]});
    if(lehengas.length === 5) break;
  }
}
console.log(lehengas);
