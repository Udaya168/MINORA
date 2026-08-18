import { useState, useEffect } from "react";
import { ShoppingBag, Search, Clock, CheckCircle2, Truck, XCircle, Loader2, Eye, X, Mail, Phone, MapPin, DollarSign, SlidersHorizontal, RefreshCw } from "lucide-react";
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

export function AdminOrders({
  selectedOrderIdToOpen,
  onClearSelectedId,
}: {
  selectedOrderIdToOpen?: string | null;
  onClearSelectedId?: () => void;
}) {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    if (selectedOrderIdToOpen && orders.length > 0) {
      const found = orders.find((o) => o.id === selectedOrderIdToOpen);
      if (found) {
        setSelectedOrder(found);
        if (onClearSelectedId) {
          onClearSelectedId();
        }
      }
    }
  }, [selectedOrderIdToOpen, orders, onClearSelectedId]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data as OrderRecord[]);
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
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        await loadOrders();
      }
    } catch (e: any) {
      toast.error("Status update failed.");
    }
  };

  const statusBadge = (status: OrderRecord["status"]) => {
    switch (status) {
      case "delivered":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/10 text-[#10B981] uppercase tracking-wide"><CheckCircle2 size={11} /> Delivered</span>;
      case "shipped":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#3B82F6]/10 text-[#3B82F6] uppercase tracking-wide"><Truck size={11} /> Shipped</span>;
      case "confirmed":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#8B5CF6]/10 text-[#8B5CF6] uppercase tracking-wide"><CheckCircle2 size={11} /> Confirmed</span>;
      case "processing":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#D97706]/10 text-[#D97706] uppercase tracking-wide"><Clock size={11} /> Processing</span>;
      case "pending":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#D97706]/10 text-[#D97706] uppercase tracking-wide"><Clock size={11} /> Pending</span>;
      case "cancelled":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#EF4444]/10 text-[#EF4444] uppercase tracking-wide"><XCircle size={11} /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FAF9F6] border border-[#E5E5E0] text-[#57534E] uppercase tracking-wide">{status}</span>;
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

  // Metrics counts
  const allCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const processingCount = orders.filter((o) => o.status === "processing").length;
  const shippedCount = orders.filter((o) => o.status === "shipped").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E0] pb-5">
        <div className="text-left">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#1C1917]">Order Management</h2>
          <p className="text-xs text-[#78716C] mt-1 font-medium">
            Monitor client purchases, dispatch schedules, and manage fulfillment.
          </p>
        </div>
      </div>

      {/* KPI metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 text-left">
        <div onClick={() => setStatusFilter("all")} className={`bg-[#FFFFFF] border p-4 rounded-2xl shadow-sm cursor-pointer transition-all ${statusFilter === "all" ? "border-[#5C0620]" : "border-[#E5E5E0]"}`}>
          <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">All Orders</span>
          <p className="text-lg font-bold font-mono text-[#1C1917] mt-1">{allCount}</p>
        </div>
        <div onClick={() => setStatusFilter("pending")} className={`bg-[#FFFFFF] border p-4 rounded-2xl shadow-sm cursor-pointer transition-all ${statusFilter === "pending" ? "border-[#5C0620]" : "border-[#E5E5E0]"}`}>
          <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">Pending</span>
          <p className="text-lg font-bold font-mono text-[#D97706] mt-1">{pendingCount}</p>
        </div>
        <div onClick={() => setStatusFilter("processing")} className={`bg-[#FFFFFF] border p-4 rounded-2xl shadow-sm cursor-pointer transition-all ${statusFilter === "processing" ? "border-[#5C0620]" : "border-[#E5E5E0]"}`}>
          <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">Processing</span>
          <p className="text-lg font-bold font-mono text-[#D97706] mt-1">{processingCount}</p>
        </div>
        <div onClick={() => setStatusFilter("shipped")} className={`bg-[#FFFFFF] border p-4 rounded-2xl shadow-sm cursor-pointer transition-all ${statusFilter === "shipped" ? "border-[#5C0620]" : "border-[#E5E5E0]"}`}>
          <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">Shipped</span>
          <p className="text-lg font-bold font-mono text-[#3B82F6] mt-1">{shippedCount}</p>
        </div>
        <div onClick={() => setStatusFilter("delivered")} className={`bg-[#FFFFFF] border p-4 rounded-2xl shadow-sm cursor-pointer transition-all ${statusFilter === "delivered" ? "border-[#5C0620]" : "border-[#E5E5E0]"}`}>
          <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">Delivered</span>
          <p className="text-lg font-bold font-mono text-[#10B981] mt-1">{deliveredCount}</p>
        </div>
      </div>

      {/* Filter and search parameters */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E0] p-4 rounded-2xl shadow-sm text-left">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders ledger..."
            className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] pl-9.5 pr-4 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 placeholder-[#A8A29E] text-[#1C1917] transition-all"
          />
        </div>
      </div>

      {/* Order ledger list table */}
      <div className="rounded-2xl border border-[#E5E5E0] bg-[#FFFFFF] overflow-hidden shadow-sm text-left">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E0] bg-[#FAF9F6] text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
                <th className="py-4 px-4.5">Order</th>
                <th className="py-4 px-4.5">Customer</th>
                <th className="py-4 px-4.5">Items</th>
                <th className="py-4 px-4.5">Amount</th>
                <th className="py-4 px-4.5">Payment</th>
                <th className="py-4 px-4.5">Status</th>
                <th className="py-4 px-4.5">Date</th>
                <th className="py-4 px-4.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F0]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-[#78716C]">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-[#5C0620]" />
                    <span>Syncing customer ledger...</span>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-[#78716C] font-medium">
                    No client order logs match your filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const qty = o.order_items?.reduce((acc, curr) => acc + curr.quantity, 0) || 1;
                  return (
                    <tr key={o.id} className="hover:bg-[#FAF9F6]/50 transition-colors group">
                      <td className="py-3.5 px-4.5 font-mono font-bold text-[#5C0620]">
                        #{o.id.slice(0, 8)}
                      </td>
                      <td className="py-3.5 px-4.5 font-bold text-[#1C1917]">
                        {o.customer_name || "Guest Checkout"}
                        <p className="text-[10px] text-[#78716C] font-normal mt-0.5">{o.customer_email}</p>
                      </td>
                      <td className="py-3.5 px-4.5 font-mono text-[#57534E]">
                        {qty} {qty === 1 ? "item" : "items"}
                      </td>
                      <td className="py-3.5 px-4.5 font-mono font-bold text-[#1C1917]">
                        {inr(o.total)}
                      </td>
                      <td className="py-3.5 px-4.5 font-semibold text-[#78716C] uppercase text-[9px]">
                        {o.payment_status || "Paid"}
                      </td>
                      <td className="py-3.5 px-4.5">
                        {statusBadge(o.status)}
                      </td>
                      <td className="py-3.5 px-4.5 text-[#57534E] font-medium">
                        {new Date(o.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="py-3.5 px-4.5 text-right">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="p-1.5 rounded-lg border border-[#E5E5E0] bg-[#FFFFFF] hover:border-[#5C0620]/30 hover:bg-[#5C0620]/5 text-[#57534E] hover:text-[#5C0620] transition-all opacity-85 group-hover:opacity-100"
                          title="View order details"
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

      {/* Upgraded Detailed Order Details Modal Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FFFFFF] border border-[#E5E5E0] p-6 shadow-2xl space-y-6 text-left animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#F5F5F0] pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">Transaction Ledger Details</h3>
                <p className="text-[10px] font-mono text-[#78716C] mt-0.5 uppercase tracking-wider">Order ID Reference: {selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg border border-[#E5E5E0] hover:bg-[#FAF9F6] text-[#78716C] hover:text-[#1C1917]"
              >
                <X size={15} />
              </button>
            </div>

            {/* Layout grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Customer details */}
              <div className="space-y-4 text-left">
                <div className="p-4 border border-[#E5E5E0] rounded-xl bg-[#FAF9F6] space-y-3">
                  <h4 className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider border-b border-[#E5E5E0] pb-1.5">Client Profile</h4>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-[#1C1917]">{selectedOrder.customer_name || "Guest Checkout"}</p>
                    <div className="flex items-center gap-2 text-[11px] text-[#57534E]">
                      <Mail size={11} className="text-[#A8A29E]" />
                      <span>{selectedOrder.customer_email || "No email"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#57534E]">
                      <Phone size={11} className="text-[#A8A29E]" />
                      <span>{selectedOrder.phone || "No phone contact"}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-[#E5E5E0] rounded-xl bg-[#FAF9F6] space-y-3">
                  <h4 className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider border-b border-[#E5E5E0] pb-1.5">Delivery Address</h4>
                  <div className="flex items-start gap-2 text-[11px] text-[#57534E] leading-relaxed">
                    <MapPin size={12} className="text-[#A8A29E] shrink-0 mt-0.5" />
                    <div>
                      <p>{selectedOrder.shipping_address}</p>
                      <p>{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Order status settings */}
              <div className="space-y-4 text-left">
                <div className="p-4 border border-[#E5E5E0] rounded-xl bg-[#FAF9F6] space-y-3">
                  <h4 className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider border-b border-[#E5E5E0] pb-1.5">Fulfillment Status Control</h4>
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#78716C] font-semibold">Fulfillment:</span>
                      {statusBadge(selectedOrder.status)}
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">Update status</label>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as any)}
                        className="w-full rounded-xl border border-[#E5E5E0] bg-[#FFFFFF] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917] font-medium cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-[#E5E5E0] rounded-xl bg-[#FAF9F6] space-y-3">
                  <h4 className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider border-b border-[#E5E5E0] pb-1.5">Payment details</h4>
                  <div className="space-y-1.5 font-mono text-[11px] text-[#57534E]">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{inr(selectedOrder.subtotal)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-[#EF4444]">
                        <span>Discount:</span>
                        <span>-{inr(selectedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping Rate:</span>
                      <span>{inr(selectedOrder.shipping)}</span>
                    </div>
                    <div className="flex justify-between text-[#1C1917] font-bold border-t border-[#E5E5E0] pt-1.5 text-xs">
                      <span>Total Value:</span>
                      <span className="text-[#5C0620]">{inr(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="space-y-2 text-left">
              <h4 className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">Purchase Lines ({selectedOrder.order_items?.length || 0})</h4>
              <div className="border border-[#E5E5E0] rounded-xl overflow-hidden bg-[#FFFFFF]">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5E5E0] bg-[#FAF9F6] text-[#78716C] font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-3">Item Details</th>
                      <th className="py-2.5 px-3">Specs</th>
                      <th className="py-2.5 px-3">Rate</th>
                      <th className="py-2.5 px-3">Qty</th>
                      <th className="py-2.5 px-3 text-right">Sum Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F5F0]">
                    {selectedOrder.order_items && selectedOrder.order_items.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FAF9F6]/50">
                        <td className="py-2 px-3 font-bold text-[#1C1917]">
                          {item.product_name || `SKU Line (${item.product_id})`}
                        </td>
                        <td className="py-2 px-3">
                          <span className="font-bold text-[9px] bg-[#FAF9F6] border border-[#E5E5E0] px-1 py-0.5 rounded uppercase mr-1">
                            {item.size}
                          </span>
                          <span className="text-[9px] text-[#78716C] font-semibold">{item.color}</span>
                        </td>
                        <td className="py-2 px-3 font-mono">{inr(item.unit_price)}</td>
                        <td className="py-2 px-3 font-bold">{item.quantity}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-[#1C1917]">
                          {inr(item.total_price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3.5 pt-4.5 border-t border-[#F5F5F0]">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4.5 py-2.5 rounded-xl border border-[#E5E5E0] text-xs font-bold text-[#44403C] hover:bg-[#FAF9F6] w-full sm:w-auto"
              >
                Close Ledger Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
