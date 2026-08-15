import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, ShieldCheck, RefreshCcw, BadgeIndianRupee } from "lucide-react";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { ProductGrid } from "@/components/site/ProductGrid";
import { CATEGORIES, CATEGORY_IMAGES, PRODUCTS } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MINORA — Shop Indian Fashion Online" },
      {
        name: "description",
        content:
          "Sarees, kurtis, dresses, jewellery, footwear and more. Shop trending Indian fashion on MINORA with free delivery and easy returns.",
      },
      { property: "og:title", content: "MINORA — Shop Indian Fashion Online" },
      {
        property: "og:description",
        content:
          "Everyday fashion, Indian classics and modern styles at prices you'll love.",
      },
    ],
  }),
  component: Index,
});

const priceBuckets = [
  { label: "Under ₹299", slug: "deals", image: CATEGORY_IMAGES['tops'] },
  { label: "Under ₹499", slug: "kurtis", image: CATEGORY_IMAGES['kurtis'] },
  { label: "Under ₹799", slug: "dresses", image: CATEGORY_IMAGES['dresses'] },
  { label: "Under ₹999", slug: "handbags", image: CATEGORY_IMAGES['handbags'] },
];

const promises = [
  { icon: Truck, title: "Free Delivery", copy: "On orders above ₹499" },
  { icon: RefreshCcw, title: "7-Day Returns", copy: "Easy pickup at home" },
  { icon: BadgeIndianRupee, title: "Cash on Delivery", copy: "Pay when it arrives" },
  { icon: ShieldCheck, title: "Secure Payments", copy: "100% safe checkout" },
];

function Index() {
  const trending = PRODUCTS.filter((p) => p.tags.includes("trending")).slice(0, 10);
  const newIn = [...PRODUCTS].sort((a, b) => a.createdDaysAgo - b.createdDaysAgo).slice(0, 5);

  return (
    <div className="mx-auto max-w-[1400px] px-0 sm:px-5">
      <div className="pt-0 sm:pt-4">
        <HeroCarousel />
      </div>

      <section aria-label="Shop by category" className="mt-8 px-3 sm:px-0">
        <h2 className="font-display text-xl sm:text-2xl">Shop by Category</h2>
        <ul className="no-scrollbar -mx-3 mt-4 flex gap-4 overflow-x-auto px-3 pb-2 sm:mx-0 sm:px-0">
          {CATEGORIES.map((c) => (
            <li key={c.slug} className="shrink-0">
              <Link
                to="/c/$slug"
                params={{ slug: c.slug }}
                className="group flex w-20 flex-col items-center gap-2 sm:w-24"
              >
                <span className="block h-20 w-20 overflow-hidden rounded-full border border-border bg-secondary transition-transform duration-200 group-hover:scale-105 group-hover:border-primary sm:h-24 sm:w-24">
                  <img
                    src={CATEGORY_IMAGES[c.slug]}
                    alt={c.label}
                    loading="lazy"
                    width={768}
                    height={1024}
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="text-center text-xs font-medium">{c.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Shop by price" className="mt-10 px-3 sm:px-0">
        <h2 className="font-display text-xl sm:text-2xl">Shop by Price</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {priceBuckets.map((b) => (
            <Link
              key={b.label}
              to="/c/$slug"
              params={{ slug: b.slug }}
              className="group relative overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="aspect-4/3 overflow-hidden">
                <img
                  src={b.image}
                  alt={b.label}
                  loading="lazy"
                  width={768}
                  height={1024}
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/75 to-transparent p-3">
                <span className="font-display text-base text-background sm:text-lg">{b.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section aria-label="Trending products" className="mt-10 px-3 sm:px-0">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl sm:text-2xl">Trending on MINORA</h2>
          <Link to="/c/$slug" params={{ slug: "trending" }} className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4">
          <ProductGrid products={trending} />
        </div>
      </section>

      <section aria-label="New arrivals" className="mt-10 px-3 sm:px-0">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl sm:text-2xl">Just In</h2>
          <Link to="/c/$slug" params={{ slug: "new-arrivals" }} className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4">
          <ProductGrid products={newIn} />
        </div>
      </section>

      <section aria-label="Why shop with MINORA" className="mt-12 px-3 sm:px-0">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-4 lg:grid-cols-4">
          {promises.map((p) => (
            <div key={p.title} className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                <p.icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{p.title}</span>
                <span className="block text-xs text-muted-foreground">{p.copy}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
