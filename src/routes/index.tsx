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
  { label: "UNDER ₹299", slug: "deals", image: CATEGORY_IMAGES['tops'], desc: "Everyday staples & light tees" },
  { label: "UNDER ₹499", slug: "kurtis", image: CATEGORY_IMAGES['kurtis'], desc: "Classic printed everyday cottons" },
  { label: "UNDER ₹799", slug: "dresses", image: CATEGORY_IMAGES['dresses'], desc: "Elegant shifts, wraps & maxis" },
  { label: "UNDER ₹999", slug: "handbags", image: CATEGORY_IMAGES['handbags'], desc: "Premium textured vegan-leather totes" },
];

const promises = [
  { title: "FREE EXPRESS SHIPPING", copy: "Orders above ₹499" },
  { title: "7-DAY EASY PICKUPS", copy: "Complimentary returns" },
  { title: "CASH ON DELIVERY", copy: "Pay upon secure arrival" },
  { title: "100% SECURE CHECKOUT", copy: "Fully encrypted processing" },
];

const occasions = [
  { title: "Wedding Guest", slug: "lehengas", label: "Pure silks and intricate embellishments." },
  { title: "Office Essentials", slug: "kurtas", label: "Clean, crisp everyday linens." },
  { title: "Date Night", slug: "dresses", label: "Flattering silhouettes and romantic shades." },
  { title: "Festive Glamour", slug: "sarees", label: "Timeless traditional heritage weaves." },
];

