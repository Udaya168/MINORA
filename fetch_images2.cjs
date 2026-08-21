const https = require('https');
const http = require('http');

const urls = [
  'https://shobitam.in/products/red-patch-work-saree-with-pure-cotton-ready-to-wear-saree-redwrk4',
  'https://www.vastranand.in/products/elegant-saree-adorned-with-ethnic-motifs-intricate-threadwork-and-embellished-borders-pri-net-04',
  'https://trendia.co/products/women-ethnic-wear-sarees-buvda-1006',
  'https://www.exoticindiaart.com/product/textiles/banarasi-silk-woven-work-designer-saree-with-blouse-tassels-pallu-for-casual-occasion-gaj128/'
];

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
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
      }
    });
  });
