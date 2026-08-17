import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("MINORA Supabase Config Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing from environment variables.");
}

export const supabase = createClient(
  supabaseUrl || "https://lijocgpuagpcckhyonoa.supabase.co",
  supabaseAnonKey || "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO"
);
