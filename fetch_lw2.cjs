const https = require('https');

https.get('https://littlewish.in/product/luxury-black-georgette-saree-with-golden-leaf-embroidery/', {
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    const imgs = data.match(/https:\/\/littlewish\.in\/[^"'\s>]+(?:\.jpg|\.png|\.webp)/g);
    if(imgs) {
      console.log([...new Set(imgs)].join('\n'));
    }
  });
});
