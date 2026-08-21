const fs = require('fs');

const imageForFunc = require('./imageForCode.cjs');

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

const seen = new Set();
const newLines = [];
let removedCount = 0;

for(let i=0; i<lines.length; i++) {
  if (i > seedStart && i < seedEnd) {
    const line = lines[i];
    const nameMatch = line.match(/name:\s*"([^"]+)"/);
    const priceMatch = line.match(/price:\s*(\d+)/);
    
    if (nameMatch) {
      const name = nameMatch[1];
      const price = priceMatch ? parseInt(priceMatch[1], 10) : 0;
      
      const img = imageForFunc({name, price});
      const sig = `${name}::${img}`;
      
      if (seen.has(sig)) {
        console.log(`Removing duplicate: ${name} (Line ${i+1})`);
        removedCount++;
        continue; // Skip this line (duplicate)
      } else {
        seen.add(sig);
      }
    }
  }
  newLines.push(lines[i]);
}

fs.writeFileSync('c:/Users/Admin/.antigravity-ide/MINORA/src/data/products.ts', newLines.join('\n'));
console.log(`Done! Removed ${removedCount} duplicates.`);
