import saree from "@/assets/p-saree.jpg";
import kurti from "@/assets/p-kurti.jpg";
import dress from "@/assets/p-dress.jpg";
import jeans from "@/assets/p-jeans.jpg";
import lehenga from "@/assets/p-lehenga.jpg";
import jewellery from "@/assets/p-jewellery.jpg";
import footwear from "@/assets/p-footwear.jpg";
import handbag from "@/assets/p-handbag.jpg";
import beauty from "@/assets/p-beauty.jpg";
import kids from "@/assets/p-kids.jpg";
import top from "@/assets/p-top.jpg";
import kurta from "@/assets/p-kurta.jpg";
import coord from "@/assets/p-coord.jpg";

export type Product = {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  group: "women" | "men" | "kids";
  tags: string[];
  images: string[];
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  sizes: string[];
  colors: string[];
  description: string;
  fabric: string;
  pattern: string;
  seller: string;
  delivery: string;
  inStock: boolean;
  createdDaysAgo: number;
  popularity: number;
};

export const CATEGORY_IMAGES: Record<string, string> = {
  sarees: saree,
  kurtis: kurti,
  kurtas: kurta,
  dresses: dress,
  tops: top,
  jeans: jeans,
  lehengas: lehenga,
  jewellery: jewellery,
  footwear: footwear,
  handbags: handbag,
  beauty: beauty,
  kids: kids,
};

export const CATEGORIES = [
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

export const NAV_LINKS = [
  { slug: "women", label: "Women" },
  { slug: "men", label: "Men" },
  { slug: "kids", label: "Kids" },
  { slug: "ethnic-wear", label: "Ethnic Wear" },
  { slug: "western-wear", label: "Western Wear" },
  { slug: "footwear", label: "Footwear" },
  { slug: "jewellery", label: "Jewellery" },
  { slug: "beauty", label: "Beauty" },
  { slug: "handbags", label: "Bags" },
  { slug: "accessories", label: "Accessories" },
  { slug: "new-arrivals", label: "New Arrivals" },
  { slug: "deals", label: "Deals" },
];

const SELLERS = [
  "Anaya Textiles, Surat",
  "Rangrez Studio, Jaipur",
  "Nirmal Fashions, Tirupur",
  "Kalaa House, Ahmedabad",
  "Veda Crafts, Bengaluru",
];

type Seed = {
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  fabric: string;
  pattern: string;
  colors: string[];
  group?: "women" | "men" | "kids";
  tags?: string[];
};

const APPAREL = ["XS", "S", "M", "L", "XL", "XXL"];
const FREE = ["Free Size"];
const SHOE = ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"];

const seeds: Seed[] = [
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

const sizesFor = (category: string) => {
  if (category === "footwear") return SHOE;
  if (["jewellery", "handbags", "beauty"].includes(category)) return FREE;
  if (category === "kids") return ["2-3Y", "4-5Y", "6-7Y", "8-9Y"];
  return APPAREL;
};

const imageFor = (seed: Seed) => {
  if (seed.name.includes("Co-ord")) return coord;
  return CATEGORY_IMAGES[seed.category] ?? kurti;
};

export const PRODUCTS: Product[] = seeds.map((seed, i) => {
  const image = imageFor(seed);
  const label =
    CATEGORIES.find((c) => c.slug === seed.category)?.label ?? seed.category;
  return {
    id: `min-${String(i + 1).padStart(3, "0")}`,
    name: seed.name,
    category: seed.category,
    categoryLabel: label,
    group: seed.group ?? "women",
    tags: seed.tags ?? [],
    images: [image, CATEGORY_IMAGES[seed.category], coord, image].filter(
      Boolean,
    ) as string[],
    price: seed.price,
    originalPrice: seed.originalPrice,
    discount: Math.round(
      ((seed.originalPrice - seed.price) / seed.originalPrice) * 100,
    ),
    rating: seed.rating,
    reviewCount: seed.reviewCount,
    sizes: sizesFor(seed.category),
    colors: seed.colors,
    description: `${seed.name} crafted in ${seed.fabric.toLowerCase()} with a ${seed.pattern.toLowerCase()} finish. Designed for all-day comfort and styled for everyday Indian wardrobes — light, breathable and easy to care for.`,
    fabric: seed.fabric,
    pattern: seed.pattern,
    seller: SELLERS[i % SELLERS.length]!,
    delivery: "Free delivery in 3-5 days",
    inStock: i % 17 !== 5,
    createdDaysAgo: (i * 3) % 60,
    popularity: seed.reviewCount + seed.rating * 500,
  };
});

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

const GROUPS = ["women", "men", "kids"];

export function resolveCollection(slug: string) {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (cat && slug !== "kids")
    return {
      title: cat.label,
      items: PRODUCTS.filter((p) => p.category === slug),
    };
  if (GROUPS.includes(slug))
    return {
      title: slug.charAt(0).toUpperCase() + slug.slice(1),
      items: PRODUCTS.filter((p) => p.group === slug || p.category === slug),
    };
  if (slug === "new-arrivals")
    return {
      title: "New Arrivals",
      items: [...PRODUCTS].sort((a, b) => a.createdDaysAgo - b.createdDaysAgo),
    };
  if (slug === "deals")
    return {
      title: "Deals",
      items: [...PRODUCTS].sort((a, b) => b.discount - a.discount),
    };
  if (slug === "trending")
    return {
      title: "Trending on MINORA",
      items: PRODUCTS.filter((p) => p.tags.includes("trending")),
    };
  return {
    title: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    items: PRODUCTS.filter((p) => p.tags.includes(slug)),
  };
}

export const searchProducts = (q: string) => {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.categoryLabel.toLowerCase().includes(term) ||
      p.fabric.toLowerCase().includes(term) ||
      p.tags.some((t) => t.includes(term)),
  );
};

export const POPULAR_SEARCHES = [
  "Sarees",
  "Kurtis",
  "Dresses",
  "Jewellery",
  "Tops",
  "Lehengas",
];
