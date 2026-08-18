const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lijocgpuagpcckhyonoa.supabase.co";
const supabaseAnonKey = "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRpc() {
  const { data, error } = await supabase.rpc("create_order_and_deduct_inventory", {
    p_user_id: "00000000-0000-0000-0000-000000000000",
    p_customer_name: "Test",
    p_customer_email: "test@example.com",
    p_phone: "1234567890",
    p_shipping_address: "123 St",
    p_city: "City",
    p_state: "State",
    p_pincode: "123456",
    p_subtotal: 100,
    p_discount: 0,
    p_shipping: 0,
    p_total: 100,
    p_items: [],
  });

  console.log("RPC result:", data, "RPC error:", error);
}

testRpc();
