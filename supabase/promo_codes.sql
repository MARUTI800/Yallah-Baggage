-- Create promo_codes table
CREATE TABLE IF NOT EXISTS promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('amount', 'percentage')),
    discount_value NUMERIC NOT NULL,
    min_booking_amount NUMERIC DEFAULT 0,
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for fast lookup by code
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes (code);

-- Sample codes
INSERT INTO promo_codes (code, discount_type, discount_value, min_booking_amount)
VALUES 
('YALLAH10', 'amount', 10, 50),
('WELCOME20', 'percentage', 20, 100)
ON CONFLICT (code) DO NOTHING;
