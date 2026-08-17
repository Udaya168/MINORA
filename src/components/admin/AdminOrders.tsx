import { useState, useEffect } from "react";
import { ShoppingBag, Search, Clock, CheckCircle2, Truck, XCircle, Loader2, Eye, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { inr } from "@/lib/format";
import { toast } from "sonner";

type OrderItemDetail = {
  id: string;
  product_id: string;
  product_name: string;
  size: string;
  color: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type OrderRecord = {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  phone: string;
  shipping_address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_status: string;
  created_at: string;
  order_items?: OrderItemDetail[];
};

export function AdminOrders() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (e) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderRecord["status"]) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) {
        toast.error(error.message || "Failed to update status.");
      } else {
        toast.success(`Order status updated to "${newStatus}".`);
        await loadOrders();
      }
    } catch (e: any) {
      toast.error("Status update failed.");
    }
  };

  const statusBadge = (status: OrderRecord["status"]) => {
    switch (status) {
      case "delivered":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500"><CheckCircle2 size={12} /> Delivered</span>;
      case "shipped":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500"><Truck size={12} /> Shipped</span>;
      case "confirmed":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-500"><CheckCircle2 size={12} /> Confirmed</span>;
      case "processing":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500"><Clock size={12} /> Processing</span>;
      case "pending":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500"><Clock size={12} /> Pending</span>;
      case "cancelled":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500"><XCircle size={12} /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-secondary-foreground">{status}</span>;
    }
  };

  const filteredOrders = orders.filter((o) => {
    const query = search.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(query) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(query)) ||
      (o.customer_email && o.customer_email.toLowerCase().includes(query));
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Customer Orders</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor and manage customer purchases, delivery statuses, and fulfillment states.
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
            placeholder="Search by order ID, customer name or email..."
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-xs outline-none focus:border-primary transition-all"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-border bg-card px-3 py-2.5 text-xs outline-none focus:border-primary transition-all"
        >
          <option value="all">All Order Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table or Empty State */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-primary" />
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-muted-foreground">
                    <div className="max-w-xs mx-auto space-y-2">
                      <div className="h-12 w-12 rounded-full bg-secondary text-muted-foreground mx-auto flex items-center justify-center">
                        <ShoppingBag size={24} />
                      </div>
                      <p className="font-semibold text-foreground">No Customer Orders Found</p>
                      <p className="text-[11px] text-muted-foreground">
                        Customer orders placed on the website will be listed here in real-time.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-foreground truncate max-w-[120px]">{o.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-foreground">{o.customer_name || "Customer"}</p>
                      <p className="text-[10px] text-muted-foreground">{o.customer_email}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">{inr(o.total)}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {o.created_at ? new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Today"}
                    </td>
                    <td className="py-3 px-4">{statusBadge(o.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="p-1.5 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                          title="View Order Details"
                        >
                          <Eye size={14} />
                        </button>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateStatus(o.id, e.target.value as any)}
                          className="rounded-lg border border-border bg-background px-2 py-1 text-[11px] font-semibold outline-none focus:border-primary"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-display text-lg font-bold">Order Details</h3>
                <p className="text-xs text-muted-foreground font-mono">ID: {selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-2 gap-3 text-xs border-b border-border pb-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Customer</p>
                <p className="font-semibold text-foreground mt-0.5">{selectedOrder.customer_name || "Customer"}</p>
                <p className="text-muted-foreground">{selectedOrder.customer_email}</p>
                <p className="text-muted-foreground">{selectedOrder.phone}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Shipping Address</p>
                <p className="text-foreground mt-0.5">{selectedOrder.shipping_address}</p>
                <p className="text-muted-foreground">{selectedOrder.city}, {selectedOrder.state} {selectedOrder.pincode}</p>
              </div>
            </div>

            {/* Order Items List */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Items ({selectedOrder.order_items?.length || 0})</p>
              <div className="divide-y divide-border">
                {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                  selectedOrder.order_items.map((item) => (
                    <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-foreground">{item.product_name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right font-mono">
                        <p className="font-bold">{inr(item.total_price || item.unit_price * item.quantity)}</p>
                        <p className="text-[10px] text-muted-foreground">({inr(item.unit_price)} each)</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground py-2">No item breakdown available.</p>
                )}
              </div>
            </div>

            {/* Total breakdown */}
            <div className="border-t border-border pt-3 text-xs space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span>{inr(selectedOrder.subtotal || selectedOrder.total)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-500">
                  <span>Discount:</span>
                  <span>-{inr(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-foreground text-sm pt-1 border-t border-border">
                <span>Total Amount:</span>
                <span className="font-mono">{inr(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
