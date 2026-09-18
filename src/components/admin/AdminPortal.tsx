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
  Eye,
  XCircle,
  AlertCircle,
  Loader2,
  Volume2,
  VolumeX,
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
import { triggerOrderAlertSound, playOrderAcceptedSound, playOrderRejectedSound } from "@/lib/audio";
import { processOrderAcceptance } from "@/lib/order-actions";

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

  // Active Realtime Order Notification Queue Stack (Clip N Copy style)
  const [activeNewOrders, setActiveNewOrders] = useState<Record<string, any>[]>([]);

  // Rejection modal state from notification stack
  const [notifRejectModalOpen, setNotifRejectModalOpen] = useState(false);
  const [notifOrderToReject, setNotifOrderToReject] = useState<Record<string, any> | null>(null);
  const [notifRejectionChoice, setNotifRejectionChoice] = useState<"product_unavailable" | "order_issue" | "other">("product_unavailable");
  const [notifCustomReason, setNotifCustomReason] = useState("");
  const [notifActionLoading, setNotifActionLoading] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Centralized Sound & Notification Alarm Manager
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Audio deduplication ref
  const processedOrderIdsRef = useRef<Set<string>>(new Set());

  // Unlock browser audio context & request Notification permission on user interaction
  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    const unlockAudio = () => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const dummyCtx = new AudioCtx();
          if (dummyCtx.state === "suspended") {
            dummyCtx.resume().then(() => setAudioUnlocked(true)).catch(() => {});
          } else {
            setAudioUnlocked(true);
          }
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
   * Synthesizes a clean professional order alert sound pattern:
   * ding (587.33Hz) -> pause -> ding (880Hz) -> pause -> ding (1174.66Hz)
   */
  const triggerCentralChimePattern = () => {
    if (!soundEnabled) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      const t = ctx.currentTime;

      const playSingleTone = (freq: number, offset: number) => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t + offset);
          gain.gain.setValueAtTime(0.2, t + offset);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + offset);
          osc.stop(t + offset + 0.35);
        } catch (e) {}
      };

      // ding -> pause -> ding -> pause -> ding
      playSingleTone(587.33, 0);       // D5
      playSingleTone(880, 0.25);       // A5
      playSingleTone(1174.66, 0.5);    // D6

      setTimeout(() => {
        try {
          ctx.close();
        } catch (e) {}
      }, 1200);
    } catch (err) {
      console.warn("[ALARM MANAGER] Web Audio notice:", err);
    }
  };

  // Centralized Repeating Alarm Interval: Repeats chime pattern while active unhandled orders exist
  useEffect(() => {
    if (activeNewOrders.length === 0 || !soundEnabled) return;

    console.log(`[ORDER ALARM MANAGER] Starting alert loop for ${activeNewOrders.length} active order(s)`);
    
    triggerOrderAlertSound(soundEnabled);

    const timer = setInterval(() => {
      triggerOrderAlertSound(soundEnabled);
    }, 3500);

    return () => {
      console.log("[ORDER ALARM MANAGER] Alarm loop cleared");
      clearInterval(timer);
    };
  }, [activeNewOrders.length, soundEnabled]);

  // Fetch initial unacknowledged pending orders for persistence across page refreshes
  const loadPendingOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setActiveNewOrders(data as Record<string, any>[]);
        data.forEach((o) => {
          const oId = String(o["id"]);
          processedOrderIdsRef.current.add(oId);
        });
      }
    } catch (err) {
      console.warn("[ADMIN ORDERS] Could not load pending orders:", err);
    }
  };

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

  // REALTIME ORDERS SUBSCRIPTION
  useEffect(() => {
    loadNotifications();
    loadPendingOrders();

    let orderChannel: any = null;
    let isMounted = true;
    let reconnectTimer: any = null;

    const setupRealtimeSubscription = async () => {
      console.log("[REALTIME] CONNECTING");

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.access_token) {
          supabase.realtime.setAuth(sessionData.session.access_token);
        }
      } catch (e) {
        console.warn("[REALTIME] Auth token error:", e);
      }

      orderChannel = supabase
        .channel("admin-orders-realtime")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "orders",
          },
          (payload) => {
            const newOrder = payload.new as Record<string, any>;
            const orderId = String(newOrder?.["id"] || "");

            console.log("[REALTIME] NEW ORDER:", payload.new);
            console.log(`[REALTIME] Order ID: ${orderId}`);

            if (!orderId || processedOrderIdsRef.current.has(orderId)) {
              console.log(`[REALTIME] Duplicate INSERT event ignored for: ${orderId}`);
              return;
            }

            processedOrderIdsRef.current.add(orderId);

            // Add to active notification queue
            setActiveNewOrders((prev) => {
              if (prev.some((o) => o["id"] === orderId)) {
                return prev;
              }
              return [newOrder, ...prev];
            });

            // Add to system notifications list (increments notification count)
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
            console.log("[REALTIME] NOTIFICATION ADDED");

            // Trigger Alarm Sound
            triggerOrderAlertSound(soundEnabledRef.current);
            console.log("[REALTIME] ALARM PLAYED");

            // Browser Notification API if permitted
            if (typeof Notification !== "undefined" && Notification.permission === "granted") {
              try {
                const n = new Notification("NEW ORDER RECEIVED", {
                  body: `New order from ${newOrder?.["customer_name"] || "Customer"} — Order #${orderId.slice(0, 8)}`,
                  icon: "/favicon.ico",
                });
                n.onclick = () => {
                  window.focus();
                  setActiveTab("orders");
                  setSelectedOrderIdToOpen(orderId);
                };
              } catch (e) {}
            }
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
          },
          (payload) => {
            const updatedOrder = payload.new as Record<string, any>;
            const updatedId = String(updatedOrder?.["id"] || "");
            const updatedStatus = updatedOrder?.["status"];

            if (updatedStatus && updatedStatus !== "pending") {
              setActiveNewOrders((prev) => prev.filter((o) => o["id"] !== updatedId));
            }
          }
        )
        .subscribe((status, err) => {
          if (status === "SUBSCRIBED") {
            console.log("[REALTIME] SUBSCRIBED");
          } else {
            console.log(`[REALTIME] subscription status: ${status}`, err || "");
          }

          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
            console.error(`[REALTIME] subscription error status: ${status}`, err || "");
            if (isMounted) {
              reconnectTimer = setTimeout(() => {
                if (isMounted) {
                  if (orderChannel) {
                    supabase.removeChannel(orderChannel);
                  }
                  setupRealtimeSubscription();
                }
              }, 5000);
            }
          }
        });
    };

    setupRealtimeSubscription();

    return () => {
      isMounted = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (orderChannel) supabase.removeChannel(orderChannel);
    };
  }, []);

  const handleDismissNotif = (orderId: string) => {
    setActiveNewOrders((prev) => prev.filter((o) => o["id"] !== orderId));
  };

  const handleViewOrderFromNotif = (orderId: string) => {
    setActiveTab("orders");
    setSelectedOrderIdToOpen(orderId);
  };

  const handleAcceptOrderFromNotif = async (orderId: string) => {
    const res = await processOrderAcceptance(orderId);
    if (res.success) {
      setActiveNewOrders((prev) => prev.filter((o) => o["id"] !== orderId));
    }
  };

  const handleRejectClickFromNotif = (order: Record<string, any>) => {
    setNotifOrderToReject(order);
    setNotifRejectionChoice("product_unavailable");
    setNotifCustomReason("");
    setNotifRejectModalOpen(true);
  };

  const handleConfirmNotifRejection = async () => {
    if (!notifOrderToReject) return;

    let finalReasonText = "";
    if (notifRejectionChoice === "product_unavailable") {
      finalReasonText = "Product unavailable";
    } else if (notifRejectionChoice === "order_issue") {
      finalReasonText = "Customizable/order issue";
    } else {
      finalReasonText = notifCustomReason.trim();
      if (!finalReasonText) {
        toast.error("Please enter a custom rejection reason.");
        return;
      }
    }

    const orderId = String(notifOrderToReject?.["id"] || "");
    const now = new Date().toISOString();
    setNotifActionLoading(true);

    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: "rejected",
          rejection_reason: finalReasonText,
          rejected_at: now,
          updated_at: now,
        })
        .eq("id", orderId)
        .eq("status", "pending");

      if (error) {
        toast.error(error.message || "Failed to reject order.");
      } else {
        toast.success(`Order #${orderId.slice(0, 8)} REJECTED.`);
        setActiveNewOrders((prev) => prev.filter((o) => o["id"] !== orderId));
        setNotifRejectModalOpen(false);
        setNotifOrderToReject(null);
        playOrderRejectedSound();
      }
    } catch (err) {
      toast.error("Failed to reject order.");
    } finally {
      setNotifActionLoading(false);
    }
  };

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
            {/* Sound Alert Toggle Control */}
            <button
              onClick={() => {
                const nextState = !soundEnabled;
                setSoundEnabled(nextState);
                if (nextState) {
                  triggerCentralChimePattern();
                  toast.success("Order alarm alerts enabled.");
                } else {
                  toast.info("Order alarm alerts muted.");
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                soundEnabled
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "border-[#E5E5E0] bg-[#FAF9F6] text-[#78716C] hover:bg-[#F5F5F0]"
              }`}
              title={soundEnabled ? "Mute Order Sound Alerts" : "Enable Order Sound Alerts"}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              <span className="hidden sm:inline">{soundEnabled ? "Alerts ON" : "Alerts OFF"}</span>
            </button>

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

      {/* REAL-TIME NEW ORDER NOTIFICATION FLOATING STACK (RIGHT-SIDE CLIP N COPY STYLE) */}
      {activeNewOrders.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full md:w-96 max-h-[calc(100vh-100px)] md:max-h-[85vh] flex flex-col pointer-events-none">
          {/* Header indicator when multiple pending orders exist */}
          {activeNewOrders.length > 1 && (
            <div className="pointer-events-auto shrink-0 mb-2 px-3.5 py-2 rounded-xl bg-[#5C0620] text-white text-[11px] font-bold flex items-center justify-between shadow-xl border border-[#5C0620]">
              <span className="flex items-center gap-1.5">
                <ShoppingBag size={14} className="animate-pulse" />
                <span>{activeNewOrders.length} Pending Orders Alert</span>
              </span>
              <span className="text-[10px] opacity-90 font-medium">Scroll to view all</span>
            </div>
          )}

          {/* Independently Scrollable Notification List */}
          <div
            className="pointer-events-auto overflow-y-auto flex flex-col-reverse gap-3 p-1 max-h-full pr-1.5 [overscroll-behavior:contain]"
            style={{ overscrollBehavior: "contain" }}
          >
            {activeNewOrders.map((order) => {
              const rawId = String(order?.["id"] || "");
              const shortId = rawId ? rawId.slice(0, 8) : "NEW";
              return (
                <div
                  key={rawId}
                  className="bg-[#FFFFFF] border-2 border-[#5C0620] rounded-2xl p-4 shadow-2xl flex flex-col gap-3 animate-in slide-in-from-right duration-200 text-left select-none shrink-0"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-2">
                    <div className="flex items-center gap-2">
                      <ShoppingBag size={16} className="text-[#5C0620] animate-bounce shrink-0" />
                      <span className="text-xs font-black text-[#5C0620] uppercase tracking-wider">
                        NEW ORDER RECEIVED
                      </span>
                    </div>
                    <button
                      onClick={() => handleDismissNotif(rawId)}
                      className="text-[#78716C] hover:text-[#1C1917] p-1 rounded-lg hover:bg-[#FAF9F6] transition-all"
                      title="Dismiss Notification"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-[#1C1917]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#78716C] font-medium">Customer:</span>
                      <span className="font-bold truncate max-w-[190px]">{order?.["customer_name"] || "Customer"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#78716C] font-medium">Email:</span>
                      <span className="font-medium truncate max-w-[190px]">{order?.["customer_email"] || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#78716C] font-medium">Phone:</span>
                      <span className="font-mono font-medium">{order?.["phone"] || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-[#F5F5F0]">
                      <span className="text-[#78716C] font-medium">Order ID:</span>
                      <span className="font-mono font-bold text-[#5C0620]">#{shortId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#78716C] font-medium">Total:</span>
                      <span className="font-bold text-sm text-[#5C0620]">{inr(order?.["total"] || 0)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5E5E0]">
                    <button
                      onClick={() => handleViewOrderFromNotif(rawId)}
                      className="py-1.5 px-2 rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] hover:bg-[#F5F5F0] text-[#1C1917] font-bold text-[11px] transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>View Order</span>
                    </button>
                    <button
                      onClick={() => handleAcceptOrderFromNotif(rawId)}
                      className="py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                    >
                      <CheckCircle size={12} />
                      <span>ACCEPT</span>
                    </button>
                    <button
                      onClick={() => handleRejectClickFromNotif(order)}
                      className="py-1.5 px-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                    >
                      <XCircle size={12} />
                      <span>REJECT</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* NOTIFICATION REJECTION REASON MODAL */}
      {notifRejectModalOpen && notifOrderToReject && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#FFFFFF] border border-[#E5E5E0] p-6 shadow-2xl space-y-5 text-left animate-in zoom-in-95 duration-150 select-none">
            <div className="flex items-center justify-between border-b border-[#F5F5F0] pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertCircle size={18} />
                <h3 className="font-bold text-sm text-[#1C1917]">
                  Reject Order #{String(notifOrderToReject?.["id"] || "").slice(0, 8)}
                </h3>
              </div>
              <button
                onClick={() => setNotifRejectModalOpen(false)}
                className="text-[#A8A29E] hover:text-[#1C1917] p-1 rounded-lg"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-[#78716C]">
                Select a reason for rejecting this order. The selected reason will be displayed to the customer.
              </p>

              <div className="space-y-2">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E5E5E0] cursor-pointer hover:bg-[#FAF9F6] transition-all">
                  <input
                    type="radio"
                    name="notifRejectionReason"
                    value="product_unavailable"
                    checked={notifRejectionChoice === "product_unavailable"}
                    onChange={() => setNotifRejectionChoice("product_unavailable")}
                    className="accent-[#5C0620]"
                  />
                  <span className="font-semibold text-[#1C1917]">Product unavailable</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E5E5E0] cursor-pointer hover:bg-[#FAF9F6] transition-all">
                  <input
                    type="radio"
                    name="notifRejectionReason"
                    value="order_issue"
                    checked={notifRejectionChoice === "order_issue"}
                    onChange={() => setNotifRejectionChoice("order_issue")}
                    className="accent-[#5C0620]"
                  />
                  <span className="font-semibold text-[#1C1917]">Customizable/order issue</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E5E5E0] cursor-pointer hover:bg-[#FAF9F6] transition-all">
                  <input
                    type="radio"
                    name="notifRejectionReason"
                    value="other"
                    checked={notifRejectionChoice === "other"}
                    onChange={() => setNotifRejectionChoice("other")}
                    className="accent-[#5C0620]"
                  />
                  <span className="font-semibold text-[#1C1917]">Other</span>
                </label>
              </div>

              {notifRejectionChoice === "other" && (
                <div className="space-y-1 pt-1">
                  <label className="block text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
                    Enter rejection reason <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={notifCustomReason}
                    onChange={(e) => setNotifCustomReason(e.target.value)}
                    placeholder="Enter rejection reason"
                    className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] p-3 text-xs outline-none focus:border-[#5C0620] transition-all"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-3 border-t border-[#F5F5F0]">
              <button
                type="button"
                onClick={() => setNotifRejectModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#E5E5E0] text-xs font-bold text-[#44403C] hover:bg-[#FAF9F6] transition-all"
              >
                CANCEL
              </button>
              <button
                type="button"
                disabled={notifActionLoading}
                onClick={handleConfirmNotifRejection}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {notifActionLoading ? <Loader2 size={14} className="animate-spin" /> : <span>CONFIRM REJECTION</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
