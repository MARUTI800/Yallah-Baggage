-- Same as Yallah-Admin/database/supabase-migration.sql (promo_codes section).
-- Run once in Supabase SQL Editor so admin-created coupons work on the booking site.

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('amount', 'percentage')),
  discount_value numeric not null check (discount_value > 0),
  min_booking_amount numeric not null default 0,
  max_uses integer,
  uses_count integer not null default 0,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_promo_codes_code on public.promo_codes (code);
