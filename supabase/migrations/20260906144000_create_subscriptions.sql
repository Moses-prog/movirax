CREATE TABLE IF NOT EXISTS public.pricing_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    interval TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    gateway TEXT NOT NULL DEFAULT 'flutterwave',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-populate defaults
INSERT INTO public.pricing_plans (name, price, discount, interval, currency, gateway)
VALUES 
    ('Monthly Plan', 4500, 0, 'monthly', 'NGN', 'flutterwave'),
    ('3-Month Plan', 12000, 11, 'quarterly', 'NGN', 'flutterwave'),
    ('Annual Plan', 45000, 16, 'annual', 'NGN', 'flutterwave');

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    plan_id UUID REFERENCES public.pricing_plans(id) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL,
    reference TEXT NOT NULL UNIQUE,
    payment_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY ""Anyone can read pricing_plans"" ON public.pricing_plans FOR SELECT USING (true);
CREATE POLICY ""Admins can manage pricing_plans"" ON public.pricing_plans
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid()));

CREATE POLICY ""Users can read their own subscriptions"" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY ""Admins can manage all subscriptions"" ON public.user_subscriptions
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid()));
