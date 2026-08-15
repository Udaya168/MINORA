import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { getProduct } from "@/data/products";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import { OrderSummary } from "@/components/site/OrderSummary";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Bag — MINORA" },
      { name: "description", content: "Review the items in your MINORA shopping bag and checkout securely with UPI, cards or cash on delivery." },
      { property: "og:title", content: "Shopping Bag — MINORA" },
      { property: "og:description", content: "Review your bag and checkout securely on MINORA." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, setQty, removeFromCart, toggleWishlist, hydrated } = useStore();

  const lines = cart
    .map((l) => ({ line: l, product: getProduct(l.id) }))
    .filter((x) => x.product);

  if (hydrated && lines.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShoppingBag size={40} className="mx-auto text-muted-foreground" />
        <h1 className="mt-4 font-display text-2xl">Your bag is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add your favourite styles and they'll show up here.
        </p>
        <Link to="/c/$slug" params={{ slug: "trending" }} className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-5 sm:px-5">
      <h1 className="font-display text-2xl">Shopping Bag</h1>
      <div className="mt-5 gap-6 lg:flex lg:items-start">
        <ul className="min-w-0 flex-1 space-y-3">
          {lines.map(({ line, product }) => {
            const p = product!;
            return (
              <li key={`${line.id}-${line.size}`} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                <Link to="/product/$id" params={{ id: p.id }} className="shrink-0">
                  <img src={p.images[0]} alt={p.name} loading="lazy" width={768} height={1024} className="h-28 w-21 rounded-md object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-medium">
                    <Link to="/product/$id" params={{ id: p.id }}>{p.name}</Link>
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">Size: {line.size} · {p.colors[0]}</p>
                  <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
                    <span className="text-sm font-semibold">{inr(p.price)}</span>
                    <span className="text-xs text-muted-foreground line-through">{inr(p.originalPrice)}</span>
                    <span className="text-xs font-semibold text-success">{p.discount}% off</span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-md border border-border">
                      <button type="button" aria-label="Decrease quantity" onClick={() => setQty(line.id, line.size, line.qty - 1)} className="px-2 py-1.5 hover:bg-secondary">
                        <Minus size={14} />
                      </button>
                      <span className="min-w-8 text-center text-sm">{line.qty}</span>
                      <button type="button" aria-label="Increase quantity" onClick={() => setQty(line.id, line.size, line.qty + 1)} className="px-2 py-1.5 hover:bg-secondary">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        toggleWishlist(p.id);
                        removeFromCart(line.id, line.size);
                        toast.success("Moved to wishlist");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary"
                    >
                      <Heart size={14} /> Move to Wishlist
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removeFromCart(line.id, line.size);
                        toast.success("Removed from bag");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 lg:mt-0 lg:w-80 lg:shrink-0">
          <OrderSummary cta="Proceed to Checkout" to="/checkout" />
        </div>
      </div>
    </div>
  );
}