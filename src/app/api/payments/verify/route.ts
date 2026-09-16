import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { activateSubscription, getPricingPlans } from '@/lib/subscriptions';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { transaction_id, tx_ref, plan_id, gateway } = await request.json();

    if (!transaction_id || !tx_ref || !plan_id) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    let isSuccess = false;
    let paymentMethod = 'Unknown';
    let paystack_subscription_code = undefined;

    if (gateway === 'paystack') {
      const { getPaymentSettings } = await import('@/lib/settings');
      const settings = await getPaymentSettings();
      if (!settings.paystackSecretKey) {
        return NextResponse.json({ error: 'Paystack configuration error' }, { status: 500 });
      }

      // Paystack uses transaction reference for verification, which we passed as transaction_id
      const response = await fetch(`https://api.paystack.co/transaction/verify/${transaction_id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${settings.paystackSecretKey}`,
        },
      });

      const psData = await response.json();
      if (psData.status === true && psData.data.status === 'success') {
        isSuccess = true;
        if (psData.data.authorization) {
          paymentMethod = `${psData.data.authorization.card_type || 'Card'} ending in ${psData.data.authorization.last4}`;
        }
        // Subscriptions usually have metadata.custom_fields or directly return plan info, but the webhook handles the official attach.
      }
    } else {
      // Default to flutterwave
      const flutterwaveSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;
      if (!flutterwaveSecretKey) {
        return NextResponse.json({ error: 'Missing FLUTTERWAVE_SECRET_KEY' }, { status: 500 });
      }

      const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${flutterwaveSecretKey}`,
          'Content-Type': 'application/json',
        },
      });

      const fwData = await response.json();
      if (fwData.status === 'success' && fwData.data.status === 'successful') {
        isSuccess = true;
        if (fwData.data.card && fwData.data.card.last_4digits) {
          paymentMethod = `${fwData.data.card.type || 'Card'} ending in ${fwData.data.card.last_4digits}`;
        }
      }
    }

    if (isSuccess) {
      // Find the plan to determine days valid
      const plans = await getPricingPlans();
      const plan = plans.find(p => p.id === plan_id);
      
      if (!plan) {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
      }
      
      let daysValid = 30;
      if (plan.interval === 'quarterly') daysValid = 90;
      if (plan.interval === 'annual') daysValid = 365;

      const userName = user.user_metadata?.full_name || 'User';

      const success = await activateSubscription(
        user.id,
        user.email!,
        userName,
        plan.id,
        tx_ref,
        paymentMethod,
        daysValid,
        paystack_subscription_code
      );

      if (success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
