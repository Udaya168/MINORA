import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Stars } from "./Stars";

const CardLink = ({ product, className, children }: { product: Product; className?: string; children: React.ReactNode }) => {
  if (product.sourceUrl) {
    return (
      <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to="/product/$id" params={{ id: product.id }} className={className}>
      {children}
    </Link>
  );
};

export function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView?: ((p: Product) => void) | undefined;
}) {
  const { isWished, toggleWishlist, addToCart } = useStore();
  const wished = isWished(product.id);
  const [hovered, setHovered] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first size
    const defaultSize = product.sizes[0] || "M";
    addToCart(product.id, defaultSize, 1);
    toast.success("Added to Bag", { description: `${product.name} (Size ${defaultSize})` });
  };

  return (
    <article
      className="group relative flex flex-col bg-background"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardLink
        product={product}
        className="relative block aspect-[3/4] overflow-hidden bg-secondary/30"
      >
        {/* Hover Crossfade Images */}
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          width={768}
          height={1024}
          onError={(e) => { e.currentTarget.src = `https://placehold.co/768x1024/f1f5f9/64748b?text=${encodeURIComponent(product.name)}` }}
          className={`h-full w-full object-cover object-top transition-transform duration-700 ease-out ${
            hovered ? "scale-105 opacity-0" : "scale-100 opacity-100"
          }`}
        />
        <img
          src={product.images[1] || product.images[0]}
          alt={product.name}
          loading="lazy"
          width={768}
          height={1024}
          onError={(e) => { e.currentTarget.src = `https://placehold.co/768x1024/f1f5f9/64748b?text=${encodeURIComponent(product.name)}` }}
          className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 ease-out ${
            hovered ? "scale-103 opacity-100" : "scale-95 opacity-0"
          }`}
        />

        {product.discount >= 55 && (
          <span className="absolute left-3 top-3 border border-primary/20 bg-background/90 px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase text-primary">
            LOWEST PRICE
          </span>
        )}

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-background/80 via-background/20 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full bg-primary py-2 text-[10px] font-bold tracking-[0.2em] text-primary-foreground hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus size={12} /> QUICK ADD
          </button>
        </div>
      </CardLink>

      {/* Wishlist Button */}
      <button
        type="button"
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wished}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
          toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
        }}
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur-md transition-all duration-300 hover:scale-105"
      >
        <Heart
          size={14}
          className={wished ? "fill-primary text-primary" : "text-muted-foreground transition-colors group-hover:text-foreground"}
        />
      </button>

      {/* Content */}
      <div className="flex flex-col flex-1 py-3.5 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
            {product.categoryLabel}
          </span>
          <div className="flex items-center gap-1">
            <Stars rating={product.rating} size={9} />
            <span className="text-[9px] font-light text-muted-foreground">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="text-xs font-medium text-foreground tracking-wide line-clamp-1">
          <CardLink product={product} className="hover:text-primary transition-colors">
            {product.name}
          </CardLink>
        </h3>

        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-xs font-bold text-foreground">{inr(product.price)}</span>
          <span className="text-[10px] text-muted-foreground line-through font-light">
            {inr(product.originalPrice)}
          </span>
          <span className="text-[10px] font-bold text-success">{product.discount}% OFF</span>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="aspect-[3/4] animate-pulse bg-secondary/40" />
      <div className="space-y-2">
        <div className="h-3 w-1/4 animate-pulse bg-secondary/40" />
        <div className="h-4 w-3/4 animate-pulse bg-secondary/40" />
        <div className="h-3 w-1/2 animate-pulse bg-secondary/40" />
      </div>
    </div>
  );
}