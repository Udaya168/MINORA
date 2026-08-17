import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, Check, Loader2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCTS, CATEGORIES, type Product } from "@/data/products";
import { inr } from "@/lib/format";
import { toast } from "sonner";

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "kurtis",
    categoryLabel: "Kurtis",
    group: "women" as "women" | "men" | "kids",
    price: 499,
    originalPrice: 1299,
    seller: "Anaya Textiles, Surat",
    fabric: "Cotton Blend",
    pattern: "Floral",
    description: "",
    sizes: "XS, S, M, L, XL, XXL",
    colors: "Ivory, Pink",
    images: "",
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: Product[] = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          category: d.category,
          categoryLabel: d.category_label || d.category,
          group: d.group_name || "women",
          tags: d.tags || [],
          images: Array.isArray(d.images) && d.images.length > 0 ? d.images : ["/assets/p-kurti.jpg"],
          price: Number(d.price) || 0,
          originalPrice: Number(d.original_price) || 0,
          discount: Number(d.discount) || 0,
          rating: Number(d.rating) || 4.2,
          reviewCount: Number(d.review_count) || 120,
          sizes: d.sizes || ["M", "L"],
          colors: d.colors || ["Standard"],
          description: d.description || "",
          fabric: d.fabric || "Cotton",
          pattern: d.pattern || "Solid",
          seller: d.seller || "MINORA Luxury",
          delivery: d.delivery || "Free delivery in 3-5 days",
          inStock: d.in_stock !== false,
          createdDaysAgo: d.created_days_ago || 0,
          popularity: d.popularity || 100,
        }));
        setProducts(mapped);
      } else {
        setProducts(PRODUCTS);
      }
    } catch (e) {
      console.error("Error loading products from Supabase:", e);
      setProducts(PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    const nextId = `min-${String(products.length + 1).padStart(3, "0")}`;
    setForm({
      id: nextId,
      name: "",
      category: "kurtis",
      categoryLabel: "Kurtis",
      group: "women",
      price: 499,
      originalPrice: 1299,
      seller: "Anaya Textiles, Surat",
      fabric: "Cotton Blend",
      pattern: "Floral",
      description: "",
      sizes: "XS, S, M, L, XL, XXL",
      colors: "Ivory, Pink",
      images: "",
    });
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setForm({
      id: p.id,
      name: p.name,
      category: p.category,
      categoryLabel: p.categoryLabel,
      group: p.group,
      price: p.price,
      originalPrice: p.originalPrice,
      seller: p.seller,
      fabric: p.fabric,
      pattern: p.pattern,
      description: p.description,
      sizes: p.sizes.join(", "),
      colors: p.colors.join(", "),
      images: p.images.join(", "),
    });
    setEditingProduct(p);
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.category) {
      toast.error("Please complete all required product fields.");
      return;
    }

    setSubmitting(true);
    try {
      const discountVal = Math.max(0, Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100));
      const sizesArray = form.sizes.split(",").map((s) => s.trim()).filter(Boolean);
      const colorsArray = form.colors.split(",").map((c) => c.trim()).filter(Boolean);
      const imagesArray = form.images.split(",").map((img) => img.trim()).filter(Boolean);
      const categoryObj = CATEGORIES.find((c) => c.slug === form.category);
      const catLabel = categoryObj ? categoryObj.label : form.category;

      const payload = {
        id: form.id,
        name: form.name.trim(),
        category: form.category,
        category_label: catLabel,
        group_name: form.group,
        price: Number(form.price),
        original_price: Number(form.originalPrice),
        discount: discountVal,
        seller: form.seller.trim(),
        fabric: form.fabric.trim(),
        pattern: form.pattern.trim(),
        description: form.description.trim() || `${form.name.trim()} crafted in ${form.fabric.trim().toLowerCase()}.`,
        sizes: sizesArray.length > 0 ? sizesArray : ["Free Size"],
        colors: colorsArray.length > 0 ? colorsArray : ["Standard"],
        images: imagesArray.length > 0 ? imagesArray : [`/assets/p-${form.category === 'kurtas' ? 'kurta' : form.category}.jpg`],
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("products").upsert(payload, { onConflict: "id" });

      if (error) {
        toast.error(error.message || "Failed to save product in database.");
      } else {
        toast.success(editingProduct ? "Product updated successfully!" : "New product created successfully!");
        setIsAddModalOpen(false);
        await loadProducts();
      }
    } catch (err: any) {
      console.error("Save product error:", err);
      toast.error("An error occurred while saving product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("products").delete().eq("id", deletingProduct.id);

      if (error) {
        toast.error(error.message || "Could not delete product.");
      } else {
        toast.success(`Product "${deletingProduct.name}" deleted.`);
        setDeletingProduct(null);
        await loadProducts();
      }
    } catch (err: any) {
      toast.error("Failed to delete product.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Products Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add, update, or remove clothing and accessory items in your Minora catalog.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground tracking-wider uppercase hover:bg-primary/95 transition-all shadow-sm"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, ID, or category..."
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-xs outline-none focus:border-primary transition-all"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-border bg-card px-3 py-2.5 text-xs outline-none focus:border-primary transition-all"
        >
          <option value="all">All Categories ({products.length})</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Sizes</th>
                <th className="py-3.5 px-4">Seller</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-primary" />
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No products match your search query.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg overflow-hidden border border-border bg-secondary flex-shrink-0">
                          {p.images && p.images[0] ? (
                            <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                              <ImageIcon size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground truncate max-w-[200px]">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">ID: {p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary text-secondary-foreground uppercase tracking-wider">
                        {p.categoryLabel || p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold">
                      {inr(p.price)}
                      {p.originalPrice > p.price && (
                        <span className="ml-1 text-[10px] text-muted-foreground line-through font-normal">
                          {inr(p.originalPrice)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {p.sizes && p.sizes.length > 0 ? p.sizes.join(", ") : "Free Size"}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground truncate max-w-[150px]">
                      {p.seller}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg border border-border hover:bg-secondary text-foreground transition-all"
                          title="Edit product"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(p)}
                          className="p-1.5 rounded-lg border border-destructive/30 hover:bg-destructive/10 text-destructive transition-all"
                          title="Delete product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-display text-lg font-bold">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <p className="text-xs text-muted-foreground">Product ID: {form.id}</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Silk Anarkali Kurti"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => {
                      const cat = CATEGORIES.find((c) => c.slug === e.target.value);
                      setForm({
                        ...form,
                        category: e.target.value,
                        categoryLabel: cat ? cat.label : e.target.value,
                      });
                    }}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase">Target Group</label>
                  <select
                    value={form.group}
                    onChange={(e) => setForm({ ...form, group: e.target.value as any })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase">Original MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase">Brand / Seller</label>
                  <input
                    type="text"
                    value={form.seller}
                    onChange={(e) => setForm({ ...form, seller: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase">Fabric</label>
                  <input
                    type="text"
                    value={form.fabric}
                    onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase">Pattern</label>
                  <input
                    type="text"
                    value={form.pattern}
                    onChange={(e) => setForm({ ...form, pattern: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase">Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={form.sizes}
                    onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                    placeholder="XS, S, M, L, XL"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase">Colors (comma separated)</label>
                  <input
                    type="text"
                    value={form.colors}
                    onChange={(e) => setForm({ ...form, colors: e.target.value })}
                    placeholder="Red, Blue, Pink"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Image URLs (comma separated)</label>
                <input
                  type="text"
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  placeholder="/assets/p-kurti.jpg, https://example.com/image2.jpg"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Product description and care instructions..."
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
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
                  {editingProduct ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-4 text-center">
            <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive mx-auto flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Confirm Deletion</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Are you sure you want to delete this product?
              </p>
              <p className="text-xs font-bold text-foreground mt-2 border border-border/80 bg-secondary/40 py-2 px-3 rounded-xl">
                "{deletingProduct.name}" ({deletingProduct.id})
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="w-1/2 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={submitting}
                className="w-1/2 py-2.5 rounded-xl bg-destructive text-xs font-bold text-destructive-foreground hover:bg-destructive/90 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
