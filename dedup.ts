import fs from 'fs';
import { PRODUCTS } from './src/data/products.ts';

// Reconstruct products.ts without the duplicates in seeds array
// Wait, we can't easily rewrite the file using imported PRODUCTS because PRODUCTS has IDs added and is mapped.
// But we CAN use PRODUCTS to find the exact names and images of duplicates.

const imageSigMap = new Map();
const duplicatesToRemove = new Set(); // store IDs of duplicates

PRODUCTS.forEach(p => {
  const sig = `${p.name}::${p.image}`;
  if (imageSigMap.has(sig)) {
    console.log(`Duplicate found: ${p.name} (ID: ${p.id})`);
    duplicatesToRemove.add(p.name + p.price.toString()); 
    // Wait, the source file doesn't have IDs. 
    // We need to match by name and price in the source file.
  } else {
    imageSigMap.set(sig, true);
  }
});

const lines = fs.readFileSync('./src/data/products.ts', 'utf8').split('\n');

let seedStart = -1;
let seedEnd = -1;
for(let i=0; i<lines.length; i++) {
  if(lines[i].includes('const seeds: Seed[] = [')) seedStart = i;
  if(seedStart !== -1 && lines[i].startsWith('];')) {
    seedEnd = i;
    break;
  }
}

const seenSigs = new Set();
const newLines = [];
let removedCount = 0;

for(let i=0; i<lines.length; i++) {
  if (i > seedStart && i < seedEnd) {
    const line = lines[i];
    const nameMatch = line.match(/name:\s*"([^"]+)"/);
    if (nameMatch) {
      const name = nameMatch[1];
      // Since we don't have the image here, we just use the name as a proxy, 
      // but wait, what if they have different images? 
      // Let's use the image from PRODUCTS array!
      const prod = PRODUCTS.find(p => p.name === name);
      if (prod) {
        const sig = `${name}::${prod.image}`;
        if (seenSigs.has(sig)) {
          removedCount++;
          continue; // skip
        } else {
          seenSigs.add(sig);
        }
      }
    }
  }
  newLines.push(lines[i]);
}

fs.writeFileSync('./src/data/products.ts', newLines.join('\n'));
console.log(`Removed ${removedCount} duplicates!`);
