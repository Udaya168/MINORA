-- MIGRATION SQL: Create Atomic Order Placement RPC Function in Supabase Postgres
-- Execute this SQL script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/lijocgpuagpcckhyonoa/sql

CREATE OR REPLACE FUNCTION public.create_order_and_deduct_inventory(
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
SET search_path = public, pg_temp
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
    RAISE EXCEPTION 'Authentication required. Please sign in to place an order.';
  END IF;

  -- Validate items parameter
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Your shopping cart is empty.';
  END IF;

  -- 2. Verify inventory availability for every cart item BEFORE creating order
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id   := v_item->>'product_id';
    v_size         := COALESCE(v_item->>'size', 'M');
    v_color        := COALESCE(v_item->>'color', 'Standard');
    v_quantity     := COALESCE((v_item->>'quantity')::INT, 1);
    v_product_name := COALESCE(v_item->>'product_name', 'Product');

    -- Row lock matching inventory record
    SELECT id, quantity INTO v_inv_id, v_available_qty
    FROM public.inventory
    WHERE product_id = v_product_id
      AND LOWER(size) = LOWER(v_size)
      AND LOWER(color) = LOWER(v_color)
    FOR UPDATE;

    IF v_inv_id IS NOT NULL THEN
      IF v_available_qty < v_quantity THEN
        RAISE EXCEPTION 'Insufficient stock for % (% / %). Requested %, only % available.',
          v_product_name, v_size, v_color, v_quantity, v_available_qty;
      END IF;
    END IF;
  END LOOP;

  -- 3. Create parent order record using auth.uid()
  INSERT INTO public.orders (
    user_id,
    customer_name,
    customer_email,
    phone,
    shipping_address,
    city,
    state,
    pincode,
    subtotal,
    discount,
    shipping,
    total,
    status,
    payment_status,
    created_at
  ) VALUES (
    v_user_id,
    p_customer_name,
    p_customer_email,
    p_phone,
    p_shipping_address,
    p_city,
    p_state,
    p_pincode,
    p_subtotal,
    p_discount,
    p_shipping,
    p_total,
    'pending',
    'pending',
    NOW()
  )
  RETURNING id INTO v_order_id;

  IF v_order_id IS NULL THEN
    RAISE EXCEPTION 'Failed to create order record.';
  END IF;

  -- 4. Insert ALL public.order_items rows & 5. Deduct inventory safely
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id   := v_item->>'product_id';
    v_product_name := COALESCE(v_item->>'product_name', 'Product');
    v_size         := COALESCE(v_item->>'size', 'M');
    v_color        := COALESCE(v_item->>'color', 'Standard');
    v_quantity     := COALESCE((v_item->>'quantity')::INT, 1);
    v_unit_price   := COALESCE((v_item->>'unit_price')::NUMERIC, 0);
    v_total_price  := COALESCE((v_item->>'total_price')::NUMERIC, v_unit_price * v_quantity);

    -- Insert order item
    INSERT INTO public.order_items (
      order_id,
      product_id,
      product_name,
      size,
      color,
      quantity,
      unit_price,
      total_price,
      created_at
    ) VALUES (
      v_order_id,
      v_product_id,
      v_product_name,
      v_size,
      v_color,
      v_quantity,
      v_unit_price,
      v_total_price,
      NOW()
    );

    -- Deduct inventory
    SELECT id, quantity INTO v_inv_id, v_available_qty
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

  -- 6. Create one public.notifications row
  v_notif_message := p_customer_name || ' placed an order of ₹' || TRIM(TO_CHAR(p_total, '999,999,999.00'));

  INSERT INTO public.notifications (
    type,
    title,
    message,
    order_id,
    product_id,
    customer_id,
    is_read,
    created_at
  ) VALUES (
    'order',
    'New Order Received',
    v_notif_message,
    v_order_id,
    NULL,
    v_user_id,
    FALSE,
    NOW()
  );

  -- 7. Return created order ID & success status
  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'message', 'Order created successfully'
  );
END;
$$;

-- Alias for create_order_and_decrement_inventory
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
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN public.create_order_and_deduct_inventory(
    p_customer_name, p_customer_email, p_phone, p_shipping_address,
    p_city, p_state, p_pincode, p_subtotal, p_discount, p_shipping,
    p_total, p_items
  );
END;
$$;
