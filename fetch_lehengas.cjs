const https = require('https');
const http = require('http');

const urls = [
  'https://www.ogaan.com/mint-green-multicolor-floral-lehenga-set',
  'https://blog.falgunishanepeacock.in/top-5-minimal-designer-bridal-lehenga-options-for-modern-brides/',
  'https://clothsvilla.com/products/dark-maroon-silk-festive-lehenga-choli',
  'https://www.samyakk.com/blog/designer-bridal-lehengas-perfect-blend-luxury-style-modern-bride/',
  'https://www.wholetex.com/wholesale-catalogs/anamika-vol-44-silk-designer-lehenga-choli'
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
