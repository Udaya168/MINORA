const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lijocgpuagpcckhyonoa.supabase.co";
const supabaseAnonKey = "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSqlRpcs() {
  const params = [
    { name: "exec_sql", arg: { sql: "SELECT 1" } },
    { name: "execute_sql", arg: { sql: "SELECT 1" } },
    { name: "run_sql", arg: { sql: "SELECT 1" } },
    { name: "exec", arg: { sql: "SELECT 1" } },
    { name: "query", arg: { query_string: "SELECT 1" } },
    { name: "sql", arg: { query: "SELECT 1" } },
  ];

  for (const item of params) {
    const { data, error } = await supabase.rpc(item.name, item.arg);
    console.log(`RPC [${item.name}]:`, error ? `Error: ${error.message} (${error.code})` : `SUCCESS: ${JSON.stringify(data)}`);
  }
}

testSqlRpcs();
