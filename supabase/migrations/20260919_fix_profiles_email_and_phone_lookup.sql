-- Migration: Fix profiles email, phone lookup, and RLS policies

-- 1. Ensure public.profiles table has correct columns and indexes
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 2. Create / Replace SECURITY DEFINER RPC lookup_email_by_phone
CREATE OR REPLACE FUNCTION public.lookup_email_by_phone(phone_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clean_digits TEXT;
  v_10_digits TEXT;
  v_email TEXT;
BEGIN
  IF phone_input IS NULL OR TRIM(phone_input) = '' THEN
    RETURN NULL;
  END IF;

  v_clean_digits := regexp_replace(phone_input, '\D', '', 'g');
  IF v_clean_digits = '' THEN
    RETURN NULL;
  END IF;

  IF length(v_clean_digits) >= 10 THEN
    v_10_digits := right(v_clean_digits, 10);
  ELSE
    v_10_digits := v_clean_digits;
  END IF;

  SELECT email INTO v_email
  FROM public.profiles
  WHERE email IS NOT NULL AND TRIM(email) <> ''
    AND (
      phone = phone_input
      OR phone = '+91' || v_10_digits
      OR phone = v_10_digits
      OR regexp_replace(phone, '\D', '', 'g') = v_clean_digits
      OR right(regexp_replace(phone, '\D', '', 'g'), 10) = v_10_digits
    )
  ORDER BY updated_at DESC
  LIMIT 1;

  RETURN v_email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.lookup_email_by_phone(TEXT) TO anon, authenticated, service_role;

-- 3. Automatic Profile Creation Trigger on auth.users (to guarantee profile row sync)
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_full_name TEXT;
  v_phone TEXT;
  v_clean_digits TEXT;
BEGIN
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    SPLIT_PART(NEW.email, '@', 1)
  );

  v_phone := COALESCE(
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'phone_number',
    NEW.phone
  );

  IF v_phone IS NOT NULL AND v_phone <> '' THEN
    v_clean_digits := regexp_replace(v_phone, '\D', '', 'g');
    IF length(v_clean_digits) = 10 THEN
      v_phone := '+91' || v_clean_digits;
    END IF;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, phone, role, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    v_full_name,
    v_phone,
    'user',
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    updated_at = NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- 4. Enable RLS and set policies on public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
