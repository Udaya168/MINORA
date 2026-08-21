const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/.gemini/antigravity-ide/brain/1714b677-697c-49e3-96b9-cc353892e45c/.system_generated/steps/649/content.md', 'utf8');
console.log(content.match(/https?:\/\/[^\s"']+\.(?:jpg|png|webp|jpeg)/gi));
