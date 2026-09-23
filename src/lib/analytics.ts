'use server';

import { createClient } from '@/utils/supabase/server';

export interface AnalyticsStats {
  mrr: number;
  totalUsers: number;
  activeSubscribers: number;
  cancelledSubscribers: number;
  churnRate: number;
  conversionRate: number;
  plansDistribution: Record<string, number>;
  gatewaysDistribution: Record<string, number>;
}

export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  const supabase = await createClient(true);
  
  // Get all users count from auth
  const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
  const totalUsers = authUsers ? authUsers.length : 0;
  
  // Get all subscriptions with pricing info
  const { data: subs } = await (supabase as any).from('user_subscriptions').select('*, pricing_plans(*)');
  
  let mrr = 0;
  let activeSubscribers = 0;
  let cancelledSubs = 0;
  let plansDistribution: Record<string, number> = {};
  let gatewaysDistribution: Record<string, number> = {};
  
  if (subs) {
    for (const sub of subs) {
      if (sub.status === 'active') {
        activeSubscribers++;
        
        // Calculate MRR
        const plan = sub.pricing_plans;
        if (plan) {
          if (plan.interval === 'monthly') {
            mrr += Number(plan.price);
          } else if (plan.interval === 'quarterly') {
            mrr += Number(plan.price) / 3;
          } else if (plan.interval === 'annual') {
            mrr += Number(plan.price) / 12;
          }
          
          // Distribution by plan name
          plansDistribution[plan.name] = (plansDistribution[plan.name] || 0) + 1;
          
          // Distribution by gateway
          gatewaysDistribution[sub.payment_method || 'Unknown'] = (gatewaysDistribution[sub.payment_method || 'Unknown'] || 0) + 1;
        }
      } else if (sub.status === 'cancelled') {
        cancelledSubs++;
      }
    }
  }

  const totalSubs = activeSubscribers + cancelledSubs;
  const churnRate = totalSubs > 0 ? (cancelledSubs / totalSubs) * 100 : 0;
  const users = totalUsers || 0;
  const conversionRate = users > 0 ? (activeSubscribers / users) * 100 : 0;

  return {
    mrr: Math.round(mrr),
    totalUsers: users,
    activeSubscribers,
    cancelledSubscribers: cancelledSubs,
    churnRate: Number(churnRate.toFixed(1)),
    conversionRate: Number(conversionRate.toFixed(1)),
    plansDistribution,
    gatewaysDistribution
  };
}
