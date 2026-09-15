'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldAlert, Fingerprint } from 'lucide-react';
import BrandLogo from '@/components/ui/other/BrandLogo';
import { createClient } from '@/utils/supabase/client';
import { Card, CardBody, CardHeader, Input, Button, Link as NextLink, Chip, addToast } from "@heroui/react";

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
        setError(result?.error || 'Access denied: Admin privileges required.');
        setIsLoading(false);
        return;
      }

      addToast({ title: "Authentication successful", color: "success" });
      router.push('/admin');
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] w-screen items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Abstract Animated Glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full bg-danger/20 blur-[120px] opacity-60" />
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px] opacity-40" />
      
      <div className="relative z-10 w-full max-w-[420px] p-6">
        <Card
          shadow="lg"
          className="border border-white/5 bg-background/60 backdrop-blur-2xl px-2 py-4 md:p-6"
        >
          <CardHeader className="flex flex-col items-center justify-center gap-6 pb-6 pt-4">
            <div className="flex flex-col items-center gap-3">
              <BrandLogo className="max-h-14" />
              <Chip 
                color="danger" 
                variant="dot"
                size="sm"
                className="border-danger/20 uppercase tracking-widest font-bold mt-2"
              >
                Secure Portal
              </Chip>
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Welcome back</h2>
              <p className="text-sm text-default-500 mt-1">Authenticate to access the admin dashboard</p>
            </div>
          </CardHeader>
          
          <CardBody className="overflow-visible pb-4">
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-danger/20 bg-danger/10 p-3 text-sm text-danger animate-in fade-in zoom-in-95">
                  <ShieldAlert size={18} className="mt-0.5 shrink-0" />
                  <p className="font-medium leading-tight">{error}</p>
                </div>
              )}

              <Input
                autoFocus
                isRequired
                type="email"
                label="Email Address"
                placeholder="admin@movirax.com"
                value={email}
                onValueChange={setEmail}
                isDisabled={isLoading}
                autoComplete="email"
                variant="faded"
                color={error ? "danger" : "default"}
                startContent={<Mail size={18} className="text-default-400 shrink-0" />}
                classNames={{
                  inputWrapper: "h-14",
                }}
              />

              <Input
                isRequired
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onValueChange={setPassword}
                isDisabled={isLoading}
                autoComplete="current-password"
                variant="faded"
                color={error ? "danger" : "default"}
                startContent={<Lock size={18} className="text-default-400 shrink-0" />}
                classNames={{
                  inputWrapper: "h-14",
                }}
              />

              <Button
                type="submit"
                color="danger"
                size="lg"
                isLoading={isLoading}
                startContent={!isLoading && <Fingerprint size={20} />}
                className="mt-4 font-bold shadow-lg shadow-danger/20 h-14"
              >
                {isLoading ? "Authenticating..." : "Authorize"}
              </Button>
            </form>

            <div className="mt-8 flex justify-center border-t border-divider pt-6">
              <NextLink 
                href="/auth" 
                className="text-xs font-semibold text-default-500 hover:text-foreground transition-colors uppercase tracking-wider"
              >
                &larr; Back to Public Login
              </NextLink>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}