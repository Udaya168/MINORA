const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lijocgpuagpcckhyonoa.supabase.co";
const supabaseAnonKey = "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCall() {
  const email = `testrpc_${Date.now()}@example.com`;
  const { data: authData } = await supabase.auth.signUp({
    email,
    password: "Password123!",
  });

  console.log("Logged in user:", authData.user?.id);

  const { data, error } = await supabase.rpc("create_order_and_decrement_inventory", {
    p_customer_name: "Test Customer",
    p_customer_email: email,
    p_phone: "9999999999",
    p_shipping_address: "123 Main St",
    p_city: "Bengaluru",
    p_state: "Karnataka",
    p_pincode: "560001",
    p_subtotal: 999,
    p_discount: 0,
    p_shipping: 0,
    p_total: 999,
    p_items: [
      {
        product_id: "p-1",
        product_name: "Test Kurti",
        size: "M",
        color: "Ivory",
        quantity: 1,
        unit_price: 999,
        total_price: 999,
      },
    ],
  });

  console.log("RPC result:", data);
  console.log("RPC error:", error);
}

testCall();
