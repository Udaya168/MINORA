const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lijocgpuagpcckhyonoa.supabase.co";
const supabaseAnonKey = "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRpcs() {
  const rpcList = [
    "exec_sql", "run_sql", "execute_sql", "exec", "sql", "pg_exec",
    "create_order_and_deduct_inventory", "create_order_and_decrement_inventory",
    "create_order_transaction"
  ];

  for (const name of rpcList) {
    const { data, error } = await supabase.rpc(name, {});
    console.log(`RPC [${name}]:`, error ? `Error: ${error.message} (${error.code})` : `Success: ${JSON.stringify(data)}`);
  }
}

testRpcs();
