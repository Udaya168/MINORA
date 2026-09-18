import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://lijocgpuagpcckhyonoa.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO";

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn("[SUPABASE] Notice: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not detected in import.meta.env, using default config.");
} else {
  console.log("[SUPABASE] Client initialized");
}

console.log("[SUPABASE] Connected VITE_SUPABASE_URL:", supabaseUrl);
console.log("[SUPABASE] Storage bucket: product-images");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
