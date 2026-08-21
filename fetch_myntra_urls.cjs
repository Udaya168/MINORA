async function run() {
  try {
    const r = await fetch('https://www.myntra.com/kurtis', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const h = await r.text();
    const urls = h.match(/https:\/\/assets\.myntassets\.com\/h_[0-9]+,q_[0-9]+,w_[0-9]+\/v1\/assets\/images\/[^"\s\?]+\.(?:jpg|jpeg|webp)/gi);
    if(urls) {
      console.log('Myntra:', [...new Set(urls)].slice(0, 10));
    } else {
      console.log('No matches');
    }
  } catch(e) { console.error(e.message) }
}
run();
