import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, ArrowDownWideNarrow, X } from "lucide-react";
import { ProductGrid } from "@/components/site/ProductGrid";
import { resolveCollection, type Product } from "@/data/products";
import { StorefrontLayout } from "@/components/site/StorefrontLayout";

type Search = {
  sort?: string | undefined;
  size?: string | undefined;
  color?: string | undefined;
  fabric?: string | undefined;
  pattern?: string | undefined;
  rating?: number | undefined;
  discount?: number | undefined;
  max?: number | undefined;
  instock?: boolean | undefined;
};

export const Route = createFileRoute("/c/$slug")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    sort: typeof s['sort'] === "string" ? s['sort'] : undefined,
    size: typeof s['size'] === "string" ? s['size'] : undefined,
    color: typeof s['color'] === "string" ? s['color'] : undefined,
    fabric: typeof s['fabric'] === "string" ? s['fabric'] : undefined,
    pattern: typeof s['pattern'] === "string" ? s['pattern'] : undefined,
    rating: s['rating'] ? Number(s['rating']) : undefined,
    discount: s['discount'] ? Number(s['discount']) : undefined,
    max: s['max'] ? Number(s['max']) : undefined,
    instock: s['instock'] === true || s['instock'] === "true" ? true : undefined,
  }),
  head: ({ params }) => {
    const title = resolveCollection(params.slug).title;
    return {
      meta: [
        { title: `${title} — Shop Online on MINORA` },
        {
          name: "description",
          content: `Browse ${title.toLowerCase()} on MINORA. Filter by price, size, colour and fabric with free delivery and easy returns.`,
        },
        { property: "og:title", content: `${title} — MINORA` },
        {
          property: "og:description",
          content: `Shop ${title.toLowerCase()} at prices you'll love on MINORA.`,
        },
      ],
    };
  },
  component: Listing,
});

const SORTS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
  { value: "discount", label: "Discount" },
];

const PRICE_CAPS = [299, 499, 799, 999, 2000];

