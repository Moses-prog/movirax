import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { createClient as createServerSupabaseClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const userSupabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: userError,
    } = await userSupabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const adminSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { data: adminUser, error: queryError } = await adminSupabase
      .from('admin_users')
      .select('id, role, is_active')
      .eq('id', user.id)
      .maybeSingle();

    if (queryError) {
      return NextResponse.json({ error: `Query error: ${queryError.message}` }, { status: 500 });
    }

    if (!adminUser) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 });
    }

    if (!adminUser.is_active) {
      return NextResponse.json({ error: 'Admin account inactive' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error('Check-auth error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
