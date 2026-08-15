import { Link } from "@tanstack/react-router";
import { Heart, Eye } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Stars } from "./Stars";

export function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView?: ((p: Product) => void) | undefined;
}) {
  const { isWished, toggleWishlist } = useStore();
  const wished = isWished(product.id);

  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-card transition-shadow duration-200 hover:shadow-[var(--shadow-card)]">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block focus-visible:outline-2 focus-visible:outline-ring"
      >
        <div className="relative aspect-3/4 overflow-hidden bg-secondary">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            width={768}
            height={1024}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.discount >= 55 && (
            <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
              Lowest Price
            </span>
          )}
        </div>
      </Link>

      <button
        type="button"
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wished}
        onClick={() => {
          toggleWishlist(product.id);
          toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
        }}
        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur transition-transform duration-150 hover:scale-110 active:scale-95"
      >
        <Heart
          size={16}
          className={wished ? "fill-primary text-primary" : "text-muted-foreground"}
        />
      </button>

      {onQuickView && (
        <button
          type="button"
          onClick={() => onQuickView(product)}
          className="absolute inset-x-2 bottom-[calc(100%-0px)] hidden -translate-y-2 items-center justify-center gap-1.5 rounded-md bg-card/95 py-1.5 text-xs font-medium opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 md:flex"
          style={{ bottom: "auto", top: "calc(75% - 3rem)" }}
        >
          <Eye size={14} /> Quick View
        </button>
      )}

      <div className="space-y-1 p-2.5 sm:p-3">
        <h3 className="line-clamp-2 text-[13px] leading-snug font-medium sm:text-sm">
          <Link to="/product/$id" params={{ id: product.id }}>
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center gap-1.5">
          <Stars rating={product.rating} />
          <span className="text-[11px] text-muted-foreground">
            ({product.reviewCount.toLocaleString("en-IN")})
          </span>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-sm font-semibold sm:text-base">{inr(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">
            {inr(product.originalPrice)}
          </span>
          <span className="text-xs font-semibold text-success">{product.discount}% off</span>
        </div>
        <p className="text-[11px] text-muted-foreground">Free Delivery</p>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="aspect-3/4 animate-pulse bg-secondary" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-4/5 animate-pulse rounded bg-secondary" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-secondary" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-secondary" />
      </div>
    </div>
  );
}