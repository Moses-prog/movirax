'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldAlert } from 'lucide-react';
import FullscreenToggleButton from '@/components/ui/button/FullscreenToggleButton';
import ThemeSwitchDropdown from '@/components/ui/input/ThemeSwitchDropdown';
import BrandLogo from '@/components/ui/other/BrandLogo';
import { createClient } from '@/utils/supabase/client';
import { Card, CardBody, CardHeader, Input, Button, Link as NextLink, Chip } from "@heroui/react";
import { cn } from "@/utils/helpers";

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

  return (
    <div
      className={cn(
        "relative flex min-h-dvh w-screen flex-col items-center justify-center overflow-hidden",
        "before:pointer-events-none before:absolute before:inset-0 before:z-0 before:opacity-40 dark:before:opacity-70",
        "dark:before:bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]",
        "before:bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)]",
        "bg-background text-foreground"
      )}
    >
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <ThemeSwitchDropdown />
        <FullscreenToggleButton />
      </div>

      <div className="pointer-events-none relative z-10 container mx-auto flex size-full flex-col items-center justify-center p-4">
        <Card
          shadow="lg"
          className="border-foreground-200 bg-background/70 dark:bg-background/80 pointer-events-auto w-full max-w-md border-2 p-2 backdrop-blur-md md:p-4"
        >
          <CardHeader className="flex flex-col items-center justify-center gap-4 pb-6 pt-4">
            <BrandLogo className="max-h-12 pointer-events-auto" />
            <Chip 
              color="danger" 
              variant="flat" 
              startContent={<ShieldAlert size={16} />}
              className="px-2 border border-danger-500/30 font-semibold tracking-widest uppercase text-xs"
            >
              Admin Portal
            </Chip>
          </CardHeader>
          
          <CardBody>
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              {error && (
                <div className="rounded-xl border border-danger-500/30 bg-danger-50 p-3 text-sm font-semibold text-danger-600 dark:bg-danger-500/10 dark:text-danger-500 text-center animate-in fade-in slide-in-from-top-2">
                  {error}
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
                variant="bordered"
                startContent={<Mail size={18} className="text-default-400" />}
                classNames={{
                  inputWrapper: "border-foreground-200 data-[hover=true]:border-danger focus-within:!border-danger",
                }}
              />

              <Input
                isRequired
                type="password"
                label="Password"
                placeholder="Enter admin password"
                value={password}
                onValueChange={setPassword}
                isDisabled={isLoading}
                autoComplete="current-password"
                variant="bordered"
                startContent={<Lock size={18} className="text-default-400" />}
                classNames={{
                  inputWrapper: "border-foreground-200 data-[hover=true]:border-danger focus-within:!border-danger",
                }}
              />

              <Button
                type="submit"
                color="danger"
                size="lg"
                isLoading={isLoading}
                className="mt-2 font-bold shadow-lg shadow-danger-500/30"
              >
                {isLoading ? "Authenticating..." : "Login to Dashboard"}
              </Button>
            </form>

            <div className="mt-8 flex justify-center">
              <NextLink 
                href="/auth" 
                color="foreground" 
                className="text-sm font-medium hover:text-danger transition-colors"
              >
                Not a staff member? Switch to User Login
              </NextLink>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Dynamic Background Pattern */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full bg-black/60 backdrop-blur-[2px] dark:bg-black/20" />
      <div 
        className="absolute inset-0 z-[-1] bg-[url('https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=2000')] bg-cover bg-center opacity-10 dark:opacity-20"
      />
    </div>
  );
}