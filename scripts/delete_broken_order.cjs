const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lijocgpuagpcckhyonoa.supabase.co";
const supabaseAnonKey = "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deleteBrokenOrder() {
  const brokenId = "20903523-d06d-4be5-93a0-29d55fbd53da";
  
  console.log(`Checking broken order ${brokenId}...`);
  const { data: order, error: orderErr } = await supabase.from("orders").select("*").eq("id", brokenId);
  console.log("Order found:", order, "Err:", orderErr);

  const { data: items, error: itemsErr } = await supabase.from("order_items").select("*").eq("order_id", brokenId);
  console.log("Order items found:", items, "Err:", itemsErr);

  console.log("Deleting broken order...");
  const { data: delData, error: delErr } = await supabase.from("orders").delete().eq("id", brokenId);
  console.log("Delete result:", delData, "Err:", delErr);
}

deleteBrokenOrder();
