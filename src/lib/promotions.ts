'use server';

import { createClient } from '@/utils/supabase/server';

export interface Promotion {
  id: string;
  code: string;
  discount_percent: number;
  is_active: boolean;
  created_at: string;
}

export async function getPromotions(): Promise<Promotion[]> {
  const supabase = await createClient(true);
  const { data } = await supabase.from('promotions').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function createPromotion(code: string, discount_percent: number): Promise<boolean> {
  const supabase = await createClient(true);
  const { error } = await supabase.from('promotions').insert({
    code: code.toUpperCase(),
    discount_percent
  });
  return !error;
}

export async function togglePromotionStatus(id: string, is_active: boolean): Promise<boolean> {
  const supabase = await createClient(true);
  const { error } = await supabase.from('promotions').update({ is_active }).eq('id', id);
  return !error;
}

export async function deletePromotion(id: string): Promise<boolean> {
  const supabase = await createClient(true);
  const { error } = await supabase.from('promotions').delete().eq('id', id);
  return !error;
}

export async function validatePromoCode(code: string): Promise<{ valid: boolean, discount?: number, error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('promotions').select('*').eq('code', code.toUpperCase()).single();
  
  if (error || !data) {
    return { valid: false, error: 'Invalid promo code' };
  }
  
  if (!data.is_active) {
    return { valid: false, error: 'Promo code has expired' };
  }
  
  return { valid: true, discount: Number(data.discount_percent) };
}
