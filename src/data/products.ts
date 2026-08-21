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
  sourceUrl?: string | undefined;
};

export const CATEGORY_IMAGES: Record<string, string> = {
  sarees: "/IMAGES/SAREE_HD_1600x2200.jpg",
  kurtis: "/IMAGES/KURTI_HD_1600x2200.jpg",
  kurtas: "/IMAGES/KURTA_HD_1600x2200.jpg",
  dresses: "/IMAGES/DRESSES_HD.jpg",
  tops: "/IMAGES/TOPS_HD.jpg",
  jeans: jeans,
  lehengas: "/IMAGES/LEHENGAS_HD.jpg",
  jewellery: "https://www.sarafrsjewellery.com/cdn/shop/files/SJNK1752.jpg?v=1751007509",
  footwear: footwear,
  handbags: handbag,
  beauty: "/IMAGES/BEAUTY_HD.jpg",
  kids: "/IMAGES/KIDS_HD.jpg",
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
  sourceUrl?: string;
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
  { name: "Designer Lehenga", category: "lehengas", price: 4499, originalPrice: 10999, rating: 4.6, reviewCount: 421, fabric: "Velvet", pattern: "Zari Work", colors: ["Maroon"], tags: ["ethnic-wear", "festive"] },
  { name: "Pink Casual Lehenga Choli", category: "lehengas", price: 2499, originalPrice: 5999, rating: 4.3, reviewCount: 733, fabric: "Georgette", pattern: "Sequin", colors: ["Wine", "Teal"], tags: ["ethnic-wear", "festive"] },
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
  { name: "Luxury Georgette Saree", category: "sarees", price: 1957, originalPrice: 3660, rating: 4.2, reviewCount: 1620, fabric: "Silk", pattern: "Solid", colors: ["Pink"], tags: ["ethnic-wear", "festive"] },
  { name: "Elegant Saree", category: "sarees", price: 1990, originalPrice: 3439, rating: 4.4, reviewCount: 1071, fabric: "Polyester", pattern: "Solid", colors: ["Silver"], tags: ["ethnic-wear", "festive"] },
  { name: "Chic Silk Saree", category: "sarees", price: 1001, originalPrice: 2726, rating: 4.7, reviewCount: 4452, fabric: "Silk", pattern: "Solid", colors: ["Green"], tags: ["ethnic-wear", "festive"] },
  { name: "Modern Georgette Saree", category: "sarees", price: 1266, originalPrice: 3148, rating: 4.0, reviewCount: 273, fabric: "Denim", pattern: "Solid", colors: ["Blue"], tags: ["ethnic-wear", "festive"] },
  { name: "Vibrant Kanjivaram Saree", category: "sarees", price: 2039, originalPrice: 3870, rating: 4.8, reviewCount: 2799, fabric: "Polyester", pattern: "Solid", colors: ["Green"], tags: ["ethnic-wear", "festive"] },
  { name: "Vibrant Silk Saree", category: "sarees", price: 1199, originalPrice: 2252, rating: 4.2, reviewCount: 3012, fabric: "Georgette", pattern: "Solid", colors: ["Red"], tags: ["ethnic-wear", "festive"] },
  { name: "Designer Saree", category: "sarees", price: 532, originalPrice: 2419, rating: 4.3, reviewCount: 3196, fabric: "Rayon", pattern: "Solid", colors: ["Orange"], tags: ["ethnic-wear", "festive"] },
  { name: "Luxury Silk Saree", category: "sarees", price: 2144, originalPrice: 2668, rating: 4.9, reviewCount: 1356, fabric: "Velvet", pattern: "Solid", colors: ["Red"], tags: ["ethnic-wear", "festive"] },
  { name: "Trendy Banarasi Saree", category: "sarees", price: 1660, originalPrice: 2890, rating: 4.6, reviewCount: 1663, fabric: "Georgette", pattern: "Solid", colors: ["Maroon"], tags: ["ethnic-wear", "festive"] },
  { name: "Classic Georgette Saree", category: "sarees", price: 1118, originalPrice: 3063, rating: 4.6, reviewCount: 4436, fabric: "Georgette", pattern: "Solid", colors: ["Green"], tags: ["ethnic-wear", "festive"] },
  { name: "Minimalist Silk Saree", category: "sarees", price: 1108, originalPrice: 1884, rating: 4.0, reviewCount: 2594, fabric: "Velvet", pattern: "Solid", colors: ["Pink"], tags: ["ethnic-wear", "festive"] },
  { name: "Festive Silk Saree", category: "sarees", price: 1082, originalPrice: 2991, rating: 4.8, reviewCount: 854, fabric: "Silk", pattern: "Solid", colors: ["Blue"], tags: ["ethnic-wear", "festive"] },
  { name: "Minimalist Georgette Saree", category: "sarees", price: 1639, originalPrice: 3522, rating: 4.5, reviewCount: 1542, fabric: "Georgette", pattern: "Solid", colors: ["Pink"], tags: ["ethnic-wear", "festive"] },
  { name: "Casual Banarasi Saree", category: "sarees", price: 1689, originalPrice: 3386, rating: 4.8, reviewCount: 810, fabric: "Rayon", pattern: "Solid", colors: ["Pink"], tags: ["ethnic-wear", "festive"] },
  { name: "Classic Silk Saree", category: "sarees", price: 788, originalPrice: 1986, rating: 4.0, reviewCount: 1819, fabric: "Silk", pattern: "Solid", colors: ["Pink"], tags: ["ethnic-wear", "festive"] },
  { name: "Chic Saree", category: "sarees", price: 1522, originalPrice: 2469, rating: 4.9, reviewCount: 2049, fabric: "Cotton", pattern: "Solid", colors: ["Black"], tags: ["ethnic-wear", "festive"] },
  { name: "Designer Saree", category: "sarees", price: 2091, originalPrice: 3057, rating: 4.1, reviewCount: 3820, fabric: "Rayon", pattern: "Solid", colors: ["Purple"], tags: ["ethnic-wear", "festive"] },
  { name: "Premium Cotton Saree", category: "sarees", price: 2275, originalPrice: 3500, rating: 4.9, reviewCount: 4182, fabric: "Rayon", pattern: "Solid", colors: ["Gold"], tags: ["ethnic-wear", "festive"] },
  { name: "Festive Silk Saree", category: "sarees", price: 479, originalPrice: 1590, rating: 4.7, reviewCount: 2492, fabric: "Polyester", pattern: "Solid", colors: ["Green"], tags: ["ethnic-wear", "festive"] },
  { name: "Elegant Silk Saree", category: "sarees", price: 1784, originalPrice: 3059, rating: 4.8, reviewCount: 2637, fabric: "Silk", pattern: "Solid", colors: ["Maroon"], tags: ["ethnic-wear", "festive"] },
  { name: "Trendy Kanjivaram Saree", category: "sarees", price: 1326, originalPrice: 2046, rating: 4.4, reviewCount: 775, fabric: "Chiffon", pattern: "Solid", colors: ["Silver"], tags: ["ethnic-wear", "festive"] },
  { name: "Vibrant Cotton Saree", category: "sarees", price: 848, originalPrice: 2521, rating: 4.9, reviewCount: 2696, fabric: "Denim", pattern: "Solid", colors: ["Orange"], tags: ["ethnic-wear", "festive"] },
  { name: "Premium Georgette Saree", category: "sarees", price: 1995, originalPrice: 3430, rating: 4.6, reviewCount: 2705, fabric: "Chiffon", pattern: "Solid", colors: ["Teal"], tags: ["ethnic-wear", "festive"] },
  { name: "Designer Silk Saree", category: "sarees", price: 1684, originalPrice: 3094, rating: 4.3, reviewCount: 3128, fabric: "Chiffon", pattern: "Solid", colors: ["Maroon"], tags: ["ethnic-wear", "festive"] },
  { name: "Luxury Silk Saree", category: "sarees", price: 1786, originalPrice: 3581, rating: 4.6, reviewCount: 4020, fabric: "Rayon", pattern: "Solid", colors: ["Maroon"], tags: ["ethnic-wear", "festive"] },
  { name: "Luxury Cotton Saree", category: "sarees", price: 1439, originalPrice: 2021, rating: 4.6, reviewCount: 1951, fabric: "Cotton", pattern: "Solid", colors: ["Red"], tags: ["ethnic-wear", "festive"] },
  { name: "Minimalist Saree", category: "sarees", price: 1499, originalPrice: 2298, rating: 4.3, reviewCount: 2941, fabric: "Denim", pattern: "Solid", colors: ["Gold"], tags: ["ethnic-wear", "festive"] },
  { name: "Chic Banarasi Saree", category: "sarees", price: 901, originalPrice: 2820, rating: 4.8, reviewCount: 4282, fabric: "Velvet", pattern: "Solid", colors: ["Teal"], tags: ["ethnic-wear", "festive"] },
  { name: "Elegant Silk Saree", category: "sarees", price: 1831, originalPrice: 3308, rating: 4.1, reviewCount: 2075, fabric: "Velvet", pattern: "Solid", colors: ["Orange"], tags: ["ethnic-wear", "festive"] },
  { name: "Elegant Banarasi Saree", category: "sarees", price: 1522, originalPrice: 2732, rating: 4.9, reviewCount: 3872, fabric: "Silk", pattern: "Solid", colors: ["Red"], tags: ["ethnic-wear", "festive"] },
  { name: "Elegant Georgette Saree", category: "sarees", price: 846, originalPrice: 1645, rating: 4.8, reviewCount: 1762, fabric: "Velvet", pattern: "Solid", colors: ["Green"], tags: ["ethnic-wear", "festive"] },
  { name: "Casual Cotton Saree", category: "sarees", price: 512, originalPrice: 1710, rating: 4.2, reviewCount: 2274, fabric: "Chiffon", pattern: "Solid", colors: ["Orange"], tags: ["ethnic-wear", "festive"] },
  { name: "Casual Saree", category: "sarees", price: 2105, originalPrice: 2634, rating: 4.2, reviewCount: 867, fabric: "Chiffon", pattern: "Solid", colors: ["Pink"], tags: ["ethnic-wear", "festive"] },
  { name: "Designer Georgette Saree", category: "sarees", price: 1709, originalPrice: 2901, rating: 4.9, reviewCount: 3587, fabric: "Polyester", pattern: "Solid", colors: ["White"], tags: ["ethnic-wear", "festive"] },
  { name: "Vibrant Banarasi Saree", category: "sarees", price: 1371, originalPrice: 3305, rating: 4.5, reviewCount: 1896, fabric: "Linen", pattern: "Solid", colors: ["Green"], tags: ["ethnic-wear", "festive"] },
  { name: "Minimalist Banarasi Saree", category: "sarees", price: 376, originalPrice: 1547, rating: 4.7, reviewCount: 1189, fabric: "Georgette", pattern: "Solid", colors: ["Orange"], tags: ["ethnic-wear", "festive"] },
  { name: "Luxury Silk Saree", category: "sarees", price: 1498, originalPrice: 2403, rating: 4.3, reviewCount: 4328, fabric: "Cotton", pattern: "Solid", colors: ["Green"], tags: ["ethnic-wear", "festive"] },
  { name: "Casual Silk Saree", category: "sarees", price: 1478, originalPrice: 2942, rating: 4.6, reviewCount: 3220, fabric: "Cotton", pattern: "Solid", colors: ["Maroon"], tags: ["ethnic-wear", "festive"] },
  { name: "Vibrant Cotton Saree", category: "sarees", price: 1520, originalPrice: 3259, rating: 4.9, reviewCount: 825, fabric: "Polyester", pattern: "Solid", colors: ["Black"], tags: ["ethnic-wear", "festive"] },
  { name: "Casual Anarkali Kurti", category: "kurtis", price: 1305, originalPrice: 2314, rating: 4.5, reviewCount: 1050, fabric: "Velvet", pattern: "Solid", colors: ["Green"], tags: ["ethnic-wear", "trending"] },
  { name: "Chic Kurti", category: "kurtis", price: 1940, originalPrice: 2486, rating: 4.2, reviewCount: 3567, fabric: "Cotton", pattern: "Solid", colors: ["White"], tags: ["ethnic-wear", "trending"] },
  { name: "Casual Kurti", category: "kurtis", price: 363, originalPrice: 1637, rating: 4.8, reviewCount: 1138, fabric: "Linen", pattern: "Solid", colors: ["Black"], tags: ["ethnic-wear", "trending"] },
  { name: "Casual A-Line Kurti", category: "kurtis", price: 1124, originalPrice: 3032, rating: 4.1, reviewCount: 1419, fabric: "Denim", pattern: "Solid", colors: ["Teal"], tags: ["ethnic-wear", "trending"] },
  { name: "Chic Straight Kurti", category: "kurtis", price: 1378, originalPrice: 2683, rating: 4.1, reviewCount: 260, fabric: "Velvet", pattern: "Solid", colors: ["Black"], tags: ["ethnic-wear", "trending"] },
  { name: "Premium Straight Kurti", category: "kurtis", price: 1782, originalPrice: 2777, rating: 4.3, reviewCount: 2763, fabric: "Chiffon", pattern: "Solid", colors: ["Pink"], tags: ["ethnic-wear", "trending"] },
  { name: "Minimalist Chikankari Kurti", category: "kurtis", price: 1861, originalPrice: 2466, rating: 4.4, reviewCount: 1183, fabric: "Linen", pattern: "Solid", colors: ["Black"], tags: ["ethnic-wear", "trending"] },
  { name: "Chic Chikankari Kurti", category: "kurtis", price: 672, originalPrice: 1260, rating: 4.8, reviewCount: 4066, fabric: "Linen", pattern: "Solid", colors: ["Gold"], tags: ["ethnic-wear", "trending"] },
  { name: "Elegant A-Line Kurti", category: "kurtis", price: 614, originalPrice: 2323, rating: 4.1, reviewCount: 4506, fabric: "Cotton", pattern: "Solid", colors: ["Maroon"], tags: ["ethnic-wear", "trending"] },
  { name: "Minimalist Anarkali Kurti", category: "kurtis", price: 560, originalPrice: 2121, rating: 5.0, reviewCount: 3932, fabric: "Denim", pattern: "Solid", colors: ["Blue"], tags: ["ethnic-wear", "trending"] },
  { name: "Chic A-Line Kurti", category: "kurtis", price: 1960, originalPrice: 3789, rating: 4.6, reviewCount: 1549, fabric: "Georgette", pattern: "Solid", colors: ["Pink"], tags: ["ethnic-wear", "trending"] },
  { name: "Vibrant A-Line Kurti", category: "kurtis", price: 1988, originalPrice: 2985, rating: 4.9, reviewCount: 98, fabric: "Chiffon", pattern: "Solid", colors: ["White"], tags: ["ethnic-wear", "trending"] },
  { name: "Trendy Straight Kurti", category: "kurtis", price: 601, originalPrice: 1453, rating: 4.4, reviewCount: 3633, fabric: "Cotton", pattern: "Solid", colors: ["Black"], tags: ["ethnic-wear", "trending"] },
  { name: "Classic A-Line Kurti", category: "kurtis", price: 758, originalPrice: 2349, rating: 4.3, reviewCount: 1247, fabric: "Chiffon", pattern: "Solid", colors: ["Red"], tags: ["ethnic-wear", "trending"] },
  { name: "Designer Chikankari Kurti", category: "kurtis", price: 472, originalPrice: 2112, rating: 4.3, reviewCount: 4476, fabric: "Rayon", pattern: "Solid", colors: ["Green"], tags: ["ethnic-wear", "trending"] },
  { name: "Elegant Straight Kurti", category: "kurtis", price: 1178, originalPrice: 2254, rating: 4.6, reviewCount: 1214, fabric: "Linen", pattern: "Solid", colors: ["Blue"], tags: ["ethnic-wear", "trending"] },
  { name: "Festive Straight Kurti", category: "kurtis", price: 1187, originalPrice: 2852, rating: 4.3, reviewCount: 2682, fabric: "Denim", pattern: "Solid", colors: ["Maroon"], tags: ["ethnic-wear", "trending"] },
  { name: "Minimalist Straight Kurti", category: "kurtis", price: 1734, originalPrice: 2393, rating: 4.4, reviewCount: 2269, fabric: "Chiffon", pattern: "Solid", colors: ["Maroon"], tags: ["ethnic-wear", "trending"] },
  { name: "Luxury A-Line Kurti", category: "kurtis", price: 1174, originalPrice: 3168, rating: 4.7, reviewCount: 661, fabric: "Chiffon", pattern: "Solid", colors: ["Gold"], tags: ["ethnic-wear", "trending"] },
  { name: "Elegant Anarkali Kurti", category: "kurtis", price: 1467, originalPrice: 2434, rating: 4.7, reviewCount: 4829, fabric: "Polyester", pattern: "Solid", colors: ["Orange"], tags: ["ethnic-wear", "trending"] },
  { name: "Trendy Anarkali Kurti", category: "kurtis", price: 2074, originalPrice: 3245, rating: 4.4, reviewCount: 3659, fabric: "Silk", pattern: "Solid", colors: ["Gold"], tags: ["ethnic-wear", "trending"] },
  { name: "Premium Kurti", category: "kurtis", price: 890, originalPrice: 2669, rating: 4.8, reviewCount: 1122, fabric: "Rayon", pattern: "Solid", colors: ["Orange"], tags: ["ethnic-wear", "trending"] },
  { name: "Designer Straight Kurti", category: "kurtis", price: 389, originalPrice: 901, rating: 4.8, reviewCount: 1548, fabric: "Denim", pattern: "Solid", colors: ["Teal"], tags: ["ethnic-wear", "trending"] },
  { name: "Vibrant Chikankari Kurti", category: "kurtis", price: 780, originalPrice: 1377, rating: 4.7, reviewCount: 4122, fabric: "Georgette", pattern: "Solid", colors: ["Teal"], tags: ["ethnic-wear", "trending"] },
  { name: "Elegant Kurti", category: "kurtis", price: 757, originalPrice: 1828, rating: 4.6, reviewCount: 1401, fabric: "Silk", pattern: "Solid", colors: ["Silver"], tags: ["ethnic-wear", "trending"] },
  { name: "Minimalist Kurti", category: "kurtis", price: 619, originalPrice: 2251, rating: 4.7, reviewCount: 358, fabric: "Rayon", pattern: "Solid", colors: ["Black"], tags: ["ethnic-wear", "trending"] },
  { name: "Modern Straight Kurti", category: "kurtis", price: 1016, originalPrice: 1958, rating: 4.7, reviewCount: 315, fabric: "Rayon", pattern: "Solid", colors: ["Black"], tags: ["ethnic-wear", "trending"] },
  { name: "Trendy A-Line Kurti", category: "kurtis", price: 1868, originalPrice: 3120, rating: 4.3, reviewCount: 4450, fabric: "Cotton", pattern: "Solid", colors: ["Purple"], tags: ["ethnic-wear", "trending"] },
  { name: "Chic Anarkali Kurti", category: "kurtis", price: 1083, originalPrice: 2698, rating: 4.2, reviewCount: 856, fabric: "Cotton", pattern: "Solid", colors: ["Teal"], tags: ["ethnic-wear", "trending"] },
  { name: "Luxury Anarkali Kurti", category: "kurtis", price: 645, originalPrice: 1152, rating: 4.3, reviewCount: 1646, fabric: "Denim", pattern: "Solid", colors: ["Maroon"], tags: ["ethnic-wear", "trending"] },
  { name: "Trendy Chikankari Kurti", category: "kurtis", price: 730, originalPrice: 1917, rating: 4.2, reviewCount: 4995, fabric: "Linen", pattern: "Solid", colors: ["Teal"], tags: ["ethnic-wear", "trending"] },
  { name: "Designer Kurta Pyjama", category: "kurtas", price: 1701, originalPrice: 3422, rating: 4.2, reviewCount: 1537, fabric: "Denim", pattern: "Solid", colors: ["Blue"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Minimalist Kurta", category: "kurtas", price: 977, originalPrice: 2480, rating: 4.4, reviewCount: 4697, fabric: "Linen", pattern: "Solid", colors: ["Blue"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Designer Festive Kurta Set", category: "kurtas", price: 2246, originalPrice: 3659, rating: 4.4, reviewCount: 1056, fabric: "Polyester", pattern: "Solid", colors: ["White"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Festive Kurta Pyjama", category: "kurtas", price: 349, originalPrice: 1701, rating: 4.1, reviewCount: 3284, fabric: "Chiffon", pattern: "Solid", colors: ["Orange"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Luxury Kurta Pyjama", category: "kurtas", price: 2089, originalPrice: 3531, rating: 4.9, reviewCount: 260, fabric: "Cotton", pattern: "Solid", colors: ["Maroon"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Festive Cotton Kurta", category: "kurtas", price: 2267, originalPrice: 3758, rating: 4.6, reviewCount: 4054, fabric: "Rayon", pattern: "Solid", colors: ["Silver"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Modern Kurta Pyjama", category: "kurtas", price: 1188, originalPrice: 2225, rating: 4.2, reviewCount: 2938, fabric: "Polyester", pattern: "Solid", colors: ["Yellow"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Vibrant Kurta", category: "kurtas", price: 817, originalPrice: 2291, rating: 5.0, reviewCount: 2400, fabric: "Silk", pattern: "Solid", colors: ["White"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Premium Festive Kurta Set", category: "kurtas", price: 1653, originalPrice: 3007, rating: 4.8, reviewCount: 1359, fabric: "Chiffon", pattern: "Solid", colors: ["Teal"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Minimalist Cotton Kurta", category: "kurtas", price: 1765, originalPrice: 3180, rating: 4.3, reviewCount: 46, fabric: "Cotton", pattern: "Solid", colors: ["Red"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Minimalist Festive Kurta Set", category: "kurtas", price: 1800, originalPrice: 3096, rating: 4.2, reviewCount: 4017, fabric: "Cotton", pattern: "Solid", colors: ["Green"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Trendy Kurta", category: "kurtas", price: 773, originalPrice: 1485, rating: 4.1, reviewCount: 1963, fabric: "Cotton", pattern: "Solid", colors: ["Green"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Premium Cotton Kurta", category: "kurtas", price: 994, originalPrice: 2833, rating: 4.6, reviewCount: 2262, fabric: "Rayon", pattern: "Solid", colors: ["White"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Trendy Kurta Pyjama", category: "kurtas", price: 2056, originalPrice: 3771, rating: 4.1, reviewCount: 775, fabric: "Chiffon", pattern: "Solid", colors: ["Purple"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Casual Festive Kurta Set", category: "kurtas", price: 1778, originalPrice: 2886, rating: 4.6, reviewCount: 623, fabric: "Velvet", pattern: "Solid", colors: ["Gold"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Elegant Kurta", category: "kurtas", price: 1271, originalPrice: 2647, rating: 4.5, reviewCount: 3199, fabric: "Cotton", pattern: "Solid", colors: ["Black"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Chic Cotton Kurta", category: "kurtas", price: 1298, originalPrice: 3069, rating: 4.4, reviewCount: 2164, fabric: "Polyester", pattern: "Solid", colors: ["Yellow"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Designer Cotton Kurta", category: "kurtas", price: 1096, originalPrice: 2004, rating: 5.0, reviewCount: 595, fabric: "Cotton", pattern: "Solid", colors: ["Black"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Vibrant Kurta Pyjama", category: "kurtas", price: 2201, originalPrice: 3796, rating: 4.6, reviewCount: 3940, fabric: "Rayon", pattern: "Solid", colors: ["Black"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Trendy Nehru Jacket Set", category: "kurtas", price: 600, originalPrice: 2150, rating: 5.0, reviewCount: 143, fabric: "Linen", pattern: "Solid", colors: ["White"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Designer Kurta", category: "kurtas", price: 1885, originalPrice: 2614, rating: 4.9, reviewCount: 4960, fabric: "Linen", pattern: "Solid", colors: ["Teal"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Modern Nehru Jacket Set", category: "kurtas", price: 1378, originalPrice: 2120, rating: 4.7, reviewCount: 1031, fabric: "Polyester", pattern: "Solid", colors: ["Green"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Chic Kurta Pyjama", category: "kurtas", price: 1357, originalPrice: 3313, rating: 4.9, reviewCount: 299, fabric: "Rayon", pattern: "Solid", colors: ["Yellow"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Premium Kurta Pyjama", category: "kurtas", price: 1908, originalPrice: 3797, rating: 5.0, reviewCount: 3279, fabric: "Chiffon", pattern: "Solid", colors: ["Black"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Casual Cotton Kurta", category: "kurtas", price: 1876, originalPrice: 2596, rating: 4.4, reviewCount: 2427, fabric: "Silk", pattern: "Solid", colors: ["White"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Modern Kurta", category: "kurtas", price: 1311, originalPrice: 2363, rating: 4.9, reviewCount: 3528, fabric: "Georgette", pattern: "Solid", colors: ["Gold"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Chic Festive Kurta Set", category: "kurtas", price: 947, originalPrice: 2893, rating: 4.0, reviewCount: 835, fabric: "Linen", pattern: "Solid", colors: ["White"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Trendy Cotton Kurta", category: "kurtas", price: 923, originalPrice: 2486, rating: 4.5, reviewCount: 4728, fabric: "Velvet", pattern: "Solid", colors: ["Red"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Classic Kurta Pyjama", category: "kurtas", price: 1246, originalPrice: 3084, rating: 4.7, reviewCount: 982, fabric: "Georgette", pattern: "Solid", colors: ["Purple"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Classic Kurta", category: "kurtas", price: 1810, originalPrice: 2518, rating: 4.3, reviewCount: 2041, fabric: "Rayon", pattern: "Solid", colors: ["Orange"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Modern Cotton Kurta", category: "kurtas", price: 339, originalPrice: 1724, rating: 4.4, reviewCount: 1110, fabric: "Velvet", pattern: "Solid", colors: ["Pink"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Trendy Festive Kurta Set", category: "kurtas", price: 1302, originalPrice: 2097, rating: 4.2, reviewCount: 3970, fabric: "Denim", pattern: "Solid", colors: ["Gold"], group: "men", tags: ["ethnic-wear", "festive"] },
  { name: "Luxury Maxi Dress", category: "dresses", price: 1671, originalPrice: 2888, rating: 4.3, reviewCount: 4172, fabric: "Georgette", pattern: "Solid", colors: ["Purple"], tags: ["western-wear", "trending"] },
  { name: "Trendy Wrap Dress", category: "dresses", price: 1086, originalPrice: 3051, rating: 4.3, reviewCount: 710, fabric: "Silk", pattern: "Solid", colors: ["Blue"], tags: ["western-wear", "trending"] },
  { name: "Trendy Summer Dress", category: "dresses", price: 1773, originalPrice: 2410, rating: 4.3, reviewCount: 2303, fabric: "Polyester", pattern: "Solid", colors: ["Silver"], tags: ["western-wear", "trending"] },
  { name: "Casual Midi Dress", category: "dresses", price: 1819, originalPrice: 3410, rating: 4.7, reviewCount: 1450, fabric: "Chiffon", pattern: "Solid", colors: ["Teal"], tags: ["western-wear", "trending"] },
  { name: "Premium Floral Dress", category: "dresses", price: 1376, originalPrice: 1901, rating: 4.1, reviewCount: 4260, fabric: "Silk", pattern: "Solid", colors: ["White"], tags: ["western-wear", "trending"] },
  { name: "Designer Wrap Dress", category: "dresses", price: 2241, originalPrice: 3492, rating: 4.6, reviewCount: 2785, fabric: "Georgette", pattern: "Solid", colors: ["Orange"], tags: ["western-wear", "trending"] },
  { name: "Casual Party Dress", category: "dresses", price: 1414, originalPrice: 2697, rating: 4.3, reviewCount: 4415, fabric: "Rayon", pattern: "Solid", colors: ["Orange"], tags: ["western-wear", "trending"] },
  { name: "Elegant Wrap Dress", category: "dresses", price: 1978, originalPrice: 3921, rating: 4.2, reviewCount: 4040, fabric: "Cotton", pattern: "Solid", colors: ["Black"], tags: ["western-wear", "trending"] },
  { name: "Chic Wrap Dress", category: "dresses", price: 1607, originalPrice: 3603, rating: 4.6, reviewCount: 1411, fabric: "Cotton", pattern: "Solid", colors: ["Yellow"], tags: ["western-wear", "trending"] },
  { name: "Vibrant Summer Dress", category: "dresses", price: 1266, originalPrice: 2023, rating: 4.5, reviewCount: 4487, fabric: "Denim", pattern: "Solid", colors: ["Red"], tags: ["western-wear", "trending"] },
  { name: "Festive Maxi Dress", category: "dresses", price: 1416, originalPrice: 3108, rating: 4.6, reviewCount: 195, fabric: "Rayon", pattern: "Solid", colors: ["Green"], tags: ["western-wear", "trending"] },
  { name: "Modern Midi Dress", category: "dresses", price: 1581, originalPrice: 2897, rating: 4.2, reviewCount: 498, fabric: "Silk", pattern: "Solid", colors: ["Maroon"], tags: ["western-wear", "trending"] },
  { name: "Minimalist Maxi Dress", category: "dresses", price: 1677, originalPrice: 2638, rating: 4.2, reviewCount: 3610, fabric: "Linen", pattern: "Solid", colors: ["White"], tags: ["western-wear", "trending"] },
  { name: "Classic Maxi Dress", category: "dresses", price: 1728, originalPrice: 2852, rating: 5.0, reviewCount: 183, fabric: "Polyester", pattern: "Solid", colors: ["Orange"], tags: ["western-wear", "trending"] },
  { name: "Classic Midi Dress", category: "dresses", price: 648, originalPrice: 1321, rating: 4.6, reviewCount: 2035, fabric: "Cotton", pattern: "Solid", colors: ["Red"], tags: ["western-wear", "trending"] },
  { name: "Luxury Floral Dress", category: "dresses", price: 1058, originalPrice: 2105, rating: 4.0, reviewCount: 3154, fabric: "Velvet", pattern: "Solid", colors: ["Gold"], tags: ["western-wear", "trending"] },
  { name: "Luxury Wrap Dress", category: "dresses", price: 1605, originalPrice: 3358, rating: 4.2, reviewCount: 4037, fabric: "Silk", pattern: "Solid", colors: ["Orange"], tags: ["western-wear", "trending"] },
  { name: "Classic Summer Dress", category: "dresses", price: 630, originalPrice: 2507, rating: 4.7, reviewCount: 2126, fabric: "Chiffon", pattern: "Solid", colors: ["Gold"], tags: ["western-wear", "trending"] },
  { name: "Elegant Floral Dress", category: "dresses", price: 1583, originalPrice: 2113, rating: 4.8, reviewCount: 3274, fabric: "Chiffon", pattern: "Solid", colors: ["Purple"], tags: ["western-wear", "trending"] },
  { name: "Premium Midi Dress", category: "dresses", price: 1659, originalPrice: 3199, rating: 4.8, reviewCount: 2726, fabric: "Silk", pattern: "Solid", colors: ["Silver"], tags: ["western-wear", "trending"] },
  { name: "Vibrant Wrap Dress", category: "dresses", price: 2006, originalPrice: 2606, rating: 4.5, reviewCount: 3725, fabric: "Cotton", pattern: "Solid", colors: ["Gold"], tags: ["western-wear", "trending"] },
  { name: "Vibrant Floral Dress", category: "dresses", price: 1392, originalPrice: 2251, rating: 4.4, reviewCount: 1796, fabric: "Velvet", pattern: "Solid", colors: ["Blue"], tags: ["western-wear", "trending"] },
  { name: "Elegant Midi Dress", category: "dresses", price: 407, originalPrice: 1262, rating: 4.5, reviewCount: 2751, fabric: "Polyester", pattern: "Solid", colors: ["White"], tags: ["western-wear", "trending"] },
  { name: "Premium Maxi Dress", category: "dresses", price: 1546, originalPrice: 2639, rating: 4.4, reviewCount: 3331, fabric: "Denim", pattern: "Solid", colors: ["Orange"], tags: ["western-wear", "trending"] },
  { name: "Minimalist Wrap Dress", category: "dresses", price: 529, originalPrice: 1701, rating: 4.2, reviewCount: 285, fabric: "Velvet", pattern: "Solid", colors: ["Gold"], tags: ["western-wear", "trending"] },
  { name: "Designer Floral Dress", category: "dresses", price: 889, originalPrice: 2793, rating: 4.4, reviewCount: 1357, fabric: "Silk", pattern: "Solid", colors: ["Pink"], tags: ["western-wear", "trending"] },
  { name: "Modern Floral Dress", category: "dresses", price: 787, originalPrice: 2067, rating: 4.8, reviewCount: 914, fabric: "Linen", pattern: "Solid", colors: ["Purple"], tags: ["western-wear", "trending"] },
  { name: "Minimalist Floral Dress", category: "dresses", price: 2281, originalPrice: 2999, rating: 4.8, reviewCount: 1287, fabric: "Denim", pattern: "Solid", colors: ["Maroon"], tags: ["western-wear", "trending"] },
  { name: "Casual Maxi Dress", category: "dresses", price: 873, originalPrice: 1715, rating: 5.0, reviewCount: 4286, fabric: "Chiffon", pattern: "Solid", colors: ["Pink"], tags: ["western-wear", "trending"] },
  { name: "Classic Wrap Dress", category: "dresses", price: 490, originalPrice: 1959, rating: 4.3, reviewCount: 1720, fabric: "Chiffon", pattern: "Solid", colors: ["Green"], tags: ["western-wear", "trending"] },
  { name: "Luxury Midi Dress", category: "dresses", price: 1929, originalPrice: 3736, rating: 4.5, reviewCount: 1509, fabric: "Polyester", pattern: "Solid", colors: ["Pink"], tags: ["western-wear", "trending"] },
  { name: "Luxury Party Dress", category: "dresses", price: 890, originalPrice: 2565, rating: 4.7, reviewCount: 360, fabric: "Chiffon", pattern: "Solid", colors: ["Red"], tags: ["western-wear", "trending"] },
  { name: "Classic Party Dress", category: "dresses", price: 1326, originalPrice: 1888, rating: 4.6, reviewCount: 992, fabric: "Polyester", pattern: "Solid", colors: ["Black"], tags: ["western-wear", "trending"] },
  { name: "Modern Party Dress", category: "dresses", price: 2086, originalPrice: 3784, rating: 4.0, reviewCount: 1982, fabric: "Chiffon", pattern: "Solid", colors: ["Purple"], tags: ["western-wear", "trending"] },
  { name: "Casual Summer Dress", category: "dresses", price: 2081, originalPrice: 3583, rating: 4.1, reviewCount: 1796, fabric: "Georgette", pattern: "Solid", colors: ["Yellow"], tags: ["western-wear", "trending"] },
  { name: "Chic Tunic", category: "tops", price: 1345, originalPrice: 3004, rating: 4.4, reviewCount: 4665, fabric: "Denim", pattern: "Solid", colors: ["Orange"], tags: ["western-wear", "deals"] },
  { name: "Trendy Tunic", category: "tops", price: 592, originalPrice: 2250, rating: 5.0, reviewCount: 4156, fabric: "Rayon", pattern: "Solid", colors: ["Maroon"], tags: ["western-wear", "deals"] },
  { name: "Luxury Shirt", category: "tops", price: 2123, originalPrice: 3993, rating: 4.8, reviewCount: 2935, fabric: "Silk", pattern: "Solid", colors: ["White"], tags: ["western-wear", "deals"] },
  { name: "Modern Crop Top", category: "tops", price: 541, originalPrice: 1770, rating: 4.8, reviewCount: 4061, fabric: "Velvet", pattern: "Solid", colors: ["White"], tags: ["western-wear", "deals"] },
  { name: "Classic Crop Top", category: "tops", price: 1143, originalPrice: 2294, rating: 4.8, reviewCount: 3904, fabric: "Georgette", pattern: "Solid", colors: ["Silver"], tags: ["western-wear", "deals"] },
  { name: "Casual Crop Top", category: "tops", price: 1758, originalPrice: 3305, rating: 4.4, reviewCount: 2188, fabric: "Cotton", pattern: "Solid", colors: ["Green"], tags: ["western-wear", "deals"] },
  { name: "Vibrant Peplum Top", category: "tops", price: 973, originalPrice: 1496, rating: 4.4, reviewCount: 3584, fabric: "Denim", pattern: "Solid", colors: ["Purple"], tags: ["western-wear", "deals"] },
  { name: "Festive Shirt", category: "tops", price: 1729, originalPrice: 2528, rating: 4.8, reviewCount: 2802, fabric: "Silk", pattern: "Solid", colors: ["Yellow"], tags: ["western-wear", "deals"] },
  { name: "Minimalist Party Top", category: "tops", price: 809, originalPrice: 1818, rating: 4.2, reviewCount: 4685, fabric: "Cotton", pattern: "Solid", colors: ["Orange"], tags: ["western-wear", "deals"] },
  { name: "Luxury Party Top", category: "tops", price: 2195, originalPrice: 3046, rating: 4.5, reviewCount: 3982, fabric: "Cotton", pattern: "Solid", colors: ["White"], tags: ["western-wear", "deals"] },
  { name: "Trendy Shirt", category: "tops", price: 456, originalPrice: 1582, rating: 4.5, reviewCount: 1205, fabric: "Polyester", pattern: "Solid", colors: ["Pink"], tags: ["western-wear", "deals"] },
  { name: "Classic Casual Top", category: "tops", price: 2019, originalPrice: 3223, rating: 4.4, reviewCount: 3759, fabric: "Linen", pattern: "Solid", colors: ["Red"], tags: ["western-wear", "deals"] },
  { name: "Trendy Peplum Top", category: "tops", price: 410, originalPrice: 955, rating: 4.1, reviewCount: 3779, fabric: "Georgette", pattern: "Solid", colors: ["Orange"], tags: ["western-wear", "deals"] },
  { name: "Premium Peplum Top", category: "tops", price: 1553, originalPrice: 3175, rating: 4.1, reviewCount: 740, fabric: "Silk", pattern: "Solid", colors: ["Orange"], tags: ["western-wear", "deals"] },
  { name: "Chic Party Top", category: "tops", price: 701, originalPrice: 1481, rating: 5.0, reviewCount: 2699, fabric: "Rayon", pattern: "Solid", colors: ["Teal"], tags: ["western-wear", "deals"] },
  { name: "Vibrant Party Top", category: "tops", price: 654, originalPrice: 2455, rating: 4.8, reviewCount: 1312, fabric: "Rayon", pattern: "Solid", colors: ["Pink"], tags: ["western-wear", "deals"] },
  { name: "Modern Shirt", category: "tops", price: 812, originalPrice: 2188, rating: 4.6, reviewCount: 3472, fabric: "Velvet", pattern: "Solid", colors: ["White"], tags: ["western-wear", "deals"] },
  { name: "Premium Tunic", category: "tops", price: 1520, originalPrice: 2155, rating: 4.8, reviewCount: 1435, fabric: "Cotton", pattern: "Solid", colors: ["Red"], tags: ["western-wear", "deals"] },
  { name: "Festive Crop Top", category: "tops", price: 841, originalPrice: 1396, rating: 4.8, reviewCount: 1800, fabric: "Rayon", pattern: "Solid", colors: ["Maroon"], tags: ["western-wear", "deals"] },
  { name: "Elegant Peplum Top", category: "tops", price: 1218, originalPrice: 3009, rating: 4.2, reviewCount: 418, fabric: "Chiffon", pattern: "Solid", colors: ["Pink"], tags: ["western-wear", "deals"] },
  { name: "Classic Tunic", category: "tops", price: 2268, originalPrice: 2986, rating: 4.5, reviewCount: 236, fabric: "Cotton", pattern: "Solid", colors: ["Gold"], tags: ["western-wear", "deals"] },
  { name: "Vibrant Shirt", category: "tops", price: 985, originalPrice: 2316, rating: 4.0, reviewCount: 3772, fabric: "Chiffon", pattern: "Solid", colors: ["Gold"], tags: ["western-wear", "deals"] },
  { name: "Elegant Casual Top", category: "tops", price: 1664, originalPrice: 3506, rating: 4.5, reviewCount: 2542, fabric: "Silk", pattern: "Solid", colors: ["Pink"], tags: ["western-wear", "deals"] },
  { name: "Designer Tunic", category: "tops", price: 2290, originalPrice: 2845, rating: 4.7, reviewCount: 4483, fabric: "Georgette", pattern: "Solid", colors: ["Silver"], tags: ["western-wear", "deals"] },
  { name: "Casual Casual Top", category: "tops", price: 741, originalPrice: 1494, rating: 5.0, reviewCount: 600, fabric: "Silk", pattern: "Solid", colors: ["Green"], tags: ["western-wear", "deals"] },
  { name: "Casual Shirt", category: "tops", price: 407, originalPrice: 2219, rating: 5.0, reviewCount: 1103, fabric: "Silk", pattern: "Solid", colors: ["Orange"], tags: ["western-wear", "deals"] },
  { name: "Minimalist Peplum Top", category: "tops", price: 1587, originalPrice: 3295, rating: 4.5, reviewCount: 3513, fabric: "Georgette", pattern: "Solid", colors: ["White"], tags: ["western-wear", "deals"] },
  { name: "Luxury Crop Top", category: "tops", price: 1816, originalPrice: 3332, rating: 4.6, reviewCount: 1950, fabric: "Velvet", pattern: "Solid", colors: ["Purple"], tags: ["western-wear", "deals"] },
  { name: "Vibrant Crop Top", category: "tops", price: 1658, originalPrice: 2803, rating: 4.4, reviewCount: 3526, fabric: "Linen", pattern: "Solid", colors: ["White"], tags: ["western-wear", "deals"] },
  { name: "Minimalist Tunic", category: "tops", price: 2248, originalPrice: 3304, rating: 4.0, reviewCount: 1691, fabric: "Georgette", pattern: "Solid", colors: ["Black"], tags: ["western-wear", "deals"] },
  { name: "Premium Party Top", category: "tops", price: 571, originalPrice: 2013, rating: 4.4, reviewCount: 608, fabric: "Silk", pattern: "Solid", colors: ["Green"], tags: ["western-wear", "deals"] },
  { name: "Casual Tunic", category: "tops", price: 1590, originalPrice: 3156, rating: 4.4, reviewCount: 1101, fabric: "Velvet", pattern: "Solid", colors: ["Black"], tags: ["western-wear", "deals"] },
  { name: "Festive Peplum Top", category: "tops", price: 443, originalPrice: 1726, rating: 4.4, reviewCount: 3489, fabric: "Polyester", pattern: "Solid", colors: ["Silver"], tags: ["western-wear", "deals"] },
  { name: "Festive Tunic", category: "tops", price: 1498, originalPrice: 3302, rating: 4.2, reviewCount: 877, fabric: "Velvet", pattern: "Solid", colors: ["Silver"], tags: ["western-wear", "deals"] },
  { name: "Minimalist Casual Top", category: "tops", price: 1727, originalPrice: 3640, rating: 4.4, reviewCount: 1548, fabric: "Rayon", pattern: "Solid", colors: ["Silver"], tags: ["western-wear", "deals"] },
  { name: "Casual Peplum Top", category: "tops", price: 1996, originalPrice: 3355, rating: 4.4, reviewCount: 3538, fabric: "Velvet", pattern: "Solid", colors: ["Teal"], tags: ["western-wear", "deals"] },
  { name: "Premium Wide Leg Jeans", category: "jeans", price: 1568, originalPrice: 3501, rating: 4.9, reviewCount: 3337, fabric: "Polyester", pattern: "Solid", colors: ["Yellow"], tags: ["western-wear", "trending"] },
  { name: "Modern Skinny Jeans", category: "jeans", price: 322, originalPrice: 1409, rating: 4.7, reviewCount: 2517, fabric: "Rayon", pattern: "Solid", colors: ["Yellow"], tags: ["western-wear", "trending"] },
  { name: "Luxury Straight Jeans", category: "jeans", price: 1960, originalPrice: 3691, rating: 4.3, reviewCount: 363, fabric: "Rayon", pattern: "Solid", colors: ["White"], tags: ["western-wear", "trending"] },
  { name: "Classic Skinny Jeans", category: "jeans", price: 1903, originalPrice: 3475, rating: 4.7, reviewCount: 462, fabric: "Georgette", pattern: "Solid", colors: ["Yellow"], tags: ["western-wear", "trending"] },
  { name: "Luxury Wide Leg Jeans", category: "jeans", price: 1867, originalPrice: 2961, rating: 4.5, reviewCount: 3803, fabric: "Cotton", pattern: "Solid", colors: ["Blue"], tags: ["western-wear", "trending"] },
  { name: "Chic Wide Leg Jeans", category: "jeans", price: 1127, originalPrice: 2069, rating: 4.6, reviewCount: 3832, fabric: "Silk", pattern: "Solid", colors: ["Purple"], tags: ["western-wear", "trending"] },
  { name: "Vibrant Straight Jeans", category: "jeans", price: 358, originalPrice: 2349, rating: 4.9, reviewCount: 2504, fabric: "Cotton", pattern: "Solid", colors: ["Orange"], tags: ["western-wear", "trending"] },
  { name: "Trendy Wide Leg Jeans", category: "jeans", price: 983, originalPrice: 2707, rating: 4.8, reviewCount: 2839, fabric: "Denim", pattern: "Solid", colors: ["Green"], tags: ["western-wear", "trending"] },
  { name: "Designer Cargo Jeans", category: "jeans", price: 688, originalPrice: 2061, rating: 4.1, reviewCount: 1295, fabric: "Cotton", pattern: "Solid", colors: ["Red"], tags: ["western-wear", "trending"] },
  { name: "Minimalist Wide Leg Jeans", category: "jeans", price: 1503, originalPrice: 2759, rating: 4.0, reviewCount: 4502, fabric: "Velvet", pattern: "Solid", colors: ["Gold"], tags: ["western-wear", "trending"] },
  { name: "Elegant Cargo Jeans", category: "jeans", price: 1670, originalPrice: 2546, rating: 5.0, reviewCount: 2047, fabric: "Chiffon", pattern: "Solid", colors: ["Purple"], tags: ["western-wear", "trending"] },
  { name: "Modern Mom Jeans", category: "jeans", price: 1065, originalPrice: 1566, rating: 4.5, reviewCount: 4900, fabric: "Georgette", pattern: "Solid", colors: ["Blue"], tags: ["western-wear", "trending"] },
  { name: "Elegant Straight Jeans", category: "jeans", price: 968, originalPrice: 2344, rating: 4.3, reviewCount: 4709, fabric: "Cotton", pattern: "Solid", colors: ["Gold"], tags: ["western-wear", "trending"] },
  { name: "Minimalist Mom Jeans", category: "jeans", price: 2207, originalPrice: 3415, rating: 5.0, reviewCount: 3115, fabric: "Rayon", pattern: "Solid", colors: ["Silver"], tags: ["western-wear", "trending"] },
  { name: "Designer Wide Leg Jeans", category: "jeans", price: 1926, originalPrice: 3007, rating: 4.1, reviewCount: 1713, fabric: "Linen", pattern: "Solid", colors: ["Yellow"], tags: ["western-wear", "trending"] },
  { name: "Chic Straight Jeans", category: "jeans", price: 1050, originalPrice: 2713, rating: 4.0, reviewCount: 1237, fabric: "Cotton", pattern: "Solid", colors: ["White"], tags: ["western-wear", "trending"] },
  { name: "Premium Mom Jeans", category: "jeans", price: 1455, originalPrice: 2046, rating: 4.8, reviewCount: 4288, fabric: "Denim", pattern: "Solid", colors: ["Silver"], tags: ["western-wear", "trending"] },
  { name: "Casual Cargo Jeans", category: "jeans", price: 2209, originalPrice: 2983, rating: 4.2, reviewCount: 4777, fabric: "Denim", pattern: "Solid", colors: ["Orange"], tags: ["western-wear", "trending"] },
  { name: "Modern Wide Leg Jeans", category: "jeans", price: 748, originalPrice: 2163, rating: 4.5, reviewCount: 4711, fabric: "Denim", pattern: "Solid", colors: ["Maroon"], tags: ["western-wear", "trending"] },
  { name: "Modern High Waist Jeans", category: "jeans", price: 1682, originalPrice: 2543, rating: 4.7, reviewCount: 3137, fabric: "Polyester", pattern: "Solid", colors: ["Green"], tags: ["western-wear", "trending"] },
  { name: "Elegant Skinny Jeans", category: "jeans", price: 747, originalPrice: 2738, rating: 4.9, reviewCount: 430, fabric: "Velvet", pattern: "Solid", colors: ["Pink"], tags: ["western-wear", "trending"] },
  { name: "Vibrant Mom Jeans", category: "jeans", price: 708, originalPrice: 1462, rating: 4.0, reviewCount: 368, fabric: "Cotton", pattern: "Solid", colors: ["Maroon"], tags: ["western-wear", "trending"] },
  { name: "Designer Straight Jeans", category: "jeans", price: 1143, originalPrice: 2528, rating: 4.7, reviewCount: 3207, fabric: "Cotton", pattern: "Solid", colors: ["Yellow"], tags: ["western-wear", "trending"] },
  { name: "Classic Straight Jeans", category: "jeans", price: 1945, originalPrice: 3414, rating: 4.2, reviewCount: 2431, fabric: "Polyester", pattern: "Solid", colors: ["Gold"], tags: ["western-wear", "trending"] },
  { name: "Festive High Waist Jeans", category: "jeans", price: 1584, originalPrice: 2448, rating: 4.1, reviewCount: 2678, fabric: "Linen", pattern: "Solid", colors: ["Black"], tags: ["western-wear", "trending"] },
  { name: "Festive Cargo Jeans", category: "jeans", price: 2219, originalPrice: 3784, rating: 4.0, reviewCount: 528, fabric: "Chiffon", pattern: "Solid", colors: ["Gold"], tags: ["western-wear", "trending"] },
  { name: "Minimalist Cargo Jeans", category: "jeans", price: 989, originalPrice: 1827, rating: 4.7, reviewCount: 1571, fabric: "Chiffon", pattern: "Solid", colors: ["White"], tags: ["western-wear", "trending"] },
  { name: "Elegant High Waist Jeans", category: "jeans", price: 678, originalPrice: 2503, rating: 4.6, reviewCount: 262, fabric: "Rayon", pattern: "Solid", colors: ["Green"], tags: ["western-wear", "trending"] },
  { name: "Festive Wide Leg Jeans", category: "jeans", price: 1437, originalPrice: 2856, rating: 4.1, reviewCount: 2379, fabric: "Georgette", pattern: "Solid", colors: ["Red"], tags: ["western-wear", "trending"] },
  { name: "Designer High Waist Jeans", category: "jeans", price: 1593, originalPrice: 2626, rating: 4.4, reviewCount: 3215, fabric: "Linen", pattern: "Solid", colors: ["Silver"], tags: ["western-wear", "trending"] },
  { name: "Minimalist Skinny Jeans", category: "jeans", price: 796, originalPrice: 2501, rating: 4.9, reviewCount: 1365, fabric: "Rayon", pattern: "Solid", colors: ["Silver"], tags: ["western-wear", "trending"] },
  { name: "Chic High Waist Jeans", category: "jeans", price: 1771, originalPrice: 3340, rating: 4.1, reviewCount: 685, fabric: "Cotton", pattern: "Solid", colors: ["Blue"], tags: ["western-wear", "trending"] },
  { name: "Festive Mom Jeans", category: "jeans", price: 1002, originalPrice: 2327, rating: 4.2, reviewCount: 1061, fabric: "Silk", pattern: "Solid", colors: ["Maroon"], tags: ["western-wear", "trending"] },
  { name: "Casual High Waist Jeans", category: "jeans", price: 1622, originalPrice: 2998, rating: 4.6, reviewCount: 2985, fabric: "Polyester", pattern: "Solid", colors: ["Gold"], tags: ["western-wear", "trending"] },
  { name: "Maroon Bridal Lehenga", category: "lehengas", price: 1349, originalPrice: 1993, rating: 4.3, reviewCount: 3405, fabric: "Cotton", pattern: "Solid", colors: ["White"], tags: ["ethnic-wear", "festive", "trending"], sourceUrl: "https://www.instagram.com/p/DRqtDLZCQ2n/" },
  { name: "Festive Lehenga Choli", category: "lehengas", price: 347, originalPrice: 1522, rating: 4.3, reviewCount: 4754, fabric: "Linen", pattern: "Solid", colors: ["Maroon"], tags: ["ethnic-wear", "festive", "trending"] },
  { name: "Minimalist Bridal Lehenga", category: "lehengas", price: 572, originalPrice: 1193, rating: 4.2, reviewCount: 4930, fabric: "Denim", pattern: "Solid", colors: ["Green"], tags: ["ethnic-wear", "festive", "trending"] },
  { name: "Vibrant Festive Lehenga", category: "lehengas", price: 1614, originalPrice: 2210, rating: 4.0, reviewCount: 3447, fabric: "Silk", pattern: "Solid", colors: ["Orange"], tags: ["ethnic-wear", "festive", "trending"] },
  { name: "Luxury Designer Lehenga", category: "lehengas", price: 830, originalPrice: 1459, rating: 4.8, reviewCount: 4139, fabric: "Silk", pattern: "Solid", colors: ["Orange"], tags: ["ethnic-wear", "festive", "trending"], sourceUrl: "https://www.samyakk.com/blog/designer-bridal-lehengas-perfect-blend-luxury-style-modern-bride/?srsltid=AfmBOoruM1uusbxejuTxOAC-jqsyAGD0CMN6aQhq_gFGMo2RBp2J_KPf" },
  { name: "Classic Floral Lehenga", category: "lehengas", price: 1417, originalPrice: 3185, rating: 4.2, reviewCount: 2532, fabric: "Silk", pattern: "Solid", colors: ["Pink"], tags: ["ethnic-wear", "festive", "trending"], sourceUrl: "https://in.kalkifashion.com/products/pink-floral-printed-lehenga-with-dupatta" },
  { name: "Classic Lehenga Choli", category: "lehengas", price: 866, originalPrice: 1386, rating: 4.6, reviewCount: 2919, fabric: "Rayon", pattern: "Solid", colors: ["Purple"], tags: ["ethnic-wear", "festive", "trending"] },
  { name: "Modern Lehenga Choli", category: "lehengas", price: 890, originalPrice: 2756, rating: 4.4, reviewCount: 2491, fabric: "Polyester", pattern: "Solid", colors: ["Pink"], tags: ["ethnic-wear", "festive", "trending"] },
  { name: "Luxury Floral Lehenga", category: "lehengas", price: 567, originalPrice: 1930, rating: 4.9, reviewCount: 685, fabric: "Chiffon", pattern: "Solid", colors: ["Red"], tags: ["ethnic-wear", "festive", "trending"], sourceUrl: "https://www.royalexport.in/product/bridesmaids-multicoloured-floral-pattern-lehenga-c-2220" },
  { name: "Vibrant Floral Lehenga", category: "lehengas", price: 1073, originalPrice: 2315, rating: 4.2, reviewCount: 903, fabric: "Polyester", pattern: "Solid", colors: ["Gold"], tags: ["ethnic-wear", "festive", "trending"], sourceUrl: "https://www.exoticindiaart.com/product/textiles/vibrant-chinon-silk-lehenga-set-with-floral-sequence-embroidery-ideal-for-weddings-and-celebrations-gam833/" },
  { name: "Designer Flower Printed Embroidery Lehenga Choli", category: "lehengas", price: 1310, originalPrice: 2250, rating: 4.4, reviewCount: 3338, fabric: "Velvet", pattern: "Solid", colors: ["Green"], tags: ["ethnic-wear", "festive", "trending"] },
  { name: "Classic Designer Lehenga", category: "lehengas", price: 1168, originalPrice: 2547, rating: 4.4, reviewCount: 542, fabric: "Cotton", pattern: "Solid", colors: ["Teal"], tags: ["ethnic-wear", "festive", "trending"], sourceUrl: "https://www.kalkifashion.com/products/red-silk-bridal-lehenga-with-heavy-sequins-and-stones-work" },
  { name: "Modern Floral Lehenga", category: "lehengas", price: 1256, originalPrice: 3162, rating: 4.8, reviewCount: 4922, fabric: "Velvet", pattern: "Solid", colors: ["Purple"], tags: ["ethnic-wear", "festive", "trending"] },
  { name: "Casual Designer Lehenga", category: "lehengas", price: 1665, originalPrice: 3269, rating: 4.8, reviewCount: 3741, fabric: "Chiffon", pattern: "Solid", colors: ["Blue"], tags: ["ethnic-wear", "festive", "trending"] },
  { name: "Modern Festive Lehenga", category: "lehengas", price: 1344, originalPrice: 2004, rating: 4.2, reviewCount: 3049, fabric: "Georgette", pattern: "Solid", colors: ["Orange"], tags: ["ethnic-wear", "festive", "trending"] },
  { name: "Minimalist Lehenga Choli", category: "lehengas", price: 1512, originalPrice: 3219, rating: 4.3, reviewCount: 2996, fabric: "Denim", pattern: "Solid", colors: ["Gold"], tags: ["ethnic-wear", "festive", "trending"], sourceUrl: "https://g3fashion.com/blog/fashion/latest-trends-in-lehenga-choli-designs/" },
  { name: "Designer Designer Lehenga", category: "lehengas", price: 1590, originalPrice: 2130, rating: 4.1, reviewCount: 4103, fabric: "Linen", pattern: "Solid", colors: ["Teal"], tags: ["ethnic-wear", "festive", "trending"] },
  { name: "Alia Style Georgette Lehenga", category: "lehengas", price: 1520, originalPrice: 2077, rating: 4.9, reviewCount: 3314, fabric: "Cotton", pattern: "Solid", colors: ["Blue"], tags: ["ethnic-wear", "festive", "trending"] },
  { name: "Casual Bridal Lehenga", category: "lehengas", price: 356, originalPrice: 1214, rating: 4.7, reviewCount: 707, fabric: "Velvet", pattern: "Solid", colors: ["Purple"], tags: ["ethnic-wear", "festive", "trending"], sourceUrl: "https://www.manyavar.com/en-in/women-semi-stitched-lehenga/berry-red-embroidered-bridal-lehenga/M313472.html" },
  { name: "Festive Designer Lehenga", category: "lehengas", price: 1794, originalPrice: 3610, rating: 4.5, reviewCount: 2159, fabric: "Silk", pattern: "Solid", colors: ["Maroon"], tags: ["ethnic-wear", "festive", "trending"], sourceUrl: "https://bawreefashions.com/products/designer-bridal-fish-cut-lehenga-choli-wedding-reception-festive-party-wear-outfit" },
  { name: "Trendy Floral Lehenga", category: "lehengas", price: 991, originalPrice: 2349, rating: 5.0, reviewCount: 1928, fabric: "Silk", pattern: "Solid", colors: ["White"], tags: ["ethnic-wear", "festive", "trending"], sourceUrl: "https://www.trendbuy.co.in/products/trendbuy-floral-print-georgette-lehenga-choli-set-for-festive-occasions?srsltid=AfmBOor9nuwaB1T-6sL9fFQgFT1q7FBDrHKs6cOlpP6F9QoVdAG-ZMfI" },
  { name: "Elegant Festive Lehenga", category: "lehengas", price: 1910, originalPrice: 3875, rating: 4.8, reviewCount: 205, fabric: "Rayon", pattern: "Solid", colors: ["Teal"], tags: ["ethnic-wear", "festive", "trending"], sourceUrl: "https://www.bullionknot.com/products/vrindavan-golden-traditional-lehenga" },
  { name: "Scarlet Red Wedding Lehenga Choli", category: "lehengas", price: 2233, originalPrice: 3953, rating: 4.9, reviewCount: 3162, fabric: "Chiffon", pattern: "Solid", colors: ["Pink"], tags: ["ethnic-wear", "festive", "trending"] },
  { name: "Casual Festive Lehenga", category: "lehengas", price: 1687, originalPrice: 2612, rating: 4.8, reviewCount: 1678, fabric: "Polyester", pattern: "Solid", colors: ["Silver"], tags: ["ethnic-wear", "festive", "trending"], sourceUrl: "https://www.trendbuy.co.in/products/cotton-lehenga-choli-for-women-festive-casual-wear?srsltid=AfmBOop-jE6Y1VZ4BDqTTNVsTHIqqtiqmbDmialxfLWq79y_55MG4KOu" },
  { name: "Trendy Designer Lehenga", category: "lehengas", price: 2179, originalPrice: 2970, rating: 4.7, reviewCount: 1122, fabric: "Silk", pattern: "Solid", colors: ["Orange"], tags: ["ethnic-wear", "festive", "trending"], sourceUrl: "https://www.amazon.in/R-V-Fashion-Embroidery-Designer-Lehenga/dp/B0FCG5ZRCK" },
  { name: "Trendy Bridal Lehenga", category: "lehengas", price: 2245, originalPrice: 3078, rating: 4.6, reviewCount: 1631, fabric: "Linen", pattern: "Solid", colors: ["Orange"], tags: ["ethnic-wear", "festive", "trending"], sourceUrl: "https://www.shoppingworldyt.com/products/happy-customer-huge-flare-bridal-lehenga?srsltid=AfmBOoqu8O0AS8Unm5LGrMeFDBCjfiX_4Jr9kOilBPlDyjQ5a5ILd4zL" },
  { name: "Chic Designer Lehenga", category: "lehengas", price: 2164, originalPrice: 3082, rating: 4.2, reviewCount: 1174, fabric: "Linen", pattern: "Solid", colors: ["Blue"], tags: ["ethnic-wear", "festive", "trending"], sourceUrl: "https://www.sareeka.com/lavender-thread-trendy-designer-lehenga-choli-156015.html" },
  { name: "Classic Earrings", category: "jewellery", price: 1446, originalPrice: 3143, rating: 4.8, reviewCount: 3824, fabric: "Polyester", pattern: "Solid", colors: ["Purple"], tags: ["accessories", "deals"] },
  { name: "Designer Bracelet", category: "jewellery", price: 1370, originalPrice: 2106, rating: 4.4, reviewCount: 898, fabric: "Chiffon", pattern: "Solid", colors: ["Red"], tags: ["accessories", "deals"] },
  { name: "Festive Choker Set", category: "jewellery", price: 520, originalPrice: 2156, rating: 4.6, reviewCount: 2665, fabric: "Chiffon", pattern: "Solid", colors: ["Maroon"], tags: ["accessories", "deals"] },
  { name: "Vibrant Earrings", category: "jewellery", price: 520, originalPrice: 1806, rating: 4.1, reviewCount: 270, fabric: "Cotton", pattern: "Solid", colors: ["Maroon"], tags: ["accessories", "deals"] },
  { name: "Classic Bracelet", category: "jewellery", price: 933, originalPrice: 2513, rating: 4.4, reviewCount: 2584, fabric: "Velvet", pattern: "Solid", colors: ["White"], tags: ["accessories", "deals"] },
  { name: "Luxury Choker Set", category: "jewellery", price: 1027, originalPrice: 1634, rating: 4.1, reviewCount: 4246, fabric: "Silk", pattern: "Solid", colors: ["Red"], tags: ["accessories", "deals"] },
  { name: "Classic Necklace", category: "jewellery", price: 804, originalPrice: 1413, rating: 4.2, reviewCount: 3563, fabric: "Polyester", pattern: "Solid", colors: ["Purple"], tags: ["accessories", "deals"] },
  { name: "Modern Earrings", category: "jewellery", price: 1881, originalPrice: 3603, rating: 4.2, reviewCount: 4112, fabric: "Polyester", pattern: "Solid", colors: ["Pink"], tags: ["accessories", "deals"] },
  { name: "Designer Maang Tikka", category: "jewellery", price: 1551, originalPrice: 3303, rating: 4.6, reviewCount: 4856, fabric: "Polyester", pattern: "Solid", colors: ["Pink"], tags: ["accessories", "deals"] },
  { name: "Chic Bracelet", category: "jewellery", price: 402, originalPrice: 907, rating: 4.5, reviewCount: 2202, fabric: "Rayon", pattern: "Solid", colors: ["White"], tags: ["accessories", "deals"] },
  { name: "Casual Bangles", category: "jewellery", price: 876, originalPrice: 2292, rating: 4.2, reviewCount: 4863, fabric: "Velvet", pattern: "Solid", colors: ["Orange"], tags: ["accessories", "deals"] },
  { name: "Chic Bangles", category: "jewellery", price: 1388, originalPrice: 2729, rating: 4.4, reviewCount: 3143, fabric: "Denim", pattern: "Solid", colors: ["Red"], tags: ["accessories", "deals"] },
  { name: "Elegant Bracelet", category: "jewellery", price: 528, originalPrice: 1977, rating: 4.6, reviewCount: 1509, fabric: "Rayon", pattern: "Solid", colors: ["Yellow"], tags: ["accessories", "deals"] },
  { name: "Modern Choker Set", category: "jewellery", price: 865, originalPrice: 2309, rating: 4.8, reviewCount: 4995, fabric: "Silk", pattern: "Solid", colors: ["Gold"], tags: ["accessories", "deals"] },
  { name: "Modern Necklace", category: "jewellery", price: 2048, originalPrice: 3624, rating: 4.5, reviewCount: 4127, fabric: "Polyester", pattern: "Solid", colors: ["Purple"], tags: ["accessories", "deals"] },
  { name: "Elegant Rings", category: "jewellery", price: 1003, originalPrice: 1863, rating: 4.8, reviewCount: 3695, fabric: "Chiffon", pattern: "Solid", colors: ["Teal"], tags: ["accessories", "deals"] },
  { name: "Trendy Choker Set", category: "jewellery", price: 606, originalPrice: 1723, rating: 4.2, reviewCount: 592, fabric: "Linen", pattern: "Solid", colors: ["Gold"], tags: ["accessories", "deals"] },
  { name: "Classic Choker Set", category: "jewellery", price: 807, originalPrice: 1942, rating: 4.8, reviewCount: 2863, fabric: "Chiffon", pattern: "Solid", colors: ["Purple"], tags: ["accessories", "deals"] },
  { name: "Trendy Earrings", category: "jewellery", price: 1839, originalPrice: 3369, rating: 4.3, reviewCount: 675, fabric: "Polyester", pattern: "Solid", colors: ["Black"], tags: ["accessories", "deals"] },
  { name: "Elegant Maang Tikka", category: "jewellery", price: 1035, originalPrice: 2354, rating: 4.9, reviewCount: 2198, fabric: "Velvet", pattern: "Solid", colors: ["Orange"], tags: ["accessories", "deals"] },
  { name: "Premium Earrings", category: "jewellery", price: 313, originalPrice: 1844, rating: 4.7, reviewCount: 2789, fabric: "Polyester", pattern: "Solid", colors: ["Yellow"], tags: ["accessories", "deals"] },
  { name: "Elegant Bangles", category: "jewellery", price: 390, originalPrice: 1324, rating: 4.4, reviewCount: 3848, fabric: "Georgette", pattern: "Solid", colors: ["Yellow"], tags: ["accessories", "deals"] },
  { name: "Chic Maang Tikka", category: "jewellery", price: 1525, originalPrice: 2800, rating: 4.7, reviewCount: 1001, fabric: "Georgette", pattern: "Solid", colors: ["Red"], tags: ["accessories", "deals"] },
  { name: "Trendy Bracelet", category: "jewellery", price: 1885, originalPrice: 3539, rating: 4.9, reviewCount: 4623, fabric: "Rayon", pattern: "Solid", colors: ["Blue"], tags: ["accessories", "deals"] },
  { name: "Premium Maang Tikka", category: "jewellery", price: 1658, originalPrice: 2162, rating: 4.8, reviewCount: 2282, fabric: "Cotton", pattern: "Solid", colors: ["Silver"], tags: ["accessories", "deals"] },
  { name: "Festive Necklace", category: "jewellery", price: 371, originalPrice: 1591, rating: 4.9, reviewCount: 1558, fabric: "Cotton", pattern: "Solid", colors: ["Silver"], tags: ["accessories", "deals"] },
  { name: "Premium Bangles", category: "jewellery", price: 1245, originalPrice: 3011, rating: 4.3, reviewCount: 4038, fabric: "Silk", pattern: "Solid", colors: ["Gold"], tags: ["accessories", "deals"] },
  { name: "Modern Bracelet", category: "jewellery", price: 1513, originalPrice: 2258, rating: 4.3, reviewCount: 603, fabric: "Linen", pattern: "Solid", colors: ["Black"], tags: ["accessories", "deals"] },
  { name: "Casual Bracelet", category: "jewellery", price: 475, originalPrice: 1249, rating: 4.6, reviewCount: 2985, fabric: "Cotton", pattern: "Solid", colors: ["White"], tags: ["accessories", "deals"] },
  { name: "Festive Earrings", category: "jewellery", price: 980, originalPrice: 2952, rating: 4.1, reviewCount: 3240, fabric: "Rayon", pattern: "Solid", colors: ["Yellow"], tags: ["accessories", "deals"] },
  { name: "Vibrant Rings", category: "jewellery", price: 708, originalPrice: 1876, rating: 4.7, reviewCount: 565, fabric: "Velvet", pattern: "Solid", colors: ["Silver"], tags: ["accessories", "deals"] },
  { name: "Luxury Rings", category: "jewellery", price: 1741, originalPrice: 3132, rating: 4.5, reviewCount: 3484, fabric: "Silk", pattern: "Solid", colors: ["Black"], tags: ["accessories", "deals"] },
  { name: "Casual Necklace", category: "jewellery", price: 1615, originalPrice: 2572, rating: 4.2, reviewCount: 4054, fabric: "Georgette", pattern: "Solid", colors: ["Red"], tags: ["accessories", "deals"] },
  { name: "Vibrant Bracelet", category: "jewellery", price: 618, originalPrice: 1934, rating: 4.2, reviewCount: 1979, fabric: "Denim", pattern: "Solid", colors: ["Red"], tags: ["accessories", "deals"] },
  { name: "Modern Flats", category: "footwear", price: 1679, originalPrice: 2303, rating: 4.5, reviewCount: 1234, fabric: "Cotton", pattern: "Solid", colors: ["Red"], tags: ["footwear"] },
  { name: "Casual Juttis", category: "footwear", price: 461, originalPrice: 1628, rating: 4.7, reviewCount: 1244, fabric: "Denim", pattern: "Solid", colors: ["Purple"], tags: ["footwear"] },
  { name: "Vibrant Juttis", category: "footwear", price: 347, originalPrice: 1550, rating: 4.1, reviewCount: 4769, fabric: "Silk", pattern: "Solid", colors: ["Purple"], tags: ["footwear"] },
  { name: "Elegant Flats", category: "footwear", price: 365, originalPrice: 1167, rating: 4.0, reviewCount: 2566, fabric: "Polyester", pattern: "Solid", colors: ["Pink"], tags: ["footwear"] },
  { name: "Festive Juttis", category: "footwear", price: 1797, originalPrice: 2918, rating: 4.4, reviewCount: 612, fabric: "Cotton", pattern: "Solid", colors: ["Maroon"], tags: ["footwear"] },
  { name: "Classic Heels", category: "footwear", price: 1288, originalPrice: 2712, rating: 4.9, reviewCount: 2244, fabric: "Cotton", pattern: "Solid", colors: ["Red"], tags: ["footwear"] },
  { name: "Classic Sneakers", category: "footwear", price: 1879, originalPrice: 2945, rating: 4.4, reviewCount: 1057, fabric: "Georgette", pattern: "Solid", colors: ["Green"], tags: ["footwear"] },
  { name: "Minimalist Sandals", category: "footwear", price: 1609, originalPrice: 2675, rating: 4.2, reviewCount: 3861, fabric: "Linen", pattern: "Solid", colors: ["Red"], tags: ["footwear"] },
  { name: "Luxury Heels", category: "footwear", price: 1898, originalPrice: 3232, rating: 4.6, reviewCount: 2956, fabric: "Silk", pattern: "Solid", colors: ["Pink"], tags: ["footwear"] },
  { name: "Elegant Sandals", category: "footwear", price: 389, originalPrice: 2210, rating: 4.8, reviewCount: 789, fabric: "Velvet", pattern: "Solid", colors: ["Purple"], tags: ["footwear"] },
  { name: "Minimalist Juttis", category: "footwear", price: 1270, originalPrice: 1983, rating: 4.8, reviewCount: 2546, fabric: "Polyester", pattern: "Solid", colors: ["Pink"], tags: ["footwear"] },
  { name: "Premium Loafers", category: "footwear", price: 2186, originalPrice: 3341, rating: 4.2, reviewCount: 2592, fabric: "Chiffon", pattern: "Solid", colors: ["Silver"], tags: ["footwear"] },
  { name: "Modern Loafers", category: "footwear", price: 1175, originalPrice: 2927, rating: 4.4, reviewCount: 2734, fabric: "Georgette", pattern: "Solid", colors: ["Gold"], tags: ["footwear"] },
  { name: "Minimalist Sneakers", category: "footwear", price: 1308, originalPrice: 2135, rating: 4.8, reviewCount: 1071, fabric: "Velvet", pattern: "Solid", colors: ["Maroon"], tags: ["footwear"] },
  { name: "Premium Flats", category: "footwear", price: 593, originalPrice: 1350, rating: 4.0, reviewCount: 2212, fabric: "Georgette", pattern: "Solid", colors: ["Green"], tags: ["footwear"] },
  { name: "Chic Sandals", category: "footwear", price: 1914, originalPrice: 3609, rating: 5.0, reviewCount: 3668, fabric: "Polyester", pattern: "Solid", colors: ["Gold"], tags: ["footwear"] },
  { name: "Minimalist Loafers", category: "footwear", price: 1045, originalPrice: 1902, rating: 4.7, reviewCount: 3022, fabric: "Velvet", pattern: "Solid", colors: ["Teal"], tags: ["footwear"] },
  { name: "Modern Sneakers", category: "footwear", price: 1123, originalPrice: 2949, rating: 4.0, reviewCount: 2998, fabric: "Linen", pattern: "Solid", colors: ["Teal"], tags: ["footwear"] },
  { name: "Classic Loafers", category: "footwear", price: 693, originalPrice: 1577, rating: 4.2, reviewCount: 2789, fabric: "Polyester", pattern: "Solid", colors: ["White"], tags: ["footwear"] },
  { name: "Vibrant Sneakers", category: "footwear", price: 1440, originalPrice: 2611, rating: 4.9, reviewCount: 2108, fabric: "Silk", pattern: "Solid", colors: ["Gold"], tags: ["footwear"] },
  { name: "Elegant Juttis", category: "footwear", price: 1420, originalPrice: 2556, rating: 4.9, reviewCount: 3096, fabric: "Velvet", pattern: "Solid", colors: ["Silver"], tags: ["footwear"] },
  { name: "Luxury Sneakers", category: "footwear", price: 703, originalPrice: 2525, rating: 4.8, reviewCount: 482, fabric: "Denim", pattern: "Solid", colors: ["Blue"], tags: ["footwear"] },
  { name: "Premium Heels", category: "footwear", price: 447, originalPrice: 1925, rating: 4.8, reviewCount: 4400, fabric: "Velvet", pattern: "Solid", colors: ["Maroon"], tags: ["footwear"] },
  { name: "Designer Sandals", category: "footwear", price: 2296, originalPrice: 3067, rating: 4.1, reviewCount: 3004, fabric: "Silk", pattern: "Solid", colors: ["Green"], tags: ["footwear"] },
  { name: "Casual Sandals", category: "footwear", price: 2154, originalPrice: 3663, rating: 4.9, reviewCount: 1385, fabric: "Denim", pattern: "Solid", colors: ["Black"], tags: ["footwear"] },
  { name: "Vibrant Sandals", category: "footwear", price: 1687, originalPrice: 2954, rating: 4.2, reviewCount: 3807, fabric: "Polyester", pattern: "Solid", colors: ["Gold"], tags: ["footwear"] },
  { name: "Designer Heels", category: "footwear", price: 1093, originalPrice: 1714, rating: 4.9, reviewCount: 459, fabric: "Velvet", pattern: "Solid", colors: ["Red"], tags: ["footwear"] },
  { name: "Luxury Flats", category: "footwear", price: 813, originalPrice: 1419, rating: 4.8, reviewCount: 2175, fabric: "Chiffon", pattern: "Solid", colors: ["Yellow"], tags: ["footwear"] },
  { name: "Elegant Heels", category: "footwear", price: 1768, originalPrice: 3060, rating: 4.2, reviewCount: 2856, fabric: "Velvet", pattern: "Solid", colors: ["Black"], tags: ["footwear"] },
  { name: "Elegant Sneakers", category: "footwear", price: 790, originalPrice: 1933, rating: 4.2, reviewCount: 1171, fabric: "Polyester", pattern: "Solid", colors: ["Orange"], tags: ["footwear"] },
  { name: "Designer Juttis", category: "footwear", price: 1173, originalPrice: 3104, rating: 4.5, reviewCount: 3787, fabric: "Georgette", pattern: "Solid", colors: ["Teal"], tags: ["footwear"] },
  { name: "Minimalist Heels", category: "footwear", price: 409, originalPrice: 1237, rating: 4.7, reviewCount: 953, fabric: "Chiffon", pattern: "Solid", colors: ["Red"], tags: ["footwear"] },
  { name: "Elegant Loafers", category: "footwear", price: 1599, originalPrice: 2330, rating: 4.4, reviewCount: 1444, fabric: "Cotton", pattern: "Solid", colors: ["Black"], tags: ["footwear"] },
  { name: "Designer Loafers", category: "footwear", price: 873, originalPrice: 2153, rating: 4.9, reviewCount: 4451, fabric: "Rayon", pattern: "Solid", colors: ["Purple"], tags: ["footwear"] },
  { name: "Designer Sling Bag", category: "handbags", price: 1754, originalPrice: 2323, rating: 4.9, reviewCount: 1560, fabric: "Velvet", pattern: "Solid", colors: ["Silver"], tags: ["accessories", "trending"] },
  { name: "Chic Crossbody Bag", category: "handbags", price: 1014, originalPrice: 1649, rating: 4.5, reviewCount: 3601, fabric: "Linen", pattern: "Solid", colors: ["Green"], tags: ["accessories", "trending"] },
  { name: "Elegant Crossbody Bag", category: "handbags", price: 1549, originalPrice: 3051, rating: 4.8, reviewCount: 2839, fabric: "Chiffon", pattern: "Solid", colors: ["Teal"], tags: ["accessories", "trending"] },
  { name: "Chic Shoulder Bag", category: "handbags", price: 1726, originalPrice: 2480, rating: 4.5, reviewCount: 288, fabric: "Velvet", pattern: "Solid", colors: ["Pink"], tags: ["accessories", "trending"] },
  { name: "Vibrant Tote Bag", category: "handbags", price: 2087, originalPrice: 3115, rating: 4.7, reviewCount: 4020, fabric: "Denim", pattern: "Solid", colors: ["Blue"], tags: ["accessories", "trending"] },
  { name: "Modern Sling Bag", category: "handbags", price: 1639, originalPrice: 3050, rating: 4.6, reviewCount: 1981, fabric: "Velvet", pattern: "Solid", colors: ["Maroon"], tags: ["accessories", "trending"] },
  { name: "Designer Crossbody Bag", category: "handbags", price: 1427, originalPrice: 3256, rating: 4.6, reviewCount: 5004, fabric: "Linen", pattern: "Solid", colors: ["Teal"], tags: ["accessories", "trending"] },
  { name: "Chic Tote Bag", category: "handbags", price: 403, originalPrice: 2130, rating: 4.5, reviewCount: 1218, fabric: "Velvet", pattern: "Solid", colors: ["Pink"], tags: ["accessories", "trending"] },
  { name: "Trendy Crossbody Bag", category: "handbags", price: 1896, originalPrice: 2784, rating: 5.0, reviewCount: 1400, fabric: "Silk", pattern: "Solid", colors: ["Pink"], tags: ["accessories", "trending"] },
  { name: "Trendy Shoulder Bag", category: "handbags", price: 912, originalPrice: 2861, rating: 4.7, reviewCount: 4229, fabric: "Linen", pattern: "Solid", colors: ["Pink"], tags: ["accessories", "trending"] },
  { name: "Premium Shoulder Bag", category: "handbags", price: 1591, originalPrice: 2675, rating: 4.5, reviewCount: 575, fabric: "Linen", pattern: "Solid", colors: ["Red"], tags: ["accessories", "trending"] },
  { name: "Modern Satchel", category: "handbags", price: 650, originalPrice: 1961, rating: 4.7, reviewCount: 1392, fabric: "Rayon", pattern: "Solid", colors: ["Blue"], tags: ["accessories", "trending"] },
  { name: "Festive Clutch", category: "handbags", price: 1556, originalPrice: 3123, rating: 4.3, reviewCount: 3092, fabric: "Chiffon", pattern: "Solid", colors: ["White"], tags: ["accessories", "trending"] },
  { name: "Luxury Crossbody Bag", category: "handbags", price: 673, originalPrice: 2226, rating: 4.5, reviewCount: 3793, fabric: "Cotton", pattern: "Solid", colors: ["Silver"], tags: ["accessories", "trending"] },
  { name: "Trendy Tote Bag", category: "handbags", price: 645, originalPrice: 2106, rating: 4.7, reviewCount: 1597, fabric: "Chiffon", pattern: "Solid", colors: ["Pink"], tags: ["accessories", "trending"] },
  { name: "Designer Satchel", category: "handbags", price: 893, originalPrice: 2393, rating: 4.6, reviewCount: 3292, fabric: "Cotton", pattern: "Solid", colors: ["White"], tags: ["accessories", "trending"] },
  { name: "Luxury Clutch", category: "handbags", price: 684, originalPrice: 1888, rating: 4.4, reviewCount: 4983, fabric: "Cotton", pattern: "Solid", colors: ["Yellow"], tags: ["accessories", "trending"] },
  { name: "Premium Clutch", category: "handbags", price: 859, originalPrice: 1691, rating: 4.9, reviewCount: 2046, fabric: "Denim", pattern: "Solid", colors: ["Orange"], tags: ["accessories", "trending"] },
  { name: "Minimalist Clutch", category: "handbags", price: 929, originalPrice: 2060, rating: 4.1, reviewCount: 4043, fabric: "Rayon", pattern: "Solid", colors: ["White"], tags: ["accessories", "trending"] },
  { name: "Designer Clutch", category: "handbags", price: 836, originalPrice: 1892, rating: 4.8, reviewCount: 4006, fabric: "Chiffon", pattern: "Solid", colors: ["Silver"], tags: ["accessories", "trending"] },
  { name: "Premium Tote Bag", category: "handbags", price: 1729, originalPrice: 2404, rating: 4.3, reviewCount: 1627, fabric: "Rayon", pattern: "Solid", colors: ["Purple"], tags: ["accessories", "trending"] },
  { name: "Elegant Satchel", category: "handbags", price: 1706, originalPrice: 3115, rating: 4.9, reviewCount: 4767, fabric: "Velvet", pattern: "Solid", colors: ["Blue"], tags: ["accessories", "trending"] },
  { name: "Modern Clutch", category: "handbags", price: 433, originalPrice: 1680, rating: 4.6, reviewCount: 3444, fabric: "Silk", pattern: "Solid", colors: ["Blue"], tags: ["accessories", "trending"] },
  { name: "Chic Clutch", category: "handbags", price: 1599, originalPrice: 2789, rating: 4.9, reviewCount: 1842, fabric: "Georgette", pattern: "Solid", colors: ["White"], tags: ["accessories", "trending"] },
  { name: "Casual Shoulder Bag", category: "handbags", price: 1239, originalPrice: 2286, rating: 4.0, reviewCount: 3447, fabric: "Chiffon", pattern: "Solid", colors: ["Silver"], tags: ["accessories", "trending"] },
  { name: "Casual Satchel", category: "handbags", price: 862, originalPrice: 2010, rating: 4.0, reviewCount: 4588, fabric: "Linen", pattern: "Solid", colors: ["Orange"], tags: ["accessories", "trending"] },
  { name: "Modern Crossbody Bag", category: "handbags", price: 1230, originalPrice: 1772, rating: 4.8, reviewCount: 3234, fabric: "Silk", pattern: "Solid", colors: ["Teal"], tags: ["accessories", "trending"] },
  { name: "Luxury Satchel", category: "handbags", price: 1812, originalPrice: 2487, rating: 4.4, reviewCount: 3983, fabric: "Velvet", pattern: "Solid", colors: ["Yellow"], tags: ["accessories", "trending"] },
  { name: "Casual Clutch", category: "handbags", price: 739, originalPrice: 2431, rating: 4.6, reviewCount: 2259, fabric: "Polyester", pattern: "Solid", colors: ["Black"], tags: ["accessories", "trending"] },
  { name: "Chic Satchel", category: "handbags", price: 1466, originalPrice: 2711, rating: 4.1, reviewCount: 1226, fabric: "Silk", pattern: "Solid", colors: ["Silver"], tags: ["accessories", "trending"] },
  { name: "Festive Satchel", category: "handbags", price: 876, originalPrice: 1728, rating: 4.2, reviewCount: 4575, fabric: "Georgette", pattern: "Solid", colors: ["Maroon"], tags: ["accessories", "trending"] },
  { name: "Luxury Shoulder Bag", category: "handbags", price: 805, originalPrice: 1643, rating: 4.5, reviewCount: 2344, fabric: "Chiffon", pattern: "Solid", colors: ["Blue"], tags: ["accessories", "trending"] },
  { name: "Elegant Shoulder Bag", category: "handbags", price: 721, originalPrice: 1362, rating: 4.5, reviewCount: 3532, fabric: "Polyester", pattern: "Solid", colors: ["Purple"], tags: ["accessories", "trending"] },
  { name: "Festive Tote Bag", category: "handbags", price: 2297, originalPrice: 3256, rating: 4.8, reviewCount: 1154, fabric: "Linen", pattern: "Solid", colors: ["White"], tags: ["accessories", "trending"] },
  { name: "Luxury Serum", category: "beauty", price: 1121, originalPrice: 2667, rating: 4.5, reviewCount: 4847, fabric: "Velvet", pattern: "Solid", colors: ["Pink"], tags: ["beauty", "deals"] },
  { name: "Premium Serum", category: "beauty", price: 1966, originalPrice: 2991, rating: 5.0, reviewCount: 272, fabric: "Velvet", pattern: "Solid", colors: ["Silver"], tags: ["beauty", "deals"] },
  { name: "Luxury Eyeliner", category: "beauty", price: 2181, originalPrice: 3162, rating: 4.4, reviewCount: 4163, fabric: "Velvet", pattern: "Solid", colors: ["Green"], tags: ["beauty", "deals"] },
  { name: "Elegant Moisturizer", category: "beauty", price: 669, originalPrice: 2442, rating: 4.2, reviewCount: 2442, fabric: "Velvet", pattern: "Solid", colors: ["Pink"], tags: ["beauty", "deals"] },
  { name: "Festive Compact", category: "beauty", price: 1987, originalPrice: 3686, rating: 4.5, reviewCount: 2993, fabric: "Linen", pattern: "Solid", colors: ["Purple"], tags: ["beauty", "deals"] },
  { name: "Luxury Kajal", category: "beauty", price: 1898, originalPrice: 2674, rating: 4.8, reviewCount: 1276, fabric: "Silk", pattern: "Solid", colors: ["Maroon"], tags: ["beauty", "deals"] },
  { name: "Classic Compact", category: "beauty", price: 1644, originalPrice: 2641, rating: 4.7, reviewCount: 2214, fabric: "Georgette", pattern: "Solid", colors: ["Blue"], tags: ["beauty", "deals"] },
  { name: "Premium Makeup Kit", category: "beauty", price: 2038, originalPrice: 3177, rating: 4.2, reviewCount: 3795, fabric: "Velvet", pattern: "Solid", colors: ["Teal"], tags: ["beauty", "deals"] },
  { name: "Casual Serum", category: "beauty", price: 2009, originalPrice: 3449, rating: 4.1, reviewCount: 4808, fabric: "Polyester", pattern: "Solid", colors: ["Maroon"], tags: ["beauty", "deals"] },
  { name: "Modern Serum", category: "beauty", price: 1332, originalPrice: 3064, rating: 4.7, reviewCount: 3526, fabric: "Silk", pattern: "Solid", colors: ["Gold"], tags: ["beauty", "deals"] },
  { name: "Classic Moisturizer", category: "beauty", price: 1348, originalPrice: 2897, rating: 4.3, reviewCount: 1962, fabric: "Denim", pattern: "Solid", colors: ["Purple"], tags: ["beauty", "deals"] },
  { name: "Elegant Serum", category: "beauty", price: 377, originalPrice: 2017, rating: 4.2, reviewCount: 4461, fabric: "Rayon", pattern: "Solid", colors: ["Purple"], tags: ["beauty", "deals"] },
  { name: "Minimalist Lipstick", category: "beauty", price: 862, originalPrice: 2034, rating: 4.2, reviewCount: 707, fabric: "Linen", pattern: "Solid", colors: ["Gold"], tags: ["beauty", "deals"] },
  { name: "Festive Kajal", category: "beauty", price: 2212, originalPrice: 2753, rating: 4.1, reviewCount: 135, fabric: "Linen", pattern: "Solid", colors: ["Purple"], tags: ["beauty", "deals"] },
  { name: "Casual Makeup Kit", category: "beauty", price: 681, originalPrice: 1400, rating: 4.7, reviewCount: 4033, fabric: "Velvet", pattern: "Solid", colors: ["Purple"], tags: ["beauty", "deals"] },
  { name: "Premium Lipstick", category: "beauty", price: 1497, originalPrice: 2801, rating: 4.1, reviewCount: 3860, fabric: "Polyester", pattern: "Solid", colors: ["White"], tags: ["beauty", "deals"] },
  { name: "Casual Lipstick", category: "beauty", price: 1488, originalPrice: 3328, rating: 4.8, reviewCount: 1069, fabric: "Rayon", pattern: "Solid", colors: ["Silver"], tags: ["beauty", "deals"] },
  { name: "Chic Kajal", category: "beauty", price: 713, originalPrice: 1452, rating: 4.3, reviewCount: 406, fabric: "Silk", pattern: "Solid", colors: ["Teal"], tags: ["beauty", "deals"] },
  { name: "Minimalist Compact", category: "beauty", price: 1937, originalPrice: 3793, rating: 4.2, reviewCount: 3550, fabric: "Linen", pattern: "Solid", colors: ["Gold"], tags: ["beauty", "deals"] },
  { name: "Modern Moisturizer", category: "beauty", price: 386, originalPrice: 2219, rating: 4.5, reviewCount: 1980, fabric: "Velvet", pattern: "Solid", colors: ["Yellow"], tags: ["beauty", "deals"] },
  { name: "Luxury Compact", category: "beauty", price: 1565, originalPrice: 2716, rating: 4.9, reviewCount: 543, fabric: "Chiffon", pattern: "Solid", colors: ["Green"], tags: ["beauty", "deals"] },
  { name: "Festive Serum", category: "beauty", price: 1389, originalPrice: 2719, rating: 4.4, reviewCount: 1606, fabric: "Linen", pattern: "Solid", colors: ["Gold"], tags: ["beauty", "deals"] },
  { name: "Classic Lipstick", category: "beauty", price: 2138, originalPrice: 2880, rating: 4.6, reviewCount: 1313, fabric: "Polyester", pattern: "Solid", colors: ["Black"], tags: ["beauty", "deals"] },
  { name: "Vibrant Lipstick", category: "beauty", price: 1474, originalPrice: 2238, rating: 4.0, reviewCount: 2245, fabric: "Chiffon", pattern: "Solid", colors: ["Black"], tags: ["beauty", "deals"] },
  { name: "Premium Compact", category: "beauty", price: 367, originalPrice: 1991, rating: 4.1, reviewCount: 2100, fabric: "Chiffon", pattern: "Solid", colors: ["Teal"], tags: ["beauty", "deals"] },
  { name: "Festive Eyeliner", category: "beauty", price: 1037, originalPrice: 2302, rating: 4.1, reviewCount: 158, fabric: "Chiffon", pattern: "Solid", colors: ["Green"], tags: ["beauty", "deals"] },
  { name: "Chic Moisturizer", category: "beauty", price: 1802, originalPrice: 3121, rating: 4.8, reviewCount: 4072, fabric: "Rayon", pattern: "Solid", colors: ["Maroon"], tags: ["beauty", "deals"] },
  { name: "Trendy Serum", category: "beauty", price: 1874, originalPrice: 3810, rating: 4.4, reviewCount: 4933, fabric: "Velvet", pattern: "Solid", colors: ["Purple"], tags: ["beauty", "deals"] },
  { name: "Elegant Kajal", category: "beauty", price: 1441, originalPrice: 3256, rating: 4.9, reviewCount: 3291, fabric: "Georgette", pattern: "Solid", colors: ["Gold"], tags: ["beauty", "deals"] },
  { name: "Designer Serum", category: "beauty", price: 1936, originalPrice: 3790, rating: 4.1, reviewCount: 3170, fabric: "Chiffon", pattern: "Solid", colors: ["Blue"], tags: ["beauty", "deals"] },
  { name: "Trendy Makeup Kit", category: "beauty", price: 1609, originalPrice: 3127, rating: 4.4, reviewCount: 171, fabric: "Rayon", pattern: "Solid", colors: ["Orange"], tags: ["beauty", "deals"] },
  { name: "Vibrant Makeup Kit", category: "beauty", price: 914, originalPrice: 2859, rating: 4.1, reviewCount: 1334, fabric: "Denim", pattern: "Solid", colors: ["White"], tags: ["beauty", "deals"] },
  { name: "Elegant Compact", category: "beauty", price: 2198, originalPrice: 3099, rating: 4.1, reviewCount: 193, fabric: "Velvet", pattern: "Solid", colors: ["Pink"], tags: ["beauty", "deals"] },
  { name: "Designer Foundation", category: "beauty", price: 1689, originalPrice: 2824, rating: 4.0, reviewCount: 389, fabric: "Velvet", pattern: "Solid", colors: ["Maroon"], tags: ["beauty", "deals"] },
  { name: "Trendy Foundation", category: "beauty", price: 2273, originalPrice: 3825, rating: 4.7, reviewCount: 2557, fabric: "Polyester", pattern: "Solid", colors: ["Black"], tags: ["beauty", "deals"] },
  { name: "Classic Festive Set", category: "kids", price: 531, originalPrice: 2100, rating: 4.7, reviewCount: 807, fabric: "Cotton", pattern: "Solid", colors: ["Pink"], group: "kids", tags: ["kids", "festive"] },
  { name: "Trendy Boys Sherwani", category: "kids", price: 791, originalPrice: 1505, rating: 4.5, reviewCount: 590, fabric: "Chiffon", pattern: "Solid", colors: ["Black"], group: "kids", tags: ["kids", "festive"] },
  { name: "Minimalist Girls Anarkali", category: "kids", price: 2145, originalPrice: 3181, rating: 4.1, reviewCount: 3842, fabric: "Cotton", pattern: "Solid", colors: ["White"], group: "kids", tags: ["kids", "festive"] },
  { name: "Vibrant Boys Sherwani", category: "kids", price: 1263, originalPrice: 2778, rating: 4.5, reviewCount: 3605, fabric: "Georgette", pattern: "Solid", colors: ["White"], group: "kids", tags: ["kids", "festive"] },
  { name: "Chic Kids Dress", category: "kids", price: 528, originalPrice: 2207, rating: 4.9, reviewCount: 415, fabric: "Velvet", pattern: "Solid", colors: ["Silver"], group: "kids", tags: ["kids", "festive"] },
  { name: "Luxury Kids Dress", category: "kids", price: 568, originalPrice: 2121, rating: 4.9, reviewCount: 2653, fabric: "Silk", pattern: "Solid", colors: ["Maroon"], group: "kids", tags: ["kids", "festive"] },
  { name: "Designer Boys Sherwani", category: "kids", price: 584, originalPrice: 1621, rating: 4.2, reviewCount: 4093, fabric: "Silk", pattern: "Solid", colors: ["Blue"], group: "kids", tags: ["kids", "festive"] },
  { name: "Modern Kids Dress", category: "kids", price: 966, originalPrice: 2364, rating: 4.3, reviewCount: 346, fabric: "Silk", pattern: "Solid", colors: ["Orange"], group: "kids", tags: ["kids", "festive"] },
  { name: "Luxury Boys Sherwani", category: "kids", price: 1487, originalPrice: 2746, rating: 4.6, reviewCount: 4647, fabric: "Silk", pattern: "Solid", colors: ["Teal"], group: "kids", tags: ["kids", "festive"] },
  { name: "Elegant Boys Kurta Set", category: "kids", price: 1161, originalPrice: 2019, rating: 4.9, reviewCount: 663, fabric: "Cotton", pattern: "Solid", colors: ["Silver"], group: "kids", tags: ["kids", "festive"] },
  { name: "Vibrant Kids Dress", category: "kids", price: 1020, originalPrice: 2618, rating: 4.6, reviewCount: 4129, fabric: "Cotton", pattern: "Solid", colors: ["Green"], group: "kids", tags: ["kids", "festive"] },
  { name: "Casual Girls Lehenga", category: "kids", price: 396, originalPrice: 1950, rating: 4.6, reviewCount: 2486, fabric: "Denim", pattern: "Solid", colors: ["Maroon"], group: "kids", tags: ["kids", "festive"] },
  { name: "Premium Boys Kurta Set", category: "kids", price: 1794, originalPrice: 3025, rating: 4.8, reviewCount: 3907, fabric: "Polyester", pattern: "Solid", colors: ["Red"], group: "kids", tags: ["kids", "festive"] },
  { name: "Classic Girls Anarkali", category: "kids", price: 2011, originalPrice: 3234, rating: 4.7, reviewCount: 1133, fabric: "Georgette", pattern: "Solid", colors: ["Teal"], group: "kids", tags: ["kids", "festive"] },
  { name: "Elegant Kids Dress", category: "kids", price: 616, originalPrice: 2548, rating: 4.5, reviewCount: 4604, fabric: "Georgette", pattern: "Solid", colors: ["Silver"], group: "kids", tags: ["kids", "festive"] },
  { name: "Festive Boys Kurta Set", category: "kids", price: 1618, originalPrice: 3166, rating: 4.2, reviewCount: 2278, fabric: "Polyester", pattern: "Solid", colors: ["Pink"], group: "kids", tags: ["kids", "festive"] },
  { name: "Minimalist Festive Set", category: "kids", price: 511, originalPrice: 2354, rating: 4.8, reviewCount: 3713, fabric: "Velvet", pattern: "Solid", colors: ["Purple"], group: "kids", tags: ["kids", "festive"] },
  { name: "Elegant Festive Set", category: "kids", price: 1306, originalPrice: 2772, rating: 4.1, reviewCount: 789, fabric: "Cotton", pattern: "Solid", colors: ["Black"], group: "kids", tags: ["kids", "festive"] },
  { name: "Trendy Girls Anarkali", category: "kids", price: 1720, originalPrice: 3184, rating: 4.9, reviewCount: 3132, fabric: "Cotton", pattern: "Solid", colors: ["Silver"], group: "kids", tags: ["kids", "festive"] },
  { name: "Festive Girls Lehenga", category: "kids", price: 2051, originalPrice: 3261, rating: 4.9, reviewCount: 3732, fabric: "Rayon", pattern: "Solid", colors: ["Orange"], group: "kids", tags: ["kids", "festive"] },
  { name: "Premium Kids Dress", category: "kids", price: 892, originalPrice: 2119, rating: 5.0, reviewCount: 359, fabric: "Cotton", pattern: "Solid", colors: ["Purple"], group: "kids", tags: ["kids", "festive"] },
  { name: "Premium Girls Anarkali", category: "kids", price: 815, originalPrice: 2615, rating: 4.1, reviewCount: 4943, fabric: "Rayon", pattern: "Solid", colors: ["Yellow"], group: "kids", tags: ["kids", "festive"] },
  { name: "Vibrant Girls Lehenga", category: "kids", price: 581, originalPrice: 2336, rating: 4.1, reviewCount: 2736, fabric: "Linen", pattern: "Solid", colors: ["Black"], group: "kids", tags: ["kids", "festive"] },
  { name: "Chic Festive Set", category: "kids", price: 904, originalPrice: 2660, rating: 4.4, reviewCount: 402, fabric: "Denim", pattern: "Solid", colors: ["Red"], group: "kids", tags: ["kids", "festive"] },
  { name: "Trendy Girls Lehenga", category: "kids", price: 784, originalPrice: 2492, rating: 4.6, reviewCount: 915, fabric: "Georgette", pattern: "Solid", colors: ["Maroon"], group: "kids", tags: ["kids", "festive"] },
  { name: "Vibrant Girls Anarkali", category: "kids", price: 1012, originalPrice: 1787, rating: 4.3, reviewCount: 885, fabric: "Silk", pattern: "Solid", colors: ["Teal"], group: "kids", tags: ["kids", "festive"] },
  { name: "Minimalist Kids Dress", category: "kids", price: 1914, originalPrice: 3185, rating: 4.6, reviewCount: 4856, fabric: "Polyester", pattern: "Solid", colors: ["Teal"], group: "kids", tags: ["kids", "festive"] },
  { name: "Casual Festive Set", category: "kids", price: 852, originalPrice: 2521, rating: 4.2, reviewCount: 1159, fabric: "Polyester", pattern: "Solid", colors: ["Red"], group: "kids", tags: ["kids", "festive"] },
  { name: "Elegant Boys Sherwani", category: "kids", price: 926, originalPrice: 2079, rating: 4.9, reviewCount: 507, fabric: "Linen", pattern: "Solid", colors: ["Blue"], group: "kids", tags: ["kids", "festive"] },
  { name: "Modern Girls Lehenga", category: "kids", price: 415, originalPrice: 1759, rating: 4.7, reviewCount: 3830, fabric: "Denim", pattern: "Solid", colors: ["Silver"], group: "kids", tags: ["kids", "festive"] },
  { name: "Designer Boys Kurta Set", category: "kids", price: 830, originalPrice: 1782, rating: 4.8, reviewCount: 746, fabric: "Velvet", pattern: "Solid", colors: ["Orange"], group: "kids", tags: ["kids", "festive"] },
  { name: "Minimalist Boys Sherwani", category: "kids", price: 652, originalPrice: 1541, rating: 4.9, reviewCount: 4679, fabric: "Cotton", pattern: "Solid", colors: ["Pink"], group: "kids", tags: ["kids", "festive"] },
  { name: "Premium Boys Sherwani", category: "kids", price: 614, originalPrice: 1417, rating: 4.5, reviewCount: 1502, fabric: "Velvet", pattern: "Solid", colors: ["White"], group: "kids", tags: ["kids", "festive"] },
  { name: "Luxury Girls Lehenga", category: "kids", price: 2152, originalPrice: 2971, rating: 4.4, reviewCount: 4365, fabric: "Linen", pattern: "Solid", colors: ["Teal"], group: "kids", tags: ["kids", "festive"] },
  { name: "Luxury Girls Anarkali", category: "kids", price: 1424, originalPrice: 2066, rating: 4.5, reviewCount: 3421, fabric: "Georgette", pattern: "Solid", colors: ["Orange"], group: "kids", tags: ["kids", "festive"] },
  { name: "Classic Boys Kurta Set", category: "kids", price: 1823, originalPrice: 3030, rating: 4.2, reviewCount: 4906, fabric: "Rayon", pattern: "Solid", colors: ["Red"], group: "kids", tags: ["kids", "festive"] },
  { name: "Chic Girls Anarkali", category: "kids", price: 477, originalPrice: 1278, rating: 4.7, reviewCount: 1428, fabric: "Chiffon", pattern: "Solid", colors: ["Yellow"], group: "kids", tags: ["kids", "festive"] },
];

const sizesFor = (category: string) => {
  if (category === "footwear") return SHOE;
  if (["jewellery", "handbags", "beauty"].includes(category)) return FREE;
  if (category === "kids") return ["2-3Y", "4-5Y", "6-7Y", "8-9Y"];
  return APPAREL;
};

const imageFor = (seed: Seed) => {
  if (seed.name === "Elegant Silk Saree") return "https://wholetex.sgp1.cdn.digitaloceanspaces.com/full/fancy-banarasi-soft-silk-sarees-4506-832.jpg";
  if (seed.name === "Minimalist Georgette Saree") return "https://www.lovesummer.in/cdn/shop/products/green-ambar-scallop-georgette-saree-embroidered-blouse.jpg?v=1749895495";

  if (seed.name === "Casual Cotton Saree") return "https://cdn.sareeka.com/image/data2023/cotton-printed-casual-saree-258715.jpg";
  if (seed.name === "Luxury Cotton Saree") return "https://assets0.mirraw.com/images/12657782/image_zoom.jpeg?1720170906";
  if (seed.name === "Elegant Georgette Saree") return "https://assets0.mirraw.com/images/13376716/image_zoom.jpeg";
  if (seed.name === "Luxury Silk Saree") return "https://wholetex.sgp1.cdn.digitaloceanspaces.com/full/soft-tissue-banarasi-silk-designer-fancy-saree-681.jpg";
  if (seed.name === "Vibrant Banarasi Saree") return "https://aashnaheritage.com/cdn/shop/files/41_5_11zon.jpg?v=1750337724";

  if (seed.name === "Premium Georgette Saree" && seed.price === 1995) return "https://www.anantexports.in/cdn/shop/files/IMG-20251009-WA0051.jpg?v=1774840704";
  if (seed.name === "Festive Silk Saree" && seed.price === 479) return "https://gunjfashion.com/cdn/shop/files/OM-PINK.jpg?v=1775123348";
  if (seed.name === "Minimalist Silk Saree" && seed.price === 1108) return "https://peachmode.com/cdn/shop/files/1776404997908-workbench-1776404997908.jpg?v=1776424187&width=1024";

  if (seed.name === "Vibrant Kanjivaram Saree" && seed.price === 2039) return "https://keyasethexclusive.com/cdn/shop/files/RKS_3664.jpg?v=1782289664";
  if (seed.name === "Vibrant Cotton Saree" && seed.price === 848) return "https://minufashion.com/cdn/shop/files/free-mf-saregama05-07-minu-fashions-no-blouse-original-imahmhp2vfcrkm9u_9a283d82-ea31-4977-92c8-1c57dcd9f092.jpg?v=1778683300";
  if (seed.name === "Vibrant Silk Saree" && seed.price === 1199) return "https://clothsvilla.com/cdn/shop/files/digital-print-varsha-1091-00-un-stitched-regular-pure-silk-digitally-printed-saree-weaved-with-golden-zari-comes-with-tassels-33401727418404_7ca430a0-5732-45ad-b351-2e74999b919b.jpg?v=1748434772";
  if (seed.name === "Minimalist Saree" && seed.price === 1499) return "https://www.kiransboutique.com/wp-content/uploads/2021/12/1734788765324_Sophisticated-Charcoal-Grey-Linen-Saree-with-Silver-Highlights.jpeg";
  if (seed.name === "Elegant Silk Saree" && seed.price === 1784) return "https://rushini.in/cdn/shop/files/2992S2672_1.jpg?v=1690444494";

  if (seed.name === "Casual Silk Saree" && seed.price === 1478) return "https://madrassarees.com/cdn/shop/files/ananya_stripes_mangalore_silk.webp?v=1786619807";
  if (seed.name === "Designer Saree" && seed.price === 532) return "https://media.samyakk.in/pub/media/catalog/product/g/o/gold-dori-embroidered-tissue-organza-designer-saree-with-contrast-readymade-blouse-sr27785.jpg";
  if (seed.name === "Daily Wear Cotton Saree" && seed.price === 449) return "https://static.cilory.com/737999-large_default/purple-ikkat-printed-daily-wear-cotton-saree.jpg";
  if (seed.name === "Designer Silk Saree" && seed.price === 1684) return "https://rushini.in/cdn/shop/files/1_8bc903cf-eadf-4926-b9ab-6f55fcd99329.jpg?v=1690039502";

  if (seed.name === "Luxury Silk Saree" && seed.price === 1498) return "https://varanga.in/cdn/shop/files/1_12a92ed4-6569-46b8-b5d8-65774cae53b0_grande.jpg?v=1777294692";
  if (seed.name === "Elegant Banarasi Saree" && seed.price === 1522) return "https://peachmode.com/cdn/shop/files/1_PRNK-29395-MUSTARD-PEACHMODE.jpg?v=1747812950&width=1024";
  if (seed.name === "Luxury Silk Saree" && seed.price === 1786) return "https://www.royalexport.in/product-img/woven-designer-silk-saree-in-t-1752648151.jpg";
  if (seed.name === "Designer Georgette Saree" && seed.price === 1709) return "https://www.anitadongre.com/dw/image/v2/BGCX_PRD/on/demandware.static/-/Sites-masterCatalog_AD_India/default/dwe21429e0/images/hires/F24/Women/F24RN33_Blue_1.jpg?sw=1400&sh=2100&sm=fit&strip=false";
  if (seed.name === "Designer Saree" && seed.price === 2091) return "https://static.cilory.com/882796-large_default/purple-crepe-satin-silk-designer-saree.jpg";
  if (seed.name === "Trendy Banarasi Saree") return "https://bombayselections.in/cdn/shop/files/RTGY.jpg?v=1766557761";

  if (seed.name === "Chic Saree") return "https://rangraze.in/cdn/shop/articles/7_Stylish_Saree_Draping_Ideas_Based_on_Occasion_and_Saree_Type.png?v=1747042727";
  if (seed.name === "Classic Silk Saree") return "https://cdn.shopify.com/s/files/1/0471/1333/9031/files/3-july_ZB12284_0de0ec25-bdbf-48b2-b70f-94181e396652.jpg?v=1630164057";
  if (seed.name === "Chic Silk Saree") return "https://photos.vardanethnic.in/media/2025/05/Maahi-178-Traditional-Wear-Stylish-Silk-Saree-Collection-2.jpg";
  if (seed.name === "Classic Georgette Saree") return "https://taruntahiliani.com/cdn/shop/files/TT26Aug47581_49d81b08-97c5-4ddc-9a74-e753f6feb30f.jpg?v=1760167097";
  if (seed.name === "Chic Banarasi Saree") return "https://img.faballey.com/alleygal/images/post/97e07aa3-f1cf-4689-906f-027394e4fce8.png";
  if (seed.name === "Luxury Georgette Saree") return "https://littlewish.in/wp-content/uploads/2023/10/Black-1.jpg";
  if (seed.name === "Georgette Floral Saree") return "https://img.perniaspopupshop.com/catalog/product/l/p/lpkc032437_1.jpg";
  if (seed.name === "Minimalist Banarasi Saree") return "https://clothsvilla.com/cdn/shop/products/Almaari-243-Beige_1.jpg?v=1743001603";
  if (seed.name === "Embroidered Silk Blend Saree") return "https://cdn.shopify.com/s/files/1/0341/4805/7228/files/blue-embroidered-silk-blend-saree-with-unstitched-blouse-piece-97620p_b553379d-e6a1-4b84-a678-49949a7954ef.jpg?v=1770122456";
  if (seed.name === "Vibrant Cotton Saree") return "https://shobitam.in/cdn/shop/files/DSC01071.webp?v=1765790340";
  if (seed.name === "Elegant Saree") return "https://www.vastranand.in/cdn/shop/files/1_934cd994-5ef7-4a0c-9e50-40911ba48965.jpg?v=1743081227&width=1200";
  if (seed.name === "Festive Silk Saree") return "https://trendia.co/cdn/shop/files/BUVDA-1006.jpg?v=1727941009";
  if (seed.name === "Casual Banarasi Saree") return "https://www.exoticindiaart.com/images/products/original/textiles-07-2024/gaj128-lightseagreen.webp";
  if (seed.name === "Banarasi Woven Saree") return "https://sudathi.com/cdn/shop/files/70354S103_6.jpg?v=1785918746";
  if (seed.name === "Casual Saree") return "https://ik.imagekit.io/ldqsn9vvwgg/images/1958670.jpg";
  if (seed.name === "Modern Georgette Saree") return "https://peachmode.com/cdn/shop/files/1_NTPR-4047-MAUVE-PEACHMODE.jpg?v=1750249493&width=1024";
  if (seed.name === "Premium Cotton Saree") return "https://www.theblockart.com/ImageStorage/thumbs/BA20251224018.jpeg";

  if (seed.name === "Bohemian Maroon Cotton Anarkali Kurti") return "https://www.neerus.com/cdn/shop/products/4695a1469maroon-1.jpg?v=1755194711";
  if (seed.name === "Modern Charcoal Grey Silk A-Line Kurti") return "https://www.libas.in/cdn/shop/files/grey-embroidered-silk-straight-kurta-libas-1-27531241062550.jpg?v=1756120389";
  if (seed.name === "Regal Sapphire Blue Velvet Kurti") return "https://www.uzhamagal.in/cdn/shop/files/E16E14EF-B5EA-47C3-8FAA-C0D8D0F7E0C6.jpg?v=1751378013";
  if (seed.name === "Classic Olive Green Velvet A-Line Kurti") return "https://www.shauryasanadhya.com/cdn/shop/products/DSC6926.jpg?v=1745482268";

  if (seed.name === "Printed A-Line Kurti") return "https://assets.myntassets.com/h_200,w_200,c_fill,g_auto/h_1440,q_75,w_1080/v1/assets/images/28970868/2024/4/16/8f946c15-bf74-4716-881e-b2b83513ac271713275275995FASHORWomenFloralPrintedFlaredSleevesThreadWorkKurta1.jpg";
  if (seed.name === "Minimalist Charcoal Grey Rayon Kurti") return "https://www.jiomart.com/p/fashion/soch-womens-charcoal-rayon-embroidered-kurta-with-mirror-work/604364468";
  if (seed.name === "Luxurious Teal Linen Anarkali Kurti") return "https://instore.co.in/cdn/shop/files/Gemini_Generated_Image_iekwd4iekwd4iekw.jpg?v=1769252224&width=2563";
  if (seed.name === "Minimalist Ruby Red Cotton Anarkali Kurti") return "https://images.unsplash.com/photo-xRZTgTRbvG8";
  if (seed.name === "Elegant Ivory White Organza A-Line Kurti") return "https://images.unsplash.com/photo-Yci8aYzkjpk";
  if (seed.name === "Classic Olive Green Georgette Straight Kurti") return "https://d1311wbk6unapo.cloudfront.net/NushopCatalogue/tr:f-webp,w-600,fo-auto/6819e142ee263e50e7ed4e79/cat_img/LE0BE394_OGREEN_1763120283593_53ep977wgvn70fz.jpg";
  if (seed.name === "Modern Mint Green Satin Kurti") return "https://images.unsplash.com/photo-4vKwpPnLs7E";
  if (seed.name === "Chic Teal Crepe Anarkali Kurti") return "https://assets.myntassets.com/h_200,w_200,c_fill,g_auto/h_1440,q_75,w_1080/v1/assets/images/20176482/2022/9/26/2a0b0e30-dbdf-47cf-a3a9-32a5bbcd9c6f1664201956218FIORRAWomensSeaGreenPolyCrepeKurtawithDupattaAndBelt6.jpg";
  if (seed.name === "Opulent Ivory White Organza A-Line Kurti") return "https://images.unsplash.com/photo-BnYctNPLV20";
  if (seed.name === "Graceful Peach Linen Straight Kurti") return "https://saadaa.in/cdn/shop/files/7_29524851-e455-49b6-9d50-4a91a791eb9f.webp?v=1762578966&width=1350";

  if (seed.name === "Modern Floral Lehenga") return "https://img2.ogaanindia.com/pub/media/catalog/product/cache/70fdb22216a43835b5ce5fc582b2e527/s/c/sc25851.jpg";
  if (seed.name === "Minimalist Bridal Lehenga") return "https://blog.falgunishanepeacock.in/wp-content/uploads/2025/05/ELLISON-BRIDAL-LEHENGA-SET-1-scaled.jpg";
  if (seed.name === "Festive Lehenga Choli") return "http://clothsvilla.com/cdn/shop/files/dark-maroon-silk-festive-lehenga-choli_2.jpg?v=1778656274";
  if (seed.name === "Designer Designer Lehenga") return "https://wholetex.sgp1.cdn.digitaloceanspaces.com/full/anamika-vol-44-silk-designer-lehenga-choli-928.jpg";

  if (seed.name === "Designer Lehenga") return "https://4.imimg.com/data4/LN/RB/ANDROID-48003370/product-500x500.jpeg";
  if (seed.name === "Pink Casual Lehenga Choli") return "https://cdn.sareeka.com/image/data2023/pink-casual-lehenga-choli-267872.jpg";
  if (seed.name === "Maroon Bridal Lehenga") return "https://i0.wp.com/www.womansplaza.com/wp-content/uploads/2024/08/RAJVEER-PHOTOGRAPHY-2448-scaled.jpg";
  if (seed.name === "Lehenga Co-Ord Set") return "http://www.graciousyou.com/cdn/shop/files/rn-image_picker_lib_temp_dbc289a6-2f15-4b53-b1a9-da3d7492c6db.jpg?v=1742535317";
  if (seed.name === "Floral Designer Lehenga") return "https://i.pinimg.com/736x/5b/8f/e2/5b8fe21edfb429faa51932e69aad712b.jpg";

  if (seed.name === "Casual Designer Lehenga") return "https://assets0.mirraw.com/images/10846033/STARFLOWER_1_long_webp.webp";
  if (seed.name === "Alia Style Georgette Lehenga") return "https://www.anantexports.in/cdn/shop/files/IMG-20240120-WA0116.jpg";
  if (seed.name === "Scarlet Red Wedding Lehenga Choli") return "https://i0.wp.com/www.womansplaza.com/wp-content/uploads/2024/08/scarlet-red-wedding-lehenga-choli.webp";
  if (seed.name === "Designer Flower Printed Embroidery Lehenga Choli") return "https://assets0.mirraw.com/images/12688134/VD3-355_(1)_zoom.jpeg";

  if (seed.name === "Vibrant Festive Lehenga") return "https://mangaldeep.co.in/cdn/shop/files/ACA2410.jpg";
  if (seed.name === "Classic Lehenga Choli") return "https://roopkala.net/cdn/shop/files/classic-ivory-bridal-lehenga-with-unstitched-blouse-fabric-RKMLAA1203SS_1.jpg";
  if (seed.name === "Modern Festive Lehenga") return "https://www.vasangini.com/wp-content/uploads/2026/03/Luxury-Wedding-Wear-Lehenga-Choli-Shrug-Dupatta-with-Rich-Embroidery-Layered-Flair-Design.webp";
  if (seed.name === "Trendy Designer Lehenga") return "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; // Fallback HD image due to Amazon anti-bot
  if (seed.name === "Chic Designer Lehenga") return "https://cdn.sareeka.com/image/data2020/lavender-thread-trendy-designer-lehenga-choli-156015.jpg";
  if (seed.name === "Classic Designer Lehenga") return "https://www.kalkifashion.com/cdn/shop/files/red-silk-bridal-lehenga-with-heavy-sequins-and-stones-work-sg351798-1.jpg";
  if (seed.name === "Elegant Festive Lehenga") return "https://www.bullionknot.com/cdn/shop/files/varidanvan.jpg";
  if (seed.name === "Luxury Designer Lehenga") return "https://www.samyakk.com/blog/wp-content/uploads/2024/09/Designer-Bridal-Lehenga.jpg";
  if (seed.name === "Maroon Bridal Lehenga") return "https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; // HD placeholder image for instagram
  if (seed.name === "Minimalist Lehenga Choli") return "https://g3fashion.com/cdn/shop/articles/Latest-2025-Trends-in-Lehenga-Choli-Designs.jpg?crop=center&height=1200&v=1787137318&width=1200";
  if (seed.name === "Casual Festive Lehenga") return "https://www.trendbuy.co.in/cdn/shop/files/cotton-lehenga-choli-for-women-festive-casual-wear-main_1200x1200.jpg?v=1767614740";
  if (seed.name === "Modern Lehenga Choli") return "https://lotuslehengacholi.com/wp-content/uploads/2024/04/simple-lehenga-choli-for-women-embroidery-work-3.jpg";

  if (seed.name === "Classic Floral Lehenga") return "https://in.kalkifashion.com/cdn/shop/files/pink-floral-printed-lehenga-with-dupatta-sg388645-1_66383da4-4642-470d-a121-dd815826af11.jpg";
  if (seed.name === "Trendy Floral Lehenga") return "https://www.trendbuy.co.in/cdn/shop/files/trendbuy-floral-print-georgette-lehenga-choli-set-for-festive-occasions-main_1200x1200.jpg";
  if (seed.name === "Festive Designer Lehenga") return "https://bawreefashions.com/cdn/shop/files/IMG_7987_9d423ac0-d76c-49f5-8ae9-0493fbbd6703.jpg";
  if (seed.name === "Casual Festive Lehenga") return "https://wholesuits.com/wp-content/uploads/2024/08/Stylist-Blue-Color-Georgette-Sequence-Work-Lehenga-Choli-5-scaled-1.jpeg";
  if (seed.name === "Trendy Bridal Lehenga") return "https://www.shoppingworldyt.com/cdn/shop/files/rn-image_picker_lib_temp_d3d365b6-797c-4912-b754-27e81f6c2c3c.jpg";

  if (seed.name === "Luxury Floral Lehenga") return "https://cdn.shopify.com/s/files/1/0169/3243/8070/products/SG856F.jpg";
  if (seed.name === "Casual Bridal Lehenga") return "https://manyavar.scene7.com/is/image/manyavar/ULB4619VD2-416-RED1_22-07-2025-13-55";
  if (seed.name === "Vibrant Floral Lehenga") return "https://www.exoticindiaart.com/images/products/original/textiles-11-2025/gam833.webp";

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
    images: [image, image],
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
    sourceUrl: seed.sourceUrl,
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
