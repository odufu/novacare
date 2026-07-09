-- SUPABASE DATABASE SETUP SCHEMA
-- Copy and run this script in the Supabase SQL Editor to set up your tables.

-- 1. Create PRODUCTS Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  tagline TEXT,
  nafdac TEXT,
  price NUMERIC NOT NULL,
  image TEXT,
  benefits TEXT[] DEFAULT '{}',
  description TEXT,
  ingredients JSONB DEFAULT '[]',
  directions TEXT,
  warnings TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS for Products so the app can insert/update using the anon key
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- 2. Create ORDERS Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  alt_phone TEXT,
  state TEXT NOT NULL,
  lga TEXT NOT NULL,
  address TEXT NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Dispatched', 'Delivered', 'Cancelled')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS for Orders
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- 3. Create REVIEWS Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  location TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS for Reviews
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
