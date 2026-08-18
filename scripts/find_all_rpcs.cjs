const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lijocgpuagpcckhyonoa.supabase.co";
const supabaseAnonKey = "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function findRpcs() {
  const commonNames = [
    "create_order_and_deduct_inventory",
    "create_order_and_decrement_inventory",
    "create_order",
    "place_order",
    "create_order_transaction",
    "is_admin",
    "get_profile",
    "exec_sql",
    "execute_sql",
    "run_sql",
    "sql"
  ];

  for (const name of commonNames) {
    const { data, error } = await supabase.rpc(name, {});
    console.log(`RPC [${name}]:`, error ? `Code ${error.code} - ${error.message}` : `Success: ${JSON.stringify(data)}`);
  }
}

findRpcs();
