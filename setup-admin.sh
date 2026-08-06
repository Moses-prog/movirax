#!/bin/bash

# Admin Panel Setup Script
# Run this from your project root: bash setup-admin.sh

echo "🚀 Creating Admin Panel Structure..."

# Create folders
mkdir -p src/app/admin/{users,subscriptions,pricing,features,tickets,analytics,promotions,settings}
mkdir -p src/app/api/admin/dashboard
mkdir -p src/components/admin/layout

echo "✅ Folders created"

# Create Sidebar component
cat > src/components/admin/layout/Sidebar.tsx << 'EOF'
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Users', href: '/admin/users', icon: '👥' },
    { label: 'Subscriptions', href: '/admin/subscriptions', icon: '💳' },
    { label: 'Pricing', href: '/admin/pricing', icon: '💰' },
    { label: 'Features', href: '/admin/features', icon: '🎯' },
    { label: 'Support Tickets', href: '/admin/tickets', icon: '🎟️' },
    { label: 'Analytics', href: '/admin/analytics', icon: '📈' },
    { label: 'Promotions', href: '/admin/promotions', icon: '🏷️' },
    { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <nav
      style={{
        width: isOpen ? '280px' : '80px',
        backgroundColor: 'var(--color-background-primary)',
        borderRight: '1px solid var(--color-border-tertiary)',
        padding: '1.5rem 0',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '0 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isOpen ? (
          <h1 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
            MOVIRA X
          </h1>
        ) : (
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--color-background-secondary)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}
          >
            MX
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isOpen ? '12px' : '0',
                padding: '12px 1.5rem',
                margin: '8px 0.75rem',
                borderRadius: '6px',
                backgroundColor: isActive
                  ? 'var(--color-background-secondary)'
                  : 'transparent',
                color: 'var(--color-text-primary)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? '500' : '400',
                borderLeft: isActive ? '3px solid #ef4444' : 'none',
                paddingLeft: isActive ? 'calc(1.5rem - 3px)' : '1.5rem',
                transition: 'all 0.2s ease',
                justifyContent: isOpen ? 'flex-start' : 'center',
                cursor: 'pointer',
                whiteSpace: isOpen ? 'nowrap' : 'initial',
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      <div
        style={{
          borderTop: '1px solid var(--color-border-tertiary)',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          justifyContent: isOpen ? 'flex-start' : 'center',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-background-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '600',
          }}
        >
          A
        </div>
        {isOpen && (
          <div style={{ fontSize: '12px' }}>
            <p style={{ margin: '0', fontWeight: '500' }}>Admin</p>
            <p
              style={{
                margin: '4px 0 0 0',
                color: 'var(--color-text-secondary)',
              }}
            >
              Online
            </p>
          </div>
        )}
      </div>
    </nav>
  );
}
EOF

echo "✅ Sidebar created"

# Create TopBar component
cat > src/components/admin/layout/TopBar.tsx << 'EOF'
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-background-primary)',
        borderBottom: '1px solid var(--color-border-tertiary)',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onMenuClick}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
            color: 'var(--color-text-primary)',
          }}
        >
          ☰
        </button>
        <h2
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--color-text-primary)',
          }}
        >
          Dashboard
        </h2>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          style={{
            padding: '8px 12px',
            border: '1px solid var(--color-border-tertiary)',
            borderRadius: '6px',
            backgroundColor: 'var(--color-background-secondary)',
            color: 'var(--color-text-primary)',
            fontSize: '14px',
            width: '200px',
          }}
        />

        <button
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: 'var(--color-text-primary)',
            position: 'relative',
          }}
        >
          🔔
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '16px',
              height: '16px',
              backgroundColor: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              fontSize: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
            }}
          >
            3
          </span>
        </button>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-background-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
              }}
            >
              A
            </div>
            <span
              style={{
                fontSize: '14px',
                color: 'var(--color-text-primary)',
              }}
            >
              ▼
            </span>
          </button>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                backgroundColor: 'var(--color-background-primary)',
                border: '1px solid var(--color-border-tertiary)',
                borderRadius: '8px',
                marginTop: '8px',
                minWidth: '160px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                zIndex: 1000,
              }}
            >
              <a
                href="/admin/settings"
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  fontSize: '14px',
                  color: 'var(--color-text-primary)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--color-border-tertiary)',
                }}
              >
                Settings
              </a>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  color: '#ef4444',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
EOF

echo "✅ TopBar created"

