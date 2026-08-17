import { useState, useEffect } from "react";
import { Users, Search, ShieldCheck, UserCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ProfileUser = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  created_at: string | null;
};

export function AdminCustomers() {
  const [customers, setCustomers] = useState<ProfileUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setCustomers(data as ProfileUser[]);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Customer Accounts</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Registered user profiles stored in public.profiles table.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer by name, email or ID..."
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-xs outline-none focus:border-primary transition-all"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-border bg-card px-3 py-2.5 text-xs outline-none focus:border-primary transition-all"
        >
          <option value="all">All Roles ({customers.length})</option>
          <option value="user">User Role</option>
          <option value="admin">Admin Role</option>
        </select>
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">User ID</th>
                <th className="py-3.5 px-4 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-primary" />
                    Loading user accounts...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No registered profiles found matching your query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const initial = (c.full_name || c.email || "U").charAt(0).toUpperCase();
                  const isAdmin = c.role === "admin" || c.role === "super_admin";
                  return (
                    <tr key={c.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs border border-primary/20">
                            {initial}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{c.full_name || "Anonymous User"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{c.email || "—"}</td>
                      <td className="py-3 px-4">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase">
                            <ShieldCheck size={12} /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-secondary text-secondary-foreground uppercase">
                            <UserCheck size={12} /> Customer
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground truncate max-w-[180px]">
                        {c.id}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">
                        {c.created_at
                          ? new Date(c.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
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
