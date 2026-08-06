import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get service role client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get auth token from cookies
    const token = request.cookies.get('sb-auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 });
    }

    // Verify user with token
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = data.user.id;

    // Check if admin
    const { data: admin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .single();

    if (!admin) {
      return NextResponse.json({ error: 'Not admin' }, { status: 403 });
    }

    // Check user_profiles exists
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .single();

    // If not exists, create it
    if (!profile) {
      await supabase.from('user_profiles').insert({
        id: userId,
        is_banned: false,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}