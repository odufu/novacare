-- ============================================================
-- NOVACARE SUPABASE DATABASE SCHEMA
-- Run this entire script in the Supabase SQL Editor.
-- It is safe to re-run (uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).
-- ============================================================

-- ============================================================
-- 1. PRODUCTS Table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  tagline TEXT,
  nafdac TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  image TEXT,
  benefits TEXT[] DEFAULT '{}',
  description TEXT,
  ingredients JSONB DEFAULT '[]',
  directions TEXT,
  warnings TEXT,
  -- Funnel extras
  testimonial_videos TEXT[] DEFAULT '{}',
  gallery_images TEXT[] DEFAULT '{}',
  lead_magnet JSONB DEFAULT NULL,
  -- Archiving (replaces delete)
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add missing columns to existing products table (safe to run if table already exists)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS testimonial_videos TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS lead_magnet JSONB DEFAULT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE;

-- Disable RLS so the app can read/write using the anon key
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;


-- ============================================================
-- 2. ORDERS Table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  alt_phone TEXT,
  state TEXT,
  lga TEXT,
  address TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Dispatched', 'Delivered', 'Cancelled')),
  -- Archiving (replaces delete)
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add missing columns to existing orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS campaign_id TEXT;

-- Disable RLS for Orders
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;


-- ============================================================
-- 3. REVIEWS Table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  location TEXT,
  rating INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS for Reviews
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;


-- ============================================================
-- 4. SITE SETTINGS Table (hero content, slideshow images, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS for Site Settings
ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;


-- ============================================================
-- 5. CAMPAIGNS Table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  source TEXT,
  title TEXT,
  description TEXT,
  status TEXT DEFAULT 'Active',
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS for Campaigns
ALTER TABLE public.campaigns DISABLE ROW LEVEL SECURITY;


-- ============================================================
-- 6. Reload PostgREST schema cache
--    Run this if the app reports "table not found in schema cache"
-- ============================================================
NOTIFY pgrst, 'reload schema';