function Index() {
  const trending = PRODUCTS.filter((p) => p.tags.includes("trending")).slice(0, 10);
  const newIn = [...PRODUCTS].sort((a, b) => a.createdDaysAgo - b.createdDaysAgo).slice(0, 8);

  return (
    <div className="mx-auto max-w-[1400px] px-0 sm:px-6">
      <div className="pt-0 sm:pt-4">
        <HeroCarousel />
      </div>

      {/* 1. Editorial Storytelling Section (The Minora Edit) */}
      <section aria-label="Editorial introduction" className="my-20 px-4 sm:px-0">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
              THE MINORA EDIT
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-wide text-foreground">
              Where tradition meets tomorrow.
            </h2>
            <p className="text-sm text-muted-foreground/90 font-light leading-relaxed tracking-wide">
              An intentional curation of contemporary Indian wear that balances classic craftsmanship with modern simplicity. Crafted in breathable, lightweight fabrics tailored for a generation that lives dynamically.
            </p>
            <div className="pt-2">
              <Link
                to="/c/$slug"
                params={{ slug: "new-arrivals" }}
                className="inline-flex items-center gap-2 border-b border-primary pb-1 text-xs font-bold tracking-widest text-primary hover:gap-4 transition-all duration-300"
              >
                DISCOVER THE COLLECTION
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-12 gap-4 relative">
            <div className="col-span-7 overflow-hidden bg-secondary">
              <img
                src={CATEGORY_IMAGES['sarees']}
                alt="Editorial model wearing saree"
                loading="lazy"
                width={768}
                height={1024}
                className="w-full h-[350px] sm:h-[480px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="col-span-5 pt-12 overflow-hidden bg-secondary">
              <img
                src={CATEGORY_IMAGES['kurtis']}
                alt="Editorial model wearing kurti"
                loading="lazy"
                width={768}
                height={1024}
                className="w-full h-[300px] sm:h-[400px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category (Editorial Vertical Tiles) */}
      <section aria-label="Shop by category" className="my-20 px-4 sm:px-0">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
            EXPLORE
          </span>
          <h2 className="font-display text-3xl sm:text-4xl mt-2 tracking-wide">Shop by Category</h2>
          <p className="text-xs text-muted-foreground mt-2 tracking-widest uppercase">Select your curation style</p>
        </div>
        <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:px-0 sm:pb-0">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/c/$slug"
              params={{ slug: c.slug }}
              className="group relative block w-[200px] shrink-0 overflow-hidden sm:w-full"
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-secondary">
                <img
                  src={CATEGORY_IMAGES[c.slug]}
                  alt={c.label}
                  loading="lazy"
                  width={768}
                  height={1024}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-foreground transition-all duration-300 group-hover:text-primary">
                  {c.label}
                </h3>
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  SHOP THE CLASSIC →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Shop by Price (Campaign Price Cards) */}
      <section aria-label="Shop by price" className="my-20 px-4 sm:px-0">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
            ACCESSIBLE COUTURE
          </span>
          <h2 className="font-display text-3xl sm:text-4xl mt-2 tracking-wide">Shop by Price</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {priceBuckets.map((b) => (
            <Link
              key={b.label}
              to="/c/$slug"
              params={{ slug: b.slug }}
              className="group relative block overflow-hidden border border-border bg-card"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={b.image}
                  alt={b.label}
                  loading="lazy"
                  width={768}
                  height={1024}
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent p-5 flex flex-col justify-end">
                <span className="font-display text-lg tracking-wider text-foreground">{b.label}</span>
                <p className="text-[11px] text-muted-foreground font-light tracking-wide mt-1 line-clamp-1">{b.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-[10px] font-bold tracking-widest text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  EXPLORE THE TILE &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Trending & Featured rail */}
      <section aria-label="Trending products" className="my-20 px-4 sm:px-0">
        <div className="flex items-end justify-between border-b border-border pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
              SEASONAL HIGHLIGHTS
            </span>
            <h2 className="font-display text-2xl sm:text-3xl mt-1 tracking-wide">Trending on MINORA</h2>
          </div>
          <Link to="/c/$slug" params={{ slug: "trending" }} className="text-xs font-bold tracking-widest text-primary hover:underline uppercase">
            View all &rarr;
          </Link>
        </div>
        <div className="mt-8">
          <ProductGrid products={trending} />
        </div>
      </section>

      {/* 5. Cinematic Fashion Editorial Banner */}
      <section aria-label="Editorial campaign banner" className="my-24 relative overflow-hidden bg-primary/10">
        <div className="grid lg:grid-cols-2">
          <div className="p-8 sm:p-16 lg:p-24 flex flex-col justify-center space-y-6">
            <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
              THE FESTIVE EDIT
            </span>
            <h3 className="font-display text-4xl sm:text-5xl leading-tight tracking-wide text-foreground">
              Crafted for celebrations that deserve a little more.
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground/90 font-light leading-relaxed tracking-wide">
              Timeless silhouettes designed in rich deep wine and champagne tones, perfect for weddings, dinners, and evening elegance.
            </p>
            <div className="pt-2">
              <Link
                to="/c/$slug"
                params={{ slug: "ethnic-wear" }}
                className="inline-block border border-primary bg-primary px-8 py-3 text-[11px] font-bold tracking-[0.2em] text-primary-foreground hover:bg-transparent hover:text-primary transition-all duration-300"
              >
                EXPLORE FESTIVE
              </Link>
            </div>
          </div>
          <div className="h-[300px] sm:h-[450px] lg:h-[550px] bg-secondary overflow-hidden">
            <img
              src={CATEGORY_IMAGES['lehengas']}
              alt="Luxury lehenga campaign"
              loading="lazy"
              width={768}
              height={1024}
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-[4000ms]"
            />
          </div>
        </div>
      </section>

      {/* 6. Just In / New Arrivals rail */}
      <section aria-label="New arrivals" className="my-20 px-4 sm:px-0">
        <div className="flex items-end justify-between border-b border-border pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
              JUST LANDED
            </span>
            <h2 className="font-display text-2xl sm:text-3xl mt-1 tracking-wide">New This Week</h2>
          </div>
          <Link to="/c/$slug" params={{ slug: "new-arrivals" }} className="text-xs font-bold tracking-widest text-primary hover:underline uppercase">
            View all &rarr;
          </Link>
        </div>
        <div className="mt-8">
          <ProductGrid products={newIn} />
        </div>
      </section>

      {/* 7. Occasion Edit */}
      <section aria-label="Occasion Edit" className="my-20 px-4 sm:px-0">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
            CURATIONS
          </span>
          <h2 className="font-display text-3xl sm:text-4xl mt-2 tracking-wide">The Occasion Edit</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {occasions.map((o) => (
            <Link
              key={o.title}
              to="/c/$slug"
              params={{ slug: o.slug }}
              className="group border border-border bg-card p-6 flex flex-col justify-between transition-all duration-300 hover:border-primary hover:shadow-[var(--shadow-card)]"
            >
              <div>
                <h3 className="font-display text-lg tracking-wide text-foreground transition-colors group-hover:text-primary">
                  {o.title}
                </h3>
                <p className="text-[11px] text-muted-foreground/80 mt-2 font-light leading-relaxed">
                  {o.label}
                </p>
              </div>
              <span className="mt-8 inline-flex items-center gap-1.5 text-[9px] font-bold tracking-widest text-primary uppercase">
                SHOP NOW →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Landing Page Footer CTA Banner */}
      <div className="border-t border-border bg-secondary/10 py-20 text-center px-4 my-10">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-wide text-foreground leading-tight">
            YOUR NEXT LOOK STARTS HERE.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest font-light">
            Discover fashion made for every version of you.
          </p>
          <div className="pt-4">
            <Link
              to="/c/$slug"
              params={{ slug: "new-arrivals" }}
              className="inline-block border border-primary bg-primary px-8 py-3 text-[11px] font-bold tracking-[0.2em] text-primary-foreground hover:bg-transparent hover:text-primary transition-all duration-300"
            >
              SHOP NEW ARRIVALS
            </Link>
          </div>
        </div>
      </div>

      {/* 8. Trust Section */}
      <section aria-label="Why shop with MINORA" className="my-20 px-4 sm:px-0">
        <div className="grid grid-cols-1 gap-6 border-t border-b border-border py-12 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((p) => (
            <div key={p.title} className="text-center space-y-1">
              <span className="block text-[11px] font-bold tracking-[0.2em] text-foreground">{p.title}</span>
              <span className="block text-[11px] text-muted-foreground uppercase tracking-widest">{p.copy}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
