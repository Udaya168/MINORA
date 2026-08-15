import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, MapPin, Heart, User, CreditCard, LogOut, ChevronRight } from "lucide-react";
import { PRODUCTS, getProduct } from "@/data/products";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — MINORA" },
      { name: "description", content: "Manage your MINORA profile, track orders, saved addresses, payment methods and wishlist in one place." },
      { property: "og:title", content: "My Account — MINORA" },
      { property: "og:description", content: "Orders, addresses and profile settings on MINORA." },
    ],
  }),
  component: AccountPage,
});

const TABS = [
  { id: "orders", label: "My Orders", icon: Package },
  { id: "profile", label: "Profile", icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "payments", label: "Payments", icon: CreditCard },
];

const ORDERS = [
  { id: "MIN284917", status: "Delivered", date: "12 Mar 2026", productIdx: 0 },
  { id: "MIN273408", status: "Out for delivery", date: "24 Mar 2026", productIdx: 4 },
  { id: "MIN261155", status: "Processing", date: "28 Mar 2026", productIdx: 9 },
];

function AccountPage() {
  const [tab, setTab] = useState("orders");
  const { wishlist } = useStore();

  return (
    <div className="mx-auto max-w-[1200px] px-3 py-5 sm:px-5">
      <h1 className="font-display text-2xl">My Account</h1>

      <div className="mt-5 gap-6 lg:flex lg:items-start">
        <aside className="rounded-xl border border-border bg-card p-3 lg:w-64 lg:shrink-0">
          <div className="flex min-w-0 items-center gap-3 border-b border-border px-2 pb-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-soft font-display text-primary">A</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">Aanya Sharma</span>
              <span className="block truncate text-xs text-muted-foreground">+91 98765 43210</span>
            </span>
          </div>
          <nav className="mt-2 flex gap-1 overflow-x-auto lg:flex-col">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm lg:w-full ${tab === t.id ? "bg-primary-soft font-medium text-primary" : "text-muted-foreground hover:bg-secondary"}`}
              >
                <t.icon size={16} /> {t.label}
              </button>
            ))}
            <Link to="/wishlist" className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary lg:w-full">
              <Heart size={16} /> Wishlist
              <span className="ml-auto text-xs">{wishlist.length}</span>
            </Link>
            <button type="button" className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary lg:w-full">
              <LogOut size={16} /> Logout
            </button>
          </nav>
        </aside>

        <section className="mt-5 min-w-0 flex-1 lg:mt-0">
          {tab === "orders" && (
            <ul className="space-y-3">
              {ORDERS.map((o) => {
                const p = PRODUCTS[o.productIdx] ?? getProduct(PRODUCTS[0]!.id)!;
                return (
                  <li key={o.id} className="rounded-xl border border-border bg-card p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 text-xs">
                      <span className="text-muted-foreground">Order <span className="font-medium text-foreground">{o.id}</span> · {o.date}</span>
                      <span className={`rounded-full px-2 py-0.5 font-medium ${o.status === "Delivered" ? "bg-success/10 text-success" : "bg-primary-soft text-primary"}`}>{o.status}</span>
                    </div>
                    <Link to="/product/$id" params={{ id: p.id }} className="mt-3 flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} loading="lazy" width={768} height={1024} className="h-20 w-16 rounded object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{p.name}</span>
                        <span className="block text-xs text-muted-foreground">{p.categoryLabel}</span>
                        <span className="mt-1 block text-sm font-semibold">{inr(p.price)}</span>
                      </span>
                      <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {tab === "profile" && (
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
              <h2 className="font-display text-lg">Profile Details</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["Full name", "Aanya Sharma"],
                  ["Mobile", "+91 98765 43210"],
                  ["Email", "aanya.sharma@example.com"],
                  ["Gender", "Female"],
                ].map(([label, value]) => (
                  <label key={label} className="block">
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
                    <input defaultValue={value} className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
                  </label>
                ))}
              </div>
              <button type="button" className="mt-4 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Save Changes</button>
            </div>
          )}

          {tab === "addresses" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { tag: "Home", name: "Aanya Sharma", line: "402, Sunrise Residency, Bandra West, Mumbai, Maharashtra 400050" },
                { tag: "Work", name: "Aanya Sharma", line: "9th Floor, Prestige Tower, Koramangala, Bengaluru, Karnataka 560034" },
              ].map((a) => (
                <div key={a.tag} className="rounded-xl border border-border bg-card p-4">
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">{a.tag}</span>
                  <p className="mt-2 text-sm font-medium">{a.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{a.line}</p>
                  <div className="mt-3 flex gap-3 text-sm font-medium text-primary">
                    <button type="button">Edit</button>
                    <button type="button">Remove</button>
                  </div>
                </div>
              ))}
              <button type="button" className="rounded-xl border border-dashed border-border p-4 text-sm font-medium text-primary">+ Add New Address</button>
            </div>
          )}

          {tab === "payments" && (
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
              <h2 className="font-display text-lg">Saved Payments</h2>
              <ul className="mt-4 space-y-3">
                {[
                  ["HDFC Bank Credit Card", "•••• 4821"],
                  ["UPI", "aanya@okhdfcbank"],
                ].map(([t, s]) => (
                  <li key={t} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <CreditCard size={18} className="text-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{t}</span>
                      <span className="block text-xs text-muted-foreground">{s}</span>
                    </span>
                    <button type="button" className="text-sm font-medium text-primary">Remove</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}