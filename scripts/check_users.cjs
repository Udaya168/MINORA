const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lijocgpuagpcckhyonoa.supabase.co";
const supabaseAnonKey = "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUsers() {
  const { data: profiles, error } = await supabase.from("profiles").select("*");
  console.log("Profiles in DB:", profiles, "Error:", error);
}

checkUsers();
