import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { ProductGrid } from "@/components/site/ProductGrid";
import { POPULAR_SEARCHES, searchProducts } from "@/data/products";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s['q'] === "string" ? s['q'] : "",
  }),
  head: () => ({
    meta: [
      { title: "Search Results — MINORA" },
      { name: "description", content: "Search sarees, kurtis, dresses, jewellery and more across the MINORA catalogue." },
      { property: "og:title", content: "Search Results — MINORA" },
      { property: "og:description", content: "Find your next favourite style on MINORA." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const results = searchProducts(q);

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-5">
      <Breadcrumb items={[{ label: "Search" }]} />
      <h1 className="mt-3 font-display text-2xl">
        {q ? <>Results for “{q}”</> : "Search MINORA"}
      </h1>
      <p className="text-sm text-muted-foreground">{results.length} products</p>

      {results.length === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-card p-8 text-center">
          <p className="font-display text-lg">No matches found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try one of these popular searches instead.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {POPULAR_SEARCHES.map((s) => (
              <Link key={s} to="/search" search={{ q: s }} className="rounded-full bg-primary-soft px-3 py-1.5 text-sm text-primary">
                {s}
              </Link>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-5">
          <ProductGrid products={results} />
        </div>
      )}
    </div>
  );
}