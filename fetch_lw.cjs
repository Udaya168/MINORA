const https = require('https');

const url = 'https://littlewish.in/product/luxury-black-georgette-saree-with-golden-leaf-embroidery/';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Accept': 'text/html'
  }
}, (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    // Find images without dimensions like -265x331 in the URL
    const jpgs = data.match(/https:\/\/littlewish\.in\/wp-content\/uploads\/[0-9]{4}\/[0-9]{2}\/[a-zA-Z0-9-_]+\.jpg/g);
    if(jpgs) {
       // Filter out thumbnail suffixes
       const fullSize = jpgs.filter(url => !url.match(/-\d+x\d+\.jpg$/));
       console.log("FULL SIZE JPGS:", Array.from(new Set(fullSize)).slice(0, 5));
    }
    const ogMatches = data.match(/og:image['"]\s+content=['"]([^'"]+)['"]/i) || data.match(/content=['"]([^'"]+)['"]\s+property=['"]og:image['"]/i);
    if (ogMatches) {
        console.log("OG IMAGE:", ogMatches[1]);
    }
  });
});
