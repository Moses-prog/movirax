'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Search, Filter, MoreVertical, AlertCircle, CheckCircle2, XCircle, RefreshCcw, Clock, DollarSign } from 'lucide-react';
import { Button, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, addToast } from '@heroui/react';
import { Select, SelectItem } from '@heroui/select';
import { getAllSubscriptions, cancelUserSubscription, UserSubscription } from '@/lib/subscriptions';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const subs = await getAllSubscriptions();
      setSubscriptions(subs);
      setIsLoading(false);
    }
    load();
  }, []);
  
  const filteredSubs = subscriptions.filter(sub => {
    const email = sub.user_email?.toLowerCase() || '';
    const name = sub.user_name?.toLowerCase() || '';
    const matchesSearch = email.includes(searchQuery.toLowerCase()) || 
                          name.includes(searchQuery.toLowerCase()) ||
                          sub.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="flex items-center gap-1 w-fit rounded bg-green-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-green-500"><CheckCircle2 size={12}/> Active</span>;
      case 'trialing': return <span className="flex items-center gap-1 w-fit rounded bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-500"><Clock size={12}/> Trialing</span>;
      case 'cancelled': return <span className="flex items-center gap-1 w-fit rounded bg-white/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground"><XCircle size={12}/> Cancelled</span>;
      case 'past_due': return <span className="flex items-center gap-1 w-fit rounded bg-red-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-red-500"><AlertCircle size={12}/> Past Due</span>;
      default: return <span>{status}</span>;
    }
  };

  const handleCancel = async (id: string) => {
    if (confirm('Are you sure you want to force cancel this subscription?')) {
      const ok = await cancelUserSubscription(id);
      if (ok) {
        setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, status: 'cancelled' } : s));
        addToast({ title: 'Subscription cancelled successfully.', color: 'success' });
      } else {
        addToast({ title: 'Failed to cancel subscription', color: 'danger' });
      }
    }
  };

  if (isLoading) return <div className="p-8 text-center"><div className="animate-spin size-8 border-4 border-danger border-t-transparent rounded-full mx-auto" /></div>;

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="m-0 mb-1 text-3xl font-extrabold tracking-tight text-foreground">Subscription Management</h1>
          <p className="m-0 text-sm font-medium text-muted-foreground">Manage active subscriptions, trials, and manual refunds</p>
        </div>
      </header>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-white/5 bg-background/50 p-5 shadow-sm backdrop-blur-xl">
          <p className="text-[13px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">Active Subs</p>
          <p className="text-3xl font-black text-foreground">{subscriptions.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-background/50 p-5 shadow-sm backdrop-blur-xl">
          <p className="text-[13px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">Cancelled</p>
          <p className="text-3xl font-black text-muted-foreground">{subscriptions.filter(s => s.status === 'cancelled').length}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search by name, email..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Search size={16} className="text-muted-foreground" />}
          className="max-w-md"
        />
        <Select 
          selectedKeys={new Set([statusFilter])}
          onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
          className="w-40"
        >
          <SelectItem key="all">All Statuses</SelectItem>
          <SelectItem key="active">Active</SelectItem>
          <SelectItem key="cancelled">Cancelled</SelectItem>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-background/50 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_0.5fr] items-center gap-4 border-b border-white/5 bg-white/5 px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
              <div>Customer</div>
              <div>Plan & Pricing</div>
              <div>Status</div>
              <div>Billing Period</div>
              <div>Payment Method</div>
              <div className="text-right">Actions</div>
            </div>

            {filteredSubs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CreditCard className="mb-3 size-10 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">No subscriptions found</p>
              </div>
            ) : (
              filteredSubs.map((sub, idx) => (
                <div key={sub.id} className={\grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_0.5fr] items-center gap-4 px-6 py-5 transition-colors hover:bg-white/5 \\}>
                  <div>
                    <h3 className="text-[14px] font-bold text-foreground">{sub.user_name}</h3>
                    <p className="text-[12px] text-muted-foreground">{sub.user_email}</p>
                    <p className="text-[10px] text-muted-foreground/50 mt-1 font-mono">{sub.id}</p>
                  </div>
                  <div>
                    <div className="mb-1"><span className="text-orange-500 font-bold text-[13px]">{sub.pricing_plans?.name || 'Unknown Plan'}</span></div>
                    <div className="text-[13px] font-bold text-foreground">₦{sub.pricing_plans?.price || 0}</div>
                  </div>
                  <div>{getStatusBadge(sub.status)}</div>
                  <div>
                    <p className="text-[12px] font-bold text-foreground mb-0.5">Renews/Ends:</p>
                    <p className="text-[12px] text-muted-foreground">{new Date(sub.current_period_end).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{sub.payment_method}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">{sub.reference}</p>
                  </div>
                  <div className="flex justify-end">
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <Button variant="light" size="sm" isIconOnly className="text-muted-foreground"><MoreVertical size={16} /></Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Subscription actions" className="bg-background border border-white/10">
                        <DropdownItem startContent={<XCircle size={14}/>} className="text-danger" color="danger" onPress={() => handleCancel(sub.id)} isDisabled={sub.status === 'cancelled'}>
                          Force Cancel
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
