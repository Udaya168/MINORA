const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'zaribanaras.com',
  path: '/products/classic-red-woven-soft-silk-saree',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('zaribanaras_product.html', data);
    console.log("Status Code:", res.statusCode);
    const matches = data.match(/og:image" content="([^"]+)"/);
    if (matches) {
        console.log("IMAGE_URL:", matches[1]);
    } else {
        console.log("No og:image found.");
    }
  });
});

req.on('error', (error) => { console.error('Error:', error); });
req.end();
