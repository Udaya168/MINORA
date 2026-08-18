import { useState, useEffect, useRef } from "react";
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
  Shield,
  Bell,
  HelpCircle,
  Search,
  ChevronRight,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  Info,
  Trash2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { AdminDashboard } from "./AdminDashboard";
import { AdminProducts } from "./AdminProducts";
import { AdminInventory } from "./AdminInventory";
import { AdminOrders } from "./AdminOrders";
import { AdminCustomers } from "./AdminCustomers";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { inr } from "@/lib/format";

type AdminNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  order_id?: string | null;
  product_id?: string | null;
  customer_id?: string | null;
  is_read: boolean;
  created_at: string;
};

// Sidebar Menu Groupings (STRICT)
const menuGroups = [
  {
    title: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Catalog",
    items: [
      { id: "products", label: "Products", icon: Package },
      { id: "inventory", label: "Inventory", icon: Layers },
    ],
  },
  {
    title: "Commerce",
    items: [
      { id: "orders", label: "Orders", icon: ShoppingBag },
      { id: "customers", label: "Customers", icon: Users },
    ],
  },
  {
    title: "System",
    items: [
      { id: "notifications_view", label: "Notifications", icon: Bell },
    ],
  },
];

const quickSearchActions = [
  { name: "Add New Product", tab: "products" },
  { name: "View Low Stock SKU Items", tab: "inventory" },
  { name: "Process Pending Orders", tab: "orders" },
  { name: "Inspect Registered Customers", tab: "customers" },
  { name: "View System Notifications", tab: "notifications_view" },
];

