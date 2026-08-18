const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lijocgpuagpcckhyonoa.supabase.co";
const supabaseAnonKey = "sb_publishable_paCEXvwsm5GHcFJHCICZEA_E4IeW_kO";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const rpcSql = `
CREATE OR REPLACE FUNCTION public.create_order_and_decrement_inventory(
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_phone TEXT,
  p_shipping_address TEXT,
  p_city TEXT,
  p_state TEXT,
  p_pincode TEXT,
  p_subtotal NUMERIC,
  p_discount NUMERIC,
  p_shipping NUMERIC,
  p_total NUMERIC,
  p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_order_id UUID;
  v_item JSONB;
  v_product_id TEXT;
  v_size TEXT;
  v_color TEXT;
  v_quantity INT;
  v_unit_price NUMERIC;
  v_total_price NUMERIC;
  v_product_name TEXT;
  v_inv_id UUID;
  v_available_qty INT;
  v_notif_message TEXT;
BEGIN
  -- 1. Verify auth.uid() exists
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to place an order.';
  END IF;

  -- Validate inputs
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Cart is empty.';
  END IF;

  -- 2. Validate every cart item inventory stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := v_item->>'product_id';
    v_size       := COALESCE(v_item->>'size', 'M');
    v_color      := COALESCE(v_item->>'color', 'Standard');
    v_quantity   := COALESCE((v_item->>'quantity')::INT, 1);
    v_product_name := COALESCE(v_item->>'product_name', 'Product');

    SELECT id, quantity INTO v_inv_id, v_available_qty
    FROM public.inventory
    WHERE product_id = v_product_id
      AND LOWER(size) = LOWER(v_size)
      AND LOWER(color) = LOWER(v_color)
    FOR UPDATE;

    IF v_inv_id IS NOT NULL THEN
      IF v_available_qty < v_quantity THEN
        RAISE EXCEPTION 'Insufficient inventory stock for % (% - %). Requested %, available %.',
          v_product_name, v_size, v_color, v_quantity, v_available_qty;
      END IF;
    END IF;
  END LOOP;

  -- 3. Create the order
  INSERT INTO public.orders (
    user_id, customer_name, customer_email, phone, shipping_address,
    city, state, pincode, subtotal, discount, shipping, total,
    status, payment_status, created_at
  ) VALUES (
    v_user_id, p_customer_name, p_customer_email, p_phone, p_shipping_address,
    p_city, p_state, p_pincode, p_subtotal, p_discount, p_shipping, p_total,
    'pending', 'pending', NOW()
  )
  RETURNING id INTO v_order_id;

  IF v_order_id IS NULL THEN
    RAISE EXCEPTION 'Failed to create order record.';
  END IF;

  -- 4. Create order_items & 5. Deduct inventory
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id   := v_item->>'product_id';
    v_product_name := COALESCE(v_item->>'product_name', 'Product');
    v_size         := COALESCE(v_item->>'size', 'M');
    v_color        := COALESCE(v_item->>'color', 'Standard');
    v_quantity     := COALESCE((v_item->>'quantity')::INT, 1);
    v_unit_price   := COALESCE((v_item->>'unit_price')::NUMERIC, 0);
    v_total_price  := COALESCE((v_item->>'total_price')::NUMERIC, v_unit_price * v_quantity);

    INSERT INTO public.order_items (
      order_id, product_id, product_name, size, color, quantity, unit_price, total_price, created_at
    ) VALUES (
      v_order_id, v_product_id, v_product_name, v_size, v_color, v_quantity, v_unit_price, v_total_price, NOW()
    );

    SELECT id INTO v_inv_id
    FROM public.inventory
    WHERE product_id = v_product_id
      AND LOWER(size) = LOWER(v_size)
      AND LOWER(color) = LOWER(v_color)
    FOR UPDATE;

    IF v_inv_id IS NOT NULL THEN
      UPDATE public.inventory
      SET quantity = GREATEST(0, quantity - v_quantity),
          updated_at = NOW()
      WHERE id = v_inv_id;
    END IF;
  END LOOP;

  -- 6. Create admin notification
  v_notif_message := p_customer_name || ' placed an order of ₹' || p_total::text;

  INSERT INTO public.notifications (
    type, title, message, order_id, product_id, customer_id, is_read, created_at
  ) VALUES (
    'order', 'New Order Received', v_notif_message, v_order_id, NULL, v_user_id, FALSE, NOW()
  );

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'message', 'Order created successfully'
  );
END;
$$;
`;

async function apply() {
  console.log("Attempting to create RPC in Supabase...");
  // Try calling exec_sql or similar if present
  const { data, error } = await supabase.rpc("exec_sql", { sql: rpcSql });
  if (error) {
    console.log("RPC creation via exec_sql error:", error.message);
  } else {
    console.log("RPC created successfully!", data);
  }
}

apply();
