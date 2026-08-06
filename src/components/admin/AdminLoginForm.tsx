'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import FullscreenToggleButton from '@/components/ui/button/FullscreenToggleButton';
import ThemeSwitchDropdown from '@/components/ui/input/ThemeSwitchDropdown';
import BrandLogo from '@/components/ui/other/BrandLogo';
import { createClient } from '@/utils/supabase/client';

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !data.user) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const checkResponse = await fetch('/api/admin/check-auth', {
        method: 'GET',
      });

      if (!checkResponse.ok) {
        await supabase.auth.signOut();
        const result = await checkResponse.json().catch(() => null);
        setError(result?.error || 'You do not have admin access');
        setIsLoading(false);
        return;
      }

      router.push('/admin');
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const inputBaseStyle: React.CSSProperties = {
    width: '100%',
    height: '46px',
    padding: '0 14px 0 42px',
    border: '1px solid var(--admin-border)',
    borderRadius: '10px',
    backgroundColor: 'var(--admin-input-bg)',
    color: 'var(--admin-text)',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
    opacity: isLoading ? 0.72 : 1,
  };

  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        background:
          'radial-gradient(circle at top left, rgba(244, 63, 63, 0.16), transparent 34%), var(--admin-bg)',
        padding: '24px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          zIndex: 2,
        }}
      >
        <ThemeSwitchDropdown />
        <FullscreenToggleButton />
      </div>

      <section
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--admin-surface)',
          border: '1px solid var(--admin-border)',
          borderRadius: '14px',
          boxShadow: 'var(--admin-popover-shadow)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '28px 28px 22px',
            borderBottom: '1px solid var(--admin-border)',
            background:
              'linear-gradient(135deg, rgba(244, 63, 63, 0.12), transparent 42%), var(--admin-surface)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
            <BrandLogo className="max-h-12" />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: 'var(--admin-muted)',
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '0.4px',
              textTransform: 'uppercase',
            }}
          >
            <ShieldCheck size={16} style={{ color: 'var(--admin-accent)' }} />
            Admin Portal
          </div>
        </div>

        <div style={{ padding: '28px' }}>
          {error && (
            <div
              role="alert"
              style={{
                backgroundColor: 'var(--admin-danger-soft)',
                color: 'var(--admin-danger-strong)',
                padding: '12px 14px',
                borderRadius: '10px',
                marginBottom: '1.25rem',
                fontSize: '13px',
                fontWeight: '600',
                border: '1px solid rgba(239, 68, 68, 0.35)',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <label style={{ display: 'block' }}>
              <span
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'var(--admin-text-soft)',
                  marginBottom: '0.55rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.45px',
                }}
              >
                Email Address
              </span>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={17}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--admin-muted)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                  style={inputBaseStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--admin-accent)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(244, 63, 63, 0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--admin-border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </label>

            <label style={{ display: 'block' }}>
              <span
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'var(--admin-text-soft)',
                  marginBottom: '0.55rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.45px',
                }}
              >
                Password
              </span>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={17}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--admin-muted)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                  style={inputBaseStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--admin-accent)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(244, 63, 63, 0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--admin-border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className={isLoading ? 'admin-shimmer' : undefined}
              style={{
                height: '46px',
                marginTop: '0.35rem',
                background: isLoading ? 'var(--admin-input-bg)' : 'var(--admin-accent-gradient)',
                color: isLoading ? 'var(--admin-muted)' : 'white',
                border: isLoading ? '1px solid var(--admin-border)' : 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 14px 30px rgba(225, 29, 72, 0.22)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {isLoading ? 'Checking access...' : 'Login'}
            </button>
          </form>

          <p
            style={{
              fontSize: '12px',
              color: 'var(--admin-muted)',
              margin: '1.5rem 0 0 0',
              textAlign: 'center',
              fontWeight: '600',
            }}
          >
            Admin access only
          </p>
        </div>
      </section>
    </main>
  );
}
