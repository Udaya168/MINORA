import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { getProduct, PRODUCTS } from "@/data/products";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_AVAILABLE_COUPONS = [
  { code: "WELCOME10", description: "Get 10% OFF", type: "percentage", value: 10, min_order: 0 },
  { code: "FIRSTORDER", description: "Get ₹100 OFF", type: "flat", value: 100, min_order: 0 },
  { code: "SAVE200", description: "Get ₹200 OFF on orders above ₹1500", type: "flat", value: 200, min_order: 1500 },
  { code: "MINORA15", description: "Get 15% OFF", type: "percentage", value: 15, min_order: 0 },
  { code: "FREESHIP", description: "Free Delivery", type: "free_shipping", value: 0, min_order: 0 },
];

const VALID_COUPONS: Record<string, { type: "percent" | "flat" | "free_shipping"; value: number; label: string; minOrder?: number }> = {
  WELCOME10: { type: "percent", value: 10, label: "10% OFF" },
  FIRSTORDER: { type: "flat", value: 100, label: "₹100 OFF" },
  SAVE200: { type: "flat", value: 200, label: "₹200 OFF (Min ₹1500)", minOrder: 1500 },
  MINORA15: { type: "percent", value: 15, label: "15% OFF" },
  FREESHIP: { type: "free_shipping", value: 0, label: "Free Delivery" },
  MINORA20: { type: "percent", value: 20, label: "20% OFF" },
  SAVE10: { type: "percent", value: 10, label: "10% OFF" },
  FLAT50: { type: "flat", value: 50, label: "₹50 OFF" },
  MINORA100: { type: "flat", value: 100, label: "₹100 OFF" },
};

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, setQty, removeFromCart, totals, hydrated, appliedCoupon, applyCouponState, removeCoupon } = useStore();
  const navigate = useNavigate();

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  // Available Coupons list state
  const [availableCoupons, setAvailableCoupons] = useState(DEFAULT_AVAILABLE_COUPONS);
  const [showAllCoupons, setShowAllCoupons] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-cart-drawer", handleOpen);
    return () => window.removeEventListener("open-cart-drawer", handleOpen);
  }, []);

  // Fetch active coupons from Supabase public.coupons when drawer is open
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    async function loadActiveCoupons() {
      try {
        const { data, error } = await supabase
          .from("coupons")
          .select("*")
          .eq("is_active", true);

        if (!error && data && data.length > 0 && isMounted) {
          const mapped = data.map((c: any) => ({
            code: (c.code || "").toUpperCase(),
            description:
              c.description ||
              (c.discount_type === "percentage"
                ? `Get ${c.discount_value}% OFF`
                : c.discount_type === "free_shipping"
                ? "Free Delivery"
                : `Get ₹${c.discount_value} OFF`),
            type: c.discount_type,
            value: Number(c.discount_value || 0),
            min_order: Number(c.min_order_amount ?? c.minimum_order_amount ?? 0),
          }));
          setAvailableCoupons(mapped);
        }
      } catch {
        // Ignore network / table missing errors gracefully
      }
    }

    loadActiveCoupons();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const lines = cart
    .map((l) => ({ line: l, product: getProduct(l.id) }))
    .filter((x) => x.product);

  // Calculate current cart payable before coupon
  let payableBeforeCoupon = 0;
  for (const line of cart) {
    const p = PRODUCTS.find((x) => x.id === line.id);
    if (p) payableBeforeCoupon += p.price * line.qty;
  }

  // Handle Apply Coupon (Reads from Supabase public.coupons table)
  const handleApplyCoupon = async (codeToApply?: string) => {
    const targetCode = codeToApply || couponCode;
    const cleanCode = targetCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (payableBeforeCoupon <= 0) {
      setCouponError("Your bag is empty");
      setCouponSuccess("");
      return;
    }

    setCouponCode(cleanCode);
    setIsApplying(true);
    setCouponError("");
    setCouponSuccess("");

    try {
      // 1. Fetch matching coupon from Supabase public.coupons
      const { data: dbCoupon, error: dbError } = await supabase
        .from("coupons")
        .select("*")
        .ilike("code", cleanCode)
        .maybeSingle();

      let couponData: any = dbCoupon;

      // Fallback check against local config if table query has no result
      if (dbError || !couponData) {
        const localConfig = VALID_COUPONS[cleanCode];
        if (localConfig) {
          couponData = {
            code: cleanCode,
            is_active: true,
            discount_type:
              localConfig.type === "percent"
                ? "percentage"
                : localConfig.type === "free_shipping"
                ? "free_shipping"
                : "flat",
            discount_value: localConfig.value,
            minimum_order_amount: localConfig.minOrder || 0,
          };
        }
      }

      if (!couponData) {
        setCouponError("Invalid or expired coupon code");
        setIsApplying(false);
        return;
      }

      // Check active status
      const isActive = couponData.is_active ?? true;
      if (!isActive) {
        setCouponError("Invalid or expired coupon code");
        setIsApplying(false);
        return;
      }

      // Check start date if present
      if (couponData.start_date && new Date() < new Date(couponData.start_date)) {
        setCouponError("Invalid or expired coupon code");
        setIsApplying(false);
        return;
      }

      // Check expiry date (expires_at or expiry_date)
      const expiryDateStr = couponData.expires_at || couponData.expiry_date;
      if (expiryDateStr && new Date() > new Date(expiryDateStr)) {
        setCouponError("Invalid or expired coupon code");
        setIsApplying(false);
        return;
      }

      // Check minimum order amount
      const minOrder = Number(couponData.min_order_amount ?? couponData.minimum_order_amount ?? 0);
      if (payableBeforeCoupon < minOrder) {
        setCouponError(`Minimum order value of ${inr(minOrder)} required for this coupon.`);
        setIsApplying(false);
        return;
      }

      // Calculate discount amount
      const discType = (couponData.discount_type || "percentage").toLowerCase();
      const discValue = Number(couponData.discount_value || 0);
      const maxDiscount = couponData.max_discount ?? couponData.maximum_discount;

      let discountAmt = 0;
      let isFreeShip = false;

      if (discType === "percentage" || discType === "percent") {
        discountAmt = Math.round((payableBeforeCoupon * discValue) / 100);
        if (maxDiscount != null && Number(maxDiscount) > 0) {
          discountAmt = Math.min(discountAmt, Number(maxDiscount));
        }
      } else if (discType === "free_shipping") {
        isFreeShip = true;
        discountAmt = 0;
      } else {
        // fixed / flat
        discountAmt = discValue;
      }

      discountAmt = Math.min(payableBeforeCoupon, discountAmt);

      applyCouponState({
        code: (couponData.code || cleanCode).toUpperCase(),
        discountAmount: discountAmt,
        discountType: discType,
        isFreeShipping: isFreeShip,
      });
      setCouponSuccess("Coupon applied successfully");
      setCouponError("");
    } catch (err: any) {
      console.warn("Coupon check exception:", err);
      setCouponError("Invalid or expired coupon code");
    } finally {
      setIsApplying(false);
    }
  };

  // Handle Remove Coupon
  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess("");
    setCouponError("");
    setCouponCode("");
  };

  // Dynamic Price Calculations from store totals
  const totalBagDiscount = totals.productDiscount + totals.couponDiscount;
  const deliveryCharges = totals.delivery;
  const totalPayable = totals.total;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-foreground/30 backdrop-blur-xs"
        onClick={() => setIsOpen(false)}
        aria-label="Close cart"
      />

      {/* Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-primary" />
            <h2 className="font-display text-lg tracking-wide">Your Bag ({lines.length})</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="no-scrollbar flex-1 overflow-y-auto p-5 space-y-6">
          {hydrated && lines.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <ShoppingBag size={32} className="mx-auto text-muted-foreground/60 animate-bounce" />
              <p className="text-xs text-muted-foreground tracking-wider uppercase">Your bag is empty</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="border border-primary bg-primary px-6 py-2.5 text-[10px] font-bold tracking-[0.2em] text-primary-foreground hover:bg-transparent hover:text-primary transition-all duration-300"
              >
                START SHOPPING
              </button>
            </div>
          ) : (
            <>
              {/* Product Lines */}
              <ul className="space-y-4 divide-y divide-border">
                {lines.map(({ line, product }, idx) => {
                  const p = product!;
                  return (
                    <li key={`${line.id}-${line.size}`} className={`flex gap-4 ${idx > 0 ? "pt-4" : ""}`}>
                      <Link
                        to="/product/$id"
                        params={{ id: p.id }}
                        onClick={() => setIsOpen(false)}
                        className="h-24 w-18 shrink-0 overflow-hidden bg-secondary/20"
                      >
                        <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                      </Link>
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div className="space-y-0.5">
                          <h3 className="truncate text-xs font-semibold tracking-wide text-foreground">
                            <Link to="/product/$id" params={{ id: p.id }} onClick={() => setIsOpen(false)}>
                              {p.name}
                            </Link>
                          </h3>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                            Size: {line.size}
                          </p>
                          <div className="flex items-baseline gap-1.5 pt-0.5">
                            <span className="text-xs font-bold">{inr(p.price)}</span>
                            <span className="text-[10px] text-muted-foreground line-through font-light">
                              {inr(p.originalPrice)}
                            </span>
                          </div>
                        </div>

                        {/* Line Actions */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-border">
                            <button
                              type="button"
                              onClick={() => setQty(line.id, line.size, line.qty - 1)}
                              className="px-2 py-1 hover:bg-secondary text-muted-foreground"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="w-6 text-center text-xs">{line.qty}</span>
                            <button
                              type="button"
                              onClick={() => setQty(line.id, line.size, line.qty + 1)}
                              className="px-2 py-1 hover:bg-secondary text-muted-foreground"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(line.id, line.size)}
                            className="text-muted-foreground hover:text-destructive p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* HAVE A COUPON? Section */}
              <div className="border-t border-border pt-6 space-y-3.5">
                <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
                  HAVE A COUPON?
                </h4>

                {!appliedCoupon ? (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleApplyCoupon();
                        }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            if (couponError) setCouponError("");
                          }}
                          className="flex-1 rounded-none border border-border bg-background px-3 py-2 text-xs font-mono tracking-wider uppercase placeholder:font-sans placeholder:tracking-normal placeholder:normal-case outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                        <button
                          type="submit"
                          disabled={!couponCode.trim() || isApplying}
                          className={`px-5 py-2 text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-200 border flex items-center justify-center gap-1.5 ${
                            couponCode.trim() && !isApplying
                              ? "border-primary bg-primary text-primary-foreground hover:bg-primary/95 shadow-xs cursor-pointer"
                              : "border-border bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                          }`}
                        >
                          {isApplying ? <Loader2 size={12} className="animate-spin" /> : "APPLY"}
                        </button>
                      </form>

                      {couponError && (
                        <p className="text-[11px] font-medium text-destructive pt-0.5 animate-in fade-in duration-150">
                          {couponError}
                        </p>
                      )}
                    </div>

                    {/* AVAILABLE COUPONS */}
                    {availableCoupons.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                            AVAILABLE COUPONS
                          </span>
                          {availableCoupons.length > 3 && (
                            <button
                              type="button"
                              onClick={() => setShowAllCoupons(!showAllCoupons)}
                              className="text-[10px] font-semibold text-primary hover:underline cursor-pointer"
                            >
                              {showAllCoupons ? "Show Less" : "View all coupons"}
                            </button>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          {(showAllCoupons ? availableCoupons : availableCoupons.slice(0, 3)).map(
                            (coupon) => (
                              <div
                                key={coupon.code}
                                className="flex items-center justify-between border border-border/70 bg-secondary/10 px-3 py-2 transition-all hover:border-primary/40 hover:bg-secondary/20"
                              >
                                <div className="space-y-0.5">
                                  <span className="font-mono text-xs font-bold text-foreground tracking-wider block">
                                    {coupon.code}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground block">
                                    {coupon.description}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  disabled={isApplying}
                                  onClick={() => handleApplyCoupon(coupon.code)}
                                  className="border border-primary/30 bg-primary/5 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-primary transition-all hover:bg-primary hover:text-primary-foreground cursor-pointer disabled:opacity-50"
                                >
                                  APPLY
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">✓</span>
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                          Applied
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-xs font-semibold text-destructive hover:underline cursor-pointer"
                      >
                        [Remove]
                      </button>
                    </div>

                    {couponSuccess && (
                      <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 pt-0.5 animate-in fade-in duration-150">
                        {couponSuccess}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer actions */}
        {lines.length > 0 && (
          <div className="border-t border-border p-5 bg-secondary/20 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between font-light text-muted-foreground">
                <span>Subtotal</span>
                <span>{inr(totals.mrp)}</span>
              </div>
              <div className="flex justify-between font-light text-success">
                <span>Bag Discount</span>
                <span>-{inr(totalBagDiscount)}</span>
              </div>
              <div className="flex justify-between font-light text-muted-foreground border-b border-border/40 pb-2">
                <span>Delivery Charges</span>
                <span>{deliveryCharges > 0 ? inr(deliveryCharges) : "FREE"}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-foreground pt-1.5">
                <span>Total Payable</span>
                <span>{inr(totalPayable)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate({ to: "/checkout" });
              }}
              className="w-full bg-primary py-3 text-[11px] font-bold tracking-[0.2em] text-primary-foreground hover:bg-primary/95 transition-all text-center uppercase"
            >
              PROCEED TO SECURE CHECKOUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
