const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lijocgpuagpcckhyonoa.supabase.co";
const supabaseAnonKey = "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testNotif() {
  console.log("1. Testing insert into notifications with anon key...");
  const { data: insData, error: insErr } = await supabase
    .from("notifications")
    .insert([
      {
        type: "order",
        title: "Test Title",
        message: "Test Message",
        order_id: null,
        product_id: null,
        customer_id: null,
        is_read: false,
      },
    ])
    .select();

  console.log("Insert result:", insData, "Error:", insErr);

  if (insData && insData.length > 0) {
    const createdId = insData[0].id;
    console.log("2. Cleaning up test notification...", createdId);
    const { error: delErr } = await supabase.from("notifications").delete().eq("id", createdId);
    console.log("Delete error:", delErr);
  }
}

testNotif();
