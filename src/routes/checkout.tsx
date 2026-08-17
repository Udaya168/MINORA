import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, CreditCard, Smartphone, Landmark, Banknote, Truck } from "lucide-react";
import { toast } from "sonner";
import { getProduct } from "@/data/products";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — MINORA" },
      { name: "description", content: "Complete your MINORA order: add a delivery address, choose a delivery option and pay by UPI, card, net banking or cash on delivery." },
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

function Checkout() {
  const [step, setStep] = useState(0);
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("upi");
  const [orderId, setOrderId] = useState("");
  const { cart, totals, clearCart } = useStore();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "",
    mobile: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const field = (key: keyof typeof address, label: string, extra?: string) => (
    <label className={`block ${extra ?? ""}`}>
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        required
        value={address[key]}
        onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </label>
  );

  if (cart.length === 0 && step < 3) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl">Nothing to check out</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your bag is empty right now.</p>
        <Link to="/c/$slug" params={{ slug: "trending" }} className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
          Start Shopping
        </Link>
      </div>
    );
  }

  const placeOrder = async () => {
    try {
      // 1. Get current Supabase session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const currentUserId = currentSession?.user?.id;

      if (!currentUserId || !currentSession?.user) {
        toast.error("Please sign in to place your order.");
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
      if (!address.name || !address.mobile || !address.house || !address.city || !address.state || !address.pincode) {
        toast.error("Please complete all shipping address fields.");
        return;
      }

      if (cart.length === 0) {
        toast.error("Your bag is empty.");
        return;
      }

      // 4. Fetch corresponding products from public.products
      const productIds = Array.from(new Set(cart.map((c) => c.id)));
      const { data: dbProducts } = await supabase
        .from("products")
        .select("id, name, price, colors")
        .in("id", productIds);

      const dbProdMap = new Map<string, any>();
      if (dbProducts) {
        dbProducts.forEach((p: any) => dbProdMap.set(p.id, p));
      }

      // 5. Fetch inventory variants from public.inventory
      const { data: invVariants } = await supabase
        .from("inventory")
        .select("id, product_id, size, color, quantity")
        .in("product_id", productIds);

      // 6. Verify stock for each cart item
      for (const line of cart) {
        const dbP = dbProdMap.get(line.id) || getProduct(line.id);
        const lineItemColor = (line as any).color || (dbP?.colors ? dbP.colors[0] : "Standard");
        const matchingInv = invVariants?.find(
          (v: any) =>
            v.product_id === line.id &&
            v.size.toLowerCase() === (line.size || "M").toLowerCase() &&
            (!lineItemColor || v.color.toLowerCase() === lineItemColor.toLowerCase())
        );

        if (matchingInv) {
          const availQty = Math.max(0, Number(matchingInv.quantity) || 0);
          if (line.qty > availQty) {
            toast.error(`Only ${availQty} items are available.`);
            return;
          }
        }
      }

      // Prepare items payload with prices from public.products / catalog
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

      // 7. Try RPC for atomic row-locking execution
      try {
        const { data: rpcRes, error: rpcErr } = await supabase.rpc("create_order_and_deduct_inventory", {
          p_user_id: currentUserId,
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

        if (!rpcErr && rpcRes) {
          if (rpcRes.success === false) {
            toast.error(rpcRes.message || "Order placement failed.");
            return;
          }
          if (rpcRes.order_id) {
            setOrderId(rpcRes.order_id);
            clearCart();
            setStep(3);
            toast.success("Order placed successfully!");
            return;
          }
        }
      } catch (e: any) {
        console.warn("[Checkout] RPC notice, using direct DB fallback:", e.message);
      }

      // 8. Direct DB Insertion Fallback
      const { data: newOrder, error: orderErr } = await supabase
        .from("orders")
        .insert([
          {
            user_id: currentUserId,
            customer_name: customerName,
            customer_email: currentSession.user.email || "",
            phone: address.mobile,
            shipping_address: fullShippingAddress,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            subtotal: totals.mrp,
            discount: totals.discount,
            shipping: totals.delivery,
            total: totals.total,
            status: "pending",
            payment_status: "pending",
          },
        ])
        .select("*")
        .single();

      if (orderErr) {
        console.error("[Checkout] Orders insertion error:", orderErr);
        toast.error(orderErr.message || "Could not create order.");
        return;
      }

      // Insert Order Items and deduct inventory stock
      for (const item of itemsPayload) {
        const { error: itemErr } = await supabase.from("order_items").insert([
          {
            order_id: newOrder.id,
            product_id: item.product_id,
            product_name: item.product_name,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
          },
        ]);

        if (itemErr) {
          console.error("[Checkout] Order items insertion error:", itemErr);
        }

        const { data: curVariant } = await supabase
          .from("inventory")
          .select("id, quantity")
          .eq("product_id", item.product_id)
          .eq("size", item.size)
          .maybeSingle();

        if (curVariant) {
          const newQty = Math.max(0, Number(curVariant.quantity || 0) - item.quantity);
          const { error: invUpdateErr } = await supabase
            .from("inventory")
            .update({ quantity: newQty, updated_at: new Date().toISOString() })
            .eq("id", curVariant.id);

          if (invUpdateErr) {
            console.error("[Checkout] Inventory deduction error:", invUpdateErr);
          }
        }
      }

      setOrderId(newOrder.id);
      clearCart();
      setStep(3);
      toast.success("Order placed successfully!");
    } catch (e: any) {
      console.error("[Checkout] Execution error:", e);
      toast.error(e.message || "An error occurred during checkout.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-3 py-5 sm:px-5">
      <h1 className="font-display text-2xl">Checkout</h1>

      <ol className="mt-5 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-2">
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </span>
            <span className={`hidden text-xs font-medium sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < STEPS.length - 1 && <span className={`h-px flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
          </li>
        ))}
      </ol>

      <div className="mt-6 gap-6 lg:flex lg:items-start">
        <div className="min-w-0 flex-1 rounded-xl border border-border bg-card p-4 sm:p-5">
          {step === 0 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(1);
              }}
            >
              <h2 className="font-display text-lg">Delivery Address</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {field("name", "Full name")}
                {field("mobile", "Mobile number")}
                {field("house", "House / Flat")}
                {field("street", "Street / Area")}
                {field("city", "City")}
                {field("state", "State")}
                {field("pincode", "Pincode")}
              </div>
              <button type="submit" className="mt-5 w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground sm:w-auto sm:px-8">
                Save & Continue
              </button>
            </form>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-display text-lg">Delivery Options</h2>
              <div className="mt-4 space-y-3">
                {[
                  { id: "standard", label: "Standard Delivery", note: "3-5 business days", price: "FREE" },
                  { id: "express", label: "Express Delivery", note: "1-2 business days", price: "₹99" },
                ].map((d) => (
                  <label key={d.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${delivery === d.id ? "border-primary bg-primary-soft" : "border-border"}`}>
                    <input type="radio" name="delivery" checked={delivery === d.id} onChange={() => setDelivery(d.id)} className="accent-[oklch(0.36_0.115_12)]" />
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
                <button type="button" onClick={() => setStep(0)} className="rounded-md border border-border px-5 py-3 text-sm font-medium">Back</button>
                <button type="button" onClick={() => setStep(2)} className="flex-1 rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground sm:flex-none sm:px-8">Continue to Payment</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display text-lg">Payment Method</h2>
              <div className="mt-4 space-y-3">
                {PAYMENTS.map((p) => (
                  <label key={p.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${payment === p.id ? "border-primary bg-primary-soft" : "border-border"}`}>
                    <input type="radio" name="payment" checked={payment === p.id} onChange={() => setPayment(p.id)} className="accent-[oklch(0.36_0.115_12)]" />
                    <p.icon size={18} className="text-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{p.label}</span>
                      <span className="block text-xs text-muted-foreground">{p.note}</span>
                    </span>
                  </label>
                ))}
              </div>
              {payment === "upi" && (
                <input placeholder="yourname@upi" aria-label="UPI ID" className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
              )}
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="rounded-md border border-border px-5 py-3 text-sm font-medium">Back</button>
                <button type="button" onClick={placeOrder} className="flex-1 rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground sm:flex-none sm:px-8">
                  Pay {inr(totals.total)}
                </button>
              </div>
            </div>
          )}

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
                Order Status: <span className="font-bold text-amber-500 uppercase">Pending Confirmation</span>
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <Link to="/account" search={{ tab: "orders" }} className="rounded-xl bg-primary px-7 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all shadow-sm">
                  View My Orders
                </Link>
                <Link to="/" className="rounded-xl border border-border px-7 py-3 text-xs font-bold uppercase tracking-wider hover:bg-secondary transition-all">
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>

        {step < 3 && (
          <aside className="mt-6 rounded-xl border border-border bg-card p-4 lg:mt-0 lg:w-80 lg:shrink-0">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order Summary</h2>
            <ul className="mt-3 space-y-3">
              {cart.map((l) => {
                const p = getProduct(l.id);
                if (!p) return null;
                return (
                  <li key={`${l.id}-${l.size}`} className="flex gap-3">
                    <img src={p.images[0]} alt={p.name} loading="lazy" width={768} height={1024} className="h-16 w-12 rounded object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">Size {l.size} · Qty {l.qty}</span>
                    </span>
                    <span className="text-sm font-medium">{inr(p.price * l.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Item Total</dt><dd>{inr(totals.mrp)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Discount</dt><dd className="text-success">− {inr(totals.discount)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{totals.delivery === 0 ? "FREE" : inr(totals.delivery)}</dd></div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold"><dt>Total</dt><dd>{inr(totals.total)}</dd></div>
            </dl>
          </aside>
        )}
      </div>
    </div>
  );
}