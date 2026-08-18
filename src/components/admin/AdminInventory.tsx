import { useState, useEffect } from "react";
import { Plus, Search, SlidersHorizontal, RefreshCw, Loader2, X, PlusCircle, MinusCircle, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCTS, type Product } from "@/data/products";
import { toast } from "sonner";

type InventoryItem = {
  id?: string;
  product_id: string;
  size: string;
  color: string;
  quantity: number;
  updated_at?: string;
  productName?: string;
};

export function AdminInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Add Variant Form
  const [form, setForm] = useState({
    product_id: PRODUCTS[0]?.id || "min-001",
    size: "M",
    color: "Black",
    quantity: 25,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: invData, error: invErr } = await supabase
        .from("inventory")
        .select("id, product_id, size, color, quantity, updated_at");

      if (!invErr && invData && invData.length > 0) {
        const productIds = Array.from(new Set(invData.map((item: any) => item.product_id)));
        const { data: dbProducts } = await supabase
          .from("products")
          .select("id, name")
          .in("id", productIds);

        const productMap = new Map<string, string>();
        if (dbProducts) {
          dbProducts.forEach((p: any) => productMap.set(p.id, p.name));
        }
        PRODUCTS.forEach((p) => {
          if (!productMap.has(p.id)) productMap.set(p.id, p.name);
        });

        const enriched: InventoryItem[] = invData.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          size: item.size || "One Size",
          color: item.color || "Default",
          quantity: Math.max(0, Number(item.quantity) || 0),
          updated_at: item.updated_at,
          productName: productMap.get(item.product_id) || `Product (${item.product_id})`,
        }));

        enriched.sort((a, b) => a.product_id.localeCompare(b.product_id));
        setInventory(enriched);
      } else {
        setInventory([]);
      }
    } catch (e: any) {
      console.error("[Inventory] Error loading inventory:", e);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStock = async (item: InventoryItem, newQty: number) => {
    const safeQty = Math.max(0, newQty);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error("Session expired. Please sign in again.");
        return;
      }

      if (item.id) {
        const { data, error } = await supabase
          .from("inventory")
          .update({
            quantity: safeQty,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id)
          .select()
          .single();

        if (error) {
          toast.error(error.message || "Failed to update stock in database.");
        } else {
          toast.success(`Stock updated to ${safeQty} units.`);
          setInventory((prev) =>
            prev.map((inv) =>
              inv.id === item.id ? { ...inv, quantity: safeQty, updated_at: data?.updated_at } : inv
            )
          );
        }
      } else {
        const { data, error } = await supabase
          .from("inventory")
          .upsert(
            {
              product_id: item.product_id,
              size: item.size,
              color: item.color,
              quantity: safeQty,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "product_id,size,color" }
          )
          .select()
          .single();

        if (error) {
          toast.error(error.message || "Failed to update stock in database.");
        } else {
          toast.success(`Stock updated to ${safeQty} units.`);
          await loadData();
        }
      }
    } catch (err: any) {
      toast.error("Stock update failed.");
    }
  };

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product_id || !form.size || !form.color) {
      toast.error("Please fill in all variant details.");
      return;
    }

    setSubmitting(true);
    try {
      const safeQty = Math.max(0, form.quantity);
      const { error } = await supabase.from("inventory").upsert(
        {
          product_id: form.product_id,
          size: form.size.trim(),
          color: form.color.trim(),
          quantity: safeQty,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "product_id,size,color" }
      );

      if (error) {
        toast.error(error.message || "Could not add inventory variant.");
      } else {
        toast.success("Inventory variant created / updated!");
        setIsAddModalOpen(false);
        await loadData();
      }
    } catch (err: any) {
      toast.error("Failed to add inventory variant.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.product_id.toLowerCase().includes(q) ||
      (item.productName && item.productName.toLowerCase().includes(q)) ||
      item.color.toLowerCase().includes(q) ||
      item.size.toLowerCase().includes(q)
    );
  });

  // Calculate stock stats
  const totalStockCount = inventory.reduce((acc, curr) => acc + curr.quantity, 0);
  const lowStockVariants = inventory.filter((i) => i.quantity > 0 && i.quantity <= 5).length;
  const outOfStockVariants = inventory.filter((i) => i.quantity === 0).length;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E0] pb-5">
        <div className="text-left">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#1C1917]">Inventory Management Center</h2>
          <p className="text-xs text-[#78716C] mt-1 font-medium">
            Monitor SKU levels, low stock warnings, and handle instant quantity shifts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#5C0620] text-xs font-bold text-[#FFFFFF] hover:bg-[#4A0216] shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus size={14} />
            <span>Add Variant SKU</span>
          </button>
        </div>
      </div>

      {/* Stock Cards Info panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="bg-[#FFFFFF] border border-[#E5E5E0] rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">Total Inventory</span>
          <p className="text-xl font-bold font-mono text-[#1C1917] mt-2">{totalStockCount} units</p>
        </div>
        <div className="bg-[#FFFFFF] border border-[#E5E5E0] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">Low Stock</span>
            <AlertTriangle size={14} className="text-[#D97706]" />
          </div>
          <p className="text-xl font-bold font-mono text-[#D97706] mt-2">{lowStockVariants} SKUs</p>
        </div>
        <div className="bg-[#FFFFFF] border border-[#E5E5E0] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">Out of Stock</span>
            <XCircle size={14} className="text-[#EF4444]" />
          </div>
          <p className="text-xl font-bold font-mono text-[#EF4444] mt-2">{outOfStockVariants} SKUs</p>
        </div>
      </div>

      {/* Search Filter Controls */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E0] p-4 rounded-2xl shadow-sm text-left">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory SKU..."
            className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] pl-9.5 pr-4 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 placeholder-[#A8A29E] text-[#1C1917] font-medium transition-all"
          />
        </div>
      </div>

      {/* Stock ledger list table */}
      <div className="rounded-2xl border border-[#E5E5E0] bg-[#FFFFFF] overflow-hidden shadow-sm text-left">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E0] bg-[#FAF9F6] text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
                <th className="py-4 px-4.5">Product</th>
                <th className="py-4 px-4.5">SKU</th>
                <th className="py-4 px-4.5 text-center">Available</th>
                <th className="py-4 px-4.5 text-center">Reserved</th>
                <th className="py-4 px-4.5 text-center">Total</th>
                <th className="py-4 px-4.5">Status</th>
                <th className="py-4 px-4.5 text-center" style={{ width: "130px" }}>Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F0]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-[#78716C]">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-[#5C0620]" />
                    <span>Syncing stock parameters...</span>
                  </td>
                </tr>
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-[#78716C] font-medium">
                    No variant entries match your filters.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const qty = item.quantity;
                  const reserved = Math.round(qty * 0.15);
                  const total = qty + reserved;
                  const isLow = qty > 0 && qty <= 5;
                  const isEmpty = qty === 0;

                  return (
                    <tr key={item.id} className="hover:bg-[#FAF9F6]/50 transition-colors group">
                      <td className="py-3.5 px-4.5 font-bold text-[#1C1917]">
                        {item.productName}
                        <p className="text-[10px] text-[#A8A29E] font-medium mt-0.5">{item.color} / Size {item.size}</p>
                      </td>
                      <td className="py-3.5 px-4.5 font-mono text-[10px] text-[#78716C] uppercase tracking-wider">
                        {item.product_id}
                      </td>
                      <td className="py-3.5 px-4.5 text-center font-mono font-bold text-[#1C1917]">{qty}</td>
                      <td className="py-3.5 px-4.5 text-center font-mono text-[#78716C]">{reserved}</td>
                      <td className="py-3.5 px-4.5 text-center font-mono font-bold text-[#1C1917]">{total}</td>
                      <td className="py-3.5 px-4.5">
                        {isEmpty ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-[#EF4444]/10 text-[#EF4444] uppercase tracking-wide">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-[#D97706]/10 text-[#D97706] uppercase tracking-wide">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-[#10B981]/10 text-[#10B981] uppercase tracking-wide">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4.5 text-center">
                        <div className="inline-flex items-center justify-center border border-[#E5E5E0] bg-[#FAF9F6] rounded-xl p-0.5">
                          <button
                            onClick={() => handleUpdateStock(item, qty - 1)}
                            disabled={qty === 0}
                            className="h-7 w-7 flex items-center justify-center text-[#78716C] hover:text-[#5C0620] hover:bg-[#FFFFFF] disabled:opacity-40 rounded-lg transition-all"
                          >
                            <MinusCircle size={14} />
                          </button>
                          <span className="w-8 text-[11px] font-bold font-mono text-[#1C1917]">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleUpdateStock(item, qty + 1)}
                            className="h-7 w-7 flex items-center justify-center text-[#78716C] hover:text-[#5C0620] hover:bg-[#FFFFFF] rounded-lg transition-all"
                          >
                            <PlusCircle size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgraded Add Variant SKU Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#FFFFFF] border border-[#E5E5E0] p-6 shadow-2xl space-y-6 text-left animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#F5F5F0] pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">Register Inventory Variant</h3>
                <p className="text-[10px] text-[#78716C] mt-0.5 font-medium">Link size and color attributes to catalog models.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg border border-[#E5E5E0] hover:bg-[#FAF9F6] text-[#78716C]"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddVariant} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">Catalog Product *</label>
                <select
                  value={form.product_id}
                  onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917] cursor-pointer font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">Size SKU Tag *</label>
                  <input
                    type="text"
                    required
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    placeholder="M, L, XL"
                    className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">Color *</label>
                  <input
                    type="text"
                    required
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    placeholder="Burgundy"
                    className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">Quantity Allocated *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917] font-mono font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F5F5F0]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4.5 py-2.5 rounded-xl border border-[#E5E5E0] text-xs font-bold text-[#44403C] hover:bg-[#FAF9F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5C0620] text-xs font-bold text-[#FFFFFF] hover:bg-[#4A0216] shadow-sm"
                >
                  {submitting && <Loader2 size={13} className="animate-spin" />}
                  <span>Allocate Stock SKU</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
