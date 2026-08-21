const https = require('https');
const http = require('http');

const urls = [
  'https://www.indiamart.com/proddetail/designer-lehenga-19309490797.html',
  'https://www.sareeka.com/pink-casual-lehenga-choli-267872.html',
  'https://www.mirraw.com/designers/anantesh/designs/exclusive-maroon-bridal-lehenga-premium-velvet-multi-embroidery-5m-grand-flair-designer-double-dupatta-lehenga-choli',
  'https://www.graciousyou.com/products/co-ord-set-lehenga',
  'https://in.pinterest.com/contactvaishali10/floral-lehenga/'
];

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ url, data, status: res.statusCode }));
    });
    req.on('error', (e) => reject(e));
  });
}

Promise.all(urls.map(url => fetchHTML(url).catch(e => ({url, data: '', status: 'error'}))))
  .then(results => {
    results.forEach(res => {
      console.log('---');
      console.log('URL:', res.url);
      console.log('Status:', res.status);
      const matches = res.data.match(/property="og:image"\s+content="([^"]+)"/i) || res.data.match(/content="([^"]+)"\s+property="og:image"/i) || res.data.match(/name="og:image"\s+content="([^"]+)"/i);
      if (matches) {
        console.log('OG IMAGE:', matches[1]);
      }
      
      const allJpgs = res.data.match(/https:\/\/[^"'\s]+\.(?:jpg|png|webp)/g);
      if(allJpgs) {
         console.log('All Images:', Array.from(new Set(allJpgs)).filter(img => !img.includes('logo') && !img.includes('icon')).slice(0, 5));
      }
    });
  });
