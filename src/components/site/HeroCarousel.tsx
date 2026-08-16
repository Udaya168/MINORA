import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import heroFestive from "@/assets/p-saree.jpg";
import heroNew from "@/assets/p-dress.jpg";
import heroValue from "@/assets/p-kurti.jpg";

const slides = [
  {
    image: heroFestive,
    eyebrow: "NEW SEASON / 2026",
    title: "STYLE, REIMAGINED.",
    subtitle:
      "Contemporary Indian fashion designed for the way you live now. Pure silk blends, intricate embroidery, and clean tailored cuts.",
    cta: { label: "SHOP THE LOOK", slug: "ethnic-wear" },
    secondary: { label: "THE COLLECTION", slug: "new-arrivals" },
    alt: "Model wearing a luxury saree",
    objectPosition: "center right",
  },
  {
    image: heroNew,
    eyebrow: "THE MODERN CUT",
    title: "FRESH DROPS.",
    subtitle: "Premium western staples and breathable cottons built for everyday luxury.",
    cta: { label: "EXPLORE NEW IN", slug: "new-arrivals" },
    secondary: { label: "WESTERN EDIT", slug: "western-wear" },
    alt: "Model wearing casual modern dress",
    objectPosition: "center",
  },
  {
    image: heroValue,
    eyebrow: "DAILY ESSENTIALS",
    title: "UNDER ₹499 COUTURE.",
    subtitle: "Exquisite daily wear kurtis, tops and airy sarees that don't compromise on design detail.",
    cta: { label: "BROWSE DEALS", slug: "deals" },
    secondary: { label: "VIEW ALL KURTIS", slug: "kurtis" },
    alt: "Model wearing printed kurti",
    objectPosition: "center",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setZoom(false);
    const timeout = setTimeout(() => setZoom(true), 50);

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [index]);

  const go = (d: number) => {
    setIndex((i) => (i + d + slides.length) % slides.length);
  };

  if (isMobile) {
    const s = slides[index];
    if (!s) return null;
    return (
      <section
        aria-label="Featured campaign"
        className="relative overflow-hidden bg-background border-b border-border"
      >
        {/* Mobile Image Section */}
        <div className="w-full aspect-[4/5] overflow-hidden bg-secondary/10 relative">
          <img
            src={s.image}
            alt={s.alt}
            className="h-full w-full object-cover"
            style={{ objectPosition: s.objectPosition || "center right" }}
          />
        </div>

        {/* Mobile Content Section in Flow */}
        <div className="p-6 space-y-6 bg-background">
          <div className="space-y-3">
            <span className="text-[11px] font-bold tracking-[0.25em] text-primary uppercase block">
              {s.eyebrow}
            </span>
            <h1 className="font-display text-4xl leading-[1.1] tracking-wide text-foreground">
              {s.title}
            </h1>
            <p className="text-xs text-muted-foreground/90 tracking-wide leading-relaxed font-light">
              {s.subtitle}
            </p>
          </div>

          {/* Primary/Secondary CTA Stack */}
          <div className="flex flex-col gap-2.5">
            <Link
              to="/c/$slug"
              params={{ slug: s.cta.slug }}
              className="w-full text-center border border-primary bg-primary py-3.5 text-[11px] font-bold tracking-[0.2em] text-primary-foreground hover:bg-transparent hover:text-primary transition-all duration-300"
            >
              {s.cta.label}
            </Link>
            <Link
              to="/c/$slug"
              params={{ slug: s.secondary.slug }}
              className="w-full text-center border border-foreground/20 bg-transparent py-3.5 text-[11px] font-bold tracking-[0.2em] text-foreground hover:border-primary hover:text-primary transition-all duration-300"
            >
              {s.secondary.label}
            </Link>
          </div>

          {/* Controls section in Flow */}
          <div className="pt-4 flex items-center justify-between border-t border-border/40">
            <div className="flex items-center gap-4">
              <div className="font-display text-xs text-foreground/80 tracking-widest">
                0{index + 1} <span className="mx-1 text-muted-foreground/50">/</span> 0{slides.length}
              </div>
              <div className="relative h-[2px] w-20 bg-foreground/10 overflow-hidden">
                <div
                  key={index}
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-[6500ms] ease-linear"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous slide"
                className="grid h-11 w-11 place-items-center border border-foreground/10 bg-background hover:bg-secondary transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next slide"
                className="grid h-11 w-11 place-items-center border border-foreground/10 bg-background hover:bg-secondary transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Featured campaign"
      className="relative overflow-hidden bg-background"
    >
      <div className="relative aspect-[4/3] w-full md:aspect-[21/9] min-h-[500px] overflow-hidden">
        {slides.map((s, i) => {
          const isActive = i === index;
          return (
            <div
              key={s.eyebrow}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                isActive
                  ? "opacity-100 scale-100 z-10 visible pointer-events-auto"
                  : "opacity-0 scale-102 z-0 invisible pointer-events-none"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 h-full w-full">
                {/* Content Section (Left) */}
                <div className="md:col-span-5 flex flex-col justify-center bg-background p-6 sm:p-12 md:p-16 lg:p-20 order-2 md:order-1">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
                      {s.eyebrow}
                    </span>
                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-wide text-foreground">
                      {s.title}
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground/90 tracking-wide leading-relaxed font-light">
                      {s.subtitle}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-3">
                      <Link
                        to="/c/$slug"
                        params={{ slug: s.cta.slug }}
                        className="border border-primary bg-primary px-6 py-2.5 text-[10px] font-bold tracking-[0.2em] text-primary-foreground hover:bg-transparent hover:text-primary transition-all duration-300"
                      >
                        {s.cta.label}
                      </Link>
                      <Link
                        to="/c/$slug"
                        params={{ slug: s.secondary.slug }}
                        className="border border-foreground/20 bg-transparent px-6 py-2.5 text-[10px] font-bold tracking-[0.2em] text-foreground hover:border-primary hover:text-primary transition-all duration-300"
                      >
                        {s.secondary.label}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Image Section (Right) */}
                <div className="md:col-span-7 relative h-[300px] md:h-full overflow-hidden bg-secondary/10 order-1 md:order-2">
                  <img
                    src={s.image}
                    alt={s.alt}
                    width={1200}
                    height={900}
                    className={`h-full w-full object-cover transition-transform duration-[7000ms] ease-out ${
                      isActive && zoom ? "scale-105" : "scale-100"
                    }`}
                    style={{ objectPosition: s.objectPosition || "center right" }}
                  />
                  {/* Subtle split boundary transition gradient */}
                  <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent hidden md:block" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-6 left-6 md:left-20 z-20 flex items-center gap-6">
        <div className="font-display text-xs text-foreground/80 tracking-widest">
          0{index + 1} <span className="mx-1 text-muted-foreground/50">/</span> 0{slides.length}
        </div>
        <div className="relative h-[2px] w-24 bg-foreground/10 overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-[6500ms] ease-linear"
            style={{ width: "100%" }}
          />
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="grid h-8 w-8 place-items-center border border-foreground/10 bg-background/60 hover:bg-background transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next slide"
            className="grid h-8 w-8 place-items-center border border-foreground/10 bg-background/60 hover:bg-background transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}