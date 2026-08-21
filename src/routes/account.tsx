import { useState, useEffect, useCallback } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Package,
  MapPin,
  Heart,
  User as UserIcon,
  CreditCard,
  LogOut,
  ShieldCheck,
  Loader2,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Star,
  Check,
  Phone,
  Mail,
  Calendar,
  Building,
} from "lucide-react";
import { getProduct } from "@/data/products";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { UserPortalLayout } from "@/components/site/UserPortalLayout";
import { EditProfileModal } from "@/components/account/EditProfileModal";
import { AddressFormModal, type AddressData } from "@/components/account/AddressFormModal";
import { DeleteAddressModal } from "@/components/account/DeleteAddressModal";
import { toast } from "sonner";

const accountSearchSchema = z.object({
  tab: z.string().optional(),
});

export const Route = createFileRoute("/account")({
  validateSearch: accountSearchSchema,
  head: () => ({
    meta: [
      { title: "My Account — MINORA" },
      {
        name: "description",
        content:
          "Manage your MINORA profile, track orders, saved addresses, payment methods and wishlist in one place.",
      },
      { property: "og:title", content: "My Account — MINORA" },
    ],
  }),
  component: AccountPage,
});

const TABS = [
  { id: "orders", label: "My Orders", icon: Package },
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "payments", label: "Payments", icon: CreditCard },
];