export function AdminPortal() {
  const { profile, logout, session } = useStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // DB Table status
  const [dbTableExists, setDbTableExists] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState<AdminNotification[]>([]);
  const [selectedOrderIdToOpen, setSelectedOrderIdToOpen] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Command + K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchModalOpen(false);
        setProfileMenuOpen(false);
        setNotificationsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when search modal opens
  useEffect(() => {
    if (searchModalOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchModalOpen]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch saved notifications and subscribe to real-time events
  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        if (error.code === "PGRST205" || error.message.includes("relation \"public.notifications\" does not exist")) {
          setDbTableExists(false);
          // Fallback to local simulation data if table is not created yet
          const localData = localStorage.getItem("minora_local_notifications");
          if (localData) {
            setSystemNotifications(JSON.parse(localData));
          } else {
            const defaults = [
              { id: "1", type: "order", title: "New Order Received", message: "Order #MN-10284 received from customer Aarav Sharma", is_read: true, created_at: new Date(Date.now() - 120000).toISOString() },
              { id: "2", type: "stock", title: "Low Stock Alert", message: "Modern Cotton Kurta (Size M) has only 3 units remaining", is_read: false, created_at: new Date(Date.now() - 900000).toISOString() },
              { id: "3", type: "customer", title: "New Customer registered", message: "Customer account created by client Ananya Sen", is_read: false, created_at: new Date(Date.now() - 1800000).toISOString() },
            ];
            setSystemNotifications(defaults);
            localStorage.setItem("minora_local_notifications", JSON.stringify(defaults));
          }
        } else {
          console.error("DB Notifications error:", error);
        }
      } else if (data) {
        setDbTableExists(true);
        setSystemNotifications(data as AdminNotification[]);
      }
    } catch (err) {
      console.warn("Could not load notifications from Supabase:", err);
    }
  };

  useEffect(() => {
    loadNotifications();

    // Subscribe to Postgres Real-Time changes
    const channel = supabase
      .channel("db-realtime-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          console.log("[Realtime] Notification INSERT received:", payload.new);
          const newNotif = payload.new as AdminNotification;
          
          setSystemNotifications((prev) => {
            // Prevent duplicate records for same entity
            if (prev.some((x) => x.id === newNotif.id || (newNotif.order_id && x.order_id === newNotif.order_id))) {
              return prev;
            }
            
            // Fire custom admin toast
            triggerAdminToast(newNotif);

            return [newNotif, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const triggerAdminToast = (notif: AdminNotification) => {
    if (notif.type === "order") {
      toast.custom((t) => (
        <div className="bg-[#FFFFFF] border-2 border-[#5C0620] rounded-xl p-4.5 shadow-xl text-left flex flex-col gap-2 max-w-sm w-full animate-in slide-in-from-bottom duration-200 select-none">
          <div className="flex justify-between items-center border-b border-[#F5F5F0] pb-1.5">
            <span className="text-[10px] font-bold text-[#5C0620] uppercase tracking-wider">New Order Received</span>
            <button onClick={() => toast.dismiss(t)} className="text-[#A8A29E] hover:text-[#1C1917] p-0.5 rounded">
              <X size={13} />
            </button>
          </div>
          <div className="text-[11px] space-y-1">
            <p className="font-bold text-[#1C1917]">{notif.title}</p>
            <p className="text-[#78716C] leading-snug">{notif.message}</p>
          </div>
          {notif.order_id && (
            <button
              onClick={() => {
                toast.dismiss(t);
                handleNotificationClick(notif);
              }}
              className="text-[10px] font-bold text-[#5C0620] hover:underline self-end flex items-center gap-0.5"
            >
              <span>View Order →</span>
            </button>
          )}
        </div>
      ), { duration: 6000 });
    } else {
      toast.info(notif.title, {
        description: notif.message,
      });
    }
  };

  const handleNotificationClick = async (notif: AdminNotification) => {
    setNotificationsOpen(false);
    
    // 1. Mark as read
    try {
      if (dbTableExists) {
        await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("id", notif.id);
      }
      setSystemNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
      );
    } catch (e) {
      console.warn("Could not mark as read in DB:", e);
    }

    // 2. Navigate / Action
    if (notif.type === "order" && notif.order_id) {
      setSelectedOrderIdToOpen(notif.order_id);
      setActiveTab("orders");
    } else if (notif.type === "stock") {
      setActiveTab("inventory");
    } else if (notif.type === "customer") {
      setActiveTab("customers");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      if (dbTableExists) {
        await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("is_read", false);
      }
      setSystemNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast.success("All notifications marked as read.");
    } catch (e) {
      console.warn(e);
    }
  };

  const handleClearNotifications = async () => {
    try {
      if (dbTableExists) {
        await supabase.from("notifications").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      }
      setSystemNotifications([]);
      localStorage.removeItem("minora_local_notifications");
      toast.success("Notification logs cleared.");
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      if (dbTableExists) {
        await supabase.from("notifications").delete().eq("id", id);
      }
      setSystemNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification deleted.");
    } catch (e) {
      console.warn(e);
    }
  };

  const adminName = profile?.full_name || "Shop Owner";
  const adminEmail = profile?.email || session?.user?.email || "admin@minora.com";

  // Filter types inside tab view
  const [filterType, setFilterType] = useState("all");
  const filteredTabNotifications = systemNotifications.filter((n) => {
    if (filterType === "all") return true;
    return n.type === filterType;
  });

  const unreadCount = systemNotifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C1917] flex flex-col font-sans antialiased select-none">
      {/* Premium Admin Header */}
      <header className="sticky top-0 z-40 h-16 border-b border-[#E5E5E0] bg-[#FAF9F6]/95 backdrop-blur-md px-6 flex items-center justify-between">
        {/* Left Side: Logo & Expand/Collapse Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-[#E5E5E0] hover:bg-[#F3F4F6] text-[#78716C] transition-all"
          >
            <Menu size={18} />
          </button>
          
          <div className="flex items-center gap-2 text-left">
            <span className="font-serif text-lg font-bold tracking-wider text-[#5C0620]">MINORA</span>
            <span className="text-[10px] font-bold text-[#5C0620]/80 bg-[#5C0620]/10 px-1.5 py-0.5 rounded tracking-wide border border-[#5C0620]/20 uppercase">
              Admin
            </span>
          </div>

          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="hidden md:flex p-1.5 rounded hover:bg-[#F5F5F0] text-[#78716C] border border-transparent hover:border-[#E5E5E0] transition-all"
            title={sidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {sidebarExpanded ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
          </button>
        </div>

        {/* Center: Command Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-lg mx-6 relative">
          <div
            onClick={() => setSearchModalOpen(true)}
            className="w-full flex items-center justify-between border border-[#E5E5E0] bg-[#FFFFFF] rounded-xl pl-3.5 pr-3 py-2 cursor-pointer hover:border-[#5C0620]/40 hover:shadow-[0_2px_8px_rgba(92,6,32,0.04)] transition-all group"
          >
            <div className="flex items-center gap-2.5 text-[#A8A29E] group-hover:text-[#78716C] transition-colors">
              <Search size={14} />
              <span className="text-[12px] font-medium">Search products, orders, customers, SKU...</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-sans font-semibold text-[#A8A29E] bg-[#FAF9F6] border border-[#E5E5E0] rounded">
              <span>⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Right Side: Tools, Notifications & Admin Account */}
        <div className="flex items-center gap-3.5">
          {/* Mobile Search Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="md:hidden p-2 rounded-lg text-[#78716C] hover:bg-[#F3F4F6] border border-transparent hover:border-[#E5E5E0] transition-all"
          >
            <Search size={18} />
          </button>

          {/* Notifications Trigger */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`p-2 rounded-xl text-[#78716C] hover:text-[#1C1917] hover:bg-[#FFFFFF] border border-transparent hover:border-[#E5E5E0] transition-all relative ${
                notificationsOpen ? "bg-[#FFFFFF] border-[#E5E5E0] text-[#1C1917]" : ""
              } ${unreadCount > 0 ? "animate-pulse" : ""}`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#5C0620] text-[#FFFFFF] text-[8px] font-bold flex items-center justify-center border border-[#FFFFFF]">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#FFFFFF] border border-[#E5E5E0] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                <div className="px-4 py-2 border-b border-[#F5F5F0] flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">Notifications</h4>
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-bold text-[#5C0620] hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-[#F5F5F0]">
                  {systemNotifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#78716C]">
                      No active alerts.
                    </div>
                  ) : (
                    systemNotifications.slice(0, 4).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3 text-left hover:bg-[#FAF9F6] transition-colors cursor-pointer ${
                          !notif.is_read ? "bg-[#5C0620]/5 font-bold" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-xs font-medium text-[#44403C] leading-snug">{notif.message}</p>
                          {!notif.is_read && <span className="w-1.5 h-1.5 rounded-full bg-[#5C0620] shrink-0 mt-1" />}
                        </div>
                        <span className="text-[10px] text-[#A8A29E] mt-1 block">
                          {new Date(notif.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2 border-t border-[#F5F5F0] text-center">
                  <button
                    onClick={() => {
                      setNotificationsOpen(false);
                      setActiveTab("notifications_view");
                    }}
                    className="text-[11px] font-bold text-[#5C0620] hover:underline"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <span className="h-6 w-px bg-[#E5E5E0]" />

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#FFFFFF] border border-transparent hover:border-[#E5E5E0] transition-all"
            >
              <div className="h-8.5 w-8.5 rounded-lg bg-[#5C0620] text-[#FFFFFF] font-serif font-bold flex items-center justify-center text-xs border border-[#5C0620]/10 shadow-inner">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left pr-1.5">
                <p className="text-[11px] font-bold text-[#1C1917] leading-none">{adminName}</p>
                <p className="text-[9px] text-[#78716C] font-semibold tracking-wider uppercase mt-1">Store Manager</p>
              </div>
              <ChevronDown size={12} className="text-[#A8A29E] hidden md:block" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] border border-[#E5E5E0] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                <div className="px-4.5 py-3 border-b border-[#F5F5F0]">
                  <p className="text-xs font-bold text-[#1C1917]">{adminName}</p>
                  <p className="text-[10px] text-[#78716C] truncate mt-0.5">{adminEmail}</p>
                </div>

                <div className="border-t border-[#F5F5F0] pt-1">
                  <button
                    onClick={async () => {
                      setProfileMenuOpen(false);
                      await logout();
                      toast.success("Successfully logged out of Admin Portal.");
                    }}
                    className="w-full text-left px-4.5 py-2.5 text-xs text-[#EF4444] hover:bg-[#FEF2F2] font-semibold transition-colors flex items-center gap-2"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar (Desktop) */}
        <aside
          className={`hidden md:flex flex-col border-r border-[#E5E5E0] bg-[#FAF9F6] p-4 transition-all duration-300 ease-in-out shrink-0 select-none ${
            sidebarExpanded ? "w-60" : "w-18"
          }`}
        >
          {sidebarExpanded && (
            <div className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-widest px-3.5 mb-3 text-left">
              Control Panel
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-4 pr-1.5 scrollbar-thin">
            {menuGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                {sidebarExpanded && (
                  <h5 className="text-[9px] font-bold text-[#78716C] px-3.5 py-1 uppercase tracking-wider select-none text-left">
                    {group.title}
                  </h5>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center rounded-xl transition-all ${
                        sidebarExpanded ? "px-3.5 py-2.5 gap-3" : "p-2.5 justify-center"
                      } ${
                        isActive
                          ? "bg-[#5C0620] text-[#FFFFFF] font-bold shadow-sm"
                          : "text-[#57534E] hover:text-[#1C1917] hover:bg-[#FFFFFF] border border-transparent hover:border-[#E5E5E0]"
                      }`}
                      title={item.label}
                    >
                      <Icon size={16} className={isActive ? "text-[#FFFFFF]" : "text-[#78716C]"} />
                      {sidebarExpanded && <span className="text-xs tracking-wide">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-[#000000]/40 backdrop-blur-sm md:hidden flex">
            <div className="w-64 bg-[#FAF9F6] border-r border-[#E5E5E0] p-4 flex flex-col justify-between animate-in slide-in-from-left duration-200">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E0]">
                  <span className="font-serif font-bold text-sm tracking-widest text-[#5C0620]">MINORA CONTROL</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#78716C]"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4 overflow-y-auto max-h-[70vh] py-4 text-left">
                  {menuGroups.map((group) => (
                    <div key={group.title} className="space-y-1">
                      <h5 className="text-[9px] font-bold text-[#A8A29E] px-3.5 uppercase tracking-wider">
                        {group.title}
                      </h5>
                      {group.items.map((item) => {
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
                                ? "bg-[#5C0620] text-[#FFFFFF] font-bold"
                                : "text-[#57534E] hover:text-[#1C1917] hover:bg-[#FFFFFF]"
                            }`}
                          >
                            <Icon size={16} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E5E0]">
                <Link
                  to="/"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E5E5E0] bg-[#FFFFFF] text-xs font-bold"
                >
                  <Store size={14} />
                  <span>View Storefront</span>
                </Link>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Content View Workspace */}
        <main className="flex-1 overflow-y-auto px-6 py-8 bg-[#FAF9F6] w-full">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
            {activeTab === "dashboard" && <AdminDashboard onNavigate={(tab) => setActiveTab(tab)} />}
            {activeTab === "products" && <AdminProducts />}
            {activeTab === "inventory" && <AdminInventory />}
            {activeTab === "orders" && (
              <AdminOrders
                selectedOrderIdToOpen={selectedOrderIdToOpen}
                onClearSelectedId={() => setSelectedOrderIdToOpen(null)}
              />
            )}
            {activeTab === "customers" && <AdminCustomers />}

            {/* Notifications Tab View */}
            {activeTab === "notifications_view" && (
              <div className="space-y-6 text-left">
                {/* Warnings if SQL migration is missing */}
                {!dbTableExists && (
                  <div className="p-4 border border-[#D97706]/30 bg-[#FFFBEB] text-[#D97706] rounded-xl flex items-start gap-3 text-xs leading-relaxed">
                    <Info size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Real-time DB Notifications Offline</p>
                      <p className="opacity-90">To run persistent database alerts, please copy-paste and execute the SQL script in your Supabase SQL Editor:</p>
                      <pre className="mt-2 p-2 bg-[#FFFFFF]/80 rounded border border-[#D97706]/20 font-mono text-[10px] select-all overflow-x-auto">
{`CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  order_id VARCHAR(100),
  product_id VARCHAR(100),
  customer_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin read" ON public.notifications FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Allow admin write" ON public.notifications FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Allow public inserts" ON public.notifications FOR INSERT WITH CHECK (true);
alter publication supabase_realtime add table notifications;`}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Title Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E0] pb-5">
                  <div>
                    <h2 className="font-serif text-2xl font-bold tracking-tight text-[#1C1917]">Notifications</h2>
                    <p className="text-xs text-[#78716C] mt-1 font-medium">
                      Stay updated with important activity across your MINORA store.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleMarkAllRead}
                      className="px-3.5 py-2 rounded-xl border border-[#E5E5E0] bg-[#FFFFFF] text-xs font-bold text-[#44403C] hover:bg-[#FAF9F6] shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <CheckCircle size={13} />
                      <span>Mark all read</span>
                    </button>
                    <button
                      onClick={handleClearNotifications}
                      className="px-3.5 py-2 rounded-xl border border-transparent bg-[#FAF9F6] hover:bg-[#FEF2F2] text-xs font-bold text-[#EF4444] shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <Trash2 size={13} />
                      <span>Clear logs</span>
                    </button>
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="flex gap-2 border-b border-[#E5E5E0] pb-3">
                  {["all", "order", "stock", "customer"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all border ${
                        filterType === type
                          ? "bg-[#5C0620] text-[#FFFFFF] border-transparent"
                          : "bg-[#FFFFFF] border-[#E5E5E0] text-[#78716C] hover:bg-[#FAF9F6]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Notifications ledger */}
                <div className="bg-[#FFFFFF] border border-[#E5E5E0] rounded-2xl shadow-sm overflow-hidden">
                  {filteredTabNotifications.length === 0 ? (
                    <div className="py-20 text-center text-[#78716C] space-y-2">
                      <Bell size={32} className="mx-auto text-[#A8A29E]" />
                      <p className="text-xs font-bold">No active logs</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#F5F5F0]">
                      {filteredTabNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 hover:bg-[#FAF9F6]/50 transition-colors flex items-start justify-between gap-4 ${
                            !notif.is_read ? "bg-[#5C0620]/5" : ""
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className="h-7 w-7 rounded-lg bg-[#FAF9F6] border border-[#E5E5E0] text-[#78716C] flex items-center justify-center shrink-0 mt-0.5">
                              {notif.type === "order" ? <ShoppingBag size={13} /> :
                               notif.type === "stock" ? <Layers size={13} /> :
                               notif.type === "customer" ? <Users size={13} /> :
                               <Info size={13} />}
                            </div>
                            <div onClick={() => handleNotificationClick(notif)} className="cursor-pointer">
                              <p className={`text-xs text-[#1C1917] leading-snug ${!notif.is_read ? "font-bold" : "font-medium"}`}>
                                {notif.title}
                              </p>
                              <p className="text-[11px] text-[#57534E] mt-0.5">{notif.message}</p>
                              <span className="text-[9px] text-[#A8A29E] font-semibold mt-1.5 block uppercase tracking-wider">
                                {new Date(notif.created_at).toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })} • {new Date(notif.created_at).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {notif.type === "order" && notif.order_id && (
                              <button
                                onClick={() => handleNotificationClick(notif)}
                                className="px-2.5 py-1 text-[10px] font-bold border border-[#E5E5E0] bg-[#FFFFFF] text-[#44403C] hover:bg-[#FAF9F6] rounded-lg transition-all"
                              >
                                View Order
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteNotification(notif.id)}
                              className="p-1 rounded text-[#A8A29E] hover:text-[#EF4444]"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Global Command-Style Search Overlay Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/30 backdrop-blur-xs flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-xl bg-[#FFFFFF] border border-[#E5E5E0] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-100">
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4.5 py-3 border-b border-[#F5F5F0]">
              <Search size={16} className="text-[#A8A29E]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, orders, customers, SKU..."
                className="w-full bg-transparent text-sm border-none outline-none text-[#1C1917] placeholder-[#A8A29E]"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="px-2 py-1 text-[10px] font-semibold text-[#78716C] bg-[#FAF9F6] border border-[#E5E5E0] rounded hover:bg-[#F3F4F6]"
              >
                ESC
              </button>
            </div>

            {/* Results Grid */}
            <div className="p-3 max-h-96 overflow-y-auto divide-y divide-[#F5F5F0]">
              {/* Quick Actions Shortcuts */}
              <div className="pb-3 text-left">
                <span className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider px-3.5 mb-1.5 block">
                  Quick Actions
                </span>
                <div className="space-y-0.5">
                  {quickSearchActions
                    .filter((act) => act.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchModalOpen(false);
                          setActiveTab(action.tab);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-[#44403C] hover:bg-[#FAF9F6] hover:text-[#5C0620] rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span>{action.name}</span>
                        <ChevronRight size={12} className="opacity-50" />
                      </button>
                    ))}
                </div>
              </div>

              {/* Navigation Jump Lists */}
              <div className="pt-3 text-left">
                <span className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider px-3.5 mb-1.5 block">
                  Jump to Management View
                </span>
                <div className="grid grid-cols-2 gap-1 p-1">
                  {menuGroups.flatMap((gp) => gp.items).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSearchModalOpen(false);
                        setActiveTab(item.id);
                      }}
                      className="text-left px-3 py-2 text-xs text-[#57534E] hover:bg-[#FAF9F6] hover:text-[#1C1917] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <item.icon size={13} className="text-[#A8A29E]" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer tips */}
            <div className="bg-[#FAF9F6] px-4.5 py-2.5 border-t border-[#F5F5F0] flex items-center justify-between text-[10px] text-[#78716C]">
              <span>Use ↑ ↓ keys to navigate, Enter to choose</span>
              <span>Search MINORA catalog & clients</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
