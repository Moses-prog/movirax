import React from 'react';
import { getPricingPlans } from '@/lib/subscriptions';
import { getPaymentSettings } from '@/lib/settings';
import { createClient } from '@/utils/supabase/server';
import PricingCards from './PricingCards';

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const allPlans = await getPricingPlans();
  const activePlans = allPlans.filter(p => p.is_active !== false);
  
  const paymentSettings = await getPaymentSettings();

  const userData = user ? {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || 'User',
  } : null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Unlock unlimited movies and TV shows with MoviraX Pro. Cancel anytime.
        </p>
      </div>

      <PricingCards plans={activePlans} user={userData} paymentSettings={paymentSettings} />
    </div>
  );
}
