const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lijocgpuagpcckhyonoa.supabase.co";
const supabaseAnonKey = "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testIsAdmin() {
  const { data, error } = await supabase.rpc("is_admin");
  console.log("is_admin data:", data, "error:", error);
}

testIsAdmin();
