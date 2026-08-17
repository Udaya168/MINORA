import { useState, useEffect } from "react";
import { Package, Layers, AlertTriangle, XCircle, ShoppingBag, Clock, ArrowUpRight, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCTS } from "@/data/products";

export function AdminDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    productsCount: 0,
    inventoryCount: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    ordersCount: 0,
    pendingOrdersCount: 0,
  });

  const loadMetrics = async () => {
    setLoading(true);
    try {
      // 1. Fetch Products count from Supabase
      const { count: prodCount, error: prodErr } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      console.log("[Dashboard] Products count:", prodCount);
      if (prodErr) {
        console.error("[Dashboard] Products error:", prodErr.message);
      }

      const totalProducts = prodErr ? 0 : (prodCount ?? 0);

      // 2. Fetch Inventory from Supabase
      const { data: invData, error: invErr } = await supabase
        .from("inventory")
        .select("quantity");

      console.log("[Dashboard] Inventory variants count:", invData?.length);
      if (invErr) {
        console.error("[Dashboard] Inventory error:", invErr.message);
      }

      let totalInvItems = 0;
      let lowStock = 0;
      let outOfStock = 0;

      if (!invErr && invData) {
        totalInvItems = invData.length;
        invData.forEach((item: any) => {
          const qty = Number(item.quantity) || 0;
          if (qty === 0) outOfStock++;
          else if (qty <= 5) lowStock++;
        });
      }

      // 3. Fetch Orders count from public.orders
      let ordersCount = 0;
      let pendingOrdersCount = 0;

      const { data: ordersData, error: ordErr } = await supabase
        .from("orders")
        .select("status");

      console.log("[Dashboard] Orders count:", ordersData ? ordersData.length : 0);
      if (!ordErr && ordersData) {
        ordersCount = ordersData.length;
        pendingOrdersCount = ordersData.filter(
          (o: any) => o.status === "pending" || o.status === "processing"
        ).length;
      }

      setStats({
        productsCount: totalProducts,
        inventoryCount: totalInvItems,
        lowStockCount: lowStock,
        outOfStockCount: outOfStock,
        ordersCount,
        pendingOrdersCount,
      });
    } catch (e: any) {
      console.error("[Dashboard] Error loading dashboard metrics:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const cards = [
    {
      title: "Total Products",
      value: stats.productsCount,
      label: "Active catalog items",
      icon: Package,
      tab: "products",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Inventory Variants",
      value: stats.inventoryCount,
      label: "Tracked stock variants",
      icon: Layers,
      tab: "inventory",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockCount,
      label: "5 or fewer units remaining",
      icon: AlertTriangle,
      tab: "inventory",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStockCount,
      label: "0 units available",
      icon: XCircle,
      tab: "inventory",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      title: "Total Orders",
      value: stats.ordersCount,
      label: "All customer purchases",
      icon: ShoppingBag,
      tab: "orders",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrdersCount,
      label: "Awaiting fulfillment",
      icon: Clock,
      tab: "orders",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Overview Dashboard</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time catalog metrics, inventory status, and store activity.
          </p>
        </div>
        <button
          onClick={loadMetrics}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-secondary/80 text-xs font-semibold text-foreground hover:bg-secondary transition-all"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Stats
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => onNavigate(card.tab)}
              className="group cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary/50 transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon size={20} />
                </div>
                <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold font-mono">{card.value}</p>
                <h3 className="text-xs font-semibold text-foreground mt-1">{card.title}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold tracking-wide uppercase text-primary">Catalog & Stock Control</h3>
          <p className="text-xs text-muted-foreground max-w-xl">
            Manage your fashion catalog, update stock quantities, monitor order fulfillment, and inspect customer accounts directly from Supabase.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("products")}
            className="px-4 py-2.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground tracking-wider uppercase hover:bg-primary/95 transition-all"
          >
            Manage Products
          </button>
          <button
            onClick={() => onNavigate("inventory")}
            className="px-4 py-2.5 rounded-xl border border-border bg-background text-xs font-bold text-foreground tracking-wider uppercase hover:bg-secondary transition-all"
          >
            Manage Stock
          </button>
        </div>
      </div>
    </div>
  );
}
