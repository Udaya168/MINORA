const puppeteer = require('C:/Users/Admin/scratch_pw/node_modules/puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Amazon
  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    await page.goto('https://www.amazon.in/R-V-Fashion-Embroidery-Designer-Lehenga/dp/B0FCG5ZRCK', { waitUntil: 'domcontentloaded' });
    const imgUrl = await page.evaluate(() => {
      const img = document.querySelector('#landingImage');
      return img ? img.src : null;
    });
    console.log('Amazon:', imgUrl);
  } catch (e) { console.log('Amazon err', e); }

  // Sareeka
  try {
    await page.goto('https://www.sareeka.com/lavender-thread-trendy-designer-lehenga-choli-156015.html', { waitUntil: 'domcontentloaded' });
    const imgUrl2 = await page.evaluate(() => {
      const img = document.querySelector('.main-image img') || document.querySelector('.product-image img') || document.querySelector('img.zoom');
      return img ? img.src : null;
    });
    console.log('Sareeka:', imgUrl2);
  } catch (e) { console.log('Sareeka err', e); }

  await browser.close();
})();
