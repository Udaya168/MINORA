const https = require('https');
const http = require('http');

const urls = [
  'https://www.samyakk.com/blog/designer-bridal-lehengas-perfect-blend-luxury-style-modern-bride/?srsltid=AfmBOoruM1uusbxejuTxOAC-jqsyAGD0CMN6aQhq_gFGMo2RBp2J_KPf',
  'https://www.instagram.com/p/DRqtDLZCQ2n/',
  'https://g3fashion.com/blog/fashion/latest-trends-in-lehenga-choli-designs/',
  'https://www.trendbuy.co.in/products/cotton-lehenga-choli-for-women-festive-casual-wear?srsltid=AfmBOop-jE6Y1VZ4BDqTTNVsTHIqqtiqmbDmialxfLWq79y_55MG4KOu'
];

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ url, data, status: res.statusCode, headers: res.headers }));
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
      if(res.status === 301 || res.status === 302) {
         console.log('Redirects to:', res.headers.location);
      }
      const matches = res.data.match(/property="og:image"\s+content="([^"]+)"/i) || res.data.match(/content="([^"]+)"\s+property="og:image"/i) || res.data.match(/name="og:image"\s+content="([^"]+)"/i);
      if (matches) {
        console.log('OG IMAGE:', matches[1]);
      } else {
        const allJpgs = res.data.match(/https:\/\/[^"'\s]+\.(?:jpg|png|webp|jpeg)/g);
        if(allJpgs) {
           console.log('All Images:', Array.from(new Set(allJpgs)).filter(img => !img.includes('logo') && !img.includes('icon')).slice(0, 5));
        } else {
           console.log('No images found.');
        }
      }
    });
  });
