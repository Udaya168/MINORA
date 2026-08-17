import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  LogOut,
  Store,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { AdminDashboard } from "./AdminDashboard";
import { AdminProducts } from "./AdminProducts";
import { AdminInventory } from "./AdminInventory";
import { AdminOrders } from "./AdminOrders";
import { AdminCustomers } from "./AdminCustomers";
import { Link } from "@tanstack/react-router";

export function AdminPortal() {
  const { profile, logout } = useStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "inventory", label: "Inventory & Stock", icon: Layers },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "customers", label: "Customers", icon: Users },
  ];

  const adminName = profile?.full_name || "Admin User";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Admin Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-xl font-bold tracking-wider text-primary">MINORA</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/15 text-primary uppercase tracking-widest border border-primary/20">
              <ShieldAlert size={10} /> Admin
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-secondary/40 text-xs font-semibold text-foreground hover:bg-secondary transition-all"
          >
            <Store size={14} /> View Storefront
          </Link>

          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="h-8 w-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs border border-primary/30">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold leading-tight truncate max-w-[120px]">{adminName}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">Store Manager</p>
            </div>
            <button
              onClick={() => logout()}
              className="p-2 rounded-xl border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all ml-1"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-60 border-r border-border bg-card p-4 space-y-2 flex-shrink-0">
          <div className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest px-3 mb-2">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden flex">
            <div className="w-64 bg-card border-r border-border p-4 space-y-4 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="font-display font-bold text-sm tracking-wider">ADMIN NAVIGATION</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-muted-foreground">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-1 flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground font-bold"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-border">
                <Link
                  to="/"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-xs font-semibold"
                >
                  <Store size={14} /> View Storefront
                </Link>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-background max-w-7xl mx-auto w-full">
          {activeTab === "dashboard" && <AdminDashboard onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === "products" && <AdminProducts />}
          {activeTab === "inventory" && <AdminInventory />}
          {activeTab === "orders" && <AdminOrders />}
          {activeTab === "customers" && <AdminCustomers />}
        </main>
      </div>
    </div>
  );
}
