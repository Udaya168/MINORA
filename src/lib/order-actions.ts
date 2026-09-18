import { supabase } from "@/integrations/supabase/client";
import { playOrderAcceptedSound } from "@/lib/audio";
import { toast } from "sonner";

export async function processOrderAcceptance(orderId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const now = new Date().toISOString();

    // 1. Invoke atomic PostgreSQL RPC `accept_order_and_deduct_inventory`
    const { data: rpcData, error: rpcErr } = await supabase.rpc("accept_order_and_deduct_inventory", {
      p_order_id: orderId,
    });

    if (!rpcErr && rpcData) {
      if (rpcData.success === false) {
        toast.error(rpcData.message || "Failed to accept order.");
        return { success: false, message: rpcData.message };
      }

      console.log(`[INVENTORY] Order accepted: ${orderId}`);

      if (rpcData.items && Array.isArray(rpcData.items)) {
        rpcData.items.forEach((item: any) => {
          console.log(`[INVENTORY] Current stock: ${item.previous_quantity}`);
          console.log(`[INVENTORY] Ordered quantity: ${item.ordered_quantity}`);
          console.log(`[INVENTORY] Deducting quantity: ${item.ordered_quantity}`);
          console.log(`[INVENTORY] Updated stock: ${item.new_quantity}`);
        });
      }

      toast.success(`Order #${orderId.slice(0, 8)} ACCEPTED.`);
      playOrderAcceptedSound();
      return { success: true };
    }

    // 2. Client-side fallback if RPC is unavailable or failed
    console.warn("[INVENTORY] RPC fallback executing:", rpcErr?.message);

    // Verify order status
    const { data: orderData, error: fetchErr } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", orderId)
      .single();

    if (fetchErr || !orderData) {
      toast.error("Order not found.");
      return { success: false, message: "Order not found" };
    }

    if (orderData.status === "confirmed") {
      console.log(`[INVENTORY] Order accepted: ${orderId} (already confirmed)`);
      toast.success(`Order #${orderId.slice(0, 8)} ACCEPTED.`);
      playOrderAcceptedSound();
      return { success: true };
    }

    if (orderData.status !== "pending") {
      toast.error(`Order cannot be confirmed from status: ${orderData.status}`);
      return { success: false, message: `Status is ${orderData.status}` };
    }

    // Fetch order items
    const { data: itemsData } = await supabase
      .from("order_items")
      .select("product_id, product_name, size, color, quantity")
      .eq("order_id", orderId);

    if (itemsData && itemsData.length > 0) {
      for (const item of itemsData) {
        const { data: invRows } = await supabase
          .from("inventory")
          .select("id, quantity, size, color")
          .eq("product_id", item.product_id);

        if (invRows && invRows.length > 0) {
          let match = invRows.find(
            (r: any) =>
              r.size?.toLowerCase() === item.size?.toLowerCase() &&
              r.color?.toLowerCase() === item.color?.toLowerCase()
          );
          if (!match) {
            match = invRows.find((r: any) => r.size?.toLowerCase() === item.size?.toLowerCase());
          }
          if (!match) {
            match = invRows[0];
          }

          if (!match) continue;

          const currentStock = Math.max(0, Number(match.quantity) || 0);
          const orderedQty = Number(item.quantity) || 1;

          if (currentStock < orderedQty) {
            toast.error(`Insufficient stock for ${item.product_name || item.product_id}. Available: ${currentStock}, Ordered: ${orderedQty}`);
            return { success: false, message: "Insufficient stock" };
          }

          const newStock = Math.max(0, currentStock - orderedQty);

          console.log(`[INVENTORY] Current stock: ${currentStock}`);
          console.log(`[INVENTORY] Ordered quantity: ${orderedQty}`);
          console.log(`[INVENTORY] Deducting quantity: ${orderedQty}`);
          console.log(`[INVENTORY] Updated stock: ${newStock}`);

          await supabase
            .from("inventory")
            .update({
              quantity: newStock,
              updated_at: now,
            })
            .eq("id", match.id);
        }
      }
    }

    // Update order status to confirmed
    const { error: updateErr } = await supabase
      .from("orders")
      .update({
        status: "confirmed",
        accepted_at: now,
        rejected_at: null,
        rejection_reason: null,
        updated_at: now,
      })
      .eq("id", orderId)
      .eq("status", "pending");

    if (updateErr) {
      toast.error(updateErr.message || "Failed to accept order.");
      return { success: false, message: updateErr.message };
    }

    console.log(`[INVENTORY] Order accepted: ${orderId}`);
    toast.success(`Order #${orderId.slice(0, 8)} ACCEPTED.`);
    playOrderAcceptedSound();
    return { success: true };
  } catch (err: any) {
    console.error("[INVENTORY] Process acceptance exception:", err);
    toast.error("Failed to accept order.");
    return { success: false, message: err?.message };
  }
}
