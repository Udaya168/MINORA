const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lijocgpuagpcckhyonoa.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CATEGORIES = [
  { slug: "sarees", label: "Sarees" },
  { slug: "kurtis", label: "Kurtis" },
  { slug: "kurtas", label: "Kurtas" },
  { slug: "dresses", label: "Dresses" },
  { slug: "tops", label: "Tops" },
  { slug: "jeans", label: "Jeans" },
  { slug: "lehengas", label: "Lehengas" },
  { slug: "jewellery", label: "Jewellery" },
  { slug: "footwear", label: "Footwear" },
  { slug: "handbags", label: "Handbags" },
  { slug: "beauty", label: "Beauty" },
  { slug: "kids", label: "Kids" },
];

const SELLERS = [
  "Anaya Textiles, Surat",
  "Rangrez Studio, Jaipur",
  "Nirmal Fashions, Tirupur",
  "Kalaa House, Ahmedabad",
  "Veda Crafts, Bengaluru",
];

const APPAREL = ["XS", "S", "M", "L", "XL", "XXL"];
const FREE = ["Free Size"];
const SHOE = ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"];

const seeds = [
  { name: "Floral Printed Cotton Kurti", category: "kurtis", price: 499, originalPrice: 1299, rating: 4.4, reviewCount: 2341, fabric: "Cotton Blend", pattern: "Floral", colors: ["Ivory", "Pink", "Sage"], tags: ["ethnic-wear", "trending"] },
  { name: "Cotton Anarkali Kurti", category: "kurtis", price: 699, originalPrice: 1599, rating: 4.3, reviewCount: 1876, fabric: "Pure Cotton", pattern: "Solid", colors: ["Wine", "Navy"], tags: ["ethnic-wear", "trending"] },
  { name: "Chikankari Straight Kurti", category: "kurtis", price: 899, originalPrice: 2199, rating: 4.6, reviewCount: 934, fabric: "Georgette", pattern: "Embroidered", colors: ["White", "Powder Blue"], tags: ["ethnic-wear"] },
  { name: "Printed A-Line Kurti", category: "kurtis", price: 379, originalPrice: 999, rating: 4.1, reviewCount: 5120, fabric: "Rayon", pattern: "Printed", colors: ["Mustard", "Teal"], tags: ["ethnic-wear", "deals"] },
  { name: "Embroidered Silk Blend Saree", category: "sarees", price: 1499, originalPrice: 3499, rating: 4.5, reviewCount: 1204, fabric: "Art Silk", pattern: "Embroidered", colors: ["Gold", "Wine"], tags: ["ethnic-wear", "festive", "trending"] },
  { name: "Banarasi Woven Saree", category: "sarees", price: 1899, originalPrice: 4599, rating: 4.7, reviewCount: 812, fabric: "Banarasi Silk", pattern: "Woven Design", colors: ["Maroon", "Emerald"], tags: ["ethnic-wear", "festive"] },
  { name: "Daily Wear Cotton Saree", category: "sarees", price: 449, originalPrice: 1199, rating: 4.0, reviewCount: 3311, fabric: "Cotton", pattern: "Solid", colors: ["Beige", "Indigo"], tags: ["ethnic-wear", "deals"] },
  { name: "Georgette Floral Saree", category: "sarees", price: 799, originalPrice: 1999, rating: 4.2, reviewCount: 1490, fabric: "Georgette", pattern: "Floral", colors: ["Peach", "Lilac"], tags: ["ethnic-wear"] },
  { name: "Women's Casual Midi Dress", category: "dresses", price: 649, originalPrice: 1499, rating: 4.3, reviewCount: 2110, fabric: "Viscose", pattern: "Solid", colors: ["Mocha", "Black"], tags: ["western-wear", "trending"] },
  { name: "Wrap Front Maxi Dress", category: "dresses", price: 999, originalPrice: 2299, rating: 4.4, reviewCount: 764, fabric: "Crepe", pattern: "Solid", colors: ["Olive", "Rust"], tags: ["western-wear"] },
  { name: "Fit & Flare Printed Dress", category: "dresses", price: 549, originalPrice: 1399, rating: 4.1, reviewCount: 1988, fabric: "Polyester", pattern: "Printed", colors: ["Blue", "Red"], tags: ["western-wear", "deals"] },
  { name: "Relaxed Cotton Top", category: "tops", price: 299, originalPrice: 899, rating: 4.2, reviewCount: 4402, fabric: "Cotton", pattern: "Solid", colors: ["Sand", "White"], tags: ["western-wear", "deals"] },
  { name: "Puff Sleeve Blouse", category: "tops", price: 449, originalPrice: 1099, rating: 4.3, reviewCount: 1201, fabric: "Rayon", pattern: "Solid", colors: ["Blush", "Black"], tags: ["western-wear"] },
  { name: "Ribbed Knit Casual Top", category: "tops", price: 399, originalPrice: 999, rating: 4.0, reviewCount: 880, fabric: "Knit", pattern: "Ribbed", colors: ["Lilac", "Grey"], tags: ["western-wear"] },
  { name: "Straight Fit Jeans", category: "jeans", price: 899, originalPrice: 1999, rating: 4.4, reviewCount: 3050, fabric: "Denim", pattern: "Solid", colors: ["Mid Blue", "Black"], tags: ["western-wear", "trending"] },
  { name: "High Rise Skinny Jeans", category: "jeans", price: 1099, originalPrice: 2499, rating: 4.5, reviewCount: 1670, fabric: "Stretch Denim", pattern: "Solid", colors: ["Dark Blue"], tags: ["western-wear"] },
  { name: "Wide Leg Denim Trousers", category: "jeans", price: 1249, originalPrice: 2799, rating: 4.2, reviewCount: 612, fabric: "Denim", pattern: "Solid", colors: ["Light Blue"], tags: ["western-wear"] },
  { name: "Bridal Embroidered Lehenga", category: "lehengas", price: 4499, originalPrice: 10999, rating: 4.6, reviewCount: 421, fabric: "Velvet", pattern: "Zari Work", colors: ["Maroon"], tags: ["ethnic-wear", "festive"] },
  { name: "Festive Georgette Lehenga", category: "lehengas", price: 2499, originalPrice: 5999, rating: 4.3, reviewCount: 733, fabric: "Georgette", pattern: "Sequin", colors: ["Wine", "Teal"], tags: ["ethnic-wear", "festive"] },
  { name: "Ethnic Printed Co-ord Set", category: "kurtis", price: 899, originalPrice: 2099, rating: 4.5, reviewCount: 1522, fabric: "Muslin", pattern: "Printed", colors: ["Ivory", "Rose"], tags: ["ethnic-wear", "trending"] },
  { name: "Minimal Gold-Plated Earrings", category: "jewellery", price: 249, originalPrice: 799, rating: 4.4, reviewCount: 6120, fabric: "Brass, Gold Plated", pattern: "Jhumka", colors: ["Gold"], tags: ["accessories", "trending", "deals"] },
  { name: "Kundan Choker Necklace Set", category: "jewellery", price: 899, originalPrice: 2499, rating: 4.5, reviewCount: 1043, fabric: "Alloy", pattern: "Kundan", colors: ["Gold", "Silver"], tags: ["accessories", "festive"] },
  { name: "Oxidised Silver Bangles", category: "jewellery", price: 299, originalPrice: 899, rating: 4.1, reviewCount: 2210, fabric: "Oxidised Alloy", pattern: "Textured", colors: ["Silver"], tags: ["accessories", "deals"] },
  { name: "Embroidered Ethnic Juttis", category: "footwear", price: 599, originalPrice: 1499, rating: 4.2, reviewCount: 1330, fabric: "Synthetic", pattern: "Embroidered", colors: ["Pink", "Gold"], tags: ["festive"] },
  { name: "Everyday Block Heel Sandals", category: "footwear", price: 749, originalPrice: 1899, rating: 4.0, reviewCount: 905, fabric: "Faux Leather", pattern: "Solid", colors: ["Tan", "Black"], tags: [] },
  { name: "Women's Structured Handbag", category: "handbags", price: 999, originalPrice: 2599, rating: 4.4, reviewCount: 1802, fabric: "PU Leather", pattern: "Solid", colors: ["Tan", "Black"], tags: ["accessories", "trending"] },
  { name: "Everyday Tote Bag", category: "handbags", price: 649, originalPrice: 1599, rating: 4.2, reviewCount: 740, fabric: "Canvas", pattern: "Solid", colors: ["Beige"], tags: ["accessories"] },
  { name: "Matte Lipstick Duo", category: "beauty", price: 349, originalPrice: 899, rating: 4.3, reviewCount: 4210, fabric: "Cosmetic", pattern: "Matte", colors: ["Rosewood", "Crimson"], tags: ["deals"] },
  { name: "Glow Skincare Essentials Kit", category: "beauty", price: 799, originalPrice: 1999, rating: 4.5, reviewCount: 1620, fabric: "Cosmetic", pattern: "Kit", colors: ["Neutral"], tags: [] },
  { name: "Men's Cotton Kurta Pyjama Set", category: "kurtas", price: 1099, originalPrice: 2499, rating: 4.4, reviewCount: 1180, fabric: "Cotton", pattern: "Solid", colors: ["Cream", "Beige"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Men's Short Kurta", category: "kurtas", price: 649, originalPrice: 1599, rating: 4.1, reviewCount: 690, fabric: "Cotton Blend", pattern: "Solid", colors: ["White", "Olive"], group: "men", tags: ["ethnic-wear"] },
  { name: "Kids Festive Ethnic Set", category: "kids", price: 749, originalPrice: 1799, rating: 4.5, reviewCount: 512, fabric: "Cotton Silk", pattern: "Printed", colors: ["Yellow", "Blue"], group: "kids", tags: ["ethnic-wear", "festive"] },
  { name: "Kids Cotton Everyday Set", category: "kids", price: 399, originalPrice: 999, rating: 4.2, reviewCount: 341, fabric: "Cotton", pattern: "Printed", colors: ["Red", "Blue"], group: "kids", tags: ["deals"] },
];

const sizesFor = (category) => {
  if (category === "footwear") return SHOE;
  if (["jewellery", "handbags", "beauty"].includes(category)) return FREE;
  if (category === "kids") return ["2-3Y", "4-5Y", "6-7Y", "8-9Y"];
  return APPAREL;
};

const PRODUCTS = seeds.map((seed, i) => {
  const label = CATEGORIES.find((c) => c.slug === seed.category)?.label ?? seed.category;
  const imagePath = `/assets/p-${seed.category === 'kurtas' ? 'kurta' : seed.category === 'jewellery' ? 'jewellery' : seed.category}.jpg`;
  return {
    id: `min-${String(i + 1).padStart(3, "0")}`,
    name: seed.name,
    category: seed.category,
    categoryLabel: label,
    group: seed.group ?? "women",
    tags: seed.tags ?? [],
    images: [imagePath],
    price: seed.price,
    originalPrice: seed.originalPrice,
    discount: Math.round(((seed.originalPrice - seed.price) / seed.originalPrice) * 100),
    rating: seed.rating,
    reviewCount: seed.reviewCount,
    sizes: sizesFor(seed.category),
    colors: seed.colors,
    description: `${seed.name} crafted in ${seed.fabric.toLowerCase()} with a ${seed.pattern.toLowerCase()} finish. Designed for all-day comfort and styled for everyday Indian wardrobes — light, breathable and easy to care for.`,
    fabric: seed.fabric,
    pattern: seed.pattern,
    seller: SELLERS[i % SELLERS.length],
    delivery: "Free delivery in 3-5 days",
    inStock: i % 17 !== 5,
    createdDaysAgo: (i * 3) % 60,
    popularity: seed.reviewCount + seed.rating * 500,
  };
});

async function runMigration() {
  console.log(`Original PRODUCTS.length: ${PRODUCTS.length}`);

  // Check if public.products table exists
  const { data: existingData, error: tableErr } = await supabase.from('products').select('*');

  if (tableErr) {
    console.log(`[MIGRATION_STATUS]: TABLE NOT FOUND OR ERROR (${tableErr.message})`);
    console.log("Please make sure public.products table exists in your Supabase project.");
    return;
  }

  console.log("public.products table verified in Supabase!");

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

  const { data: upsertData, error: upsertErr } = await supabase
    .from('products')
    .upsert(payload, { onConflict: 'id' })
    .select('id, name, price, category, sizes, colors, in_stock');

  if (upsertErr) {
    console.error("UPSERT ERROR:", upsertErr.message);
    return;
  }

  console.log(`Successfully migrated ${upsertData ? upsertData.length : 0} items!`);

  // Verify Count
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log(`Supabase product count (SELECT COUNT(*)): ${count}`);

  if (upsertData && upsertData.length > 0) {
    console.log("Sample Migrated Records:");
    console.log(JSON.stringify(upsertData.slice(0, 3), null, 2));
  }
}

runMigration();
