'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Calendar,
  Clock,
  RefreshCcw,
  History,
  LifeBuoy,
  CheckCircle2,
  AlertCircle,
  Zap
} from 'lucide-react';
import { Button } from '@heroui/react';
import useSupabaseUser from '@/hooks/useSupabaseUser';
import { env } from '@/utils/env';
import { getUserSubscription, UserSubscription } from '@/lib/subscriptions';
import Link from 'next/link';

export default function UserProfilePage() {
  const router = useRouter();
  const { data: user, isLoading: isUserLoading } = useSupabaseUser();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoadingSub, setIsLoadingSub] = useState(true);

  useEffect(() => {
    async function loadSub() {
      if (user) {
        try {
          const sub = await getUserSubscription(user.id);
          setSubscription(sub);
        } catch (e) {
          console.error(e);
        }
      }
      setIsLoadingSub(false);
    }
    loadSub();
  }, [user]);

  if (isUserLoading || isLoadingSub) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="mb-4 size-12 text-red-500/50" />
        <h2 className="text-xl font-bold text-foreground">Please Log In</h2>
        <p className="mt-2 text-muted-foreground">You must be logged in to view your profile.</p>
        <Button 
          color="danger"
          variant="flat" 
          className="mt-6"
          onPress={() => router.push('/auth')}
        >
          Go to Login
        </Button>
      </div>
    );
  }

  const isPro = !!subscription && subscription.status === 'active';
  const planName = isPro ? subscription.pricing_plans?.name || 'Pro' : 'Free';
  const avatar = `${env.NEXT_PUBLIC_AVATAR_PROVIDER_URL}${user?.email}`;

  let daysRemaining = '∞';
  if (isPro && subscription.current_period_end) {
    const diff = new Date(subscription.current_period_end).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    daysRemaining = days > 0 ? `${days} Days` : 'Expired';
  }

  const nextBillingDate = isPro ? new Date(subscription.current_period_end).toISOString() : null;
  const paymentMethodStr = isPro ? subscription.payment_method : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
      <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-white/5 bg-background/50 p-6 shadow-sm backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <img src={avatar} alt="" className="size-16 rounded-full border border-white/10 object-cover" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              {user.username || 'Unnamed User'}
            </h1>
            <p className="text-sm font-medium text-muted-foreground">{user.email}</p>
          </div>
        </div>
        
        <Button 
          color="danger" 
          variant="flat" 
          startContent={<LifeBuoy size={18} />}
          onPress={() => router.push('/support')}
          className="w-full md:w-auto font-semibold shadow-sm"
        >
          Contact Support
        </Button>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 text-red-500">
            <CreditCard size={16} />
          </div>
          <h2 className="text-lg font-bold text-foreground">Subscription & Billing</h2>
        </div>
        {!isPro && (
          <Link href="/pricing">
            <Button color="danger" startContent={<Zap size={16} />} className="font-bold shadow-md">
              Upgrade to Pro
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-2xl border border-white/5 bg-white/5 p-5 relative overflow-hidden group">
          {isPro && (
            <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-red-500/20 to-transparent pointer-events-none" />
          )}
          <p className="text-[13px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">Current Plan</p>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-black ${isPro ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500' : 'text-foreground'}`}>
              {planName}
            </span>
            {isPro && <CheckCircle2 size={20} className="text-orange-500" />}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock size={14} />
            <p className="text-[13px] font-bold uppercase tracking-wider">Time Remaining</p>
          </div>
          <p className="text-2xl font-black text-foreground">
            {daysRemaining}
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calendar size={14} />
            <p className="text-[13px] font-bold uppercase tracking-wider">Next Billing</p>
          </div>
          <p className="text-2xl font-black text-foreground">
            {nextBillingDate ? new Date(nextBillingDate).toLocaleDateString() : 'N/A'}
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <RefreshCcw size={14} />
            <p className="text-[13px] font-bold uppercase tracking-wider">Auto-Renewal</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-10 h-5 rounded-full relative transition-colors ${isPro ? 'bg-red-500' : 'bg-white/10'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${isPro ? 'left-[22px]' : 'left-0.5'}`} />
            </div>
            <span className="text-[14px] font-bold text-foreground">
              {isPro ? 'On' : 'Off'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="col-span-1 rounded-2xl border border-white/5 bg-background/50 p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-[15px] font-bold text-foreground">Payment Method</h3>
          {paymentMethodStr ? (
            <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4">
              <div className="flex h-10 w-auto px-4 items-center justify-center rounded bg-white/10 text-xl font-bold italic text-foreground uppercase tracking-widest">
                {paymentMethodStr}
              </div>
              <div>
                <p className="text-[14px] font-bold text-foreground">Active</p>
                <p className="text-[12px] font-medium text-muted-foreground">Default Payment Method</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm font-medium text-muted-foreground">
              No payment method on file
            </div>
          )}
        </div>

        <div className="col-span-1 lg:col-span-2 rounded-2xl border border-white/5 bg-background/50 p-6 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-foreground flex items-center gap-2">
              <History size={16} className="text-muted-foreground" />
              Recent Subscription
            </h3>
          </div>
          
          {subscription ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 pl-2">Date</th>
                    <th className="pb-3">Description</th>
                    <th className="pb-3">Ref</th>
                    <th className="pb-3 pr-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-3 pl-2 font-medium text-foreground">
                      {subscription.created_at ? new Date(subscription.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 text-muted-foreground">{subscription.pricing_plans?.name || 'Pro Plan'}</td>
                    <td className="py-3 font-mono text-[10px] text-muted-foreground">{subscription.reference}</td>
                    <td className="py-3 pr-2 text-right">
                      <span className={`inline-flex rounded bg-green-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${subscription.status === 'active' ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {subscription.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 py-12 text-center text-sm font-medium text-muted-foreground">
              No billing history available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
