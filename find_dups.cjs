const fs = require('fs');
const lines = fs.readFileSync('c:/Users/Admin/.antigravity-ide/MINORA/src/data/products.ts', 'utf8').split('\n');

let seedStart = -1;
let seedEnd = -1;
for(let i=0; i<lines.length; i++) {
  if(lines[i].includes('const seeds: Seed[] = [')) seedStart = i;
  if(seedStart !== -1 && lines[i].startsWith('];')) {
    seedEnd = i;
    break;
  }
}

const map = new Map();
for(let i=seedStart+1; i<seedEnd; i++) {
  const line = lines[i];
  const match = line.match(/name:\s*"([^"]+)"/);
  if(match) {
    const name = match[1];
    if(!map.has(name)) map.set(name, []);
    map.get(name).push(i + 1);
  }
}

map.forEach((linesArr, name) => {
  if(linesArr.length > 1) {
    console.log(`DUPLICATE: "${name}" at lines: ${linesArr.join(', ')}`);
  }
});
