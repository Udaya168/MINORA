import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { Package, MapPin, Heart, User as UserIcon, CreditCard, LogOut, ChevronRight, ShieldCheck, Loader2, Clock, CheckCircle2, Truck, XCircle } from "lucide-react";
import { PRODUCTS, getProduct } from "@/data/products";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const accountSearchSchema = z.object({
  tab: z.string().optional(),
});

export const Route = createFileRoute("/account")({
  validateSearch: accountSearchSchema,
  head: () => ({
    meta: [
      { title: "My Account — MINORA" },
      { name: "description", content: "Manage your MINORA profile, track orders, saved addresses, payment methods and wishlist in one place." },
      { property: "og:title", content: "My Account — MINORA" },
    ],
  }),
  component: AccountPage,
});

const TABS = [
  { id: "orders", label: "My Orders", icon: Package },
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "payments", label: "Payments", icon: CreditCard },
];

function AccountPage() {
  const search = Route.useSearch();
  const [tab, setTab] = useState(search.tab || "orders");
  const { wishlist, isLoggedIn, fullName, user, profile, role, logout } = useStore();
  const navigate = useNavigate();
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadCustomerOrders() {
      if (!user?.id) return;
      setLoadingOrders(true);
      try {
        const { data: ordData, error: ordErr } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!ordErr && ordData && isMounted) {
          setCustomerOrders(ordData);
        }
      } catch (e) {
        // Fallback
      } finally {
        if (isMounted) setLoadingOrders(false);
      }
    }
    loadCustomerOrders();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="font-display text-2xl tracking-wide">MY ACCOUNT</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xs">
          Please sign in to view your orders, saved addresses, and profile details.
        </p>
        <Link
          to="/login"
          className="mt-8 rounded-none bg-primary px-8 py-3.5 text-xs font-bold tracking-widest text-primary-foreground hover:bg-primary/95 transition-all uppercase"
        >
          SIGN IN TO PROFILE
        </Link>
      </div>
    );
  }

  const initialLetter = (fullName || user?.email || "A").charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-[1200px] px-3 py-5 sm:px-5">
      <h1 className="font-display text-2xl">My Account</h1>

      <div className="mt-5 gap-6 lg:flex lg:items-start">
        <aside className="rounded-xl border border-border bg-card p-3 lg:w-64 lg:shrink-0">
          <div className="flex min-w-0 items-center gap-3 border-b border-border px-2 pb-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-soft font-display text-primary text-lg font-bold">
              {initialLetter}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{fullName || "User"}</span>
              <span className="block truncate text-xs text-muted-foreground">{user?.email}</span>
            </span>
          </div>
          <nav className="mt-2 flex gap-1 overflow-x-auto lg:flex-col">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm lg:w-full ${
                  tab === t.id ? "bg-primary-soft font-medium text-primary" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <t.icon size={16} /> {t.label}
              </button>
            ))}
            <Link
              to="/wishlist"
              className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary lg:w-full"
            >
              <Heart size={16} /> Wishlist
              <span className="ml-auto text-xs">{wishlist.length}</span>
            </Link>
            {(role === "admin" || role === "super_admin") && (
              <a
                href="/admin"
                className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm text-primary hover:bg-primary-soft lg:w-full"
              >
                <ShieldCheck size={16} /> Admin Portal
              </a>
            )}
            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate({ to: "/" });
              }}
              className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary lg:w-full"
            >
              <LogOut size={16} /> Logout
            </button>
          </nav>
        </aside>

        <section className="mt-5 min-w-0 flex-1 lg:mt-0">
          {tab === "orders" && (
            <div>
              {loadingOrders ? (
                <div className="py-12 text-center text-muted-foreground">
                  <Loader2 size={24} className="animate-spin mx-auto mb-2 text-primary" />
                  Loading your orders...
                </div>
              ) : customerOrders.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-8 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-secondary text-muted-foreground mx-auto flex items-center justify-center">
                    <Package size={24} />
                  </div>
                  <h3 className="font-display font-semibold text-foreground">No Orders Yet</h3>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    You haven't placed any orders with MINORA yet. Explore our curated collections.
                  </p>
                  <Link
                    to="/c/$slug"
                    params={{ slug: "trending" }}
                    className="inline-block px-5 py-2.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground tracking-wider uppercase"
                  >
                    Explore Catalog
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {customerOrders.map((o) => {
                    const statusKey = (o.status || "processing").toLowerCase();
                    const formattedDate = o.created_at
                      ? new Date(o.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Recently";

                    const itemsList = Array.isArray(o.order_items) ? o.order_items : [];

                    return (
                      <li key={o.id || o.order_number} className="rounded-xl border border-border bg-card p-4 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 text-xs">
                          <div>
                            <span className="text-muted-foreground">
                              Order <span className="font-bold text-foreground font-mono">{o.order_number || o.id}</span>
                            </span>
                            <span className="ml-2 text-[11px] text-muted-foreground font-light">· {formattedDate}</span>
                          </div>

                          <div>
                            {statusKey === "delivered" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                                <CheckCircle2 size={12} /> Delivered
                              </span>
                            )}
                            {statusKey === "shipped" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500">
                                <Truck size={12} /> Shipped
                              </span>
                            )}
                            {statusKey === "confirmed" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-500">
                                <CheckCircle2 size={12} /> Confirmed
                              </span>
                            )}
                            {statusKey === "processing" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500">
                                <Clock size={12} /> Processing
                              </span>
                            )}
                            {statusKey === "cancelled" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500">
                                <XCircle size={12} /> Cancelled
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Order Items List */}
                        <div className="space-y-2">
                          {itemsList.length > 0 ? (
                            itemsList.map((item: any, idx: number) => {
                              const prod = getProduct(item.product_id);
                              const imgSrc = item.image_url || (prod ? prod.images[0] : "/assets/p-kurti.jpg");
                              return (
                                <div key={item.id || idx} className="flex items-center gap-3 pt-1">
                                  <img
                                    src={imgSrc}
                                    alt={item.product_name}
                                    className="h-16 w-12 rounded object-cover border border-border"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-xs text-foreground truncate">{item.product_name}</p>
                                    <p className="text-[10px] text-muted-foreground">
                                      Size: {item.size || "M"} · Qty: {item.quantity}
                                    </p>
                                    <p className="text-xs font-mono font-bold text-foreground mt-0.5">{inr(item.price)}</p>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-xs text-muted-foreground">{o.items_count || 1} Item(s)</p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Total Paid:</span>
                          <span className="font-mono font-bold text-sm text-foreground">{inr(o.total_amount || o.total || 0)}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {tab === "profile" && (
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
              <h2 className="font-display text-lg">Profile Details</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Full Name</span>
                  <input value={fullName || ""} readOnly className="w-full rounded-md border border-border bg-secondary/30 px-3 py-2.5 text-sm outline-none" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Email</span>
                  <input value={user?.email || ""} readOnly className="w-full rounded-md border border-border bg-secondary/30 px-3 py-2.5 text-sm outline-none" />
                </label>
              </div>
            </div>
          )}

          {tab === "addresses" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { tag: "Home", name: fullName || "User", line: "402, Sunrise Residency, Bandra West, Mumbai, Maharashtra 400050" },
              ].map((a) => (
                <div key={a.tag} className="rounded-xl border border-border bg-card p-4">
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">{a.tag}</span>
                  <p className="mt-2 text-sm font-medium">{a.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{a.line}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "payments" && (
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
              <h2 className="font-display text-lg">Saved Payments</h2>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <CreditCard size={18} className="text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">UPI / Saved Card</span>
                    <span className="block text-xs text-muted-foreground">Default payment option</span>
                  </span>
                </li>
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}