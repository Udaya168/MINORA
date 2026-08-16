import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X, Clock, TrendingUp, ArrowLeft } from "lucide-react";
import { POPULAR_SEARCHES, searchProducts } from "@/data/products";
import { useStore } from "@/lib/store";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      // Lock body scroll when search is open
      document.body.style.overflow = "hidden";
    } else {
      setQ("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
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

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-100 bg-background flex flex-col animate-in slide-in-from-bottom duration-300" role="dialog" aria-modal="true" aria-label="Search MINORA">
        {/* Mobile Search Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to page"
            className="rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-secondary text-foreground"
          >
            <ArrowLeft size={22} />
          </button>
          <span className="font-display text-base font-bold tracking-widest text-foreground">
            Search MINORA
          </span>
        </div>

        {/* Input Bar */}
        <div className="p-4">
          <form
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-3"
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
              placeholder="Search sarees, kurtis, dresses..."
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none font-medium tracking-wide"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Clear input"
                className="p-1 hover:bg-secondary rounded-full"
              >
                <X size={16} className="text-muted-foreground" />
              </button>
            )}
          </form>
        </div>

        {/* Suggestions / Popular Searches / Recent Searches */}
        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-6">
          {q && suggestions.length > 0 && (
            <section>
              <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Suggestions</h2>
              <ul className="divide-y divide-border/60">
                {suggestions.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate({ to: "/product/$id", params: { id: p.id } });
                      }}
                      className="flex w-full items-center gap-3 py-3 text-left hover:bg-secondary"
                    >
                      <img src={p.images[0]} alt="" width={40} height={53} className="h-12 w-9 rounded object-cover shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">{p.name}</span>
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
              <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recent searches</h2>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => go(r)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-secondary transition-all"
                  >
                    <Clock size={13} className="text-muted-foreground" /> {r}
                  </button>
                ))}
              </div>
            </section>
          )}

          {!q && (
            <section>
              <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Trending Searches</h2>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => go(s)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-4 py-2 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <TrendingUp size={13} className="text-muted-foreground" /> {s}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

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