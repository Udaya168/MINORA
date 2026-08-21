const https = require('https');

const options = {
  hostname: 'zaribanaras.com',
  path: '/sitemap_products_1.xml',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    // Only print matches for the specific product to avoid large output
    const matches = data.match(/<image:loc>([^<]+)<\/image:loc>[\s\S]*?<image:title>([^<]*Classic Red Woven Soft Silk Saree[^<]*)<\/image:title>/i);
    if (matches) {
        console.log("FOUND IMAGE:", matches[1]);
    } else {
        const urlMatches = data.match(/<loc>[^<]*classic-red-woven-soft-silk-saree[^<]*<\/loc>[\s\S]*?(?:<\/url>)/i);
        if (urlMatches) {
            console.log("FOUND URL BLOCK:", urlMatches[0]);
        } else {
            console.log("No matches found. First 500 chars:", data.substring(0, 500));
        }
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
