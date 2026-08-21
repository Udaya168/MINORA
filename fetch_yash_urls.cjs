async function run() {
  try {
    const r = await fetch('https://yashgallery.com/collections/kurta', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const h = await r.text();
    const urls = h.match(/cdn\/shop\/files\/[^"\s\?]+\.(?:jpg|jpeg|webp)/gi);
    if(urls) {
      console.log('YashGallery:', [...new Set(urls)].slice(0, 10).map(u => 'https://yashgallery.com/' + u));
    } else {
      console.log('No matches');
    }
  } catch(e) { console.error(e.message) }
}
run();
