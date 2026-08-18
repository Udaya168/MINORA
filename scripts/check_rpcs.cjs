const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lijocgpuagpcckhyonoa.supabase.co";
const supabaseAnonKey = "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log("Checking if RPC create_order_and_decrement_inventory exists...");
  const { data, error } = await supabase.rpc("create_order_and_decrement_inventory", {
    p_customer_name: "test",
    p_customer_email: "test@test.com",
    p_phone: "123",
    p_shipping_address: "123",
    p_city: "City",
    p_state: "State",
    p_pincode: "123",
    p_subtotal: 100,
    p_discount: 0,
    p_shipping: 0,
    p_total: 100,
    p_items: []
  });
  console.log("Result:", data, "Error:", error);
}

check();
