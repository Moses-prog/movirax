'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Clock,
  DollarSign
} from 'lucide-react';
import { Button, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, addToast, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { Select, SelectItem } from '@heroui/select';

type SubStatus = 'active' | 'trialing' | 'cancelled' | 'past_due';
type SubPlan = 'free' | 'pro' | 'enterprise';

interface Subscription {
  id: string;
  user_email: string;
  user_name: string;
  plan: SubPlan;
  status: SubStatus;
  amount: number;
  interval: 'month' | 'year';
  current_period_end: string;
  created_at: string;
  payment_method: string;
}

const mockSubscriptions: Subscription[] = [
  { id: 'sub_1001', user_email: 'sarah@example.com', user_name: 'Sarah Connor', plan: 'pro', status: 'active', amount: 14.99, interval: 'month', current_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), payment_method: 'Stripe (Visa 4242)' },
  { id: 'sub_1002', user_email: 'john@example.com', user_name: 'John Doe', plan: 'enterprise', status: 'active', amount: 149.99, interval: 'year', current_period_end: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(), payment_method: 'Paystack (Mastercard 1234)' },
  { id: 'sub_1003', user_email: 'jane@example.com', user_name: 'Jane Smith', plan: 'pro', status: 'cancelled', amount: 14.99, interval: 'month', current_period_end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), payment_method: 'Stripe (Amex 9012)' },
  { id: 'sub_1004', user_email: 'peter@example.com', user_name: 'Peter Parker', plan: 'pro', status: 'trialing', amount: 14.99, interval: 'month', current_period_end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), payment_method: 'Stripe (Visa 1111)' },
  { id: 'sub_1005', user_email: 'bruce@example.com', user_name: 'Bruce Wayne', plan: 'enterprise', status: 'past_due', amount: 149.99, interval: 'year', current_period_end: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 367 * 24 * 60 * 60 * 1000).toISOString(), payment_method: 'Stripe (Visa 4242)' },
];

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modals
  const {isOpen: isRefundOpen, onOpen: onRefundOpen, onOpenChange: onRefundChange} = useDisclosure();
  const {isOpen: isUpdateOpen, onOpen: onUpdateOpen, onOpenChange: onUpdateChange} = useDisclosure();
  
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [newPlan, setNewPlan] = useState<Set<string>>(new Set(['pro']));
  
  const filteredSubs = subscriptions.filter(sub => {
    const matchesSearch = sub.user_email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sub.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: SubStatus) => {
    switch (status) {
      case 'active': return <span className="flex items-center gap-1 w-fit rounded bg-green-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-green-500"><CheckCircle2 size={12}/> Active</span>;
      case 'trialing': return <span className="flex items-center gap-1 w-fit rounded bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-500"><Clock size={12}/> Trialing</span>;
      case 'cancelled': return <span className="flex items-center gap-1 w-fit rounded bg-white/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground"><XCircle size={12}/> Cancelled</span>;
      case 'past_due': return <span className="flex items-center gap-1 w-fit rounded bg-red-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-red-500"><AlertCircle size={12}/> Past Due</span>;
    }
  };

  const getPlanBadge = (plan: SubPlan) => {
    switch (plan) {
      case 'free': return <span className="text-muted-foreground font-bold text-[13px]">Free</span>;
      case 'pro': return <span className="text-orange-500 font-bold text-[13px]">Pro</span>;
      case 'enterprise': return <span className="text-red-500 font-bold text-[13px]">Enterprise</span>;
    }
  };

  const openRefundModal = (sub: Subscription) => {
    setSelectedSub(sub);
    setRefundAmount(sub.amount.toString());
    onRefundOpen();
  };

  const openUpdateModal = (sub: Subscription) => {
    setSelectedSub(sub);
    setNewPlan(new Set([sub.plan]));
    onUpdateOpen();
  };

  const handleRefund = (onClose: () => void) => {
    if (!selectedSub) return;
    addToast({ title: `Refund of $${refundAmount} processed successfully.`, color: 'success' });
    onClose();
  };

  const handleUpdate = (onClose: () => void) => {
    if (!selectedSub) return;
    const planValue = Array.from(newPlan)[0] as SubPlan;
    
    setSubscriptions(subscriptions.map(s => s.id === selectedSub.id ? { ...s, plan: planValue } : s));
    addToast({ title: `Subscription updated to ${planValue}.`, color: 'success' });
    onClose();
  };

  const cancelSubscription = (id: string) => {
    setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, status: 'cancelled' } : s));
    addToast({ title: `Subscription cancelled successfully.`, color: 'success' });
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="m-0 mb-1 text-3xl font-extrabold tracking-tight text-foreground">Subscription Management</h1>
          <p className="m-0 text-sm font-medium text-muted-foreground">
            Manage active subscriptions, trials, and manual refunds
          </p>
        </div>
      </header>

      {/* Top Metrics */}
      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-white/5 bg-background/50 p-5 shadow-sm backdrop-blur-xl">
          <p className="text-[13px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">Active Subs</p>
          <p className="text-3xl font-black text-foreground">{subscriptions.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-background/50 p-5 shadow-sm backdrop-blur-xl">
          <p className="text-[13px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">In Trial</p>
          <p className="text-3xl font-black text-blue-500">{subscriptions.filter(s => s.status === 'trialing').length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-background/50 p-5 shadow-sm backdrop-blur-xl">
          <p className="text-[13px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">Cancelled (This Month)</p>
          <p className="text-3xl font-black text-muted-foreground">{subscriptions.filter(s => s.status === 'cancelled').length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-background/50 p-5 shadow-sm backdrop-blur-xl">
          <p className="text-[13px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">Past Due</p>
          <p className="text-3xl font-black text-red-500">{subscriptions.filter(s => s.status === 'past_due').length}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search by name, email, or sub ID..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Search size={16} className="text-muted-foreground" />}
          className="max-w-md"
          classNames={{ inputWrapper: "bg-white/5 border border-white/5 hover:bg-white/10" }}
        />
        <Select 
          selectedKeys={new Set([statusFilter])}
          onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
          aria-label="Filter by status"
          startContent={<Filter size={16} className="text-muted-foreground" />}
          className="w-40"
          classNames={{ trigger: "bg-white/5 border border-white/5" }}
        >
          <SelectItem key="all">All Statuses</SelectItem>
          <SelectItem key="active">Active</SelectItem>
          <SelectItem key="trialing">Trialing</SelectItem>
          <SelectItem key="cancelled">Cancelled</SelectItem>
          <SelectItem key="past_due">Past Due</SelectItem>
        </Select>
      </div>

      {/* Subscriptions Table */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-background/50 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Table Header */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_0.5fr] items-center gap-4 border-b border-white/5 bg-white/5 px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
              <div>Customer</div>
              <div>Plan & Pricing</div>
              <div>Status</div>
              <div>Billing Period</div>
              <div>Payment Method</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Table Body */}
            {filteredSubs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CreditCard className="mb-3 size-10 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">No subscriptions found</p>
              </div>
            ) : (
              filteredSubs.map((sub, idx) => (
                <div 
                  key={sub.id} 
                  className={`grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_0.5fr] items-center gap-4 px-6 py-5 transition-colors hover:bg-white/5 ${idx !== filteredSubs.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  {/* Customer */}
                  <div>
                    <h3 className="text-[14px] font-bold text-foreground">{sub.user_name}</h3>
                    <p className="text-[12px] text-muted-foreground">{sub.user_email}</p>
                    <p className="text-[10px] text-muted-foreground/50 mt-1 font-mono">{sub.id}</p>
                  </div>

                  {/* Plan */}
                  <div>
                    <div className="mb-1">{getPlanBadge(sub.plan)}</div>
                    <div className="text-[13px] font-bold text-foreground">${sub.amount}/{sub.interval === 'month' ? 'mo' : 'yr'}</div>
                  </div>

                  {/* Status */}
                  <div>
                    {getStatusBadge(sub.status)}
                  </div>

                  {/* Billing Period */}
                  <div>
                    <p className="text-[12px] font-bold text-foreground mb-0.5">Renews/Ends:</p>
                    <p className="text-[12px] text-muted-foreground">{new Date(sub.current_period_end).toLocaleDateString()}</p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{sub.payment_method}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end">
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <Button variant="light" size="sm" isIconOnly className="text-muted-foreground">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Subscription actions" className="bg-background border border-white/10">
                        <DropdownItem startContent={<RefreshCcw size={14}/>} onPress={() => openUpdateModal(sub)}>
                          Change Plan
                        </DropdownItem>
                        <DropdownItem startContent={<DollarSign size={14}/>} onPress={() => openRefundModal(sub)}>
                          Process Refund
                        </DropdownItem>
                        <DropdownItem 
                          startContent={<XCircle size={14}/>} 
                          className="text-danger" 
                          color="danger"
                          onPress={() => cancelSubscription(sub.id)}
                          isDisabled={sub.status === 'cancelled'}
                        >
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

      {/* Refund Modal */}
      <Modal isOpen={isRefundOpen} onOpenChange={onRefundChange} classNames={{ base: "bg-background border border-white/10" }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Process Manual Refund</ModalHeader>
              <ModalBody>
                <div className="bg-white/5 p-4 rounded-xl mb-4 border border-white/5">
                  <p className="text-sm font-bold text-foreground mb-1">Customer: {selectedSub?.user_name}</p>
                  <p className="text-xs text-muted-foreground">Sub ID: {selectedSub?.id}</p>
                </div>
                <Input
                  label="Refund Amount"
                  type="number"
                  value={refundAmount}
                  onValueChange={setRefundAmount}
                  startContent={<span className="text-muted-foreground font-bold">$</span>}
                  classNames={{ inputWrapper: "bg-white/5 border border-white/10" }}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  This will immediately refund the specified amount back to the customer's original payment method ({selectedSub?.payment_method}).
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancel</Button>
                <Button color="danger" onPress={() => handleRefund(onClose)}>Process Refund</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={isUpdateOpen} onOpenChange={onUpdateChange} classNames={{ base: "bg-background border border-white/10" }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Update Subscription</ModalHeader>
              <ModalBody>
                <div className="bg-white/5 p-4 rounded-xl mb-4 border border-white/5">
                  <p className="text-sm font-bold text-foreground mb-1">Customer: {selectedSub?.user_name}</p>
                  <p className="text-xs text-muted-foreground">Current Plan: <span className="uppercase font-bold">{selectedSub?.plan}</span></p>
                </div>
                <Select 
                  label="New Plan"
                  selectedKeys={newPlan}
                  onSelectionChange={(keys) => setNewPlan(keys as Set<string>)}
                  classNames={{ trigger: "bg-white/5 border border-white/10" }}
                >
                  <SelectItem key="free">Free Tier</SelectItem>
                  <SelectItem key="pro">Pro Tier</SelectItem>
                  <SelectItem key="enterprise">Enterprise Tier</SelectItem>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Changes will be prorated automatically based on the billing cycle.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancel</Button>
                <Button color="danger" onPress={() => handleUpdate(onClose)}>Update Subscription</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
