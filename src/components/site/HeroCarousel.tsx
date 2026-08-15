import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroFestive from "@/assets/hero-festive.jpg";
import heroNew from "@/assets/hero-new.jpg";
import heroValue from "@/assets/hero-value.jpg";

const slides = [
  {
    image: heroFestive,
    eyebrow: "Festive Collection",
    title: "Style That Belongs to You",
    subtitle:
      "Discover everyday fashion, Indian classics and modern styles at prices you'll love.",
    cta: { label: "Shop Now", slug: "ethnic-wear" },
    secondary: { label: "Explore New Arrivals", slug: "new-arrivals" },
    alt: "Model wearing a burgundy and gold festive Indian outfit",
  },
  {
    image: heroNew,
    eyebrow: "New Arrivals",
    title: "Fresh Drops, Every Week",
    subtitle: "Western staples and denim built for Indian summers.",
    cta: { label: "Shop New In", slug: "new-arrivals" },
    secondary: { label: "Browse Western Wear", slug: "western-wear" },
    alt: "Two models wearing modern western casual denim outfits",
  },
  {
    image: heroValue,
    eyebrow: "Under ₹499",
    title: "Everyday Style, Everyday Prices",
    subtitle: "Thousands of kurtis, tops and sarees under ₹499.",
    cta: { label: "Shop Deals", slug: "deals" },
    secondary: { label: "Explore Kurtis", slug: "kurtis" },
    alt: "Model wearing a printed cotton kurti",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const go = (d: number) =>
    setIndex((i) => (i + d + slides.length) % slides.length);

  return (
    <section
      aria-label="Featured collections"
      className="relative overflow-hidden rounded-none sm:rounded-2xl"
    >
      <div className="relative aspect-16/11 w-full sm:aspect-21/9">
        {slides.map((s, i) => (
          <div
            key={s.eyebrow}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <img
              src={s.image}
              alt={s.alt}
              width={1600}
              height={912}
              {...(i === 0 ? {} : { loading: "lazy" as const })}
              className="h-full w-full object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent sm:to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-[min(90%,34rem)] px-5 sm:px-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  {s.eyebrow}
                </p>
                <h1 className="mt-2 font-display text-2xl leading-tight sm:text-4xl lg:text-5xl">
                  {s.title}
                </h1>
                <p className="mt-2 max-w-md text-xs text-muted-foreground sm:text-base">
                  {s.subtitle}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
                  <Link
                    to="/c/$slug"
                    params={{ slug: s.cta.slug }}
                    className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {s.cta.label}
                  </Link>
                  <Link
                    to="/c/$slug"
                    params={{ slug: s.secondary.slug }}
                    className="rounded-md border border-primary/30 bg-card/70 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
                  >
                    {s.secondary.label}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-card/80 text-foreground shadow-sm hover:bg-card sm:grid"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-card/80 text-foreground shadow-sm hover:bg-card sm:grid"
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.eyebrow}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-primary" : "w-1.5 bg-foreground/25"}`}
          />
        ))}
      </div>
    </section>
  );
}