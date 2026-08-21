async function run() {
  try {
    const r1 = await fetch('https://thechikanlabel.com/collections/kurtis');
    const h1 = await r1.text();
    const urls1 = h1.match(/cdn\/shop\/files\/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|webp|png)/gi);
    if(urls1) console.log('Chikan:', [...new Set(urls1)].slice(0, 5).map(u => 'https://thechikanlabel.com/' + u));

    const r2 = await fetch('https://www.ajio.com/c/830303011', { headers: {'User-Agent': 'Mozilla/5.0'} });
    const h2 = await r2.text();
    const urls2 = h2.match(/assets\.ajio\.com\/medias\/sys_master\/root\/[a-zA-Z0-9_\/-]+\.(?:jpg|jpeg|webp|png)/gi);
    if(urls2) console.log('Ajio:', [...new Set(urls2)].slice(0, 5).map(u => 'https://' + u));
  } catch(e) { console.error(e.message) }
}
run();
