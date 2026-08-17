import { useState, useEffect } from "react";
import { Plus, Search, PlusCircle, MinusCircle, Sliders, Trash2, Loader2, X, RefreshCw } from "lucide-react";
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
    console.log("[Inventory] Query started");
    try {
      // 1. Get current session for debug logging
      const { data: { session } } = await supabase.auth.getSession();
      console.log("[Inventory] Current user ID:", session?.user?.id);

      // 2. Fetch inventory records (Step 1)
      const { data: invData, error: invErr } = await supabase
        .from("inventory")
        .select("id, product_id, size, color, quantity, updated_at");

      console.log("[Inventory] Rows returned:", invData ? invData.length : 0);
      if (invErr) {
        console.error("[Inventory] Query error:", invErr.message);
      }

      if (!invErr && invData && invData.length > 0) {
        // 3. Collect product IDs and fetch product names (Step 2)
        const productIds = Array.from(new Set(invData.map((item: any) => item.product_id)));
        const { data: dbProducts } = await supabase
          .from("products")
          .select("id, name")
          .in("id", productIds);

        const productMap = new Map<string, string>();
        if (dbProducts) {
          dbProducts.forEach((p: any) => productMap.set(p.id, p.name));
        }
        // Fallback to static catalog if DB name is missing
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

        // Sort by product ID then size then color
        enriched.sort((a, b) => a.product_id.localeCompare(b.product_id));
        setInventory(enriched);
      } else if (!invErr && invData && invData.length === 0) {
        setInventory([]);
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
    console.log("[Inventory] Update row ID:", item.id);
    console.log("[Inventory] Current quantity:", item.quantity);
    console.log("[Inventory] New quantity:", safeQty);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error("Session expired. Please sign in again.");
        return;
      }

      if (item.id) {
        // Direct UPDATE using existing inventory row primary key (inventory.id)
        const { data, error } = await supabase
          .from("inventory")
          .update({
            quantity: safeQty,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id)
          .select()
          .single();

        console.log("[Inventory] Update result:", data);
        if (error) {
          console.error("[Inventory] Update error:", error.message, error);
          toast.error(error.message || "Failed to update stock in database.");
        } else {
          toast.success(`Stock updated to ${safeQty} units.`);
          // Optimistically update state and refetch
          setInventory((prev) =>
            prev.map((inv) =>
              inv.id === item.id ? { ...inv, quantity: safeQty, updated_at: data?.updated_at } : inv
            )
          );
        }
      } else {
        // UPSERT by composite unique key (product_id, size, color) when creating new variant
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

        console.log("[Inventory] Upsert result:", data);
        if (error) {
          console.error("[Inventory] Update error:", error.message, error);
          toast.error(error.message || "Failed to update stock in database.");
        } else {
          toast.success(`Stock updated to ${safeQty} units.`);
          await loadData();
        }
      }
    } catch (err: any) {
      console.error("[Inventory] Update exception:", err);
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
    const query = search.toLowerCase();
    return (
      (item.productName && item.productName.toLowerCase().includes(query)) ||
      item.product_id.toLowerCase().includes(query) ||
      item.size.toLowerCase().includes(query) ||
      item.color.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Stock & Inventory Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor variant stock levels, add stock, set quantities, and manage warehouse availability.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-secondary transition-all"
            title="Refresh Inventory"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground tracking-wider uppercase hover:bg-primary/95 transition-all shadow-sm"
          >
            <Plus size={16} /> Add Variant Stock
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter inventory by product name, variant ID, size or color..."
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-xs outline-none focus:border-primary transition-all"
        />
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3.5 px-4">Product Variant</th>
                <th className="py-3.5 px-4">Size</th>
                <th className="py-3.5 px-4">Color</th>
                <th className="py-3.5 px-4">Stock Qty</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Quick Stock Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-primary" />
                    Loading inventory records...
                  </td>
                </tr>
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No inventory records match your query.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item, idx) => {
                  const isOut = item.quantity === 0;
                  const isLow = item.quantity > 0 && item.quantity <= 5;
                  return (
                    <tr key={item.id || `inv-${idx}`} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-foreground">{item.productName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">ID: {item.product_id}</p>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-foreground">{item.size}</td>
                      <td className="py-3 px-4 text-muted-foreground">{item.color}</td>
                      <td className="py-3 px-4 font-mono font-bold text-base">{item.quantity}</td>
                      <td className="py-3 px-4">
                        {isOut ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500">
                            Low Stock ({item.quantity})
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleUpdateStock(item, item.quantity + 5)}
                            className="px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-[11px] font-bold transition-all"
                            title="Add +5 units"
                          >
                            +5 Add
                          </button>
                          <button
                            onClick={() => handleUpdateStock(item, Math.max(0, item.quantity - 1))}
                            disabled={item.quantity === 0}
                            className="px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 text-[11px] font-bold transition-all disabled:opacity-40"
                            title="Remove 1 unit"
                          >
                            -1 Remove
                          </button>
                          <button
                            onClick={() => handleUpdateStock(item, 0)}
                            disabled={item.quantity === 0}
                            className="px-2.5 py-1 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-[11px] font-bold transition-all disabled:opacity-40"
                            title="Clear Stock to 0"
                          >
                            Clear
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

      {/* Add Variant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-lg font-bold">Add Variant Stock</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddVariant} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Select Product *</label>
                <select
                  value={form.product_id}
                  onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase">Variant Size *</label>
                  <input
                    type="text"
                    required
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    placeholder="M, L, UK 6, Free Size"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase">Color *</label>
                  <input
                    type="text"
                    required
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    placeholder="Black, Pink, Gold"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Initial Quantity *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Math.max(0, Number(e.target.value)) })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground tracking-wider uppercase hover:bg-primary/95"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
