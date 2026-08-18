const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lijocgpuagpcckhyonoa.supabase.co";
const supabaseAnonKey = "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO"; // publishable/anon key from code

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from("notifications").select("*").limit(1);
  if (error) {
    console.log("Error querying notifications table:", error.message, error.code);
  } else {
    console.log("Success! Table exists. Data length:", data.length);
  }
}

check();
