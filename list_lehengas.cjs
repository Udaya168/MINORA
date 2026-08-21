const fs = require('fs');
const lines = fs.readFileSync('c:/Users/Admin/.antigravity-ide/MINORA/src/data/products.ts', 'utf8').split('\n');
let lehengas = [];
lines.forEach((l, i) => {
  if(l.includes('category: "lehengas"')) {
    lehengas.push((i+1) + ': ' + l.match(/name: "([^"]+)"/)[1]);
  }
});
console.log(lehengas.join('\n'));
