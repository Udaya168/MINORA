import { Link } from "@tanstack/react-router";
import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react";
import { useStore } from "@/lib/store";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/c/$slug", params: { slug: "women" }, label: "Categories", icon: LayoutGrid },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
  { to: "/account", label: "Account", icon: User },
] as const;

export function BottomNav() {
  const { cartCount, wishlist, isLoggedIn, openLoginModal } = useStore();

  const badgeFor = (label: string) =>
    label === "Cart" ? cartCount : label === "Wishlist" ? wishlist.length : 0;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
    >
      <ul className="grid grid-cols-5 h-14">
        {items.map((item) => {
          const Icon = item.icon;
          const count = badgeFor(item.label);
          
          if (item.label === "Account" && !isLoggedIn) {
            return (
              <li key={item.label} className="h-full">
                <button
                  type="button"
                  onClick={() => openLoginModal()}
                  className="w-full h-full relative flex flex-col items-center justify-center gap-0.5 text-[9px] font-bold tracking-wider text-muted-foreground hover:text-primary transition-colors uppercase"
                >
                  <span className="relative">
                    <Icon size={18} />
                  </span>
                  <span>{item.label}</span>
                </button>
              </li>
            );
          }

          return (
            <li key={item.label} className="h-full">
              <Link
                to={item.to}
                {...("params" in item ? { params: item.params } : {})}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-primary" }}
                className="relative w-full h-full flex flex-col items-center justify-center gap-0.5 text-[9px] font-bold tracking-wider text-muted-foreground uppercase transition-colors"
              >
                <span className="relative">
                  <Icon size={18} />
                  {count > 0 && (
                    <span className="absolute -right-2 -top-1.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-primary px-1 text-[8px] font-bold text-primary-foreground">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}