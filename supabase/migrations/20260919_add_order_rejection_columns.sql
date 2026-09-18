-- Migration: Add rejection reason and acceptance tracking columns to public.orders table

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS rejection_reason_type TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason_text TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS accepted_by TEXT,
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejected_by TEXT;
