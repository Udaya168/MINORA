import { useState } from "react";
import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import {
  Heart,
  Truck,
  BadgeIndianRupee,
  RefreshCcw,
  Store,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { ProductGrid } from "@/components/site/ProductGrid";
import { Stars } from "@/components/site/Stars";
import { PRODUCTS, getProduct } from "@/data/products";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [
          { title: "Product unavailable — MINORA" },
          { name: "robots", content: "noindex" },
        ],
      };
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — Buy Online on MINORA` },
        { name: "description", content: p.description.slice(0, 155) },
        { property: "og:title", content: `${p.name} — MINORA` },
        { property: "og:description", content: p.description.slice(0, 155) },
      ],
    };
  },
  component: ProductPage,
});

const accordion = (p: ReturnType<typeof getProduct>) => [
  { title: "Description", body: p!.description },
  { title: "Size & Fit", body: "Model is 5'6\" and wears size S. Regular fit, true to size. Refer to the size chart for exact measurements." },
  { title: "Material", body: `${p!.fabric}. ${p!.pattern} pattern.` },
  { title: "Care Instructions", body: "Machine wash cold with similar colours. Do not bleach. Tumble dry low. Warm iron if needed." },
  { title: "Shipping", body: "Dispatched within 24 hours. Free delivery on orders above ₹499, otherwise ₹49." },
  { title: "Returns", body: "Easy 7-day returns and exchange. Free pickup from your doorstep." },
  { title: "Seller Information", body: `Sold by ${p!.seller}. Seller rating 4.4/5 across 12,000+ orders.` },
];

const REVIEWS = [
  { name: "Priya S.", rating: 5, text: "Fabric quality is lovely and the fit is exactly as shown. Worth every rupee.", date: "12 Mar 2026" },
  { name: "Ananya K.", rating: 4, text: "Colour is slightly lighter than the photos but still beautiful. Delivery was quick.", date: "28 Feb 2026" },
  { name: "Meera R.", rating: 5, text: "Bought two. Comfortable for all-day wear and easy to maintain.", date: "07 Feb 2026" },
];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, isWished, toggleWishlist } = useStore();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [pincode, setPincode] = useState("");
  const [zoom, setZoom] = useState(false);

  const wished = isWished(product.id);
  const similar = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 5);

  const requireSize = () => {
    if (!size) {
      toast.error("Please select a size");
      return false;
    }
    return true;
  };

  const add = () => {
    if (!requireSize()) return;
    addToCart(product.id, size!, 1);
    toast.success("Added to cart", { description: `${product.name} · Size ${size}` });
  };

  const buyNow = () => {
    if (!requireSize()) return;
    addToCart(product.id, size!, 1);
    navigate({ to: "/checkout" });
  };

  const dist = [72, 18, 6, 2, 2];

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-5">
      <Breadcrumb
        items={[
          { label: product.group === "men" ? "Men" : product.group === "kids" ? "Kids" : "Women", to: "/c/$slug", params: { slug: product.group } },
          { label: product.categoryLabel, to: "/c/$slug", params: { slug: product.category } },
          { label: product.name },
        ]}
      />

      <div className="mt-4 gap-8 lg:flex">
        <div className="lg:sticky lg:top-36 lg:h-fit lg:w-[46%]">
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <ul className="no-scrollbar flex gap-2 overflow-x-auto sm:flex-col">
              {product.images.map((img, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`View image ${i + 1}`}
                    aria-current={i === active}
                    className={`h-20 w-16 overflow-hidden rounded-md border ${i === active ? "border-primary" : "border-border"}`}
                  >
                    <img src={img} alt="" loading="lazy" width={768} height={1024} className="h-full w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
            <div
              className="relative min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-secondary"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
            >
              <img
                src={product.images[active]}
                alt={product.name}
                width={768}
                height={1024}
                className={`aspect-3/4 w-full object-cover transition-transform duration-300 ${zoom ? "scale-125" : "scale-100"}`}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 min-w-0 flex-1 lg:mt-0">
          <h1 className="font-display text-xl sm:text-2xl">{product.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{product.categoryLabel}</p>

          <div className="mt-3 flex items-center gap-2">
            <Stars rating={product.rating} size={13} />
            <span className="text-sm text-muted-foreground">
              {product.reviewCount.toLocaleString("en-IN")} ratings
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-2 border-t border-border pt-4">
            <span className="text-2xl font-semibold">{inr(product.price)}</span>
            <span className="text-sm text-muted-foreground line-through">{inr(product.originalPrice)}</span>
            <span className="text-sm font-semibold text-success">{product.discount}% OFF</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

          <ul className="mt-4 flex flex-wrap gap-2 text-xs">
            <li className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-primary"><Truck size={13} /> Free Delivery</li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-primary"><BadgeIndianRupee size={13} /> Cash on Delivery Available</li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-primary"><RefreshCcw size={13} /> 7-Day Returns</li>
          </ul>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Select Size</h2>
              <button type="button" className="text-xs font-medium text-primary hover:underline">Size chart</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={`min-w-11 rounded-md border px-3 py-2 text-sm transition-colors ${size === s ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/50"}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Colours available: {product.colors.join(", ")}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={add}
              className="flex-1 rounded-md border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={buyNow}
              className="flex-1 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Buy Now
            </button>
            <button
              type="button"
              onClick={() => {
                toggleWishlist(product.id);
                toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
              }}
              aria-label="Toggle wishlist"
              aria-pressed={wished}
              className="grid h-12 w-12 place-items-center rounded-md border border-border transition-transform hover:scale-105"
            >
              <Heart size={18} className={wished ? "fill-primary text-primary" : ""} />
            </button>
          </div>

          <div className="mt-6 rounded-lg border border-border p-4">
            <h2 className="text-sm font-semibold">Delivery Options</h2>
            <div className="mt-2 flex gap-2">
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                placeholder="Enter pincode"
                aria-label="Delivery pincode"
                className="w-40 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() =>
                  pincode.length === 6
                    ? toast.success(`Delivery by ${new Date(Date.now() + 4 * 864e5).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`)
                    : toast.error("Enter a valid 6-digit pincode")
                }
                className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary"
              >
                Check
              </button>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Store size={13} /> Sold by {product.seller}
            </p>
          </div>

          <div className="mt-6 divide-y divide-border rounded-lg border border-border">
            {accordion(product).map((sec) => (
              <details key={sec.title} className="group px-4">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-medium">
                  {sec.title}
                  <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
                </summary>
                <p className="pb-4 text-sm text-muted-foreground">{sec.body}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <section aria-label="Ratings and reviews" className="mt-12">
        <h2 className="font-display text-xl">Ratings & Reviews</h2>
        <div className="mt-4 gap-8 md:flex">
          <div className="md:w-64">
            <div className="flex items-end gap-2">
              <span className="font-display text-4xl">{product.rating.toFixed(1)}</span>
              <span className="pb-1 text-sm text-muted-foreground">/ 5</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {product.reviewCount.toLocaleString("en-IN")} ratings
            </p>
            <ul className="mt-3 space-y-1.5">
              {dist.map((pctv, i) => (
                <li key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-6">{5 - i}★</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <span className="block h-full rounded-full bg-success" style={{ width: `${pctv}%` }} />
                  </span>
                  <span className="w-8 text-right text-muted-foreground">{pctv}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 min-w-0 flex-1 md:mt-0">
            <ul className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
              {product.images.slice(0, 4).map((img, i) => (
                <li key={i} className="shrink-0">
                  <img src={img} alt={`Customer photo ${i + 1}`} loading="lazy" width={768} height={1024} className="h-20 w-16 rounded-md object-cover" />
                </li>
              ))}
            </ul>
            <ul className="space-y-4">
              {REVIEWS.map((r) => (
                <li key={r.name} className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2">
                    <Stars rating={r.rating} size={11} />
                    <span className="text-sm font-medium">{r.name}</span>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section aria-label="Similar products" className="mt-12">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-xl">Similar Products</h2>
            <Link to="/c/$slug" params={{ slug: product.category }} className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4">
            <ProductGrid products={similar} />
          </div>
        </section>
      )}
    </div>
  );
}