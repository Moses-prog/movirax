#!/bin/bash

echo "📋 Installing Admin Setup Page..."

# Create setup folder
mkdir -p src/app/admin/setup

# Create setup page
cat > src/app/admin/setup/page.tsx << 'EOF'
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSetup() {
  const router = useRouter();
  const [status, setStatus] = useState('Checking...');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setupAdmin = async () => {
      try {
        setStatus('Verifying authentication...');
        
        const response = await fetch('/api/admin/setup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Setup failed');
          setIsLoading(false);
          return;
        }

        setStatus('✅ Setup complete! Redirecting...');
        
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      } catch (err) {
        console.error('Setup error:', err);
        setError('Failed to setup admin. Check console for details.');
        setIsLoading(false);
      }
    };

    setupAdmin();
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-background-tertiary)',
        padding: '2rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-background-primary)',
          border: '1px solid var(--color-border-tertiary)',
          borderRadius: '12px',
          padding: '3rem',
          maxWidth: '400px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '600',
            margin: '0 0 1rem 0',
            color: 'var(--color-text-primary)',
          }}
        >
          Admin Setup
        </h1>

        {isLoading ? (
          <>
            <div
              style={{
                width: '40px',
                height: '40px',
                margin: '2rem auto',
                border: '4px solid var(--color-border-tertiary)',
                borderTop: '4px solid #ef4444',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                margin: '1rem 0',
              }}
            >
              {status}
            </p>
          </>
        ) : error ? (
          <>
            <p
              style={{
                fontSize: '48px',
                margin: '1rem 0',
              }}
            >
              ❌
            </p>
            <p
              style={{
                fontSize: '14px',
                color: '#ef4444',
                margin: '1rem 0',
              }}
            >
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1.5rem',
                padding: '10px 20px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Try Again
            </button>
          </>
        ) : (
          <>
            <p
              style={{
                fontSize: '48px',
                margin: '1rem 0',
              }}
            >
              ✅
            </p>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                margin: '1rem 0',
              }}
            >
              {status}
            </p>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
EOF

echo "✅ Setup page created"

# Create setup API
cat > src/app/api/admin/setup.ts << 'EOF'
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
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
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication' },
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
        { error: 'User is not an admin' },
        { status: 403 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code === 'PGRST116') {
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          is_banned: false,
        });

      if (insertError) {
        console.error('Error creating profile:', insertError);
        return NextResponse.json(
          { error: `Failed to create profile: ${insertError.message}` },
          { status: 500 }
        );
      }
    } else if (profileError) {
      console.error('Profile check error:', profileError);
      return NextResponse.json(
        { error: `Profile check failed: ${profileError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin setup complete',
      user: {
        id: user.id,
        email: user.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
EOF

echo "✅ Setup API created"

echo ""
echo "=========================================="
echo "✅ SETUP PAGE INSTALLED!"
echo "=========================================="
echo ""
echo "Files created:"
echo "  ✅ src/app/admin/setup/page.tsx"
echo "  ✅ src/app/api/admin/setup.ts"
echo ""
echo "Next steps:"
echo "  1. npm run dev"
echo "  2. Go to http://localhost:3000/admin"
echo "  3. Should see setup page → auto initialize"
echo "  4. Redirects to dashboard"
echo ""