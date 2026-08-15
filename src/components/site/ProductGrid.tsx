import type { Product } from "@/data/products";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";

export function ProductGrid({
  products,
  loading,
  onQuickView,
}: {
  products: Product[];
  loading?: boolean | undefined;
  onQuickView?: ((p: Product) => void) | undefined;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <p className="font-display text-lg">No products found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try removing a filter or searching for something else.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
      ))}
    </div>
  );
}