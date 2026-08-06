import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    
    // Initialize Supabase Admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Fetch auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (authError || !authData?.user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: authError?.message || 'User not found' }, { status: 404 });
    }

    const authUser = authData.user;

    // Fetch user profile
    const { data: userProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Fetch main profile
    const { data: mainProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const displayName = mainProfile?.username || userProfile?.display_name || authUser.user_metadata?.display_name || null;
    const subscriptionTier = (userProfile?.subscription_tier || authUser.user_metadata?.subscription_tier || 'free') as 'free' | 'premium' | 'enterprise';
    
    // Generate some mock billing history based on subscription tier
    const isPremium = subscriptionTier !== 'free';
    
    // Mock Next Billing Date (e.g. 15 days from now if premium)
    const nextBillingDate = isPremium ? new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() : null;
    
    // Mock Billing History
    const billingHistory = isPremium ? [
      { id: 'inv_1', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), amount: 14.99, status: 'paid', description: 'Premium Plan - Monthly' },
      { id: 'inv_2', date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), amount: 14.99, status: 'paid', description: 'Premium Plan - Monthly' },
      { id: 'inv_3', date: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(), amount: 14.99, status: 'paid', description: 'Premium Plan - Monthly' }
    ] : [];

    const userData = {
      id: authUser.id,
      email: authUser.email || '',
      display_name: displayName,
      avatar_url: userProfile?.avatar_url || authUser.user_metadata?.avatar_url || null,
      status: (userProfile?.status || authUser.user_metadata?.status || 'active') as 'active' | 'suspended' | 'banned',
      subscription_tier: subscriptionTier,
      created_at: authUser.created_at,
      last_sign_in_at: authUser.last_sign_in_at || null,
      email_confirmed: authUser.email_confirmed_at !== null,
      auth_provider: authUser.app_metadata?.provider || 'email',
      
      // Mock Billing Fields
      billing: {
        plan: subscriptionTier === 'enterprise' ? 'Enterprise' : subscriptionTier === 'premium' ? 'Pro' : 'Free',
        daysRemaining: isPremium ? 15 : 0,
        nextBillingDate: nextBillingDate,
        autoRenewal: isPremium,
        paymentMethod: isPremium ? { brand: 'visa', last4: '4242' } : null,
        history: billingHistory
      }
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