function AccountPage() {
  const search = Route.useSearch();
  const [tab, setTab] = useState(search.tab || "orders");
  const { wishlist, isLoggedIn, fullName, user, profile, role, logout, fetchProfile } = useStore();
  const navigate = useNavigate();

  // Customer Orders state
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Edit modal state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Address section state
  const [savedAddresses, setSavedAddresses] = useState<AddressData[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<AddressData | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<AddressData | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  // Load customer orders
  useEffect(() => {
    let isMounted = true;
    async function loadCustomerOrders() {
      if (!user?.id) return;
      setLoadingOrders(true);
      try {
        const { data: ordData, error: ordErr } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!ordErr && ordData && isMounted) {
          setCustomerOrders(ordData);
        }
      } catch (e) {
        // Fallback
      } finally {
        if (isMounted) setLoadingOrders(false);
      }
    }
    loadCustomerOrders();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Load saved addresses
  const loadSavedAddresses = useCallback(async () => {
    if (!user?.id) return;
    setLoadingAddresses(true);
    try {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Notice loading addresses:", error.message);
        setSavedAddresses([]);
      } else if (data) {
        setSavedAddresses(data as AddressData[]);
      }
    } catch (err) {
      console.error("Exception loading addresses:", err);
      setSavedAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && tab === "addresses") {
      loadSavedAddresses();
    }
  }, [user?.id, tab, loadSavedAddresses]);

  // Handler to set an address as default
  const handleSetDefaultAddress = async (addr: AddressData) => {
    if (!user?.id || !addr.id || addr.is_default) return;
    setSettingDefaultId(addr.id);

    try {
      // 1. Unset default from all addresses for user
      await supabase
        .from("addresses")
        .update({ is_default: false, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);

      // 2. Set default on selected address
      const { error } = await supabase
        .from("addresses")
        .update({ is_default: true, updated_at: new Date().toISOString() })
        .eq("id", addr.id)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success(`Set ${addr.label} address as default.`);
      await loadSavedAddresses();
    } catch (err: any) {
      console.error("Error setting default address:", err);
      toast.error(err.message || "Failed to set default address.");
    } finally {
      setSettingDefaultId(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="font-display text-2xl tracking-wide">MY ACCOUNT</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xs">
          Please sign in to view your orders, saved addresses, and profile details.
        </p>
        <Link
          to="/login"
          className="mt-8 rounded-none bg-primary px-8 py-3.5 text-xs font-bold tracking-widest text-primary-foreground hover:bg-primary/95 transition-all uppercase"
        >
          SIGN IN TO PROFILE
        </Link>
      </div>
    );
  }

  // Derive name parts safely
  const firstName = (profile?.["first_name"] as string) || (fullName ? fullName.split(" ")[0] : "");
  const lastName = (profile?.["last_name"] as string) || (fullName ? fullName.split(" ").slice(1).join(" ") : "");
  const initialLetter = (firstName || fullName || user?.email || "A").charAt(0).toUpperCase();

  return (
    <UserPortalLayout>
      <div className="mx-auto max-w-[1200px] px-3 py-5 sm:px-5">
        <h1 className="font-display text-2xl">My Account</h1>

        <div className="mt-5 gap-6 lg:flex lg:items-start">
          {/* Sidebar */}
          <aside className="rounded-xl border border-border bg-card p-3 lg:w-64 lg:shrink-0">
            <div className="flex min-w-0 items-center gap-3 border-b border-border px-2 pb-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-soft font-display text-primary text-lg font-bold">
                {initialLetter}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{fullName || "User"}</span>
                <span className="block truncate text-xs text-muted-foreground">{user?.email}</span>
              </span>
            </div>
            <nav className="mt-2 flex gap-1 overflow-x-auto lg:flex-col">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm lg:w-full transition-colors ${
                    tab === t.id
                      ? "bg-primary-soft font-medium text-primary"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <t.icon size={16} /> {t.label}
                </button>
              ))}
              <Link
                to="/wishlist"
                className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary lg:w-full transition-colors"
              >
                <Heart size={16} /> Wishlist
                <span className="ml-auto text-xs">{wishlist.length}</span>
              </Link>
              {(role === "admin" || role === "super_admin") && (
                <a
                  href="/admin"
                  className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm text-primary hover:bg-primary-soft lg:w-full transition-colors"
                >
                  <ShieldCheck size={16} /> Admin Portal
                </a>
              )}
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  navigate({ to: "/" });
                }}
                className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary lg:w-full transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </nav>
          </aside>

          {/* Main Tab Content */}
          <section className="mt-5 min-w-0 flex-1 lg:mt-0">
            {/* ORDERS TAB */}
            {tab === "orders" && (
              <div>
                {loadingOrders ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-primary" />
                    Loading your orders...
                  </div>
                ) : customerOrders.length === 0 ? (
                  <div className="rounded-xl border border-border bg-card p-8 text-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-secondary text-muted-foreground mx-auto flex items-center justify-center">
                      <Package size={24} />
                    </div>
                    <h3 className="font-display font-semibold text-foreground">No Orders Yet</h3>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      You haven't placed any orders with MINORA yet. Explore our curated collections.
                    </p>
                    <Link
                      to="/c/$slug"
                      params={{ slug: "trending" }}
                      className="inline-block px-5 py-2.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground tracking-wider uppercase hover:bg-primary/95 transition-all"
                    >
                      Explore Catalog
                    </Link>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {customerOrders.map((o) => {
                      const statusKey = (o.status || "processing").toLowerCase();
                      const formattedDate = o.created_at
                        ? new Date(o.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Recently";

                      const itemsList = Array.isArray(o.order_items) ? o.order_items : [];

                      return (
                        <li key={o.id || o.order_number} className="rounded-xl border border-border bg-card p-4 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 text-xs">
                            <div>
                              <span className="text-muted-foreground">
                                Order <span className="font-bold text-foreground font-mono">{o.order_number || o.id}</span>
                              </span>
                              <span className="ml-2 text-[11px] text-muted-foreground font-light">· {formattedDate}</span>
                            </div>

                            <div>
                              {statusKey === "delivered" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                                  <CheckCircle2 size={12} /> Delivered
                                </span>
                              )}
                              {statusKey === "shipped" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500">
                                  <Truck size={12} /> Shipped
                                </span>
                              )}
                              {statusKey === "confirmed" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-500">
                                  <CheckCircle2 size={12} /> Confirmed
                                </span>
                              )}
                              {statusKey === "processing" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500">
                                  <Clock size={12} /> Processing
                                </span>
                              )}
                              {statusKey === "cancelled" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500">
                                  <XCircle size={12} /> Cancelled
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            {itemsList.length > 0 ? (
                              itemsList.map((item: any, idx: number) => {
                                const prod = getProduct(item.product_id);
                                const imgSrc = item.image_url || (prod ? prod.images[0] : "/assets/p-kurti.jpg");
                                return (
                                  <div key={item.id || idx} className="flex items-center gap-3 pt-1">
                                    <img
                                      src={imgSrc}
                                      alt={item.product_name}
                                      className="h-16 w-12 rounded object-cover border border-border"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold text-xs text-foreground truncate">{item.product_name}</p>
                                      <p className="text-[10px] text-muted-foreground">
                                        Size: {item.size || "M"} · Qty: {item.quantity}
                                      </p>
                                      <p className="text-xs font-mono font-bold text-foreground mt-0.5">{inr(item.price)}</p>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-xs text-muted-foreground">{o.items_count || 1} Item(s)</p>
                            )}
                          </div>

                          <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Total Paid:</span>
                            <span className="font-mono font-bold text-sm text-foreground">{inr(o.total_amount || o.total || 0)}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {tab === "profile" && (
              <div className="rounded-xl border border-border bg-card p-5 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                  <div className="flex items-center gap-4">
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-primary-soft font-display text-primary text-2xl font-bold border border-primary/20 shadow-sm">
                      {initialLetter}
                    </span>
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        {fullName || "User Profile"}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all shadow-sm"
                  >
                    <Edit size={14} /> Edit Profile
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* First Name */}
                  <div className="rounded-lg border border-border bg-background p-3.5 space-y-1">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">First Name</span>
                    <p className="text-sm font-semibold text-foreground">{firstName || "—"}</p>
                  </div>

                  {/* Last Name */}
                  <div className="rounded-lg border border-border bg-background p-3.5 space-y-1">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">Last Name</span>
                    <p className="text-sm font-semibold text-foreground">{lastName || "—"}</p>
                  </div>

                  {/* Email Address */}
                  <div className="rounded-lg border border-border bg-background p-3.5 space-y-1">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">Email Address</span>
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Mail size={14} className="text-muted-foreground shrink-0" />
                      <span className="truncate">{user?.email || "—"}</span>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="rounded-lg border border-border bg-background p-3.5 space-y-1">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">Phone Number</span>
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Phone size={14} className="text-muted-foreground shrink-0" />
                      <span>{(profile?.["phone"] as string) || (profile?.["phone_number"] as string) || "Not provided"}</span>
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="rounded-lg border border-border bg-background p-3.5 space-y-1">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">Date of Birth</span>
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Calendar size={14} className="text-muted-foreground shrink-0" />
                      <span>{(profile?.["date_of_birth"] as string) || (profile?.["dob"] as string) || "Not provided"}</span>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="rounded-lg border border-border bg-background p-3.5 space-y-1">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">Gender</span>
                    <p className="text-sm font-semibold text-foreground">{(profile?.["gender"] as string) || "Not specified"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {tab === "addresses" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground">Saved Delivery Addresses</h2>
                    <p className="text-xs text-muted-foreground">Manage your saved addresses for fast checkout.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAddressToEdit(null);
                      setAddressModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all shadow-sm"
                  >
                    <Plus size={16} /> Add New Address
                  </button>
                </div>

                {loadingAddresses ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-primary" />
                    Loading saved addresses...
                  </div>
                ) : savedAddresses.length === 0 ? (
                  /* EMPTY STATE */
                  <div className="rounded-xl border border-border bg-card p-8 text-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-secondary text-muted-foreground mx-auto flex items-center justify-center">
                      <MapPin size={24} />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground">No Saved Addresses</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                      You haven’t saved any delivery addresses yet. Add a new address to make checkout faster.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setAddressToEdit(null);
                        setAddressModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-primary text-xs font-bold text-primary-foreground tracking-wider uppercase hover:bg-primary/95 transition-all shadow-md"
                    >
                      <Plus size={16} /> Add Your First Address
                    </button>
                  </div>
                ) : (
                  /* SAVED ADDRESS CARDS GRID */
                  <div className="grid gap-4 sm:grid-cols-2">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`relative rounded-xl border bg-card p-4 transition-all flex flex-col justify-between space-y-3 ${
                          addr.is_default ? "border-primary ring-1 ring-primary/30 shadow-sm" : "border-border"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
                              {addr.label}
                            </span>
                            {addr.is_default && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                                <Star size={10} className="fill-emerald-600" /> Default Address
                              </span>
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-foreground">{addr.full_name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Phone size={12} className="shrink-0" /> {addr.phone}
                            </p>
                          </div>

                          <div className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border/50 space-y-0.5">
                            <p className="font-medium text-foreground/90">{addr.address_line1}</p>
                            {addr.address_line2 && <p>{addr.address_line2}</p>}
                            {addr.landmark && <p className="italic text-[11px]">Landmark: {addr.landmark}</p>}
                            <p>
                              {addr.city}, {addr.state} – <span className="font-mono font-medium">{addr.postal_code}</span>
                            </p>
                            <p className="text-[11px] font-semibold uppercase text-muted-foreground/80">{addr.country}</p>
                          </div>
                        </div>

                        {/* Card Actions Footer */}
                        <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setAddressToEdit(addr);
                                setAddressModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            >
                              <Edit size={13} /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAddressToDelete(addr);
                                setDeleteModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-colors"
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>

                          {!addr.is_default && (
                            <button
                              type="button"
                              disabled={settingDefaultId === addr.id}
                              onClick={() => handleSetDefaultAddress(addr)}
                              className="inline-flex items-center gap-1 rounded-md bg-secondary/80 px-2.5 py-1.5 text-[11px] font-semibold text-foreground hover:bg-primary-soft hover:text-primary transition-all disabled:opacity-50"
                            >
                              {settingDefaultId === addr.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Check size={12} />
                              )}
                              Set as Default
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PAYMENTS TAB */}
            {tab === "payments" && (
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <h2 className="font-display text-lg">Saved Payments</h2>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <CreditCard size={18} className="text-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">UPI / Saved Card</span>
                      <span className="block text-xs text-muted-foreground">Default payment option</span>
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={profile}
        userEmail={user?.email || ""}
        userId={user?.id || ""}
        onProfileUpdated={async () => {
          if (user?.id) {
            await fetchProfile(user.id);
          }
        }}
      />

      {/* Add / Edit Address Modal */}
      <AddressFormModal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        addressToEdit={addressToEdit}
        userId={user?.id || ""}
        onSaved={loadSavedAddresses}
      />

      {/* Delete Address Modal */}
      <DeleteAddressModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        addressToDelete={addressToDelete}
        allAddresses={savedAddresses}
        userId={user?.id || ""}
        onDeleted={loadSavedAddresses}
      />
    </UserPortalLayout>
  );
}