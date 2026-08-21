import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/c/women', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'category_page.png', fullPage: true });
  await browser.close();
})();
