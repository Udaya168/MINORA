import { useState, useEffect } from "react";
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
  ChevronDown,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { NAV_LINKS, CATEGORIES } from "@/data/products";
import { useStore } from "@/lib/store";
import { Logo } from "./Logo";
import { SearchOverlay } from "./SearchOverlay";

const announcements = [
  "NEW SEASON — NEW STORIES",
  "FREE EXPRESS SHIPPING ON ORDERS ABOVE ₹499",
  "7-DAY COMPLIMENTARY HOME PICKS & RETURNS",
];

function Badge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground">
      {count}
    </span>
  );
}

const SUB_CATEGORIES: Record<string, { label: string; slug: string }[]> = {
  women: [
    { label: "Sarees", slug: "sarees" },
    { label: "Kurtis", slug: "kurtis" },
    { label: "Dresses", slug: "dresses" },
    { label: "Tops & Tunics", slug: "tops" },
    { label: "Lehengas", slug: "lehengas" },
    { label: "Western Wear", slug: "western-wear" },
    { label: "New Arrivals", slug: "new-arrivals" },
  ],
  men: [
    { label: "Shirts", slug: "shirts" },
    { label: "T-Shirts", slug: "tshirts" },
    { label: "Kurtas", slug: "kurtas" },
    { label: "Jeans", slug: "jeans" },
    { label: "Trousers", slug: "trousers" },
  ],
  kids: [
    { label: "Boys Wear", slug: "boys" },
    { label: "Girls Wear", slug: "girls" },
    { label: "Ethnic Wear", slug: "kids-ethnic" },
  ],
  "ethnic-wear": [
    { label: "Sarees", slug: "sarees" },
    { label: "Kurtas & Suits", slug: "kurtas" },
    { label: "Lehengas", slug: "lehengas" },
    { label: "Sherwanis", slug: "sherwanis" },
  ],
  "western-wear": [
    { label: "Dresses", slug: "dresses" },
    { label: "Tops", slug: "tops" },
    { label: "Jeans", slug: "jeans" },
    { label: "Trousers", slug: "trousers" },
  ],
  footwear: [
    { label: "Sandals", slug: "sandals" },
    { label: "Heels", slug: "heels" },
    { label: "Flats", slug: "flats" },
    { label: "Juttis", slug: "juttis" },
  ],
  jewellery: [
    { label: "Earrings", slug: "earrings" },
    { label: "Necklaces", slug: "necklaces" },
    { label: "Bangles & Bracelets", slug: "bangles" },
  ],
  beauty: [
    { label: "Makeup", slug: "makeup" },
    { label: "Skincare", slug: "skincare" },
    { label: "Fragrances", slug: "fragrances" },
  ],
  handbags: [
    { label: "Totes", slug: "totes" },
    { label: "Slings", slug: "slings" },
    { label: "Clutches", slug: "clutches" },
  ],
  accessories: [
    { label: "Belts", slug: "belts" },
    { label: "Sunglasses", slug: "sunglasses" },
    { label: "Watches", slug: "watches" },
  ],
};

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const { cartCount, wishlist, pushRecent, isLoggedIn, openLoginModal } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!menuOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [menuOpen]);

  // Manage browser history and pushState for mobile menu
  useEffect(() => {
    if (!menuOpen) return;

    if (window.history.state?.mobileMenuOpen !== true) {
      window.history.pushState({ mobileMenuOpen: true }, "");
    }

    const handlePopState = (e: PopStateEvent) => {
      if (!e.state || !e.state.mobileMenuOpen) {
        setMenuOpen(false);
        setActiveSubmenu(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [menuOpen]);

  const closeMenuSafe = () => {
    if (window.history.state?.mobileMenuOpen) {
      window.history.back();
    } else {
      setMenuOpen(false);
      setActiveSubmenu(null);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    pushRecent(q);
    navigate({ to: "/search", search: { q } });
  };

  return (
    <>
      {/* Announcement Strip */}
      <div className="bg-primary py-2 px-4 text-center text-[10px] font-medium tracking-[0.18em] text-primary-foreground transition-all duration-500 break-words leading-normal">
        {announcements[announcementIdx]}
      </div>

      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 relative">
          <div className="relative flex h-16 items-center justify-between gap-4 lg:h-20">
            {/* Left: Hamburger (Mobile) or Logo (Desktop) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-full hover:bg-secondary lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
              >
                <Menu size={20} />
              </button>
              <div className="hidden lg:block">
                <Logo className="h-7" />
              </div>
            </div>

            {/* Center Logo (Mobile ONLY - Absolutely Centered) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden flex items-center justify-center">
              <Logo className="h-6" />
            </div>

            {/* Center: Mega search experience (Desktop) */}
            <form onSubmit={submit} className="hidden max-w-xl flex-1 lg:block" role="search">
              <div className="group flex w-full items-center gap-2 border-b border-border bg-transparent py-2 transition-colors focus-within:border-primary">
                <Search size={16} className="shrink-0 text-muted-foreground transition-colors group-focus-within:text-primary" aria-hidden />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search collections, fabrics, styles..."
                  aria-label="Search for products"
                  className="min-w-0 flex-1 bg-transparent text-xs tracking-wider uppercase outline-none placeholder:text-muted-foreground/60"
                />
              </div>
            </form>

            {/* Right: Actions */}
            <nav className="flex items-center gap-1 sm:gap-2" aria-label="Account and cart">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="rounded-full hover:bg-secondary lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <Search size={20} />
              </button>
              <button
                type="button"
                className="hidden items-center gap-1.5 rounded-sm px-2 py-1.5 text-xs tracking-wide hover:bg-secondary xl:flex animate-none"
              >
                <MapPin size={15} className="text-muted-foreground" />
                <span className="text-left leading-none">
                  <span className="block text-[9px] text-muted-foreground uppercase">Deliver to</span>
                  <span className="block text-[11px] font-semibold">Mumbai 400001</span>
                </span>
              </button>
              {isLoggedIn ? (
                <Link to="/account" className="hidden items-center gap-1 rounded-sm px-2 py-1.5 text-xs font-medium tracking-wide uppercase hover:bg-secondary lg:flex">
                  <User size={15} /> <span>Account</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openLoginModal()}
                  className="hidden items-center gap-1 rounded-sm px-2 py-1.5 text-xs font-medium tracking-wide uppercase hover:bg-secondary lg:flex"
                >
                  <User size={15} /> <span>Account</span>
                </button>
              )}
              <Link to="/wishlist" aria-label="Wishlist" className="relative rounded-full hover:bg-secondary min-w-[44px] min-h-[44px] flex items-center justify-center">
                <Heart size={20} />
                <Badge count={wishlist.length} />
              </Link>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-cart-drawer"));
                }}
                aria-label="Cart"
                className="relative rounded-full hover:bg-secondary min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <ShoppingBag size={20} />
                <Badge count={cartCount} />
              </button>
              <Link
                to="/sell"
                className="hidden items-center gap-1 border border-primary/20 px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground lg:flex"
              >
                <Store size={13} /> Sell
              </Link>
            </nav>
          </div>

          {/* Desktop Category Nav & Mega Menus */}
          <nav aria-label="Categories" className="relative hidden border-t border-border lg:block">
            <ul className="flex items-center justify-center gap-1 py-1">
              {NAV_LINKS.map((c) => (
                <li
                  key={c.slug}
                  className="static"
                  onMouseEnter={() => setActiveMegaMenu(c.slug)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link
                    to="/c/$slug"
                    params={{ slug: c.slug }}
                    className="flex items-center gap-1 px-4 py-2.5 text-xs font-semibold tracking-widest uppercase text-foreground/80 transition-colors hover:text-primary"
                    activeProps={{ className: "text-primary border-b border-primary" }}
                  >
                    {c.label}
                    {["women", "men", "ethnic-wear", "western-wear"].includes(c.slug) && (
                      <ChevronDown size={10} className="opacity-60" />
                    )}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {activeMegaMenu === c.slug && ["women", "men", "ethnic-wear", "western-wear"].includes(c.slug) && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full z-50 w-[min(1200px,calc(100vw-48px))] border border-border bg-card p-6 shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-top-1">
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <h4 className="text-[10px] font-bold tracking-widest uppercase text-primary border-b border-border pb-1">
                            Curated Categories
                          </h4>
                          <ul className="mt-3 space-y-2">
                            {CATEGORIES.slice(0, 5).map((cat) => (
                              <li key={cat.slug}>
                                <Link
                                  to="/c/$slug"
                                  params={{ slug: cat.slug }}
                                  className="text-xs text-muted-foreground hover:text-primary hover:pl-1 transition-all"
                                >
                                  {cat.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold tracking-widest uppercase text-primary border-b border-border pb-1">
                            Trending Now
                          </h4>
                          <ul className="mt-3 space-y-2">
                            <li>
                              <Link to="/c/$slug" params={{ slug: "new-arrivals" }} className="text-xs text-muted-foreground hover:text-primary">
                                Just In: New arrivals
                              </Link>
                            </li>
                            <li>
                              <Link to="/c/$slug" params={{ slug: "deals" }} className="text-xs text-muted-foreground hover:text-primary">
                                Seasonal Markdowns
                              </Link>
                            </li>
                            <li>
                              <Link to="/c/$slug" params={{ slug: "trending" }} className="text-xs text-muted-foreground hover:text-primary">
                                The Occasion Edit
                              </Link>
                            </li>
                          </ul>
                        </div>
                        <div className="bg-secondary/40 p-4 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-semibold tracking-widest uppercase text-muted-foreground">Campaign</span>
                            <h5 className="mt-1 font-display text-sm font-semibold">The Editorial Edit</h5>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              Hand-selected styles that define the current season.
                            </p>
                          </div>
                          <Link
                            to="/c/$slug"
                            params={{ slug: "new-arrivals" }}
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:gap-2.5 transition-all"
                          >
                            Shop The Edit <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-100 lg:hidden flex">
          {/* Backdrop overlay */}
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-[#140A0C]/45 backdrop-blur-[3px] transition-opacity duration-300"
            onClick={closeMenuSafe}
          />
          {/* Side Drawer Content */}
          <div className="relative w-[85vw] max-w-[400px] h-full overflow-y-auto bg-[#FCF9F5] p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
                {activeSubmenu ? (
                  <button
                    type="button"
                    onClick={() => setActiveSubmenu(null)}
                    className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-[#766D69] hover:text-[#1C1818] uppercase"
                  >
                    <ArrowRight size={14} className="rotate-180" /> Back
                  </button>
                ) : (
                  <span className="font-display text-base tracking-[0.2em] font-bold text-[#1C1818]">
                    MINORA
                  </span>
                )}
                <button
                  type="button"
                  onClick={closeMenuSafe}
                  aria-label="Close menu"
                  className="rounded-full min-w-[40px] min-h-[40px] flex items-center justify-center hover:bg-secondary/20 text-[#766D69] hover:text-[#1C1818] transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Multi-level Navigation Panel */}
              <nav aria-label="Mobile main navigation">
                {activeSubmenu ? (
                  // Submenu View
                  <div className="space-y-4">
                    <span className="block text-[10px] font-bold tracking-widest text-[#766D69] uppercase pb-2 border-b border-border/40">
                      {NAV_LINKS.find(n => n.slug === activeSubmenu)?.label || activeSubmenu}
                    </span>
                    <ul className="space-y-1">
                      <li>
                        <Link
                          to="/c/$slug"
                          params={{ slug: activeSubmenu }}
                          onClick={() => {
                            setActiveSubmenu(null);
                            setMenuOpen(false);
                          }}
                          className="flex items-center justify-between min-h-[48px] py-3 text-xs font-bold tracking-[0.1em] uppercase text-[#1C1818] hover:text-primary transition-colors"
                        >
                          View All
                        </Link>
                      </li>
                      {(SUB_CATEGORIES[activeSubmenu] || []).map((sub) => (
                        <li key={sub.slug} className="border-t border-border/20">
                          <Link
                            to="/c/$slug"
                            params={{ slug: sub.slug }}
                            onClick={() => {
                              setActiveSubmenu(null);
                              setMenuOpen(false);
                            }}
                            className="flex items-center justify-between min-h-[48px] py-3 text-xs font-medium tracking-[0.1em] uppercase text-[#766D69] hover:text-[#1C1818] transition-colors"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  // Main Top-level View
                  <ul className="space-y-1">
                    <li>
                      <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center min-h-[48px] py-3 text-xs font-bold tracking-[0.2em] uppercase text-[#1C1818] hover:text-primary transition-colors"
                      >
                        Home
                      </Link>
                    </li>
                    <li className="pt-2 border-t border-border/40 pb-1">
                      <span className="block text-[9px] font-bold tracking-widest text-[#766D69] uppercase">
                        Shop Collections
                      </span>
                    </li>
                    {NAV_LINKS.map((c) => {
                      const hasSub = SUB_CATEGORIES[c.slug] !== undefined;
                      return (
                        <li key={c.slug} className="border-t border-border/20">
                          {hasSub ? (
                            <button
                              type="button"
                              onClick={() => setActiveSubmenu(c.slug)}
                              className="w-full flex items-center justify-between min-h-[48px] py-3 text-xs font-medium tracking-[0.15em] uppercase text-[#1C1818] hover:text-[#5A101C] transition-colors"
                            >
                              <span>{c.label}</span>
                              <ChevronRight size={14} className="text-[#766D69]/60" />
                            </button>
                          ) : (
                            <Link
                              to="/c/$slug"
                              params={{ slug: c.slug }}
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center justify-between min-h-[48px] py-3 text-xs font-medium tracking-[0.15em] uppercase text-[#1C1818] hover:text-[#5A101C] transition-colors"
                            >
                              <span>{c.label}</span>
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </nav>
            </div>

            {/* Bottom Panel Actions inside Drawer */}
            <div className="mt-8 space-y-2 border-t border-border/60 pt-6">
              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between min-h-[44px] py-2 text-xs font-semibold tracking-[0.15em] uppercase text-[#1C1818] hover:text-primary"
              >
                <span className="flex items-center gap-2.5">
                  <Heart size={16} /> Wishlist
                </span>
                <span className="text-[10px] text-[#766D69] bg-secondary/40 px-2 py-0.5 rounded-full font-medium">
                  {wishlist.length} items
                </span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  window.dispatchEvent(new CustomEvent("open-cart-drawer"));
                }}
                className="w-full flex items-center justify-between min-h-[44px] py-2 text-xs font-semibold tracking-[0.15em] uppercase text-[#1C1818] hover:text-primary text-left"
              >
                <span className="flex items-center gap-2.5">
                  <ShoppingBag size={16} /> Shopping Bag
                </span>
                <span className="text-[10px] text-[#766D69] bg-secondary/40 px-2 py-0.5 rounded-full font-medium">
                  {cartCount} items
                </span>
              </button>

              {isLoggedIn ? (
                <Link
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between min-h-[44px] py-2 text-xs font-semibold tracking-[0.15em] uppercase text-[#1C1818] hover:text-primary"
                >
                  <span className="flex items-center gap-2.5">
                    <User size={16} /> Account Profile
                  </span>
                  <ChevronRight size={14} className="text-[#766D69]/60" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    openLoginModal();
                  }}
                  className="w-full text-left flex items-center justify-between min-h-[44px] py-2 text-xs font-semibold tracking-[0.15em] uppercase text-[#1C1818] hover:text-primary"
                >
                  <span className="flex items-center gap-2.5">
                    <User size={16} /> Sign In
                  </span>
                  <ChevronRight size={14} className="text-[#766D69]/60" />
                </button>
              )}
              
              <Link
                to="/sell"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between min-h-[44px] py-2 text-xs font-semibold tracking-[0.15em] uppercase text-[#5A101C] hover:text-primary-soft transition-colors"
              >
                <span>Become a Seller</span>
                <ChevronRight size={14} className="text-[#5A101C]/60" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}