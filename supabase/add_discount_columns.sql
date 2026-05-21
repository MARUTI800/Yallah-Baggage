-- SQL migration to add discount columns to the bookings table
-- Run this in your Supabase SQL Editor to support promo code and multi-bag discount recording.

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS promo_code TEXT,
ADD COLUMN IF NOT EXISTS promo_discount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS bag_discount NUMERIC DEFAULT 0;

-- Optional: Add comments to the columns for documentation in Supabase Studio
COMMENT ON COLUMN bookings.promo_code IS 'The promo code applied to this booking';
COMMENT ON COLUMN bookings.promo_discount IS 'The discount amount subtracted from the total via promo code (in AED)';
COMMENT ON COLUMN bookings.bag_discount IS 'The 10% multi-bag discount amount subtracted from the total for bookings > 4 bags (in AED)';
