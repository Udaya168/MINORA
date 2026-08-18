import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Plus, Minus, ArrowRight, ShieldCheck, Truck, BarChart3, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import sellerHeroImg from "@/assets/p-coord.jpg";
import { UserPortalLayout } from "@/components/site/UserPortalLayout";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "Sell on MINORA — Grow Your Fashion Business" },
      { name: "description", content: "Join thousands of Indian sellers on MINORA. Zero commission for the first 90 days, pan-India delivery, weekly payouts and dedicated seller support." },
      { property: "og:title", content: "Sell on MINORA — Grow Your Fashion Business" },
      { property: "og:description", content: "Zero commission for 90 days, pan-India logistics and weekly payouts for MINORA sellers." },
    ],
  }),
  component: SellPage,
});

const STATS = [
  { value: "40L+", label: "Active Shoppers" },
  { value: "19,000+", label: "Serviceable Pincodes" },
  { value: "7 Days", label: "Payout Cycle" },
  { value: "₹0", label: "Listing Fee" },
];

const BENEFITS = [
  {
    num: "01",
    title: "Zero Commission Launch",
    desc: "Launch your store with zero platform commission for the first 90 days to help you scale fast.",
  },
  {
    num: "02",
    title: "Pan-India Logistics",
    desc: "Reach customers across 19,000+ serviceable pincodes with complete end-to-end delivery tracking.",
  },
  {
    num: "03",
    title: "Millions of Shoppers",
    desc: "Put your collections in front of highly active, fashion-conscious shoppers across the country.",
  },
  {
    num: "04",
    title: "Seller Analytics",
    desc: "Understand product views, click-through rates, payouts, and customer reviews from one live dashboard.",
  },
  {
    num: "05",
    title: "Secure Payouts",
    desc: "Receive automated and predictable settlements directly to your bank account every 7 days.",
  },
  {
    num: "06",
    title: "Dedicated Onboarding",
    desc: "Get professional support managers who guide you through listing formats, photoshoots, and logistics.",
  },
];

const STEPS = [
  { num: "01", label: "REGISTER", copy: "Create your seller profile with mobile authentication and GSTIN." },
  { num: "02", label: "LIST", copy: "Upload your collections, product images, sizes, and price tiers." },
  { num: "03", label: "SHIP", copy: "We pick up orders from your doorstep and deliver nationwide." },
  { num: "04", label: "GET PAID", copy: "Receive secure weekly settlements directly into your account." },
];

const FAQS = [
  {
    q: "How do I become a MINORA seller?",
    a: "Simply click 'Start Selling' to authenticate your mobile number. Fill in your GSTIN and business bank details to launch your seller profile in under 10 minutes.",
  },
  {
    q: "What documents are required?",
    a: "You will need an active GSTIN certificate, PAN card copy, and a canceled bank cheque or account details registered under your brand/business name.",
  },
  {
    q: "Is there an upfront listing fee?",
    a: "No, listing products on MINORA is entirely free of charge. We only charge a nominal commission on successful transactions.",
  },
  {
    q: "How does shipping work?",
    a: "We operate an integrated courier pick-up service. When an order is placed, you pack the product and our courier partner picks it up from your warehouse.",
  },
  {
    q: "When do I receive my payouts?",
    a: "Payouts are securely settled on a weekly cycle. Funds are deposited directly to your bank account every 7 days for successfully delivered orders.",
  },
  {
    q: "Can I sell both ethnic and western wear?",
    a: "Yes. MINORA is a fashion-first marketplace accepting Kurtas, Kurtis, Sarees, Dresses, Co-ord sets, Footwear, Jewellery, and Accessories.",
  },
  {
    q: "How do I manage my products?",
    a: "All sellers get access to our clean, desktop-optimized Seller Dashboard to manage catalogues, inventory levels, order tracking, and sales reports.",
  },
];

function SellPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSellerAction = () => {
    toast.success("Thank you for your interest! Our seller onboarding team will contact you shortly.");
  };

  return (
    <UserPortalLayout>
    <div className="bg-background min-h-screen">
      {/* 1. SELLER HERO SECTION (Split Layout) */}
      <section className="relative overflow-hidden border-b border-border py-12 md:py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-12 md:px-20 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Left Column Copy */}
          <div className="md:col-span-6 space-y-6">
            <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
              MINORA SELLER HUB
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-wide text-foreground">
              Build your label.<br />Sell across India.
            </h1>
            <p className="text-sm md:text-base text-muted-foreground/90 font-light leading-relaxed max-w-lg">
              Bring your collection to millions of fashion-conscious shoppers looking for the next great Indian label. Manage your catalog, ship across India, and scale your brand with MINORA.
            </p>
            
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleSellerAction}
                className="border border-primary bg-primary px-8 py-3.5 text-xs font-bold tracking-widest text-primary-foreground hover:bg-transparent hover:text-primary transition-all duration-300 uppercase"
              >
                START SELLING
              </button>
              <button
                type="button"
                onClick={handleSellerAction}
                className="border border-foreground/20 bg-background/50 backdrop-blur-sm px-8 py-3.5 text-xs font-bold tracking-widest text-foreground hover:border-primary hover:text-primary transition-all duration-300 uppercase"
              >
                SELLER LOGIN
              </button>
            </div>

            <div className="pt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-primary" /> Zero listing fee</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-primary" /> Pan-India delivery</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-primary" /> Secure weekly payouts</span>
            </div>
          </div>

          {/* Right Column Image */}
          <div className="md:col-span-6">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] rounded-xl overflow-hidden bg-secondary/15 shadow-xl">
              <img
                src={sellerHeroImg}
                alt="Premium Indian Fashion collection designer studio"
                className="h-full w-full object-cover object-center scale-100 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. SELLER TRUST STRIP */}
      <section aria-label="Key Marketplace Stats" className="border-b border-border py-8 bg-secondary/10">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-12 md:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-border/60 text-center">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="space-y-1">
                <span className="block font-display text-2xl sm:text-3xl lg:text-4xl text-primary font-bold">
                  {stat.value}
                </span>
                <span className="block text-[10px] text-muted-foreground font-bold tracking-widest uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BENEFITS: WHY SELL WITH MINORA */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-12 md:px-20">
          <div className="max-w-2xl space-y-4 mb-16">
            <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
              INFRASTRUCTURE & SERVICE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-wide text-foreground">
              Everything you need to grow your fashion business.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground/80 font-light leading-relaxed">
              From your first listing upload to your thousandth order, MINORA manages the complex logistics and platform operations so you can focus entirely on designing the product.
            </p>
          </div>

          <div className="grid gap-x-12 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div key={benefit.num} className="border-b border-border/40 pb-6 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg font-bold text-primary/60">{benefit.num}</span>
                  <h3 className="font-display text-lg tracking-wide font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground/90 font-light leading-relaxed pl-7">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ONBOARDING STEPS */}
      <section className="py-20 md:py-28 bg-secondary/5 border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-12 md:px-20">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
              EASY ONBOARDING
            </span>
            <h2 className="font-display text-3xl sm:text-4xl tracking-wide text-foreground">
              Start selling in four simple steps
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative">
            {/* Visual timeline connectors on desktop */}
            <div className="hidden lg:block absolute top-7 left-[15%] right-[15%] h-[1px] bg-border/80 z-0 pointer-events-none" />

            {STEPS.map((step, i) => (
              <div key={step.label} className="relative z-10 bg-background border border-border p-6 rounded-xl space-y-4 hover:border-primary transition-all">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft font-display text-xs font-bold text-primary">
                  {step.num}
                </span>
                <div>
                  <h3 className="text-xs font-bold tracking-widest text-foreground uppercase">{step.label}</h3>
                  <p className="mt-2 text-xs text-muted-foreground/80 font-light leading-relaxed">{step.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DASHBOARD PREVIEW */}
      <section className="py-20 md:py-28 border-b border-border bg-background">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-12 md:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
              SELLER PLATFORM
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-wide text-foreground">
              Your business. One powerful dashboard.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground/85 font-light leading-relaxed">
              Monitor inventory levels, catalog listings, order flows, weekly payout balances, and return rates. Our dashboard keeps all operations transparent.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSellerAction}
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase hover:underline"
              >
                REQUEST DEMO ACCOUNT <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* Dashboard Mockup Panel */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-primary" />
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="font-display text-sm tracking-widest font-bold">MINORA SELLER CONTROL</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-semibold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Server
                </span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  ["Sales", "₹1,84,920"],
                  ["Orders", "428"],
                  ["Products", "126"],
                  ["Returns", "8"],
                ].map(([label, val]) => (
                  <div key={label} className="bg-secondary/15 p-3 rounded-md space-y-1">
                    <span className="block text-[9px] text-muted-foreground font-bold tracking-wider uppercase">{label}</span>
                    <span className="block text-xs sm:text-sm font-semibold text-foreground">{val}</span>
                  </div>
                ))}
              </div>

              {/* Mini chart visual representation */}
              <div className="space-y-2">
                <span className="block text-[9px] text-muted-foreground font-bold tracking-wider uppercase">Weekly Revenue Trend</span>
                <div className="h-24 flex items-end gap-2.5 pt-4 px-2 border-b border-border/80">
                  {[45, 60, 50, 75, 90, 85, 110].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 hover:bg-primary rounded-t transition-colors relative group h-full flex items-end">
                      <div
                        className="w-full bg-primary rounded-t"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product ranking lists */}
              <div className="space-y-2">
                <span className="block text-[9px] text-muted-foreground font-bold tracking-wider uppercase">Top Selling Catalog Products</span>
                <ul className="divide-y divide-border/60 text-xs">
                  {[
                    ["1. Floral Print Kurti", "Kurti Collection", "182 sold"],
                    ["2. Pure Silk Saree", "Saree curation", "144 sold"],
                    ["3. Cotton Co-ord Suit", "Western Suit Drops", "102 sold"],
                  ].map(([num, cat, sold]) => (
                    <li key={num} className="flex items-center justify-between py-2.5">
                      <span className="font-medium text-foreground">{num} <span className="text-muted-foreground/60">({cat})</span></span>
                      <span className="font-semibold text-primary">{sold}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SELLER SUCCESS STORY */}
      <section className="py-20 md:py-28 border-b border-border bg-secondary/5">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-12 md:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg order-2 lg:order-1">
            <img
              src={sellerHeroImg}
              alt="Independent boutique designer working on garments"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
              SELLER STORIES
            </span>
            <h2 className="font-display text-3xl sm:text-4xl tracking-wide text-foreground">
              From design studio to nationwide label
            </h2>
            <blockquote className="border-l-2 border-primary pl-6 space-y-3">
              <p className="font-display text-lg sm:text-xl italic text-foreground/90 font-light leading-relaxed">
                "MINORA completely handled the shipping, packaging pickups, and payment infrastructure. This let our design studio focus 100% on crafting new ethnic lines while shipping collections from Jaipur to over 20+ Indian states."
              </p>
              <cite className="block not-italic">
                <span className="block text-xs font-bold text-foreground tracking-wide">Aarohi Studio</span>
                <span className="block text-[10px] text-muted-foreground tracking-widest uppercase">Independent Indian Boutique Label</span>
              </cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION SECTION */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="mx-auto max-w-[900px] px-6 sm:px-12">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
              ANSWERS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl tracking-wide text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={faq.q} className="border border-border rounded-lg bg-background overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left font-display text-sm sm:text-base font-semibold text-foreground hover:bg-secondary/5 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="shrink-0 ml-3 text-muted-foreground/60">
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground/90 font-light leading-relaxed border-t border-border/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. FINAL SELLER CTA */}
      <section className="bg-primary text-primary-foreground py-20 text-center px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <span className="text-[10px] font-bold tracking-[0.25em] text-primary-foreground/75 uppercase block">
            GET STARTED
          </span>
          <h2 className="font-display text-4xl sm:text-5xl tracking-wide leading-tight text-primary-foreground">
            Ready to build your label?
          </h2>
          <p className="text-xs sm:text-sm text-primary-foreground/80 uppercase tracking-widest font-light">
            Your next fashion customer could be anywhere in India.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={handleSellerAction}
              className="inline-block border border-primary-foreground bg-primary-foreground px-8 py-3 text-[11px] font-bold tracking-[0.2em] text-primary hover:bg-transparent hover:text-primary-foreground transition-all duration-300 uppercase"
            >
              START SELLING
            </button>
            <button
              type="button"
              onClick={handleSellerAction}
              className="inline-block border border-primary-foreground/30 bg-transparent px-8 py-3 text-[11px] font-bold tracking-[0.2em] text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all duration-300 uppercase"
            >
              SELLER LOGIN
            </button>
          </div>
        </div>
      </section>
    </div>
    </UserPortalLayout>
  );
}