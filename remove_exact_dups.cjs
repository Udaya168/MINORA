const fs = require('fs');

const lines = fs.readFileSync('c:/Users/Admin/.antigravity-ide/MINORA/src/data/products.ts', 'utf8').split('\n');

let imgStart = -1, imgEnd = -1;
for(let i=0; i<lines.length; i++) {
  if(lines[i].includes('const imageFor = (seed: Seed) => {')) imgStart = i;
  if(imgStart !== -1 && lines[i].trim() === '};') {
    imgEnd = i;
    break;
  }
}

let imageForCode = lines.slice(imgStart, imgEnd+1).join('\n');
imageForCode = imageForCode.replace(/:\s*Seed/g, '');
imageForCode = imageForCode.replace('const imageFor = (seed) => {', 'function imageFor(seed) {');
imageForCode = imageForCode.replace('return CATEGORY_IMAGES[seed.category] ?? kurti;', 'return "DEFAULT_IMG";');

const imageForFunc = eval(`(function() {
  ${imageForCode}
  return imageFor;
})()`);

let seedStart = -1;
let seedEnd = -1;
for(let i=0; i<lines.length; i++) {
  if(lines[i].includes('const seeds: Seed[] = [')) seedStart = i;
  if(seedStart !== -1 && lines[i].trim() === '];') {
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
    const categoryMatch = line.match(/category:\s*"([^"]+)"/);
    
    if (nameMatch && priceMatch && categoryMatch) {
      const name = nameMatch[1];
      const price = parseInt(priceMatch[1], 10);
      const category = categoryMatch[1];
      
      const img = imageForFunc({name, price, category});
      const sig = `${name}::${img}`;
      
      if (seen.has(sig)) {
        console.log(`Removing duplicate: ${name} (Price: ${price}, Line: ${i+1})`);
        removedCount++;
        continue; // Skip duplicate
      } else {
        seen.add(sig);
      }
    }
  }
  newLines.push(lines[i]);
}

fs.writeFileSync('c:/Users/Admin/.antigravity-ide/MINORA/src/data/products.ts', newLines.join('\n'));
console.log(`Done! Removed ${removedCount} actual duplicates (same name AND same image).`);
