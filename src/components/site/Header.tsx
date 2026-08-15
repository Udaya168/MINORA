import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  MapPin,
  Store,
  Menu,
  X,
} from "lucide-react";
import { NAV_LINKS } from "@/data/products";
import { useStore } from "@/lib/store";
import { Logo } from "./Logo";
import { SearchOverlay } from "./SearchOverlay";

function Badge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="absolute -right-1.5 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const { cartCount, wishlist, pushRecent } = useStore();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    pushRecent(q);
    navigate({ to: "/search", search: { q } });
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-[1400px] px-3 sm:px-5">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-2.5 lg:gap-6">
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                className="rounded-md p-1.5 hover:bg-secondary lg:hidden"
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
              >
                <Menu size={20} />
              </button>
              <Logo className="h-7 sm:h-8" />
            </div>

            <form onSubmit={submit} className="hidden lg:flex" role="search">
              <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 focus-within:border-primary">
                <Search size={18} className="shrink-0 text-muted-foreground" aria-hidden />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search for sarees, kurtis, dresses, jewellery..."
                  aria-label="Search for products"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </div>
            </form>
            <div className="lg:hidden" />

            <nav className="flex items-center gap-1 sm:gap-2" aria-label="Account and cart">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="rounded-md p-2 hover:bg-secondary lg:hidden"
              >
                <Search size={20} />
              </button>
              <button
                type="button"
                className="hidden items-center gap-1.5 rounded-md px-2 py-2 text-sm hover:bg-secondary xl:flex"
              >
                <MapPin size={17} />
                <span className="text-left leading-tight">
                  <span className="block text-[10px] text-muted-foreground">Deliver to</span>
                  <span className="block text-xs font-medium">Mumbai 400001</span>
                </span>
              </button>
              <Link to="/login" className="hidden items-center gap-1.5 rounded-md px-2 py-2 text-sm hover:bg-secondary lg:flex">
                <User size={18} /> <span className="text-xs font-medium">Login</span>
              </Link>
              <Link to="/wishlist" aria-label="Wishlist" className="relative rounded-md p-2 hover:bg-secondary">
                <Heart size={20} />
                <Badge count={wishlist.length} />
              </Link>
              <Link to="/cart" aria-label="Cart" className="relative rounded-md p-2 hover:bg-secondary">
                <ShoppingBag size={20} />
                <Badge count={cartCount} />
              </Link>
              <Link
                to="/sell"
                className="hidden items-center gap-1.5 rounded-md border border-primary px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary-soft lg:flex"
              >
                <Store size={15} /> Become a Seller
              </Link>
            </nav>
          </div>

          <nav aria-label="Categories" className="no-scrollbar -mx-3 hidden overflow-x-auto px-3 lg:block">
            <ul className="flex items-center gap-1 pb-1.5">
              {NAV_LINKS.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/c/$slug"
                    params={{ slug: c.slug }}
                    className="block whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-primary-soft hover:text-primary"
                    activeProps={{ className: "bg-primary-soft text-primary" }}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-foreground/40" onClick={() => setMenuOpen(false)} />
          <div className="animate-slide-in-right absolute inset-y-0 left-0 w-72 overflow-y-auto bg-card p-4">
            <div className="flex items-center justify-between">
              <Logo className="h-7" />
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="rounded-md p-2 hover:bg-secondary">
                <X size={18} />
              </button>
            </div>
            <ul className="mt-4 space-y-0.5">
              {NAV_LINKS.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/c/$slug"
                    params={{ slug: c.slug }}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-sm hover:bg-secondary"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-border pt-4">
              <Link to="/account" onClick={() => setMenuOpen(false)} className="block rounded-md px-3 py-2.5 text-sm hover:bg-secondary">My Account</Link>
              <Link to="/sell" onClick={() => setMenuOpen(false)} className="block rounded-md px-3 py-2.5 text-sm text-primary hover:bg-primary-soft">Become a Seller</Link>
            </div>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}