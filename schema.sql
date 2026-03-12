-- Run this in Supabase SQL Editor
-- This script sets up the user profiles and enables real-time features for the ROOTS project.

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid references auth.users primary key,
  full_name text,
  phone text,
  role text CHECK (role IN (
    'citizen', 'ward_officer', 'mcd_admin', 'researcher'
  )),
  ward_id text default 'ward78',
  ward_name text default 'Sadar Bazaar',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Enable Row Level Security (optional, based on your security model)
-- ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Enable Realtime for the required tables
-- NOTE: The complaints, clusters, and repair_tasks tables must exist before running this.
-- This allows the Next.js frontend to subscribe to live map updates and status changes.
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE complaints, clusters, repair_tasks;
