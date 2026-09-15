import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPaymentSettings } from '@/lib/settings';
import { updateSubscriptionStatus, activateSubscription } from '@/lib/subscriptions';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const settings = await getPaymentSettings();
  if (!settings.paystackSecretKey) {
    return NextResponse.json({ error: 'Paystack not configured' }, { status: 500 });
  }

  const signature = req.headers.get('x-paystack-signature');
  const body = await req.text();

  // Verify signature
  const hash = crypto.createHmac('sha512', settings.paystackSecretKey).update(body).digest('hex');
  if (hash !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);
  const eventName = event.event;
  const data = event.data;

  try {
    switch (eventName) {
      case 'subscription.create':
        // A new subscription was created
        // If the user already paid via transaction, we might already have their record.
        // But we should update the paystack_subscription_code
        await updateSubscriptionStatus(data.customer.email, { 
          paystack_subscription_code: data.subscription_code,
          status: 'active'
        });
        break;

      case 'charge.success':
        // A successful charge (initial or recurring)
        // If it's recurring, the plan might exist. Let's extend expiry.
        // Subscriptions usually send "metadata" but if it's recurring it comes from the sub.
        if (data.metadata?.custom_fields?.find((f: any) => f.variable_name === 'type')?.value === 'subscription' || data.plan) {
          const supabase = await createClient(true);
          // Find user by email
          const { data: userSub } = await supabase.from('user_subscriptions')
            .select('id')
            .eq('user_email', data.customer.email)
            .limit(1);
            
          const endDate = new Date(data.transaction_date || new Date());
          endDate.setMonth(endDate.getMonth() + 1); // rough +1 month, real data is in invoice.update

          if (userSub && userSub.length > 0) {
            await supabase.from('user_subscriptions').update({
              status: 'active',
              current_period_end: endDate.toISOString()
            }).eq('id', userSub[0].id);
          }
        }
        break;

      case 'invoice.update':
        // Contains the final status of a recurring bill attempt
        if (data.status === 'success' && data.subscription) {
          // It was paid successfully
          await updateSubscriptionStatus(data.subscription.subscription_code, {
            status: 'active',
            current_period_end: data.subscription.next_payment_date
          });
        }
        break;

      case 'invoice.payment_failed':
        // Failed recurring charge -> set status to attention
        if (data.subscription) {
          await updateSubscriptionStatus(data.subscription.subscription_code, {
            status: 'attention'
          });
        }
        break;

      case 'subscription.disable':
        // Subscription cancelled
        await updateSubscriptionStatus(data.subscription_code, {
          status: 'cancelled'
        });
        break;

      case 'subscription.not_renew':
        // User cancelled, but it stays active until next_payment_date
        await updateSubscriptionStatus(data.subscription_code, {
          status: 'non-renewing'
        });
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
