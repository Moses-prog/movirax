import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { activateSubscription, cancelUserSubscription, getUserSubscription } from '@/lib/subscriptions';

const getAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
};

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    const supabaseAdmin = getAdminClient();

    // Fetch auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (authError || !authData?.user) {
      return NextResponse.json({ error: authError?.message || 'User not found' }, { status: 404 });
    }
    const authUser = authData.user;

    // Fetch main profile
    const { data: mainProfile } = await supabaseAdmin.from('profiles').select('*').eq('id', userId).single();
    
    // Fetch subscription
    const { data: subscription } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*, pricing_plans(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const isPro = !!subscription;
    const status = authUser.user_metadata?.status || 'active';

    const userData = {
      id: authUser.id,
      email: authUser.email || '',
      display_name: mainProfile?.username || authUser.user_metadata?.display_name || null,
      avatar_url: authUser.user_metadata?.avatar_url || null,
      status: status,
      subscription_tier: isPro ? 'premium' : 'free',
      created_at: authUser.created_at,
      last_sign_in_at: authUser.last_sign_in_at || null,
      email_confirmed: authUser.email_confirmed_at !== null,
      auth_provider: authUser.app_metadata?.provider || 'email',
      
      billing: {
        plan: isPro ? subscription.pricing_plans?.name || 'Pro' : 'Free',
        daysRemaining: isPro ? Math.ceil((new Date(subscription.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0,
        nextBillingDate: isPro ? subscription.current_period_end : null,
        autoRenewal: isPro,
        paymentMethod: isPro ? { brand: subscription.payment_method, last4: '' } : null,
        history: [], // Keep empty for now
        subscriptionId: isPro ? subscription.id : null
      }
    };

    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    const { action, status, planId, days } = await request.json();
    const supabaseAdmin = getAdminClient();

    if (action === 'update_status') {
      await supabaseAdmin.auth.admin.updateUserById(userId, { user_metadata: { status } });
      return NextResponse.json({ success: true });
    }
    
    if (action === 'upgrade' && planId) {
      const { data: authData } = await supabaseAdmin.auth.admin.getUserById(userId);
      const email = authData.user?.email || '';
      await activateSubscription(userId, email, 'Manual Admin Upgrade', planId, `manual-${Date.now()}`, 'Admin Override', days || 30);
      return NextResponse.json({ success: true });
    }

    if (action === 'cancel' && planId) {
      await cancelUserSubscription(planId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabaseAdmin = getAdminClient();
    await supabaseAdmin.auth.admin.deleteUser(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
