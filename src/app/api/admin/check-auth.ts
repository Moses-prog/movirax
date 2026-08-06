import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('sb-auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No token' },
        { status: 401 }
      );
    }

    // Client with service role (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Query admin_users directly (service role bypasses RLS)
    const { data: adminUsers, error: queryError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id);

    if (queryError) {
      console.error('Query error:', queryError);
      return NextResponse.json(
        { error: queryError.message },
        { status: 500 }
      );
    }

    const adminUser = adminUsers?.[0];

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Not an admin' },
        { status: 403 }
      );
    }

    if (!adminUser.is_active) {
      return NextResponse.json(
        { error: 'Admin inactive' },
        { status: 403 }
      );
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
    console.error('Check auth error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}