import { useState, useEffect } from "react";
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
  const { addToCart, isWished, toggleWishlist, isLoggedIn, openLoginModal } = useStore();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [pincode, setPincode] = useState("");
  const [zoom, setZoom] = useState(false);

  // For sticky purchase bar detection
  const [showStickyBar, setShowStickyBar] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    toast.success("Added to Bag", { description: `${product.name} · Size ${size}` });
    window.dispatchEvent(new CustomEvent("open-cart-drawer"));
  };

  const buyNow = () => {
    if (!requireSize()) return;
    addToCart(product.id, size!, 1);
    navigate({ to: "/checkout" });
  };

  const dist = [72, 18, 6, 2, 2];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <Breadcrumb
        items={[
          { label: product.group === "men" ? "Men" : product.group === "kids" ? "Kids" : "Women", to: "/c/$slug", params: { slug: product.group } },
          { label: product.categoryLabel, to: "/c/$slug", params: { slug: product.category } },
          { label: product.name },
        ]}
      />

      <div className="mt-8 gap-12 lg:flex">
        {/* Left Column: Stacked Image Gallery */}
        <div className="lg:w-[55%] space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {product.images.map((img, i) => (
              <div
                key={i}
                className="relative overflow-hidden bg-secondary/20 border border-border"
                onClick={() => setActive(i)}
              >
                <img
                  src={img}
                  alt={`${product.name} view ${i + 1}`}
                  width={768}
                  height={1024}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Dynamic Info Panel */}
        <div className="mt-8 min-w-0 flex-1 lg:mt-0 lg:sticky lg:top-28 lg:h-fit">
          <div className="space-y-4 pb-6 border-b border-border">
            <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase block">
              {product.categoryLabel}
            </span>
            <h1 className="font-display text-3xl tracking-wide leading-tight text-foreground">{product.name}</h1>
            
            <div className="flex items-center gap-3">
              <Stars rating={product.rating} size={11} />
              <span className="text-xs text-muted-foreground tracking-wider font-light">
                {product.reviewCount.toLocaleString("en-IN")} CURATED REVIEWS
              </span>
            </div>
          </div>

          <div className="py-6 border-b border-border space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold tracking-wide">{inr(product.price)}</span>
              <span className="text-sm text-muted-foreground line-through font-light">{inr(product.originalPrice)}</span>
              <span className="text-xs font-bold text-success tracking-wider">{product.discount}% OFF</span>
            </div>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Inclusive of all local taxes</p>
          </div>

          {/* Size Curator */}
          <div className="py-6 border-b border-border space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold tracking-widest uppercase">Select Size</h2>
              <button type="button" className="text-[10px] font-bold tracking-widest text-primary uppercase hover:underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={`min-w-12 border px-4 py-2.5 text-xs font-semibold tracking-wider transition-all duration-200 ${
                    size === s
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/50 text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground tracking-wide pt-1">Colours available: {product.colors.join(", ")}</p>
          </div>

          {/* Primary CTA controls */}
          <div className="py-6 border-b border-border flex flex-wrap gap-3">
            <button
              type="button"
              onClick={add}
              className="flex-1 border border-primary bg-transparent text-primary py-3.5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              ADD TO BAG
            </button>
            <button
              type="button"
              onClick={buyNow}
              className="flex-1 border border-primary bg-primary text-primary-foreground py-3.5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary/95 transition-all duration-300"
            >
              BUY NOW
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn) {
                  openLoginModal(() => {
                    toggleWishlist(product.id);
                    toast.success("Saved to wishlist");
                  });
                  return;
                }
                toggleWishlist(product.id);
                toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
              }}
              aria-label="Toggle wishlist"
              aria-pressed={wished}
              className="grid h-12 w-12 place-items-center border border-border bg-transparent text-foreground transition-all duration-300 hover:border-primary hover:text-primary"
            >
              <Heart size={16} className={wished ? "fill-primary text-primary" : ""} />
            </button>
          </div>

          {/* Pincode Checker */}
          <div className="py-6 border-b border-border space-y-3">
            <h2 className="text-xs font-bold tracking-widest uppercase">Delivery & Availability</h2>
            <div className="flex gap-2 pt-1">
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                placeholder="ENTER PINCODE"
                aria-label="Delivery pincode"
                className="w-44 border border-border bg-transparent px-4 py-2.5 text-xs tracking-widest outline-none focus:border-primary placeholder:text-muted-foreground/50"
              />
              <button
                type="button"
                onClick={() =>
                  pincode.length === 6
                    ? toast.success(`Delivery expected by ${new Date(Date.now() + 4 * 864e5).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`)
                    : toast.error("Enter a valid 6-digit pincode")
                }
                className="border border-primary bg-primary text-primary-foreground px-5 text-xs font-bold tracking-widest uppercase hover:bg-transparent hover:text-primary transition-all duration-300"
              >
                CHECK
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground tracking-wide">
              Sold by <span className="font-semibold text-foreground">{product.seller}</span>
            </p>
          </div>

          {/* Luxury Accordions */}
          <div className="mt-6 divide-y divide-border border-t border-b border-border">
            {accordion(product).map((sec) => (
              <details key={sec.title} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-xs font-bold tracking-widest uppercase text-foreground/90">
                  {sec.title}
                  <ChevronDown size={14} className="transition-transform duration-300 group-open:rotate-180 text-muted-foreground" />
                </summary>
                <p className="pb-4 text-xs font-light tracking-wide leading-relaxed text-muted-foreground">{sec.body}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Ratings & Reviews Section */}
      <section aria-label="Ratings and reviews" className="mt-20 border-t border-border pt-16">
        <h2 className="font-display text-2xl sm:text-3xl tracking-wide">Customer Reviews</h2>
        <div className="mt-8 gap-12 md:flex">
          <div className="md:w-72 space-y-4">
            <div className="flex items-end gap-2">
              <span className="font-display text-5xl font-light">{product.rating.toFixed(1)}</span>
              <span className="pb-1.5 text-xs tracking-wider text-muted-foreground uppercase">OUT OF 5 STARS</span>
            </div>
            <p className="text-xs text-muted-foreground tracking-wider font-light">
              Based on {product.reviewCount.toLocaleString("en-IN")} verified purchase reviews
            </p>
            <ul className="mt-4 space-y-2">
              {dist.map((pctv, i) => (
                <li key={i} className="flex items-center gap-3 text-[10px] font-medium tracking-wider">
                  <span className="w-8">{5 - i} ★</span>
                  <span className="h-1 flex-1 overflow-hidden bg-secondary/40">
                    <span className="block h-full bg-primary" style={{ width: `${pctv}%` }} />
                  </span>
                  <span className="w-8 text-right text-muted-foreground">{pctv}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 min-w-0 flex-1 md:mt-0 space-y-4">
            <ul className="space-y-4">
              {REVIEWS.map((r) => (
                <li key={r.name} className="border border-border p-5 bg-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Stars rating={r.rating} size={10} />
                      <span className="text-xs font-bold tracking-wide">{r.name}</span>
                    </div>
                    <span className="text-[10px] tracking-wider text-muted-foreground">{r.date}</span>
                  </div>
                  <p className="mt-3 text-xs font-light tracking-wide leading-relaxed text-muted-foreground">{r.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Similar Products */}
      {similar.length > 0 && (
        <section aria-label="Similar products" className="mt-20 border-t border-border pt-16">
          <div className="flex items-end justify-between border-b border-border pb-3">
            <h2 className="font-display text-2xl sm:text-3xl tracking-wide">You May Also Like</h2>
            <Link to="/c/$slug" params={{ slug: product.category }} className="text-xs font-bold tracking-widest text-primary uppercase hover:underline">
              View all curations &rarr;
            </Link>
          </div>
          <div className="mt-8">
            <ProductGrid products={similar} />
          </div>
        </section>
      )}

      {/* 9. Sticky Purchase Bar */}
      <div
        className={`fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-md py-3 px-5 transition-all duration-500 transform ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-[1400px] flex items-center justify-between gap-4">
          <div className="min-w-0 hidden sm:block">
            <span className="block text-[9px] font-bold tracking-wider text-muted-foreground uppercase">{product.categoryLabel}</span>
            <span className="block text-xs font-semibold text-foreground truncate max-w-xs">{product.name}</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-sm font-bold mr-3">{inr(product.price)}</span>
            <div className="flex gap-2 flex-1 sm:flex-initial">
              {product.sizes.slice(0, 3).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`px-3 py-1.5 text-[10px] font-bold border ${
                    size === s ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={add}
              className="bg-primary text-primary-foreground px-6 py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-primary/95 transition-all"
            >
              ADD TO BAG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}