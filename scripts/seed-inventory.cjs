const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lijocgpuagpcckhyonoa.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO';

const apiKey = serviceRoleKey || anonKey;
const isServiceRole = Boolean(serviceRoleKey);

console.log(`[INVENTORY SEED] Initializing Supabase client using ${isServiceRole ? 'SERVER-SIDE SERVICE ROLE KEY' : 'ANON KEY'}...`);
const supabase = createClient(supabaseUrl, apiKey);

async function main() {
  console.log("==========================================");
  console.log("FETCHING PRODUCTS FROM public.products...");
  console.log("==========================================");

  // 1. Fetch products from Supabase
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('id, name, sizes, colors');

  if (prodErr || !products || products.length === 0) {
    console.error("[ERROR] Failed to fetch products from Supabase:", prodErr ? prodErr.message : "0 products found.");
    process.exit(1);
  }

  console.log(`Found ${products.length} products in public.products.`);

  // 2. Query initial count of public.inventory
  const { count: countBefore } = await supabase
    .from('inventory')
    .select('*', { count: 'exact', head: true });

  const prevInventoryCount = countBefore !== null ? countBefore : 0;
  console.log(`Initial public.inventory count: ${prevInventoryCount}`);

  // 3. Generate Inventory Variants Matrix
  const inventoryRows = [];

  for (const product of products) {
    const rawSizes = Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : ["One Size"];
    const rawColors = Array.isArray(product.colors) && product.colors.length > 0 ? product.colors : ["Default"];

    for (const size of rawSizes) {
      for (const color of rawColors) {
        inventoryRows.push({
          product_id: product.id,
          size: size,
          color: color,
          quantity: 0,
          updated_at: new Date().toISOString(),
        });
      }
    }
  }

  console.log(`Generated ${inventoryRows.length} inventory variants across ${products.length} products.`);

  // 4. Batch Upsert Inventory Rows
  // Chunk into batches of 100 to avoid payload size issues
  const BATCH_SIZE = 100;
  let totalInserted = 0;
  let totalErrors = 0;

  for (let i = 0; i < inventoryRows.length; i += BATCH_SIZE) {
    const batch = inventoryRows.slice(i, i + BATCH_SIZE);
    const { data: upsertData, error: upsertErr } = await supabase
      .from('inventory')
      .upsert(batch, { onConflict: 'product_id,size,color', ignoreDuplicates: true })
      .select('id, product_id, size, color, quantity');

    if (upsertErr) {
      console.error(`Batch ${i / BATCH_SIZE + 1} error:`, upsertErr.message);
      totalErrors += batch.length;
    } else {
      totalInserted += upsertData ? upsertData.length : batch.length;
    }
  }

  // 5. Query final count of public.inventory
  const { count: countAfter } = await supabase
    .from('inventory')
    .select('*', { count: 'exact', head: true });

  const finalInventoryCount = countAfter !== null ? countAfter : 0;
  const skippedDuplicates = inventoryRows.length - (finalInventoryCount - prevInventoryCount);

  console.log("\n==========================================");
  console.log("INVENTORY SEEDING COMPLETED SUCCESSFULLY!");
  console.log("==========================================");
  console.log(`Number of products processed = ${products.length}`);
  console.log(`Number of inventory variants created = ${finalInventoryCount - prevInventoryCount}`);
  console.log(`Total rows in public.inventory = ${finalInventoryCount}`);
  console.log(`Number skipped as duplicates = ${Math.max(0, skippedDuplicates)}`);
  console.log(`Number of errors = ${totalErrors}`);
  console.log("==========================================\n");

  // 6. Sample records verification query
  const { data: sampleInventory } = await supabase
    .from('inventory')
    .select('product_id, size, color, quantity')
    .limit(10);

  if (sampleInventory) {
    console.log("Sample Created Inventory Variants (First 10):");
    console.table(sampleInventory);
  }
}

main();