# Create Admin Layout
cat > src/app/admin/layout.tsx << 'EOF'
'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/admin/layout/Sidebar';
import { TopBar } from '@/components/admin/layout/TopBar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main
          style={{
            flex: 1,
            padding: '2rem',
            backgroundColor: 'var(--color-background-tertiary)',
            overflow: 'auto',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
EOF

echo "✅ Admin layout created"

# Create Dashboard Page
cat > src/app/admin/page.tsx << 'EOF'
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalRevenue: number;
  activeSubscriptions: number;
  newUsersToday: number;
  churnRate: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 15234,
    activeSubscriptions: 432,
    newUsersToday: 24,
    churnRate: 2.3,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const response = await fetch('/api/admin/check-auth', {
          method: 'GET',
        });

        if (!response.ok) {
          router.push('/auth');
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth');
      }
    };

    checkAdminAuth();

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/dashboard/stats', {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const statCards = [
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: '💰',
      bgColor: 'var(--color-background-secondary)',
    },
    {
      label: 'Active Subscriptions',
      value: stats.activeSubscriptions.toString(),
      icon: '💳',
      bgColor: 'var(--color-background-secondary)',
    },
    {
      label: 'New Users Today',
      value: stats.newUsersToday.toString(),
      icon: '👤',
      bgColor: 'var(--color-background-secondary)',
    },
    {
      label: 'Churn Rate',
      value: `${stats.churnRate}%`,
      icon: '📉',
      bgColor: 'var(--color-background-secondary)',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '600',
            margin: '0 0 0.5rem 0',
            color: 'var(--color-text-primary)',
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}
        >
          Welcome back! Here's your business overview.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '3rem',
        }}
      >
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              backgroundColor: card.bgColor,
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border-tertiary)',
            }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '24px' }}>{card.icon}</span>
              <p
                style={{
                  margin: '8px 0 0 0',
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)',
                  fontWeight: '500',
                }}
              >
                {card.label}
              </p>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
              }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          marginBottom: '3rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-background-primary)',
            border: '1px solid var(--color-border-tertiary)',
            borderRadius: '8px',
            padding: '1.5rem',
            minHeight: '250px',
          }}
        >
          <h3
            style={{
              fontSize: '14px',
              fontWeight: '600',
              margin: '0 0 1rem 0',
              color: 'var(--color-text-primary)',
            }}
          >
            Revenue Trend
          </h3>
          <div
            style={{
              height: '200px',
              backgroundColor: 'var(--color-background-secondary)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-secondary)',
              fontSize: '14px',
            }}
          >
            Chart coming soon
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-background-primary)',
            border: '1px solid var(--color-border-tertiary)',
            borderRadius: '8px',
            padding: '1.5rem',
            minHeight: '250px',
          }}
        >
          <h3
            style={{
              fontSize: '14px',
              fontWeight: '600',
              margin: '0 0 1rem 0',
              color: 'var(--color-text-primary)',
            }}
          >
            User Growth
          </h3>
          <div
            style={{
              height: '200px',
              backgroundColor: 'var(--color-background-secondary)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-secondary)',
              fontSize: '14px',
            }}
          >
            Chart coming soon
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'var(--color-background-primary)',
          border: '1px solid var(--color-border-tertiary)',
          borderRadius: '8px',
          padding: '1.5rem',
        }}
      >
        <h3
          style={{
            fontSize: '14px',
            fontWeight: '600',
            margin: '0 0 1rem 0',
            color: 'var(--color-text-primary)',
          }}
        >
          Recent Activity
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            {
              icon: '💳',
              message: 'New subscription from john@gmail.com',
              time: '2 hours ago',
            },
            {
              icon: '⚠️',
              message: 'Payment failed for user_123 - Retry queued',
              time: '4 hours ago',
            },
            {
              icon: '🏷️',
              message: 'Coupon "PROMO20" used 5 times',
              time: 'Today',
            },
            {
              icon: '👤',
              message: 'Support ticket #1001 created',
              time: '1 day ago',
            },
          ].map((activity, index) => (
            <div
              key={index}
              style={{
                paddingBottom: '12px',
                borderBottom: '1px solid var(--color-border-tertiary)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '18px', marginTop: '2px' }}>
                {activity.icon}
              </span>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    color: 'var(--color-text-primary)',
                    fontWeight: '500',
                  }}
                >
                  {activity.message}
                </p>
                <p
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
EOF

echo "✅ Dashboard page created"

# Create check-auth API route
cat > src/app/api/admin/check-auth.ts << 'EOF'
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('sb-auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token' },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id, role, is_active')
      .eq('id', user.id)
      .single();

    if (adminError || !adminUser || !adminUser.is_active) {
      return NextResponse.json(
        { error: 'Not an admin user' },
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
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
EOF

echo "✅ Check-auth API created"

# Create dashboard stats API route
cat > src/app/api/admin/dashboard/stats.ts << 'EOF'
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
EOF

echo "✅ Dashboard stats API created"

echo ""
echo "=========================================="
echo "✅ ADMIN PANEL SETUP COMPLETE!"
echo "=========================================="
echo ""
echo "All files created in your project:"
echo "  ✅ src/components/admin/layout/Sidebar.tsx"
echo "  ✅ src/components/admin/layout/TopBar.tsx"
echo "  ✅ src/app/admin/layout.tsx"
echo "  ✅ src/app/admin/page.tsx"
echo "  ✅ src/app/api/admin/check-auth.ts"
echo "  ✅ src/app/api/admin/dashboard/stats.ts"
echo ""
echo "Next steps:"
echo "  1. npm run dev"
echo "  2. Go to http://localhost:3000/admin"
echo "  3. Create admin user in Supabase admin_users table"
echo ""