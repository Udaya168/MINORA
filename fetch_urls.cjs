async function run() {
  const res = await fetch('https://unsplash.com/s/photos/saree', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  const regex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+[^"\\s&]+/g;
  const matches = html.match(regex);
  if (matches) {
    console.log([...new Set(matches)].slice(0, 10));
  } else {
    console.log('No matches');
  }
}
run();
