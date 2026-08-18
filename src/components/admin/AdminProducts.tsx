import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, Check, Loader2, AlertCircle, Image as ImageIcon, SlidersHorizontal, ArrowLeft, ArrowRight, Download, Upload, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCTS, CATEGORIES, type Product } from "@/data/products";
import { inr } from "@/lib/format";
import { toast } from "sonner";

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState("all");

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showColumns, setShowColumns] = useState(false);

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchesStock = stockFilter === "all" || (stockFilter === "instock" ? p.inStock : !p.inStock);
    const matchesPub = publishedFilter === "all" || (publishedFilter === "published" ? p.price > 0 : p.price === 0);

    return matchesSearch && matchesCategory && matchesStock && matchesPub;
  });

  return (
    <div className="space-y-6">
      {/* Title Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E0] pb-5">
        <div className="text-left">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#1C1917]">Products</h2>
          <p className="text-xs text-[#78716C] mt-1 font-medium">
            Manage the MINORA product catalog.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success("Importing catalog database...")}
            className="px-3.5 py-2 rounded-xl border border-[#E5E5E0] bg-[#FFFFFF] text-xs font-bold text-[#44403C] hover:bg-[#FAF9F6] shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Upload size={13} />
            <span>Import</span>
          </button>
          <button
            onClick={() => toast.success("Exporting catalog database...")}
            className="px-3.5 py-2 rounded-xl border border-[#E5E5E0] bg-[#FFFFFF] text-xs font-bold text-[#44403C] hover:bg-[#FAF9F6] shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Download size={13} />
            <span>Export</span>
          </button>
          <button
            onClick={openAddModal}
            className="px-3.5 py-2 rounded-xl bg-[#5C0620] text-xs font-bold text-[#FFFFFF] hover:bg-[#4A0216] shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus size={14} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Catalog Filters Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#FFFFFF] border border-[#E5E5E0] p-4 rounded-2xl shadow-sm text-left">
        <div className="md:col-span-2 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog models..."
            className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] pl-9.5 pr-4 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 placeholder-[#A8A29E] text-[#1C1917] transition-all font-medium"
          />
        </div>

        <div className="relative">
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917] font-medium appearance-none cursor-pointer"
          >
            <option value="all">Stock Status</option>
            <option value="instock">In Stock</option>
            <option value="outofstock">Out of Stock</option>
          </select>
          <SlidersHorizontal size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78716C] pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value)}
            className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917] font-medium appearance-none cursor-pointer"
          >
            <option value="all">Published status</option>
            <option value="published">Active</option>
            <option value="archived">Archived</option>
          </select>
          <SlidersHorizontal size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78716C] pointer-events-none" />
        </div>
      </div>

      {/* Bulk actions and Column tools */}
      {selectedIds.length > 0 && (
        <div className="bg-[#5C0620]/5 border border-[#5C0620]/20 rounded-xl p-3.5 flex items-center justify-between text-left">
          <span className="text-xs font-bold text-[#5C0620]">
            {selectedIds.length} catalog items selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.success("Bulk activation completed.");
                setSelectedIds([]);
              }}
              className="px-3 py-1.5 text-[10px] font-bold bg-[#FFFFFF] border border-[#E5E5E0] rounded-lg text-[#1C1917]"
            >
              Activate
            </button>
            <button
              onClick={() => {
                toast.success("Bulk archive completed.");
                setSelectedIds([]);
              }}
              className="px-3 py-1.5 text-[10px] font-bold bg-[#FFFFFF] border border-transparent text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg"
            >
              Archive / Delete
            </button>
          </div>
        </div>
      )}

      {/* Premium Catalog Table ledger */}
      <div className="rounded-2xl border border-[#E5E5E0] bg-[#FFFFFF] overflow-hidden shadow-sm text-left">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E0] bg-[#FAF9F6] text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
                <th className="py-4 px-4.5" style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-[#E5E5E0] text-[#5C0620] focus:ring-[#5C0620]"
                  />
                </th>
                <th className="py-4 px-4.5">Product</th>
                <th className="py-4 px-4.5">SKU</th>
                <th className="py-4 px-4.5">Price</th>
                <th className="py-4 px-4.5">Stock</th>
                <th className="py-4 px-4.5">Status</th>
                <th className="py-4 px-4.5">Updated</th>
                <th className="py-4 px-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F0]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-[#78716C]">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-[#5C0620]" />
                    <span>Syncing products list...</span>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-[#78716C] font-medium">
                    No catalog items matched.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF9F6]/50 transition-colors group">
                    <td className="py-3.5 px-4.5">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={(e) => handleSelectRow(p.id, e.target.checked)}
                        className="rounded border-[#E5E5E0] text-[#5C0620] focus:ring-[#5C0620]"
                      />
                    </td>
                    <td className="py-3.5 px-4.5">
                      <div className="flex items-center gap-3.5">
                        <div className="h-11 w-11 rounded-lg overflow-hidden border border-[#E5E5E0] bg-[#FAF9F6] flex-shrink-0 shadow-inner">
                          {p.images && p.images[0] ? (
                            <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[#A8A29E]">
                              <ImageIcon size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#1C1917] truncate max-w-[200px]">{p.name}</p>
                          <p className="text-[10px] text-[#A8A29E] font-medium leading-none mt-0.5 uppercase tracking-wider">{p.categoryLabel || p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4.5 font-mono text-[#78716C]">
                      {p.id}
                    </td>
                    <td className="py-3.5 px-4.5 font-mono font-bold text-[#1C1917]">
                      {inr(p.price)}
                    </td>
                    <td className="py-3.5 px-4.5 text-[#57534E] font-medium">
                      {p.inStock ? "Available" : "Empty"}
                    </td>
                    <td className="py-3.5 px-4.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        p.inStock ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#EF4444]/10 text-[#EF4444]"
                      }`}>
                        {p.inStock ? "Active" : "Depleted"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4.5 text-[#A8A29E] font-medium">
                      24h ago
                    </td>
                    <td className="py-3.5 px-4.5 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg border border-[#E5E5E0] bg-[#FFFFFF] hover:border-[#5C0620]/30 hover:bg-[#5C0620]/5 text-[#57534E] hover:text-[#5C0620] transition-all"
                          title="Edit product"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(p)}
                          className="p-1.5 rounded-lg border border-transparent hover:border-[#EF4444]/30 hover:bg-[#FEF2F2] text-[#78716C] hover:text-[#EF4444] transition-all"
                          title="Delete product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Table Footer Controls */}
        <div className="bg-[#FAF9F6] border-t border-[#E5E5E0] px-4.5 py-3.5 flex items-center justify-between text-[#78716C] text-[10px] font-bold">
          <span>Showing {filteredProducts.length} of {products.length} products</span>
          <div className="flex items-center gap-1.5">
            <button className="p-1 rounded border border-[#E5E5E0] bg-[#FFFFFF] opacity-50 cursor-not-allowed">
              <ArrowLeft size={12} />
            </button>
            <button className="p-1 rounded border border-[#E5E5E0] bg-[#FFFFFF] opacity-50 cursor-not-allowed">
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Upgraded Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FFFFFF] border border-[#E5E5E0] p-6.5 shadow-2xl space-y-6 text-left animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#F5F5F0] pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  {editingProduct ? "Modify Catalog Item" : "Add Catalog Item"}
                </h3>
                <p className="text-[10px] font-mono text-[#78716C] mt-0.5 uppercase tracking-wider">SKU: {form.id}</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg border border-[#E5E5E0] hover:bg-[#FAF9F6] text-[#78716C] hover:text-[#1C1917]"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Silk Embroidered Anarkali"
                    className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">Category Category *</label>
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
                    className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917] cursor-pointer"
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
                  <label className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">Demographic</label>
                  <select
                    value={form.group}
                    onChange={(e) => setForm({ ...form, group: e.target.value as any })}
                    className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917]"
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917] font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">MRP Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">Seller</label>
                  <input
                    type="text"
                    value={form.seller}
                    onChange={(e) => setForm({ ...form, seller: e.target.value })}
                    className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">Fabric</label>
                  <input
                    type="text"
                    value={form.fabric}
                    onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                    className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">Pattern</label>
                  <input
                    type="text"
                    value={form.pattern}
                    onChange={(e) => setForm({ ...form, pattern: e.target.value })}
                    className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={form.sizes}
                    onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                    placeholder="XS, S, M, L, XL"
                    className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">Colors (comma separated)</label>
                  <input
                    type="text"
                    value={form.colors}
                    onChange={(e) => setForm({ ...form, colors: e.target.value })}
                    placeholder="Red, Blue, Pink"
                    className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">Image URLs (comma separated)</label>
                <input
                  type="text"
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  placeholder="/assets/p-kurti.jpg"
                  className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Material care details..."
                  className="w-full rounded-xl border border-[#E5E5E0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs outline-none focus:border-[#5C0620]/50 text-[#1C1917]"
                />
              </div>

              <div className="flex items-center justify-end gap-3.5 pt-4.5 border-t border-[#F5F5F0]">
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
                  <span>{editingProduct ? "Save Changes" : "Create Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#FFFFFF] border border-[#E5E5E0] p-6 shadow-2xl space-y-4 text-center animate-in zoom-in-95 duration-100">
            <div className="h-12 w-12 rounded-full bg-[#FEF2F2] text-[#EF4444] mx-auto flex items-center justify-center border border-[#EF4444]/15">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">Remove Product Entry</h3>
              <p className="text-xs text-[#78716C] mt-1.5 font-medium">
                Are you sure you want to remove this product?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3.5 border-t border-[#F5F5F0]">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="w-1/2 py-2.5 rounded-xl border border-[#E5E5E0] text-xs font-bold text-[#44403C] hover:bg-[#FAF9F6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={submitting}
                className="w-1/2 py-2.5 rounded-xl bg-[#EF4444] text-xs font-bold text-[#FFFFFF] hover:bg-[#DC2626] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {submitting ? <Loader2 size={13} className="animate-spin" /> : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
