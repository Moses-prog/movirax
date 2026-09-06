CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_percent NUMERIC NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read promotions" ON public.promotions FOR SELECT USING (true);

CREATE POLICY "Admins can manage promotions" ON public.promotions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
);
