import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('sb-auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!adminUser || !['super_admin', 'finance_admin'].includes(adminUser.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const today = new Date().toISOString().split('T')[0];

    const { data: revenueData } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'succeeded');

    const totalRevenue = revenueData?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

    const { count: activeCount } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const activeSubscriptions = activeCount || 0;

    const { count: newUsersCount } = await supabase
      .from('auth.users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00`);

    const newUsersToday = newUsersCount || 0;

    const { count: cancelledCount } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'cancelled')
      .gte('cancelled_at', `${today}T00:00:00`);

    const { count: totalSubCount } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true });

    const churnRate = totalSubCount ? Math.round((cancelledCount || 0) / totalSubCount * 100 * 10) / 10 : 0;

    return NextResponse.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      activeSubscriptions,
      newUsersToday,
      churnRate,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
