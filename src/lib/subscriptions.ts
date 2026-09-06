import { createClient } from '@/utils/supabase/server';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  discount: number;
  interval: string;
  currency: string;
  gateway: string;
  created_at?: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  plan_id: string;
  status: string;
  current_period_end: string;
  reference: string;
  payment_method: string;
  pricing_plans?: PricingPlan;
  created_at?: string;
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('pricing_plans').select('*').order('price');
  return data || [];
}

export async function updatePricingPlan(id: string, updates: Partial<PricingPlan>): Promise<boolean> {
  const supabase = await createClient(true);
  const { error } = await supabase.from('pricing_plans').update(updates).eq('id', id);
  return !error;
}

export async function getAllSubscriptions(): Promise<UserSubscription[]> {
  const supabase = await createClient(true);
  const { data } = await supabase.from('user_subscriptions')
    .select('*, pricing_plans(*)').order('created_at', { ascending: false });
  return data || [];
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('user_subscriptions')
    .select('*, pricing_plans(*)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  return data;
}

export async function cancelUserSubscription(id: string): Promise<boolean> {
  const supabase = await createClient(true);
  const { error } = await supabase.from('user_subscriptions').update({ status: 'cancelled' }).eq('id', id);
  return !error;
}

export async function activateSubscription(
  userId: string, 
  userEmail: string, 
  userName: string, 
  planId: string, 
  reference: string, 
  paymentMethod: string,
  daysValid: number
): Promise<boolean> {
  const supabase = await createClient(true);
  
  // Calculate end date
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + daysValid);
  
  const { error } = await supabase.from('user_subscriptions').insert({
    user_id: userId,
    user_email: userEmail,
    user_name: userName,
    plan_id: planId,
    status: 'active',
    current_period_end: endDate.toISOString(),
    reference: reference,
    payment_method: paymentMethod
  });
  
  return !error;
}
