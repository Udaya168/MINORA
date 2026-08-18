import { useState, useEffect } from "react";
import { Users, Search, ShieldCheck, UserCheck, Loader2, RefreshCw, Mail, Calendar, Shield, ArrowRight, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { inr } from "@/lib/format";
import { toast } from "sonner";

type ProfileUser = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  created_at: string | null;
  ordersCount?: number;
  totalSpent?: number;
  lastOrderDate?: string;
  status?: string;
};

export function AdminCustomers() {
  const [customers, setCustomers] = useState<ProfileUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const loadCustomers = async () => {
    setLoading(true);
    try {
      // 1. Fetch Profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, created_at")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // 2. Fetch Orders to group metrics
      const { data: ordersData } = await supabase
        .from("orders")
        .select("user_id, total, created_at");

      const orderMetricsMap = new Map<string, { count: number; spent: number; lastDate: string }>();
      
      if (ordersData) {
        ordersData.forEach((order: any) => {
          if (!order.user_id) return;
          const current = orderMetricsMap.get(order.user_id) || { count: 0, spent: 0, lastDate: "" };
          current.count += 1;
          current.spent += Number(order.total) || 0;
          if (!current.lastDate || new Date(order.created_at) > new Date(current.lastDate)) {
            current.lastDate = order.created_at;
          }
          orderMetricsMap.set(order.user_id, current);
        });
      }

      if (profilesData) {
        const enriched: ProfileUser[] = profilesData.map((c) => {
          const metrics = orderMetricsMap.get(c.id) || { count: 0, spent: 0, lastDate: "" };
          const u: ProfileUser = {
            id: c.id,
            full_name: c.full_name,
            email: c.email,
            role: c.role,
            created_at: c.created_at,
            ordersCount: metrics.count,
            totalSpent: metrics.spent,
            status: metrics.count > 0 ? "Active" : "New",
          };
          if (metrics.lastDate) {
            u.lastOrderDate = metrics.lastDate;
          }
          return u;
        });
        setCustomers(enriched);
      } else {
        setCustomers([]);
      }
    } catch (e) {
      console.error("Error loading customers:", e);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const query = search.toLowerCase();
    const matchesSearch =
      (c.full_name && c.full_name.toLowerCase().includes(query)) ||
      (c.email && c.email.toLowerCase().includes(query)) ||
      c.id.toLowerCase().includes(query);
    const matchesRole = roleFilter === "all" || c.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate statistics
  const totalCount = customers.length;
  const newCount = customers.filter((c) => c.status === "New").length;
  const activeCount = customers.filter((c) => c.status === "Active").length;
  const returningCount = customers.filter((c) => (c.ordersCount ?? 0) > 1).length;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E0] pb-5">
        <div className="text-left">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#1C1917]">Customers</h2>
          <p className="text-xs text-[#78716C] mt-1 font-medium">
            Manage your registered customer accounts.
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        <div className="bg-[#FFFFFF] border border-[#E5E5E0] rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">Total Customers</span>
          <p className="text-xl font-bold font-mono text-[#1C1917] mt-2">{totalCount}</p>
        </div>
        <div className="bg-[#FFFFFF] border border-[#E5E5E0] rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">New Customers</span>
          <p className="text-xl font-bold font-mono text-[#D97706] mt-2">{newCount}</p>
        </div>
        <div className="bg-[#FFFFFF] border border-[#E5E5E0] rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">Returning Customers</span>
          <p className="text-xl font-bold font-mono text-[#5C0620] mt-2">{returningCount}</p>
        </div>
        <div className="bg-[#FFFFFF] border border-[#E5E5E0] rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">Active Customers</span>
          <p className="text-xl font-bold font-mono text-[#10B981] mt-2">{activeCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#FFFFFF] border border-[#E5E5E0] p-4 rounded-2xl shadow-sm text-left">
        <div className="sm:col-span-3 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search profiles..."
            className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] pl-9.5 pr-4 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 placeholder-[#A8A29E] text-[#1C1917] transition-all font-medium"
          />
        </div>

        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917] appearance-none cursor-pointer font-medium"
          >
            <option value="all">All Roles ({customers.length})</option>
            <option value="user">Customer</option>
            <option value="admin">Administrator</option>
          </select>
          <Shield size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78716C] pointer-events-none" />
        </div>
      </div>

      {/* Customers Table Ledger */}
      <div className="rounded-2xl border border-[#E5E5E0] bg-[#FFFFFF] overflow-hidden shadow-sm text-left">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E0] bg-[#FAF9F6] text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
                <th className="py-4 px-4.5">Customer</th>
                <th className="py-4 px-4.5">Email</th>
                <th className="py-4 px-4.5 text-center">Orders</th>
                <th className="py-4 px-4.5 text-center">Total Spent</th>
                <th className="py-4 px-4.5 text-center">Last Order</th>
                <th className="py-4 px-4.5">Status</th>
                <th className="py-4 px-4.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F0]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-[#78716C]">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-[#5C0620]" />
                    <span>Synchronizing accounts...</span>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-[#78716C] font-medium">
                    No customer accounts match your query parameters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const initial = (c.full_name || c.email || "U").charAt(0).toUpperCase();
                  const isAdmin = c.role === "admin" || c.role === "super_admin";
                  return (
                    <tr key={c.id} className="hover:bg-[#FAF9F6]/50 transition-colors group">
                      <td className="py-3.5 px-4.5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-[#5C0620]/10 text-[#5C0620] font-serif font-bold flex items-center justify-center text-xs border border-[#5C0620]/15">
                            {initial}
                          </div>
                          <div>
                            <p className="font-bold text-[#1C1917]">{c.full_name || "Anonymous User"}</p>
                            <p className="text-[9px] text-[#A8A29E] font-mono leading-none mt-0.5">ID: {c.id.slice(0,8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4.5 text-[#57534E] font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Mail size={11} className="text-[#A8A29E]" />
                          <span>{c.email || "—"}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4.5 text-center font-mono font-bold text-[#1C1917]">
                        {c.ordersCount ?? 0}
                      </td>
                      <td className="py-3.5 px-4.5 text-center font-mono font-bold text-[#5C0620]">
                        {inr(c.totalSpent ?? 0)}
                      </td>
                      <td className="py-3.5 px-4.5 text-center text-[#78716C] font-medium">
                        {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        }) : "—"}
                      </td>
                      <td className="py-3.5 px-4.5">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-bold bg-[#5C0620]/10 text-[#5C0620] uppercase tracking-wide">
                            Admin
                          </span>
                        ) : c.status === "Active" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-bold bg-[#10B981]/10 text-[#10B981] uppercase tracking-wide">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-bold bg-[#F3F4F6] text-[#78716C] uppercase tracking-wide">
                            New
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4.5 text-right">
                        <button
                          onClick={() => toast.info(`Accessing client profile: ${c.full_name || c.email}`)}
                          className="p-1.5 rounded-lg border border-[#E5E5E0] bg-[#FFFFFF] hover:border-[#5C0620]/30 hover:bg-[#5C0620]/5 text-[#57534E] hover:text-[#5C0620] transition-all opacity-85 group-hover:opacity-100"
                          title="View customer profile"
                        >
                          <Eye size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
