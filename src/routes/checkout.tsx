import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Check,
  CreditCard,
  Smartphone,
  Landmark,
  Banknote,
  Truck,
  Loader2,
  MapPin,
  Star,
  Plus,
  CheckSquare,
  Square,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { getProduct } from "@/data/products";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { UserPortalLayout } from "@/components/site/UserPortalLayout";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — MINORA" },
      {
        name: "description",
        content:
          "Complete your MINORA order: select a saved delivery address or add a new address, choose delivery, and pay securely.",
      },
      { property: "og:title", content: "Checkout — MINORA" },
      { property: "og:description", content: "Secure checkout with UPI, cards and cash on delivery." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

const STEPS = ["Address", "Delivery", "Payment", "Confirmation"];

const PAYMENTS = [
  { id: "upi", label: "UPI", note: "Pay via any UPI app", icon: Smartphone },
  { id: "card", label: "Credit / Debit Card", note: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", note: "All major Indian banks", icon: Landmark },
  { id: "cod", label: "Cash on Delivery", note: "Pay when your order arrives", icon: Banknote },
];

interface SavedAddress {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

function Checkout() {
  const [step, setStep] = useState(0);
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("upi");
  const [orderId, setOrderId] = useState("");
  const { cart, totals, clearCart } = useStore();
  const navigate = useNavigate();

  // Saved Addresses state
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [loadingSavedAddresses, setLoadingSavedAddresses] = useState(true);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string | null>(null);
  const [saveNewAddressCheckbox, setSaveNewAddressCheckbox] = useState(false);
  const [isSavingNewAddress, setIsSavingNewAddress] = useState(false);

  // New Address form state
  const [address, setAddress] = useState({
    name: "",
    mobile: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Fetch saved addresses for the authenticated user
  useEffect(() => {
    let isMounted = true;
    async function fetchAddresses() {
      setLoadingSavedAddresses(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          if (isMounted) setLoadingSavedAddresses(false);
          return;
        }

        const { data, error } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", session.user.id)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: false });

        if (!error && data && isMounted) {
          setSavedAddresses(data as SavedAddress[]);

          // Preselect default address if present
          const defaultAddr = data.find((a: SavedAddress) => a.is_default);
          if (defaultAddr) {
            setSelectedSavedAddressId(defaultAddr.id);
            setAddress({
              name: defaultAddr.full_name || "",
              mobile: defaultAddr.phone || "",
              house: defaultAddr.address_line1 || "",
              street: defaultAddr.address_line2 || "",
              city: defaultAddr.city || "",
              state: defaultAddr.state || "",
              pincode: defaultAddr.postal_code || "",
            });
          }
        }
      } catch (err) {
        console.warn("Notice fetching checkout addresses:", err);
      } finally {
        if (isMounted) setLoadingSavedAddresses(false);
      }
    }

    fetchAddresses();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle selecting a saved address card
  const handleSelectSavedAddress = (addr: SavedAddress) => {
    setSelectedSavedAddressId(addr.id);
    setAddress({
      name: addr.full_name || "",
      mobile: addr.phone || "",
      house: addr.address_line1 || "",
      street: addr.address_line2 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.postal_code || "",
    });
  };

  // Handle editing new address form fields (deselects any active saved address card)
  const handleNewAddressChange = (key: keyof typeof address, value: string) => {
    setSelectedSavedAddressId(null);
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

  const field = (key: keyof typeof address, label: string, extra?: string) => (
    <label className={`block ${extra ?? ""}`}>
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        value={address[key]}
        onChange={(e) => handleNewAddressChange(key, e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
      />
    </label>
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0 && step < 3) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl">Nothing to check out</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your bag is empty right now.</p>
        <Link
          to="/c/$slug"
          params={{ slug: "trending" }}
          className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  // Handle Step 0 (Address Step) Submission
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. If saved address is selected, proceed directly
    if (selectedSavedAddressId) {
      setStep(1);
      return;
    }

    // 2. Otherwise validate new address form
    if (
      !address.name.trim() ||
      !address.mobile.trim() ||
      !address.house.trim() ||
      !address.street.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.pincode.trim()
    ) {
      toast.error("Please fill in all required delivery address fields.");
      return;
    }

    // 3. If checkbox is checked, save this new address to user's saved addresses
    if (saveNewAddressCheckbox) {
      try {
        setIsSavingNewAddress(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user?.id) {
          const newAddressPayload = {
            user_id: session.user.id,
            label: "Home",
            full_name: address.name.trim(),
            phone: address.mobile.trim(),
            address_line1: address.house.trim(),
            address_line2: address.street.trim() || null,
            city: address.city.trim(),
            state: address.state.trim(),
            postal_code: address.pincode.trim(),
            country: "India",
            is_default: savedAddresses.length === 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { data: insertedData, error: insertErr } = await supabase
            .from("addresses")
            .insert(newAddressPayload)
            .select("*")
            .single();

          if (!insertErr && insertedData) {
            setSavedAddresses((prev) => [insertedData as SavedAddress, ...prev]);
            setSelectedSavedAddressId(insertedData.id);
            toast.success("Address saved to your account!");
          }
        }
      } catch (err) {
        console.warn("Could not save new address to database:", err);
      } finally {
        setIsSavingNewAddress(false);
      }
    }

    setStep(1);
  };

  const placeOrder = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // 1. Get current Supabase session
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      const currentUserId = currentSession?.user?.id;

      if (!currentUserId || !currentSession?.user) {
        toast.error("Please sign in to place your order.");
        setIsSubmitting(false);
        return;
      }

      // 2. Fetch profile from public.profiles
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", currentUserId)
        .maybeSingle();

      const customerName = profileData?.full_name || address.name || "Customer";

      // 3. Validate checkout inputs
      if (
        !address.name ||
        !address.mobile ||
        !address.house ||
        !address.city ||
        !address.state ||
        !address.pincode
      ) {
        toast.error("Please complete all shipping address fields.");
        setIsSubmitting(false);
        return;
      }

      if (cart.length === 0) {
        toast.error("Your bag is empty.");
        setIsSubmitting(false);
        return;
      }

      // 4. Fetch corresponding products from public.products / catalog for exact pricing
      const productIds = Array.from(new Set(cart.map((c) => c.id)));
      const { data: dbProducts } = await supabase
        .from("products")
        .select("id, name, price, colors")
        .in("id", productIds);

      const dbProdMap = new Map<string, any>();
      if (dbProducts) {
        dbProducts.forEach((p: any) => dbProdMap.set(p.id, p));
      }

      // Prepare items payload for RPC transaction
      const itemsPayload = cart.map((line) => {
        const dbP = dbProdMap.get(line.id) || getProduct(line.id);
        const unitPrice = dbP ? Number(dbP.price) || 0 : 0;
        const prodName = dbP ? dbP.name : `Product ${line.id}`;
        const lineItemColor = (line as any).color || (dbP?.colors ? dbP.colors[0] : "Standard");
        return {
          product_id: line.id,
          product_name: prodName,
          size: line.size || "M",
          color: lineItemColor,
          quantity: line.qty,
          unit_price: unitPrice,
          total_price: unitPrice * line.qty,
        };
      });

      const fullShippingAddress = `${address.house} ${address.street}`.trim();

      // 5. Invoke atomic Postgres RPC transaction (create_order_and_deduct_inventory)
      let rpcRes: any = null;
      let rpcErr: any = null;

      const primaryCall = await supabase.rpc("create_order_and_deduct_inventory", {
        p_customer_name: customerName,
        p_customer_email: currentSession.user.email || "",
        p_phone: address.mobile,
        p_shipping_address: fullShippingAddress,
        p_city: address.city,
        p_state: address.state,
        p_pincode: address.pincode,
        p_subtotal: totals.mrp,
        p_discount: totals.discount,
        p_shipping: totals.delivery,
        p_total: totals.total,
        p_items: itemsPayload,
      });

      rpcRes = primaryCall.data;
      rpcErr = primaryCall.error;

      // Secondary RPC alias fallback if function name was create_order_and_decrement_inventory
      if (rpcErr && rpcErr.code === "PGRST202") {
        console.warn("[Checkout] Primary RPC not found, trying secondary RPC alias...");
        const fallbackCall = await supabase.rpc("create_order_and_decrement_inventory", {
          p_customer_name: customerName,
          p_customer_email: currentSession.user.email || "",
          p_phone: address.mobile,
          p_shipping_address: fullShippingAddress,
          p_city: address.city,
          p_state: address.state,
          p_pincode: address.pincode,
          p_subtotal: totals.mrp,
          p_discount: totals.discount,
          p_shipping: totals.delivery,
          p_total: totals.total,
          p_items: itemsPayload,
        });
        rpcRes = fallbackCall.data;
        rpcErr = fallbackCall.error;
      }

      // Handle RPC execution errors or transaction failure
      if (rpcErr) {
        console.error("[Checkout] Atomic order creation RPC error:", rpcErr);
        toast.error(rpcErr.message || "Failed to place order. Transaction rolled back.");
        setIsSubmitting(false);
        return;
      }

      if (!rpcRes || rpcRes.success === false || !rpcRes.order_id) {
        const failureMessage = rpcRes?.message || "Order creation failed. Cart preserved.";
        console.error("[Checkout] RPC returned failure:", failureMessage);
        toast.error(failureMessage);
        setIsSubmitting(false);
        return;
      }

      // 6. SUCCESS: ONLY reachable when RPC transaction fully completes & commits
      setOrderId(rpcRes.order_id);
      clearCart();
      setStep(3);
      toast.success("Order placed successfully!");
    } catch (e: any) {
      console.error("[Checkout] Execution exception:", e);
      toast.error(e.message || "An error occurred while completing checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserPortalLayout>
      <div className="mx-auto max-w-4xl px-3 py-5 sm:px-5">
        <h1 className="font-display text-2xl">Checkout</h1>

        <ol className="mt-5 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                  i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </span>
              <span
                className={`hidden text-xs font-medium sm:block ${
                  i <= step ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <span className={`h-px flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-6 gap-6 lg:flex lg:items-start">
          <div className="min-w-0 flex-1 rounded-xl border border-border bg-card p-4 sm:p-5">
            {/* STEP 0: ADDRESS */}
            {step === 0 && (
              <form onSubmit={handleAddressSubmit} className="space-y-6">
                {/* SAVED ADDRESSES SECTION */}
                {loadingSavedAddresses ? (
                  <div className="py-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin text-primary" />
                    Loading saved addresses...
                  </div>
                ) : (
                  savedAddresses.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <h2 className="font-display text-base font-semibold text-foreground">
                          Saved Addresses
                        </h2>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {savedAddresses.map((addr) => {
                          const isSelected = selectedSavedAddressId === addr.id;
                          const fullAddressText = [
                            addr.address_line1,
                            addr.address_line2,
                            addr.landmark ? `Landmark: ${addr.landmark}` : null,
                            addr.city,
                            `${addr.state} - ${addr.postal_code}`,
                          ]
                            .filter(Boolean)
                            .join(", ");

                          return (
                            <div
                              key={addr.id}
                              onClick={() => handleSelectSavedAddress(addr)}
                              className={`relative cursor-pointer rounded-xl border p-3.5 sm:p-4 transition-all space-y-1.5 ${
                                isSelected
                                  ? "border-primary bg-primary-soft/40 ring-1 ring-primary/40 shadow-sm"
                                  : "border-border bg-card hover:border-primary/40"
                              }`}
                            >
                              {/* Top Row: Radio, Tag, Default Badge */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="checkout_saved_address"
                                    checked={isSelected}
                                    onChange={() => handleSelectSavedAddress(addr)}
                                    className="h-4 w-4 accent-primary cursor-pointer"
                                  />
                                  <span className="rounded-md bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">
                                    {addr.label}
                                  </span>
                                </div>
                                {addr.is_default && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                                    <Star size={10} className="fill-emerald-600" /> Default
                                  </span>
                                )}
                              </div>

                              {/* Second Line: Name • Phone */}
                              <p className="text-xs font-semibold text-foreground pt-0.5">
                                {addr.full_name}{" "}
                                <span className="text-muted-foreground/50 font-normal mx-1">•</span>{" "}
                                <span className="text-muted-foreground font-medium">{addr.phone}</span>
                              </p>

                              {/* Third Line: Full Address (Clamped to max 2 lines) */}
                              <p className="text-xs text-muted-foreground/90 leading-snug line-clamp-2">
                                {fullAddressText}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* DIVIDER BETWEEN SAVED ADDRESSES AND NEW ADDRESS FORM */}
                      <div className="my-5 flex items-center gap-3">
                        <div className="h-px flex-1 bg-border" />
                        <span className="rounded-full border border-border bg-secondary px-3 py-1 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                          OR
                        </span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                    </div>
                  )
                )}

                {/* ADD NEW ADDRESS SECTION */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-primary" />
                    <h2 className="font-display text-base font-semibold text-foreground">
                      Add New Address
                    </h2>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {field("name", "Full name *")}
                    {field("mobile", "Mobile number *")}
                    {field("house", "House / Flat *")}
                    {field("street", "Street / Area *")}
                    {field("city", "City *")}
                    {field("state", "State *")}
                    {field("pincode", "Pincode *")}
                  </div>

                  {/* Optional Save to Saved Addresses Checkbox */}
                  <div className="pt-2">
                    <label
                      className="inline-flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none"
                      onClick={() => setSaveNewAddressCheckbox(!saveNewAddressCheckbox)}
                    >
                      {saveNewAddressCheckbox ? (
                        <CheckSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground" />
                      )}
                      Save this address to my saved addresses
                    </label>
                  </div>
                </div>

                {/* SAVE & CONTINUE BUTTON */}
                <button
                  type="submit"
                  disabled={isSavingNewAddress}
                  className="mt-5 w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground sm:w-auto sm:px-8 hover:bg-primary/95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSavingNewAddress ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving Address...
                    </>
                  ) : (
                    "Save & Continue"
                  )}
                </button>
              </form>
            )}

            {/* STEP 1: DELIVERY OPTIONS */}
            {step === 1 && (
              <div>
                <h2 className="font-display text-lg">Delivery Options</h2>
                <div className="mt-4 space-y-3">
                  {[
                    { id: "standard", label: "Standard Delivery", note: "3-5 business days", price: "FREE" },
                    { id: "express", label: "Express Delivery", note: "1-2 business days", price: "₹99" },
                  ].map((d) => (
                    <label
                      key={d.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                        delivery === d.id ? "border-primary bg-primary-soft" : "border-border"
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        checked={delivery === d.id}
                        onChange={() => setDelivery(d.id)}
                        className="accent-[oklch(0.36_0.115_12)]"
                      />
                      <Truck size={18} className="text-primary" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{d.label}</span>
                        <span className="block text-xs text-muted-foreground">{d.note}</span>
                      </span>
                      <span className="text-sm font-semibold">{d.price}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="rounded-md border border-border px-5 py-3 text-sm font-medium"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground sm:flex-none sm:px-8"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PAYMENT METHOD */}
            {step === 2 && (
              <div>
                <h2 className="font-display text-lg">Payment Method</h2>
                <div className="mt-4 space-y-3">
                  {PAYMENTS.map((p) => (
                    <label
                      key={p.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                        payment === p.id ? "border-primary bg-primary-soft" : "border-border"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={payment === p.id}
                        onChange={() => setPayment(p.id)}
                        className="accent-[oklch(0.36_0.115_12)]"
                      />
                      <p.icon size={18} className="text-primary" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{p.label}</span>
                        <span className="block text-xs text-muted-foreground">{p.note}</span>
                      </span>
                    </label>
                  ))}
                </div>
                {payment === "upi" && (
                  <input
                    placeholder="yourname@upi"
                    aria-label="UPI ID"
                    className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                )}
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-md border border-border px-5 py-3 text-sm font-medium"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={placeOrder}
                    className="flex-1 rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground sm:flex-none sm:px-8 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    <span>{isSubmitting ? "Processing Order..." : `Pay ${inr(totals.total)}`}</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONFIRMATION */}
            {step === 3 && (
              <div className="py-6 text-center space-y-3">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <Check size={26} />
                </span>
                <h2 className="font-display text-2xl font-bold">Order Placed Successfully!</h2>
                <p className="text-sm text-muted-foreground">
                  Thank you{address.name ? `, ${address.name.split(" ")[0]}` : ""}! Order ID:{" "}
                  <span className="font-bold text-foreground font-mono">{orderId}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Order Status:{" "}
                  <span className="font-bold text-amber-500 uppercase">Pending Confirmation</span>
                </p>
                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/account"
                    search={{ tab: "orders" }}
                    className="rounded-xl bg-primary px-7 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all shadow-sm"
                  >
                    View My Orders
                  </Link>
                  <Link
                    to="/"
                    className="rounded-xl border border-border px-7 py-3 text-xs font-bold uppercase tracking-wider hover:bg-secondary transition-all"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ORDER SUMMARY SIDEBAR */}
          {step < 3 && (
            <aside className="mt-6 rounded-xl border border-border bg-card p-4 lg:mt-0 lg:w-80 lg:shrink-0">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Order Summary
              </h2>
              <ul className="mt-3 space-y-3">
                {cart.map((l) => {
                  const p = getProduct(l.id);
                  if (!p) return null;
                  return (
                    <li key={`${l.id}-${l.size}`} className="flex gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        loading="lazy"
                        width={768}
                        height={1024}
                        className="h-16 w-12 rounded object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{p.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          Size {l.size} · Qty {l.qty}
                        </span>
                      </span>
                      <span className="text-sm font-medium">{inr(p.price * l.qty)}</span>
                    </li>
                  );
                })}
              </ul>
              <dl className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Item Total</dt>
                  <dd>{inr(totals.mrp)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Discount</dt>
                  <dd className="text-success">− {inr(totals.discount)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd>{totals.delivery === 0 ? "FREE" : inr(totals.delivery)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <dt>Total</dt>
                  <dd>{inr(totals.total)}</dd>
                </div>
              </dl>
            </aside>
          )}
        </div>
      </div>
    </UserPortalLayout>
  );
}