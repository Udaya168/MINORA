const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lijocgpuagpcckhyonoa.supabase.co";
const supabaseAnonKey = "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCustomer() {
  const email = `testuser_${Date.now()}@example.com`;
  const password = "Password123!";

  console.log("Creating test customer account:", email);
  const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: "Test Customer" } }
  });

  if (signUpErr) {
    console.error("SignUp error:", signUpErr.message);
    return;
  }

  const session = signUpData.session;
  console.log("Signed up! User ID:", session?.user?.id);

  // Check if broken order exists when authenticated
  const brokenId = "20903523-d06d-4be5-93a0-29d55fbd53da";
  const { data: ord, error: ordErr } = await supabase.from("orders").select("*").eq("id", brokenId);
  console.log("Authenticated query for broken order:", ord, ordErr);
}

testCustomer();
