'use server';

import { getPaymentSettings } from '@/lib/settings';

export async function initializePaystackSubscription(email: string, planCode: string, amount: number) {
  const settings = await getPaymentSettings();
  if (!settings.paystackEnabled || !settings.paystackSecretKey) {
    return { error: 'Paystack is not configured or enabled' };
  }

  try {
    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${settings.paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Paystack uses kobo/cents
        plan: planCode || undefined, // Must send the plan code for subscriptions
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/profile`,
        metadata: {
          custom_fields: [
            {
              display_name: "Type",
              variable_name: "type",
              value: "subscription"
            }
          ]
        }
      })
    });

    const data = await res.json();
    if (!data.status) {
      return { error: data.message };
    }

    return { 
      authorization_url: data.data.authorization_url, 
      reference: data.data.reference, 
      access_code: data.data.access_code 
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function managePaystackSubscription(subscriptionCode: string) {
  const settings = await getPaymentSettings();
  if (!settings.paystackSecretKey) return { error: 'Paystack not configured' };

  try {
    const res = await fetch(`https://api.paystack.co/subscription/${subscriptionCode}/manage/link`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${settings.paystackSecretKey}`,
      }
    });

    const data = await res.json();
    if (!data.status) {
      return { error: data.message };
    }
    
    return { link: data.data.link };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function cancelPaystackSubscription(subscriptionCode: string, emailToken: string) {
  const settings = await getPaymentSettings();
  if (!settings.paystackSecretKey) return { error: 'Paystack not configured' };

  try {
    const res = await fetch('https://api.paystack.co/subscription/disable', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${settings.paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: subscriptionCode,
        token: emailToken, // Email token is required by paystack to disable
      })
    });

    const data = await res.json();
    if (!data.status) {
      return { error: data.message };
    }
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function syncPlanToPaystack(planData: { id: string, name: string, interval: string, amount: number, currency: string, paystack_plan_code?: string }) {
  const settings = await getPaymentSettings();
  if (!settings.paystackSecretKey) return { error: 'Paystack is not configured.' };

  try {
    let endpoint = 'https://api.paystack.co/plan';
    let method = 'POST';
    
    if (planData.paystack_plan_code) {
      endpoint = \https://api.paystack.co/plan/\\;
      method = 'PUT';
    }

    const res = await fetch(endpoint, {
      method,
      headers: {
        Authorization: \Bearer \\,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: planData.name,
        interval: planData.interval === 'annual' ? 'annually' : 'monthly',
        amount: Math.round(planData.amount * 100),
        currency: planData.currency || 'NGN'
      })
    });

    const data = await res.json();
    
    if (!data.status) {
      return { error: data.message };
    }

    // Save back to DB
    if (!planData.paystack_plan_code) {
      const { createClient } = await import('@/utils/supabase/server');
      const supabase = await createClient(true);
      await supabase.from('pricing_plans').update({ paystack_plan_code: data.data.plan_code }).eq('id', planData.id);
    }
    
    return { success: true, plan_code: data.data.plan_code };
  } catch (err: any) {
    return { error: err.message };
  }
}
