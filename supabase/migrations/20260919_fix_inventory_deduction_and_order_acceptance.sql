-- Migration: Fix inventory deduction flow and order acceptance RPCs

-- 1. Create/Update accept_order_and_deduct_inventory RPC function
CREATE OR REPLACE FUNCTION public.accept_order_and_deduct_inventory(
  p_order_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_status TEXT;
  v_item RECORD;
  v_inv_id UUID;
  v_current_qty INTEGER;
  v_updated_items JSONB := '[]'::JSONB;
BEGIN
  -- Lock order row for UPDATE
  SELECT status INTO v_current_status
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Order not found.');
  END IF;

  -- Idempotency check: If already confirmed, do NOT deduct inventory again
  IF v_current_status = 'confirmed' THEN
    RETURN jsonb_build_object(
      'success', true,
      'order_id', p_order_id,
      'status', 'confirmed',
      'already_confirmed', true,
      'message', 'Order is already confirmed.'
    );
  END IF;

  IF v_current_status != 'pending' THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Order cannot be confirmed from status: ' || v_current_status
    );
  END IF;

  -- Step 1: Verify sufficient stock for ALL order items before making any modifications
  FOR v_item IN
    SELECT product_id, product_name, size, color, quantity
    FROM public.order_items
    WHERE order_id = p_order_id
  LOOP
    v_inv_id := NULL;
    v_current_qty := 0;

    -- Match by product_id, size, color
    SELECT id, quantity INTO v_inv_id, v_current_qty
    FROM public.inventory
    WHERE product_id = v_item.product_id
      AND (size = v_item.size OR size = 'One Size' OR v_item.size IS NULL)
      AND (color = v_item.color OR color = 'Default' OR v_item.color IS NULL)
    ORDER BY (size = v_item.size AND color = v_item.color) DESC, updated_at DESC
    LIMIT 1
    FOR UPDATE;

    -- Fallback 1: Match by product_id and size
    IF v_inv_id IS NULL THEN
      SELECT id, quantity INTO v_inv_id, v_current_qty
      FROM public.inventory
      WHERE product_id = v_item.product_id
        AND (size = v_item.size OR size = 'One Size')
      ORDER BY updated_at DESC
      LIMIT 1
      FOR UPDATE;
    END IF;

    -- Fallback 2: Match by product_id
    IF v_inv_id IS NULL THEN
      SELECT id, quantity INTO v_inv_id, v_current_qty
      FROM public.inventory
      WHERE product_id = v_item.product_id
      ORDER BY updated_at DESC
      LIMIT 1
      FOR UPDATE;
    END IF;

    IF v_inv_id IS NULL THEN
      RETURN jsonb_build_object(
        'success', false,
        'message', 'No inventory record found for product: ' || COALESCE(v_item.product_name, v_item.product_id)
      );
    END IF;

    IF v_current_qty < v_item.quantity THEN
      RETURN jsonb_build_object(
        'success', false,
        'message', 'Insufficient stock for product ' || COALESCE(v_item.product_name, v_item.product_id) || '. Available: ' || v_current_qty || ', Ordered: ' || v_item.quantity
      );
    END IF;
  END LOOP;

  -- Step 2: Deduct stock for each order item
  FOR v_item IN
    SELECT product_id, product_name, size, color, quantity
    FROM public.order_items
    WHERE order_id = p_order_id
  LOOP
    v_inv_id := NULL;
    v_current_qty := 0;

    SELECT id, quantity INTO v_inv_id, v_current_qty
    FROM public.inventory
    WHERE product_id = v_item.product_id
      AND (size = v_item.size OR size = 'One Size' OR v_item.size IS NULL)
      AND (color = v_item.color OR color = 'Default' OR v_item.color IS NULL)
    ORDER BY (size = v_item.size AND color = v_item.color) DESC, updated_at DESC
    LIMIT 1
    FOR UPDATE;

    IF v_inv_id IS NULL THEN
      SELECT id, quantity INTO v_inv_id, v_current_qty
      FROM public.inventory
      WHERE product_id = v_item.product_id
        AND (size = v_item.size OR size = 'One Size')
      ORDER BY updated_at DESC
      LIMIT 1
      FOR UPDATE;
    END IF;

    IF v_inv_id IS NULL THEN
      SELECT id, quantity INTO v_inv_id, v_current_qty
      FROM public.inventory
      WHERE product_id = v_item.product_id
      ORDER BY updated_at DESC
      LIMIT 1
      FOR UPDATE;
    END IF;

    -- Perform atomic deduction
    UPDATE public.inventory
    SET quantity = quantity - v_item.quantity,
        updated_at = NOW()
    WHERE id = v_inv_id;

    v_updated_items := v_updated_items || jsonb_build_object(
      'product_id', v_item.product_id,
      'size', v_item.size,
      'color', v_item.color,
      'ordered_quantity', v_item.quantity,
      'previous_quantity', v_current_qty,
      'new_quantity', v_current_qty - v_item.quantity
    );
  END LOOP;

  -- Step 3: Update order status = 'confirmed', accepted_at = NOW(), rejected_at = NULL, rejection_reason = NULL
  UPDATE public.orders
  SET status = 'confirmed',
      accepted_at = NOW(),
      rejected_at = NULL,
      rejection_reason = NULL,
      updated_at = NOW()
  WHERE id = p_order_id;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', p_order_id,
    'status', 'confirmed',
    'items', v_updated_items,
    'message', 'Order confirmed and inventory deducted successfully.'
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'message', SQLERRM
  );
END;
$$;

-- 2. Update create_order_and_deduct_inventory RPC function so checkout creates pending order without deducting stock yet
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
AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();

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
    created_at,
    updated_at
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
    'paid',
    NOW(),
    NOW()
  ) RETURNING id INTO v_order_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
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
      (v_item->>'product_id')::TEXT,
      COALESCE(v_item->>'product_name', 'Product'),
      COALESCE(v_item->>'size', 'M'),
      COALESCE(v_item->>'color', 'Default'),
      (v_item->>'quantity')::INTEGER,
      (v_item->>'unit_price')::NUMERIC,
      (v_item->>'total_price')::NUMERIC,
      NOW()
    );
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'message', 'Order created with status pending.'
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'message', SQLERRM
  );
END;
$$;

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
BEGIN
  RETURN public.create_order_and_deduct_inventory(
    p_customer_name, p_customer_email, p_phone, p_shipping_address,
    p_city, p_state, p_pincode, p_subtotal, p_discount, p_shipping,
    p_total, p_items
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.accept_order_and_deduct_inventory TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.create_order_and_deduct_inventory TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.create_order_and_decrement_inventory TO authenticated, anon;

-- Ensure public.inventory table is included in Realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'inventory'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
