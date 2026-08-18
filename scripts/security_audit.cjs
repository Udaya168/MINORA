const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lijocgpuagpcckhyonoa.supabase.co";
const supabaseAnonKey = "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runSecurityAudit() {
  console.log("==================================================");
  console.log("    MINORA SUPABASE RLS & SECURITY AUDIT");
  console.log("==================================================\n");

  const tables = ["profiles", "products", "orders", "order_items", "inventory", "notifications"];

  // 1. Unauthenticated Anon Client Checks
  console.log("1. TESTING UNAUTHENTICATED (ANON KEY) ACCESS:");
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select("*").limit(5);
    if (error) {
      console.log(`   [${t}]: Access Blocked / Restricted by RLS -> (${error.code}: ${error.message})`);
    } else {
      console.log(`   [${t}]: Returned ${data.length} rows as anon user.`);
    }
  }

  // 2. Authenticated Normal Customer Checks
  console.log("\n2. TESTING AUTHENTICATED CUSTOMER SESSION ACCESS:");
  const testEmail = `sec_audit_${Date.now()}@example.com`;
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email: testEmail,
    password: "TestPassword123!",
  });

  if (authErr || !authData.session) {
    console.log("   Could not create test customer session:", authErr?.message);
  } else {
    const customerClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
    await customerClient.auth.setSession(authData.session);

    const userId = authData.user.id;
    console.log(`   Authenticated as Customer (UID: ${userId})`);

    // Check customer access to profiles
    const { data: ownProf } = await customerClient.from("profiles").select("*").eq("id", userId);
    const { data: allProfs, error: allProfsErr } = await customerClient.from("profiles").select("*").limit(5);
    console.log(`   profiles -> Own Profile: ${ownProf?.length || 0} rows. All Profiles Error/Length: ${allProfsErr ? allProfsErr.message : allProfs?.length}`);

    // Check customer access to orders
    const { data: ownOrders } = await customerClient.from("orders").select("*").eq("user_id", userId);
    const { data: allOrders, error: allOrdersErr } = await customerClient.from("orders").select("*").limit(5);
    console.log(`   orders -> Own Orders: ${ownOrders?.length || 0} rows. All Orders Access: ${allOrdersErr ? allOrdersErr.message : allOrders?.length + " rows"}`);

    // Check customer access to notifications (should be blocked for admin notifications)
    const { data: notifs, error: notifErr } = await customerClient.from("notifications").select("*").limit(5);
    console.log(`   notifications -> Customer Access: ${notifErr ? `Blocked (${notifErr.code}: ${notifErr.message})` : notifs?.length + " rows"}`);
  }

  console.log("\n==================================================");
  console.log("       SECURITY AUDIT VERIFICATION COMPLETE");
  console.log("==================================================");
}

runSecurityAudit();
