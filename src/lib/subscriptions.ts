'use server';

import { createClient } from '@/utils/supabase/server';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  discount: number;
  interval: string;
  currency: string;
  gateway: string;
  is_active?: boolean;
  paystack_plan_code?: string;
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
  paystack_subscription_code?: string;
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
  daysValid: number,
  paystackSubscriptionCode?: string
): Promise<{ success: boolean, error?: string }> {
  const supabase = await createClient(true);
  
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
    payment_method: paymentMethod,
    paystack_subscription_code: paystackSubscriptionCode
  });
  
  if (error) {
    console.error('Supabase Insert Error:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

export async function updateSubscriptionStatus(
  referenceOrSubCode: string, 
  updates: { status?: string, current_period_end?: string }
): Promise<boolean> {
  const supabase = await createClient(true);
  
  // Try matching by reference or subscription_code
  const { data: subs } = await supabase.from('user_subscriptions')
    .select('id')
    .or(`reference.eq.${referenceOrSubCode},paystack_subscription_code.eq.${referenceOrSubCode}`)
    .limit(1);

  if (!subs || subs.length === 0) return false;

  const { error } = await supabase.from('user_subscriptions')
    .update(updates)
    .eq('id', subs[0].id);

  return !error;
}
