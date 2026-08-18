const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lijocgpuagpcckhyonoa.supabase.co";
const supabaseAnonKey = "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectSchema() {
  const tables = ["orders", "order_items", "inventory", "notifications"];
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select("*").limit(1);
    if (error) {
      console.log(`Table [${t}] query error:`, error.message);
    } else {
      console.log(`Table [${t}] sample row keys:`, data.length > 0 ? Object.keys(data[0]) : "0 rows (table exists)");
    }
  }
}

inspectSchema();
