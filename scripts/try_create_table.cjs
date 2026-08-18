const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lijocgpuagpcckhyonoa.supabase.co";
const supabaseAnonKey = "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO"; // publishable/anon key from code

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const sql = `
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  order_id VARCHAR(100),
  product_id VARCHAR(100),
  customer_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow admin read" ON public.notifications;
DROP POLICY IF EXISTS "Allow admin write/update" ON public.notifications;
DROP POLICY IF EXISTS "Allow public inserts" ON public.notifications;

-- Policies
CREATE POLICY "Allow admin read" ON public.notifications
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Allow admin write/update" ON public.notifications
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Allow public inserts" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Enable realtime subscriptions on notifications
alter publication supabase_realtime add table notifications;
`;

async function tryRpcs() {
  const rpcs = ["exec_sql", "run_sql", "execute_sql"];
  
  for (const rpcName of rpcs) {
    console.log(`Trying RPC: ${rpcName}...`);
    try {
      const { data, error } = await supabase.rpc(rpcName, { sql });
      if (error) {
        console.log(`RPC ${rpcName} failed:`, error.message);
      } else {
        console.log(`Success using RPC ${rpcName}!`);
        return true;
      }
    } catch (e) {
      console.log(`RPC ${rpcName} exception:`, e.message);
    }
  }
  
  console.log("Could not create table via RPC. Checking if notifications exists now...");
  const { error } = await supabase.from("notifications").select("id").limit(1);
  if (error) {
    console.log("Table 'notifications' still does not exist.");
    return false;
  } else {
    console.log("Table 'notifications' exists now!");
    return true;
  }
}

tryRpcs();
