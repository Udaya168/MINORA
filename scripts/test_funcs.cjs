const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lijocgpuagpcckhyonoa.supabase.co";
const supabaseAnonKey = "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFuncs() {
  const names = ["is_admin", "handle_new_user", "create_order", "create_order_and_deduct_inventory", "create_order_and_decrement_inventory", "create_order_transaction"];
  for (const n of names) {
    const { data, error } = await supabase.rpc(n);
    console.log(`RPC [${n}]:`, error?.code, error?.message);
  }
}

testFuncs();
