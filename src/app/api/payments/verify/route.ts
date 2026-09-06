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

    const { transaction_id, tx_ref, plan_id } = await request.json();

    if (!transaction_id || !tx_ref || !plan_id) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Verify payment with Flutterwave
    const flutterwaveSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    
    if (!flutterwaveSecretKey) {
      console.error('Missing FLUTTERWAVE_SECRET_KEY');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const response = await fetch(\https://api.flutterwave.com/v3/transactions/\/verify\, {
      method: 'GET',
      headers: {
        Authorization: \Bearer \\,
        'Content-Type': 'application/json',
      },
    });

    const fwData = await response.json();

    if (fwData.status === 'success' && fwData.data.status === 'successful') {
      // Payment was successful. Verify amount and currency if needed
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
        'Flutterwave',
        daysValid
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
