import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching combined user data...');

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

    // Fetch auth users
    console.log('Fetching auth.users...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    console.log(`Found ${authData?.users?.length || 0} auth users`);

    // Fetch admin user profiles (contains status, etc.)
    console.log('Fetching user_profiles...');
    const { data: userProfilesData, error: userProfilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('*');

    if (userProfilesError && userProfilesError.code !== '42P01') {
      console.error('user_profiles error:', userProfilesError);
    }

    // Fetch main app profiles (contains username)
    console.log('Fetching profiles...');
    const { data: mainProfilesData, error: mainProfilesError } = await supabaseAdmin
      .from('profiles')
      .select('*');

    if (mainProfilesError && mainProfilesError.code !== '42P01') {
      console.error('profiles error:', mainProfilesError);
    }

    // Create maps for quick lookup
    const userProfilesMap = new Map((userProfilesData || []).map((p: any) => [p.id, p]));
    const mainProfilesMap = new Map((mainProfilesData || []).map((p: any) => [p.id, p]));

    // Combine auth users with their profiles
    const combinedUsers = (authData?.users || []).map((authUser: any) => {
      const userProfile = userProfilesMap.get(authUser.id);
      const mainProfile = mainProfilesMap.get(authUser.id);

      const displayName = mainProfile?.username || userProfile?.display_name || authUser.user_metadata?.display_name || null;

      return {
        id: authUser.id,
        email: authUser.email || '',
        display_name: displayName,
        avatar_url: userProfile?.avatar_url || authUser.user_metadata?.avatar_url || null,
        status: (userProfile?.status || authUser.user_metadata?.status || 'active') as 'active' | 'suspended' | 'banned',
        subscription_tier: (userProfile?.subscription_tier || authUser.user_metadata?.subscription_tier || 'free') as 'free' | 'premium' | 'enterprise',
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at || null,
        email_confirmed: authUser.email_confirmed_at !== null,
        // Auth specific
        auth_provider: authUser.app_metadata?.provider || 'email',
      };
    });

    console.log(`Returning ${combinedUsers.length} combined users`);
    return NextResponse.json(combinedUsers);
  } catch (error) {
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId, status } = await request.json();

    if (!userId || !status) {
      return NextResponse.json({ error: 'Missing userId or status' }, { status: 400 });
    }

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

    // 1. Update user_profiles table
    const is_banned = status === 'banned';
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .update({ 
        is_banned,
        banned_at: is_banned ? new Date().toISOString() : null
      })
      .eq('id', userId);

    // 2. Update auth metadata
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { status },
    });

    if (profileError || authError) {
      throw new Error(profileError?.message || authError?.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

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

    // 1. Delete from user_profiles
    await supabaseAdmin
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    // 1.5. Delete from profiles
    await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    // 2. Delete from auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      throw new Error(authError.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}