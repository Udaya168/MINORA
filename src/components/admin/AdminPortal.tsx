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

// Sidebar Menu Groupings
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

  const [dbTableExists, setDbTableExists] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState<AdminNotification[]>([]);
  const [selectedOrderIdToOpen, setSelectedOrderIdToOpen] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Audio & Alarm deduplication refs
  const playedOrderAlarmsRef = useRef<Set<string>>(new Set());
  const activeAudioStopFnRef = useRef<(() => void) | null>(null);

  // Unlock browser audio context on user interaction
  useEffect(() => {
    const unlockAudio = () => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const dummyCtx = new AudioCtx();
          dummyCtx.resume();
        }
      } catch (e) {}
    };
    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  /**
   * Synthesizes a pleasant double-chime order alert sound for ~10 seconds.
   */
  const playOrderAlarmSound = (orderId: string) => {
    if (playedOrderAlarmsRef.current.has(orderId)) {
      console.log(`[ALARM] Duplicate order alert ignored: ${orderId}`);
      return;
    }

    playedOrderAlarmsRef.current.add(orderId);

    console.log(`[ALARM] New order sound requested: ${orderId}`);
    console.log(`[ALARM] Playing order alert: ${orderId}`);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      let active = true;

      const playChime = (t: number) => {
        if (!active) return;
        try {
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = "sine";
          osc1.frequency.setValueAtTime(587.33, t); // D5
          gain1.gain.setValueAtTime(0.15, t);
          gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.start(t);
          osc1.stop(t + 0.4);

          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = "sine";
          osc2.frequency.setValueAtTime(880, t + 0.15); // A5
          gain2.gain.setValueAtTime(0.2, t + 0.15);
          gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(t + 0.15);
          osc2.stop(t + 0.6);
        } catch (e) {}
      };

      const startTime = ctx.currentTime;
      for (let sec = 0; sec < 10; sec += 1.3) {
        playChime(startTime + sec);
      }

      const stopFn = () => {
        active = false;
        try {
          ctx.close();
        } catch (e) {}
      };

      activeAudioStopFnRef.current = stopFn;

      setTimeout(() => {
        stopFn();
        console.log(`[ALARM] Played successfully: ${orderId}`);
      }, 10000);
    } catch (err) {
      console.warn("[ALARM] Web Audio synthesis notice:", err);
    }
  };

  /**
   * Shows custom prominent notification card for incoming real-time orders
   */
  const showNewOrderToast = (newOrder: any) => {
    const orderId = newOrder.id || "";
    const shortId = orderId ? orderId.slice(0, 8) : "NEW";
    const customerName = newOrder.customer_name || "Customer";
    const itemsCount = newOrder.order_items ? newOrder.order_items.length : 1;
    const totalAmount = newOrder.total || 0;

    toast.custom(
      (t) => (
        <div className="bg-[#FFFFFF] border-2 border-[#5C0620] rounded-2xl p-5 shadow-2xl text-left flex flex-col gap-3 max-w-sm w-full animate-in slide-in-from-bottom duration-200 select-none">
          <div className="flex justify-between items-center border-b border-[#E5E5E0] pb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5C0620] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#5C0620]"></span>
              </span>
              <span className="text-xs font-extrabold text-[#5C0620] uppercase tracking-wider">
                NEW ORDER RECEIVED
              </span>
            </div>
            <button
              onClick={() => {
                if (activeAudioStopFnRef.current) activeAudioStopFnRef.current();
                toast.dismiss(t);
              }}
              className="text-[#A8A29E] hover:text-[#1C1917] p-1 rounded-lg hover:bg-[#FAF9F6]"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-[#1C1917]">
            <div className="flex justify-between items-center">
              <span className="text-[#78716C] font-medium">Order ID:</span>
              <span className="font-mono font-bold text-[#5C0620]">#{shortId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#78716C] font-medium">Customer:</span>
              <span className="font-bold">{customerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#78716C] font-medium">Items:</span>
              <span className="font-mono font-bold">{itemsCount}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold border-t border-[#F5F5F0] pt-1.5">
              <span className="text-[#78716C]">Total:</span>
              <span className="text-[#5C0620]">{inr(totalAmount)}</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (activeAudioStopFnRef.current) activeAudioStopFnRef.current();
              toast.dismiss(t);
              setActiveTab("orders");
              setSelectedOrderIdToOpen(orderId);
            }}
            className="w-full mt-1 py-2.5 rounded-xl bg-[#5C0620] text-[#FFFFFF] text-xs font-bold tracking-widest uppercase hover:bg-[#5C0620]/90 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#5C0620]/20 cursor-pointer"
          >
            <span>VIEW ORDER</span>
          </button>
        </div>
      ),
      { duration: 15000 }
    );
  };

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

  useEffect(() => {
    if (searchModalOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchModalOpen]);

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

  // Fetch saved notifications
  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        if (error.code === "PGRST205" || error.message.includes("relation \"public.notifications\" does not exist")) {
          setDbTableExists(false);
          const localData = localStorage.getItem("minora_local_notifications");
          if (localData) {
            setSystemNotifications(JSON.parse(localData));
          }
        }
      } else if (data) {
        setDbTableExists(true);
        setSystemNotifications(data as AdminNotification[]);
      }
    } catch (err) {
      console.warn("Could not load notifications from Supabase:", err);
    }
  };

  // REALTIME ORDERS SUBSCRIPTION (admin-orders-realtime)
  useEffect(() => {
    loadNotifications();

    console.log("[REALTIME ORDERS] Connecting...");

    const orderChannel = supabase
      .channel("admin-orders-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const newOrder = payload.new as Record<string, any>;
          const orderId = String(newOrder?.["id"] || "");

          console.log(`[REALTIME ORDERS] INSERT received: ${orderId}`);
          console.log(`[ADMIN ALERT] New order received: ${orderId}`);
          console.log(`[ADMIN ALERT] Playing order alarm: ${orderId}`);

          playOrderAlarmSound(orderId);
          showNewOrderToast(newOrder);

          // Add to local notifications list
          const newNotif: AdminNotification = {
            id: `notif_${orderId}_${Date.now()}`,
            type: "order",
            title: "New Order Received",
            message: `Order #${orderId.slice(0, 8)} placed by ${newOrder?.["customer_name"] || "Customer"}`,
            order_id: orderId,
            is_read: false,
            created_at: new Date().toISOString(),
          };

          setSystemNotifications((prev) => [newNotif, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          const updatedOrder = payload.new as Record<string, any>;
          console.log(`[REALTIME ORDERS] UPDATE received: ${updatedOrder?.["id"]}`);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[REALTIME ORDERS] SUBSCRIBED");
        }
      });

    return () => {
      supabase.removeChannel(orderChannel);
    };
  }, []);

  const handleNotificationClick = async (notif: AdminNotification) => {
    setNotificationsOpen(false);
    if (notif.order_id) {
      setActiveTab("orders");
      setSelectedOrderIdToOpen(notif.order_id);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setSystemNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      if (dbTableExists) {
        await supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
      }
      toast.success("All notifications marked as read.");
    } catch (e) {
      toast.error("Failed to mark all as read.");
    }
  };

  const handleClearNotifications = async () => {
    try {
      setSystemNotifications([]);
      if (dbTableExists) {
        await supabase.from("notifications").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      }
      toast.success("Notifications cleared.");
    } catch (e) {
      toast.error("Failed to clear notifications.");
    }
  };

  const unreadCount = systemNotifications.filter((n) => !n.is_read).length;
  const adminName = profile?.full_name || session?.user?.email?.split("@")[0] || "Admin User";
  const adminEmail = session?.user?.email || "admin@minora.in";

  const [filterType, setFilterType] = useState("all");
  const filteredTabNotifications = systemNotifications.filter(
    (n) => filterType === "all" || n.type === filterType
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FAF9F6] text-[#1C1917] font-sans antialiased">
      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`relative z-20 flex flex-col justify-between border-r border-[#E5E5E0] bg-[#FAF9F6] transition-all duration-300 ${
          sidebarExpanded ? "w-64 p-4" : "w-20 p-3 items-center"
        } hidden md:flex`}
      >
        <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-4 w-full">
          {sidebarExpanded ? (
            <div className="flex items-center gap-2 px-1">
              <span className="h-2 w-2 rounded-full bg-[#5C0620]" />
              <span className="font-serif font-bold text-base tracking-widest text-[#5C0620]">
                MINORA
              </span>
              <span className="rounded bg-[#5C0620]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#5C0620] uppercase">
                ADMIN
              </span>
            </div>
          ) : (
            <div className="mx-auto font-serif font-bold text-lg text-[#5C0620]">M</div>
          )}
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="p-1 rounded-lg hover:bg-[#FFFFFF] border border-transparent hover:border-[#E5E5E0] text-[#78716C] transition-all"
            title={sidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {sidebarExpanded ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
          </button>
        </div>

        {sidebarExpanded && (
          <div className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-widest px-3.5 my-3 text-left">
            Control Panel
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 pr-1.5 scrollbar-thin w-full">
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

        <div className="pt-4 border-t border-[#E5E5E0] w-full">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E5E5E0] bg-[#FFFFFF] text-xs font-bold text-[#1C1917] hover:bg-[#FAF9F6] transition-all"
          >
            <Store size={14} />
            {sidebarExpanded && <span>View Storefront</span>}
          </Link>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* TOP HEADER NAV */}
        <header className="flex h-16 items-center justify-between border-b border-[#E5E5E0] bg-[#FFFFFF] px-6 text-left">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl border border-[#E5E5E0] text-[#57534E] md:hidden"
            >
              <Menu size={18} />
            </button>
            <button
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-1.5 text-xs text-[#78716C] hover:border-[#5C0620]/30 transition-all w-48 sm:w-64"
            >
              <Search size={14} className="text-[#A8A29E]" />
              <span className="flex-1 text-left truncate">Quick search...</span>
              <kbd className="hidden sm:inline-block rounded border border-[#E5E5E0] bg-[#FFFFFF] px-1.5 py-0.5 text-[10px] font-mono text-[#A8A29E]">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl border border-[#E5E5E0] bg-[#FFFFFF] text-[#57534E] hover:bg-[#FAF9F6] transition-all"
                title="Notifications"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#5C0620] text-[9px] font-bold text-[#FFFFFF]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#E5E5E0] bg-[#FFFFFF] p-4 shadow-2xl z-50 text-left space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-[#F5F5F0] pb-2">
                    <span className="text-xs font-bold text-[#1C1917]">System Activity Logs</span>
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-bold text-[#5C0620] hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2 divide-y divide-[#F5F5F0]">
                    {systemNotifications.length === 0 ? (
                      <p className="py-6 text-center text-xs text-[#78716C]">No notifications</p>
                    ) : (
                      systemNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`pt-2 flex items-start gap-2.5 cursor-pointer hover:bg-[#FAF9F6] p-1.5 rounded-lg transition-colors ${
                            !notif.is_read ? "font-semibold" : ""
                          }`}
                        >
                          <div className="mt-0.5 shrink-0 text-[#5C0620]">
                            {notif.type === "order" ? <ShoppingBag size={14} /> : <Info size={14} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#1C1917] truncate">{notif.title}</p>
                            <p className="text-[11px] text-[#78716C] line-clamp-2">{notif.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 rounded-xl border border-[#E5E5E0] bg-[#FFFFFF] p-1.5 pr-3 hover:bg-[#FAF9F6] transition-all cursor-pointer"
              >
                <div className="h-7 w-7 rounded-lg bg-[#5C0620] text-[#FFFFFF] flex items-center justify-center font-bold text-xs">
                  {adminName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-[#1C1917] leading-none">{adminName}</p>
                  <p className="text-[10px] text-[#78716C] leading-none mt-1 uppercase font-semibold">Store Administrator</p>
                </div>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#E5E5E0] bg-[#FFFFFF] p-2 shadow-2xl z-50 text-left space-y-1">
                  <div className="p-2 border-b border-[#F5F5F0]">
                    <p className="text-xs font-bold text-[#1C1917]">{adminName}</p>
                    <p className="text-[11px] text-[#78716C] truncate">{adminEmail}</p>
                  </div>
                  <button
                    onClick={async () => {
                      await logout();
                      window.location.href = "/login";
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-[#EF4444] hover:bg-[#FEF2F2] font-semibold transition-colors"
                  >
                    <LogOut size={14} />
                    <span>Sign out of Admin</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
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

                <div className="bg-[#FFFFFF] border border-[#E5E5E0] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#F5F5F0]">
                  {filteredTabNotifications.length === 0 ? (
                    <div className="py-20 text-center text-[#78716C] space-y-2">
                      <Bell size={32} className="mx-auto text-[#A8A29E]" />
                      <p className="text-xs font-bold">No active logs</p>
                    </div>
                  ) : (
                    filteredTabNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 hover:bg-[#FAF9F6]/50 transition-colors flex items-start justify-between gap-4"
                      >
                        <div className="flex gap-3">
                          <div className="h-7 w-7 rounded-lg bg-[#FAF9F6] border border-[#E5E5E0] text-[#78716C] flex items-center justify-center shrink-0 mt-0.5">
                            <ShoppingBag size={13} />
                          </div>
                          <div>
                            <p className="text-xs text-[#1C1917] font-bold">{notif.title}</p>
                            <p className="text-[11px] text-[#57534E] mt-0.5">{notif.message}</p>
                          </div>
                        </div>
                        {notif.order_id && (
                          <button
                            onClick={() => handleNotificationClick(notif)}
                            className="px-2.5 py-1 text-[10px] font-bold border border-[#E5E5E0] bg-[#FFFFFF] text-[#44403C] hover:bg-[#FAF9F6] rounded-lg transition-all"
                          >
                            View Order
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* QUICK COMMAND SEARCH MODAL */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/40 backdrop-blur-xs flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#FFFFFF] border border-[#E5E5E0] shadow-2xl overflow-hidden text-left animate-in zoom-in-95 duration-150">
            <div className="p-3 border-b border-[#E5E5E0] flex items-center gap-3">
              <Search size={16} className="text-[#A8A29E] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search admin actions..."
                className="w-full bg-transparent text-xs text-[#1C1917] outline-none"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="text-xs font-bold text-[#A8A29E] hover:text-[#1C1917]"
              >
                ESC
              </button>
            </div>
            <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
              {quickSearchActions.map((act) => (
                <button
                  key={act.name}
                  onClick={() => {
                    setActiveTab(act.tab);
                    setSearchModalOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-[#FAF9F6] hover:text-[#5C0620] flex items-center justify-between"
                >
                  <span>{act.name}</span>
                  <ChevronRight size={14} className="text-[#A8A29E]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
