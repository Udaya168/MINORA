import { useState, useEffect, useRef } from "react";
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
  Package,
  LogOut,
  ShieldCheck,
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

export function Header({ isLanding = true, showCategoryNav = true }: { isLanding?: boolean; showCategoryNav?: boolean }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const { cartCount, wishlist, pushRecent, user, fullName, role, isLoggedIn, logout } = useStore();
  const navigate = useNavigate();

  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    pushRecent(q);
    navigate({ to: "/search", search: { q: q.trim() } });
    setSearchOpen(false);
  };

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR */}
      {isLanding && (
        <div className="bg-[#1C1818] text-white py-2 text-[11px] font-medium tracking-[0.2em] text-center uppercase border-b border-white/10 transition-all">
          <div className="mx-auto max-w-[1400px] px-4 flex items-center justify-between">
            <div className="hidden md:block w-1/4 text-left text-[10px] text-white/60">
              MINORA ONLINE CONCIERGE
            </div>
            <div className="w-full md:w-1/2 text-center animate-fade-in" key={announcementIdx}>
              {announcements[announcementIdx]}
            </div>
            <div className="hidden md:flex w-1/4 justify-end gap-4 text-[10px] text-white/70 tracking-widest">
              <Link to="/sell" className="hover:text-white transition-colors">BECOME A SELLER</Link>
              <span>•</span>
              <Link to="/help" className="hover:text-white transition-colors">HELP</Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN HEADER (Sticky Container) */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border transition-all">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
            
            {/* Left: Mobile Menu Button & Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open Navigation Menu"
                className="rounded-full p-2 hover:bg-secondary lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <Menu size={22} />
              </button>
              <Logo className="h-6 sm:h-7" />
            </div>

            {/* Middle: Desktop Search Bar (Wide Layout) */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full flex items-center border border-border/80 bg-secondary/30 rounded-full px-4 py-2 focus-within:border-primary focus-within:bg-background transition-all">
                <Search size={16} className="text-muted-foreground mr-2 shrink-0" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search collections, fabrics, styles..."
                  aria-label="Search for products"
                  className="min-w-0 flex-1 bg-transparent text-xs tracking-wider uppercase outline-none placeholder:text-muted-foreground/60"
                />
              </div>
            </form>

            {/* Right: Actions */}
            <nav className="flex items-center gap-1 sm:gap-2" aria-label="Wishlist and cart">
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

              {/* Desktop Account / Login Area */}
              {isLoggedIn ? (
                <div className="relative hidden lg:block" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    className="flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-semibold tracking-wide hover:bg-secondary transition-colors"
                  >
                    <User size={15} />
                    <span className="max-w-[130px] truncate">{fullName || "My Account"}</span>
                    <ChevronDown size={12} className="text-muted-foreground" />
                  </button>

                  {accountDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-card p-1.5 shadow-xl z-50 animate-in fade-in-50 zoom-in-95">
                      <div className="px-3 py-2 border-b border-border/80 mb-1">
                        <p className="text-xs font-semibold text-foreground truncate">{fullName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                      >
                        <User size={14} /> My Account
                      </Link>
                      <Link
                        to="/account"
                        search={{ tab: "orders" }}
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                      >
                        <Package size={14} /> My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                      >
                        <Heart size={14} /> Wishlist
                      </Link>
                      {(role === "admin" || role === "super_admin") && (
                        <a
                          href="/admin"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                        >
                          <ShieldCheck size={14} /> Admin Portal
                        </a>
                      )}
                      <div className="border-t border-border/80 my-1" />
                      <button
                        type="button"
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
                      >
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-semibold tracking-wide uppercase hover:bg-secondary lg:flex transition-colors"
                >
                  <User size={15} /> <span>Login</span>
                </Link>
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
          {showCategoryNav && (
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
          )}
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
                        replace={true}
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

              {/* Mobile Account / Login Section */}
              {isLoggedIn ? (
                <div className="rounded-lg border border-border/80 bg-secondary/30 p-3 my-2 space-y-2">
                  <div className="border-b border-border/60 pb-2">
                    <p className="text-xs font-bold text-foreground truncate">{fullName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-1.5 text-xs font-semibold tracking-wider text-foreground hover:text-primary"
                  >
                    <span className="flex items-center gap-2"><User size={14} /> My Account</span>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </Link>
                  <Link
                    to="/account"
                    search={{ tab: "orders" }}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-1.5 text-xs font-semibold tracking-wider text-foreground hover:text-primary"
                  >
                    <span className="flex items-center gap-2"><Package size={14} /> My Orders</span>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </Link>
                  {(role === "admin" || role === "super_admin") && (
                    <a
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between py-1.5 text-xs font-semibold tracking-wider text-primary hover:underline"
                    >
                      <span className="flex items-center gap-2"><ShieldCheck size={14} /> Admin Portal</span>
                      <ChevronRight size={14} className="text-primary/60" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-between py-1.5 text-xs font-semibold tracking-wider text-destructive hover:bg-destructive/10 text-left"
                  >
                    <span className="flex items-center gap-2"><LogOut size={14} /> Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between min-h-[44px] py-2 text-xs font-semibold tracking-[0.15em] uppercase text-[#1C1818] hover:text-primary"
                >
                  <span className="flex items-center gap-2.5">
                    <User size={16} /> Login
                  </span>
                  <ChevronRight size={14} className="text-[#766D69]/60" />
                </Link>
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

export function LandingHeader() {
  return <Header isLanding={true} showCategoryNav={true} />;
}

export function UserAppHeader() {
  return <Header isLanding={false} showCategoryNav={true} />;
}

export function AuthHeader() {
  return <Header isLanding={false} showCategoryNav={false} />;
}