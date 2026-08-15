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
  const { cartCount, wishlist } = useStore();

  const badgeFor = (label: string) =>
    label === "Cart" ? cartCount : label === "Wishlist" ? wishlist.length : 0;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          const count = badgeFor(item.label);
          return (
            <li key={item.label}>
              <Link
                to={item.to}
                {...("params" in item ? { params: item.params } : {})}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-primary" }}
                className="relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium text-muted-foreground"
              >
                <span className="relative">
                  <Icon size={20} />
                  {count > 0 && (
                    <span className="absolute -right-2 -top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-primary px-1 text-[9px] text-primary-foreground">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}