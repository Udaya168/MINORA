import { createClient } from '@supabase/supabase-js';
import { PRODUCTS } from '../src/data/products.ts';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lijocgpuagpcckhyonoa.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function migrateProducts() {
  console.log(`Starting migration of ${PRODUCTS.length} products to Supabase...`);

  const payload = PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    category_label: p.categoryLabel,
    group_name: p.group,
    tags: p.tags,
    images: p.images,
    price: p.price,
    original_price: p.originalPrice,
    discount: p.discount,
    rating: p.rating,
    review_count: p.reviewCount,
    sizes: p.sizes,
    colors: p.colors,
    description: p.description,
    fabric: p.fabric,
    pattern: p.pattern,
    seller: p.seller,
    delivery: p.delivery,
    in_stock: p.inStock,
    created_days_ago: p.createdDaysAgo,
    popularity: p.popularity,
  }));

  const { data, error } = await supabase
    .from('products')
    .upsert(payload, { onConflict: 'id' })
    .select('id');

  if (error) {
    if (error.code === 'PGRST205') {
      console.log("MIGRATION NOTICE: public.products table does not exist in Supabase yet.");
      console.log("Please execute the SQL script in Supabase SQL Editor first, then run this migration script.");
    } else {
      console.error("Migration Error:", error.message);
    }
    return false;
  }

  console.log(`Successfully migrated ${data ? data.length : 0} / ${PRODUCTS.length} products to Supabase!`);
  return true;
}

migrateProducts();
