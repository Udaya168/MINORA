import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { POPULAR_SEARCHES, searchProducts } from "@/data/products";
import { useStore } from "@/lib/store";

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { recent, pushRecent } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else setQ("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const suggestions = useMemo(() => searchProducts(q).slice(0, 6), [q]);

  const go = (term: string) => {
    if (!term.trim()) return;
    pushRecent(term);
    onClose();
    navigate({ to: "/search", search: { q: term } });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 bg-foreground/30 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Search MINORA">
      <div className="animate-fade-in bg-card p-4 shadow-lg">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <form
            className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              go(q);
            }}
          >
            <Search size={18} className="shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for sarees, kurtis, dresses, jewellery..."
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </form>
          <button type="button" onClick={onClose} aria-label="Close search" className="shrink-0 rounded-md p-2 hover:bg-secondary">
            <X size={18} />
          </button>
        </div>

        <div className="mx-auto mt-4 max-w-3xl space-y-5 pb-4">
          {q && suggestions.length > 0 && (
            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suggestions</h2>
              <ul className="space-y-1">
                {suggestions.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate({ to: "/product/$id", params: { id: p.id } });
                      }}
                      className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-secondary"
                    >
                      <img src={p.images[0]} alt="" width={40} height={53} className="h-12 w-9 rounded object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{p.name}</span>
                        <span className="block text-xs text-muted-foreground">in {p.categoryLabel}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {recent.length > 0 && !q && (
            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent searches</h2>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button key={r} type="button" onClick={() => go(r)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm hover:bg-secondary">
                    <Clock size={13} /> {r}
                  </button>
                ))}
              </div>
            </section>
          )}

          {!q && (
            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Popular searches</h2>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((s) => (
                  <button key={s} type="button" onClick={() => go(s)} className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-sm text-primary hover:bg-accent">
                    <TrendingUp size={13} /> {s}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <button type="button" className="h-full w-full cursor-default" aria-label="Close search" onClick={onClose} />
    </div>
  );
}