function Listing() {
  const { slug } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/c/$slug" });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const collection = useMemo(() => resolveCollection(slug), [slug]);

  const facets = useMemo(() => {
    const uniq = (arr: string[]) => Array.from(new Set(arr)).sort();
    return {
      sizes: uniq(collection.items.flatMap((p) => p.sizes)),
      colors: uniq(collection.items.flatMap((p) => p.colors)),
      fabrics: uniq(collection.items.map((p) => p.fabric)),
      patterns: uniq(collection.items.map((p) => p.pattern)),
    };
  }, [collection]);

  const products = useMemo(() => {
    let list: Product[] = collection.items.filter((p) => {
      if (search.size && !p.sizes.includes(search.size)) return false;
      if (search.color && !p.colors.includes(search.color)) return false;
      if (search.fabric && p.fabric !== search.fabric) return false;
      if (search.pattern && p.pattern !== search.pattern) return false;
      if (search.rating && p.rating < search.rating) return false;
      if (search.discount && p.discount < search.discount) return false;
      if (search.max && p.price > search.max) return false;
      if (search.instock && !p.inStock) return false;
      return true;
    });
    const sort = search.sort ?? "popular";
    list = [...list].sort((a, b) => {
      if (sort === "newest") return a.createdDaysAgo - b.createdDaysAgo;
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "discount") return b.discount - a.discount;
      return b.popularity - a.popularity;
    });
    return list;
  }, [collection, search]);

  const set = (patch: Partial<Search>) =>
    navigate({ params: { slug }, search: (prev) => ({ ...prev, ...patch }) });

  const clearAll = () => navigate({ params: { slug }, search: {} });

  const activeCount = Object.values(search).filter(Boolean).length;

  const FilterGroup = ({
    title,
    options,
    value,
    onPick,
  }: {
    title: string;
    options: string[];
    value?: string | undefined;
    onPick: (v: string | undefined) => void;
  }) => (
    <div className="border-b border-border py-4">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              type="button"
              aria-pressed={active}
              onClick={() => onPick(active ? undefined : o)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${active ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/50"}`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );

  const Filters = (
    <div className="pb-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 className="font-display text-base">Filters</h2>
        {activeCount > 0 && (
          <button type="button" onClick={clearAll} className="text-xs font-medium text-primary hover:underline">
            Clear all
          </button>
        )}
      </div>
      <div className="border-b border-border py-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Price</h3>
        <div className="flex flex-wrap gap-1.5">
          {PRICE_CAPS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={search.max === c}
              onClick={() => set({ max: search.max === c ? undefined : c })}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${search.max === c ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/50"}`}
            >
              Under ₹{c}
            </button>
          ))}
        </div>
      </div>
      <FilterGroup title="Size" options={facets.sizes} value={search.size} onPick={(v) => set({ size: v })} />
      <FilterGroup title="Colour" options={facets.colors} value={search.color} onPick={(v) => set({ color: v })} />
      <FilterGroup title="Fabric" options={facets.fabrics} value={search.fabric} onPick={(v) => set({ fabric: v })} />
      <FilterGroup title="Pattern" options={facets.patterns} value={search.pattern} onPick={(v) => set({ pattern: v })} />
      <div className="border-b border-border py-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer Rating</h3>
        <div className="flex flex-wrap gap-1.5">
          {[4, 3].map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={search.rating === r}
              onClick={() => set({ rating: search.rating === r ? undefined : r })}
              className={`rounded-full border px-3 py-1 text-xs ${search.rating === r ? "border-primary bg-primary-soft text-primary" : "border-border"}`}
            >
              {r}★ & above
            </button>
          ))}
        </div>
      </div>
      <div className="border-b border-border py-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Discount</h3>
        <div className="flex flex-wrap gap-1.5">
          {[30, 50, 60].map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={search.discount === d}
              onClick={() => set({ discount: search.discount === d ? undefined : d })}
              className={`rounded-full border px-3 py-1 text-xs ${search.discount === d ? "border-primary bg-primary-soft text-primary" : "border-border"}`}
            >
              {d}% and more
            </button>
          ))}
        </div>
      </div>
      <div className="py-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!search.instock}
            onChange={(e) => set({ instock: e.target.checked ? true : undefined })}
            className="h-4 w-4 accent-[oklch(0.36_0.115_12)]"
          />
          In stock only
        </label>
      </div>
    </div>
  );

  return (
    <StorefrontLayout>
    <div className="mx-auto max-w-[1400px] px-3 sm:px-5 pt-2">

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl">{collection.title}</h1>
          <p className="text-sm text-muted-foreground">{products.length} products</p>
        </div>
        <label className="hidden items-center gap-2 text-sm lg:flex">
          <span className="text-muted-foreground">Sort by</span>
          <select
            value={search.sort ?? "popular"}
            onChange={(e) => set({ sort: e.target.value })}
            className="rounded-md border border-border bg-card px-3 py-2 text-sm"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 gap-6 lg:flex">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-36">{Filters}</div>
        </aside>
        <div className="min-w-0 flex-1">
          <ProductGrid products={products} />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-14 z-40 grid grid-cols-2 border-t border-border bg-card lg:hidden">
        <button type="button" onClick={() => setFiltersOpen(true)} className="flex items-center justify-center gap-2 py-3 text-sm font-medium">
          <SlidersHorizontal size={16} /> Filter{activeCount ? ` (${activeCount})` : ""}
        </button>
        <label className="flex items-center justify-center gap-2 border-l border-border py-3 text-sm font-medium">
          <ArrowDownWideNarrow size={16} />
          <select
            value={search.sort ?? "popular"}
            onChange={(e) => set({ sort: e.target.value })}
            aria-label="Sort products"
            className="bg-transparent text-sm font-medium outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <button type="button" aria-label="Close filters" className="absolute inset-0 bg-foreground/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-display text-lg">Filters</span>
              <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="rounded-md p-1.5 hover:bg-secondary">
                <X size={18} />
              </button>
            </div>
            {Filters}
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="w-full rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground"
            >
              Show {products.length} products
            </button>
          </div>
        </div>
      )}
    </div>
    </StorefrontLayout>
  );
}