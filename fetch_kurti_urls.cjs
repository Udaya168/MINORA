async function run() {
  try {
    const r1 = await fetch('https://thechikanlabel.com/collections/kurtis');
    const h1 = await r1.text();
    const urls1 = h1.match(/https:\/\/thechikanlabel\.com\/cdn\/shop\/files\/[^"\s\?]+\.(?:jpg|jpeg|png)/gi);
    console.log('Chikan:', [...new Set(urls1)].slice(0, 5));

    const r2 = await fetch('https://www.ajio.com/c/830303011', { headers: {'User-Agent': 'Mozilla/5.0'} });
    const h2 = await r2.text();
    const urls2 = h2.match(/https:\/\/assets\.ajio\.com\/medias\/sys_master\/root\/[^"\s\?]+\.(?:jpg|jpeg|png)/gi);
    console.log('Ajio:', [...new Set(urls2)].slice(0, 5));
  } catch(e) { console.error(e.message) }
}
run();
