console.log("Environment variables starting with SUPABASE or VITE_SUPABASE:");
Object.keys(process.env).forEach(key => {
  if (key.includes("SUPABASE") || key.includes("VITE_SUPABASE")) {
    console.log(`${key}: ${process.env[key].substring(0, 8)}...`);
  }
});
