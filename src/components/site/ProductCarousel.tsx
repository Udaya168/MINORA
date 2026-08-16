import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function ProductCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const width = container.clientWidth;
      const scrollAmount = direction === "left" ? -width * 0.75 : width * 0.75;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group w-full">
      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-4 px-4 sm:px-0"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="shrink-0 snap-start snap-always"
            style={{ width: "calc(78% - 8px)" }} /* Exact peeking formula on mobile: 78% card width, 22% next card peek */
          >
            <div className="w-full sm:w-auto">
              <ProductCard product={p} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Prev Button */}
      <button
        type="button"
        onClick={() => handleScroll("left")}
        aria-label="Previous products"
        className="hidden md:flex absolute -left-5 top-[40%] -translate-y-1/2 h-11 w-11 items-center justify-center border border-border bg-background/95 hover:bg-background shadow-md rounded-full text-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all z-20 cursor-pointer"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Desktop Next Button */}
      <button
        type="button"
        onClick={() => handleScroll("right")}
        aria-label="Next products"
        className="hidden md:flex absolute -right-5 top-[40%] -translate-y-1/2 h-11 w-11 items-center justify-center border border-border bg-background/95 hover:bg-background shadow-md rounded-full text-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all z-20 cursor-pointer"
      >
        <ChevronRight size={18} />
      </button>

      {/* Tailoring width classes using inline CSS media queries for clean layout resolution */}
      <style>{`
        @media (min-width: 640px) {
          .group div[style*="calc(78% - 8px)"] {
            width: calc(48% - 8px) !important;
          }
        }
        @media (min-width: 768px) {
          .group div[style*="calc(78% - 8px)"] {
            width: calc(32% - 8px) !important;
          }
        }
        @media (min-width: 1024px) {
          .group div[style*="calc(78% - 8px)"] {
            width: calc(25% - 12px) !important;
          }
        }
      `}</style>
    </div>
  );
}
