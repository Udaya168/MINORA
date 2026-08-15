import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { getProduct, PRODUCTS } from "@/data/products";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, setQty, removeFromCart, totals, hydrated } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-cart-drawer", handleOpen);
    return () => window.removeEventListener("open-cart-drawer", handleOpen);
  }, []);

  const lines = cart
    .map((l) => ({ line: l, product: getProduct(l.id) }))
    .filter((x) => x.product);

  // Suggest first 3 products not already in cart
  const suggestions = PRODUCTS.filter(p => !cart.some(l => l.id === p.id)).slice(0, 3);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-foreground/30 backdrop-blur-xs"
        onClick={() => setIsOpen(false)}
        aria-label="Close cart"
      />

      {/* Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-primary" />
            <h2 className="font-display text-lg tracking-wide">Your Bag ({lines.length})</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="no-scrollbar flex-1 overflow-y-auto p-5 space-y-6">
          {hydrated && lines.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <ShoppingBag size={32} className="mx-auto text-muted-foreground/60 animate-bounce" />
              <p className="text-xs text-muted-foreground tracking-wider uppercase">Your bag is empty</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="border border-primary bg-primary px-6 py-2.5 text-[10px] font-bold tracking-[0.2em] text-primary-foreground hover:bg-transparent hover:text-primary transition-all duration-300"
              >
                START SHOPPING
              </button>
            </div>
          ) : (
            <>
              {/* Product Lines */}
              <ul className="space-y-4 divide-y divide-border">
                {lines.map(({ line, product }, idx) => {
                  const p = product!;
                  return (
                    <li key={`${line.id}-${line.size}`} className={`flex gap-4 ${idx > 0 ? "pt-4" : ""}`}>
                      <Link
                        to="/product/$id"
                        params={{ id: p.id }}
                        onClick={() => setIsOpen(false)}
                        className="h-24 w-18 shrink-0 overflow-hidden bg-secondary/20"
                      >
                        <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                      </Link>
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div className="space-y-0.5">
                          <h3 className="truncate text-xs font-semibold tracking-wide text-foreground">
                            <Link to="/product/$id" params={{ id: p.id }} onClick={() => setIsOpen(false)}>
                              {p.name}
                            </Link>
                          </h3>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                            Size: {line.size}
                          </p>
                          <div className="flex items-baseline gap-1.5 pt-0.5">
                            <span className="text-xs font-bold">{inr(p.price)}</span>
                            <span className="text-[10px] text-muted-foreground line-through font-light">
                              {inr(p.originalPrice)}
                            </span>
                          </div>
                        </div>

                        {/* Line Actions */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-border">
                            <button
                              type="button"
                              onClick={() => setQty(line.id, line.size, line.qty - 1)}
                              className="px-2 py-1 hover:bg-secondary text-muted-foreground"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="w-6 text-center text-xs">{line.qty}</span>
                            <button
                              type="button"
                              onClick={() => setQty(line.id, line.size, line.qty + 1)}
                              className="px-2 py-1 hover:bg-secondary text-muted-foreground"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(line.id, line.size)}
                            className="text-muted-foreground hover:text-destructive p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Suggestions Curations (Complete the Look) */}
              {suggestions.length > 0 && (
                <div className="border-t border-border pt-6 space-y-3">
                  <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
                    Complete The Look
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {suggestions.map((p) => (
                      <Link
                        key={p.id}
                        to="/product/$id"
                        params={{ id: p.id }}
                        onClick={() => setIsOpen(false)}
                        className="group space-y-1 block text-center"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-secondary/10">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="h-full w-full object-cover group-hover:scale-103 transition-all duration-300"
                          />
                        </div>
                        <h5 className="truncate text-[9px] text-muted-foreground font-medium group-hover:text-primary transition-colors">
                          {p.name}
                        </h5>
                        <span className="text-[9px] font-bold block">{inr(p.price)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        {lines.length > 0 && (
          <div className="border-t border-border p-5 bg-secondary/20 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between font-light text-muted-foreground">
                <span>Subtotal</span>
                <span>{inr(totals.mrp)}</span>
              </div>
              <div className="flex justify-between font-light text-success">
                <span>Bag Discount</span>
                <span>-{inr(totals.discount)}</span>
              </div>
              <div className="flex justify-between font-light text-muted-foreground border-b border-border/40 pb-2">
                <span>Delivery Charges</span>
                <span>{totals.delivery > 0 ? inr(totals.delivery) : "FREE"}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-foreground pt-1.5">
                <span>Total Payable</span>
                <span>{inr(totals.total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate({ to: "/checkout" });
              }}
              className="w-full bg-primary py-3 text-[11px] font-bold tracking-[0.2em] text-primary-foreground hover:bg-primary/95 transition-all text-center uppercase"
            >
              PROCEED TO SECURE CHECKOUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
