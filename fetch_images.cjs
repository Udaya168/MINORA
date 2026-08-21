const https = require('https');
const http = require('http');

const urls = [
  'https://littlewish.in/product/luxury-black-georgette-saree-with-golden-leaf-embroidery/',
  'https://www.perniaspopupshop.com/label-priyanka-kar-blue-satin-floral-printed-hand-embroidered-lehenga-set-lpkc032437.html',
  'https://clothsvilla.com/products/admirable-beige-soft-banarasi-silk-saree-with-gorgeous-blouse-piece',
  'https://www.libas.in/products/blue-embroidered-silk-blend-saree-with-unstitched-blouse-piece-97620p'
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
        console.log('IMAGE:', matches[1]);
      } else {
        console.log('IMAGE: Not found in og:image');
        // Let's try to extract any large image if possible
        const allJpgs = res.data.match(/https:\/\/[^"']+\.jpg/g);
        if(allJpgs && allJpgs.length > 0) {
           console.log('FIRST JPG:', allJpgs[0]);
        }
      }
    });
  });
