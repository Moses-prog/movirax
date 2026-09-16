'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  CreditCard,
  Calendar,
  Clock,
  RefreshCcw,
  History,
  LifeBuoy,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Select, SelectItem, Textarea, addToast, Input } from '@heroui/react';
import { getPricingPlans } from '@/lib/subscriptions';

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: string;
  description: string;
}

interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  status: string;
  role: string;
  subscription_tier: string;
  created_at: string;
  billing: {
    plan: string;
    daysRemaining: number;
    nextBillingDate: string | null;
    autoRenewal: boolean;
    paymentMethod: { brand: string; last4: string } | null;
    history: BillingHistory[];
  };
}

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Support Modal State
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
  const [supportType, setSupportType] = useState(new Set(["upgrade"]));
  const [plans, setPlans] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${params.id}`);
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchPlans = async () => {
      try {
        const data = await getPricingPlans();
        setPlans(data);
      } catch (err) {
        console.error('Failed to load plans:', err);
      }
    };
    fetchUser();
    fetchPlans();
  }, [params.id]);

  const handleStatusChange = async (status: string) => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/admin/users/${params.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action: 'update_status', status })
      });
      setUser(prev => prev ? { ...prev, status } : null);
      addToast({ title: "Status updated", color: "success" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualUpgrade = async (planId: string) => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/admin/users/${params.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action: 'upgrade', planId, days: 30 })
      });
      addToast({ title: "User Upgraded", color: "success" });
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSub = async (planId: string) => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/admin/users/${params.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action: 'cancel', planId })
      });
      addToast({ title: "Subscription Cancelled", color: "success" });
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (role: string) => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/admin/users/${params.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action: 'update_role', role })
      });
      setUser(prev => prev ? { ...prev, role } : null);
      addToast({ title: "Role updated", color: "success" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileUpdate = async (display_name: string) => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/admin/users/${params.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action: 'update_profile', display_name })
      });
      setUser(prev => prev ? { ...prev, display_name } : null);
      addToast({ title: "Profile updated", color: "success" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSupportSubmit = async (onClose: () => void) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitting(false);
    
    addToast({
      title: "Support ticket created successfully",
      color: "success"
    });
    
    setSupportMessage("");
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    setIsSubmitting(true);
    try {
      await fetch(`/api/admin/users/${params.id}`, { method: 'DELETE' });
      addToast({ title: "User deleted", color: "success" });
      router.push('/admin/users');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
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
        <h2 className="text-xl font-bold text-foreground">User Not Found</h2>
        <p className="mt-2 text-muted-foreground">The user you're looking for doesn't exist or was deleted.</p>
        <Button 
          variant="flat" 
          className="mt-6"
          onPress={() => router.push('/admin/users')}
        >
          Back to Users
        </Button>
      </div>
    );
  }

  const isPro = user.billing.plan !== 'Free';

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header / Navigation */}
      <button
        onClick={() => router.push('/admin/users')}
        className="group mb-6 flex items-center gap-2 text-[13px] font-bold text-muted-foreground transition-colors hover:text-foreground"
      >
        <div className="flex size-7 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-white/10">
          <ChevronLeft size={16} />
        </div>
        Back to Users
      </button>

      {/* User Info Card */}
      <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-white/5 bg-background/50 p-6 shadow-sm backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="" className="size-16 rounded-full border border-white/10 object-cover" />
          ) : (
            <div className="flex size-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl font-black text-foreground">
              {(user.display_name || user.email).charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              {user.display_name || 'Unnamed User'}
            </h1>
            <p className="text-sm font-medium text-muted-foreground">{user.email}</p>
          </div>
        </div>
        
        <Button 
          color="danger" 
          variant="flat" 
          startContent={<LifeBuoy size={18} />}
          onPress={onOpen}
          className="w-full md:w-auto font-semibold shadow-sm"
        >
          Contact Support
        </Button>
      </div>

      {/* Subscription Profile Grid */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 text-red-500">
          <CreditCard size={16} />
        </div>
        <h2 className="text-lg font-bold text-foreground">Subscription & Billing</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Current Plan */}
        <div className="rounded-2xl border border-white/5 bg-white/5 p-5 relative overflow-hidden group">
          {isPro && (
            <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-red-500/20 to-transparent pointer-events-none" />
          )}
          <p className="text-[13px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">Current Plan</p>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-black ${isPro ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500' : 'text-foreground'}`}>
              {user.billing.plan}
            </span>
            {isPro && <CheckCircle2 size={20} className="text-orange-500" />}
          </div>
        </div>

        {/* Time Remaining */}
        <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock size={14} />
            <p className="text-[13px] font-bold uppercase tracking-wider">Time Remaining</p>
          </div>
          <p className="text-2xl font-black text-foreground">
            {isPro ? `${user.billing.daysRemaining} Days` : '∞'}
          </p>
        </div>

        {/* Next Billing */}
        <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calendar size={14} />
            <p className="text-[13px] font-bold uppercase tracking-wider">Next Billing</p>
          </div>
          <p className="text-2xl font-black text-foreground">
            {user.billing.nextBillingDate ? new Date(user.billing.nextBillingDate).toLocaleDateString() : 'N/A'}
          </p>
        </div>

        {/* Auto Renewal */}
        <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <RefreshCcw size={14} />
            <p className="text-[13px] font-bold uppercase tracking-wider">Auto-Renewal</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-10 h-5 rounded-full relative transition-colors ${user.billing.autoRenewal ? 'bg-red-500' : 'bg-white/10'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${user.billing.autoRenewal ? 'left-[22px]' : 'left-0.5'}`} />
            </div>
            <span className="text-[14px] font-bold text-foreground">
              {user.billing.autoRenewal ? 'On' : 'Off'}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Method & History */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payment Method */}
        <div className="col-span-1 rounded-2xl border border-white/5 bg-background/50 p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-[15px] font-bold text-foreground">Payment Method</h3>
          {user.billing.paymentMethod ? (
            <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4">
              <div className="flex h-10 w-14 items-center justify-center rounded bg-white/10 text-xl font-bold italic text-foreground uppercase tracking-widest">
                {user.billing.paymentMethod.brand === 'visa' ? 'VISA' : user.billing.paymentMethod.brand}
              </div>
              <div>
                <p className="text-[14px] font-bold text-foreground">•••• {user.billing.paymentMethod.last4}</p>
                <p className="text-[12px] font-medium text-muted-foreground">Default Payment Method</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm font-medium text-muted-foreground">
              No payment method on file
            </div>
          )}
        </div>

        {/* Billing History */}
        <div className="col-span-1 lg:col-span-2 rounded-2xl border border-white/5 bg-background/50 p-6 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-foreground flex items-center gap-2">
              <History size={16} className="text-muted-foreground" />
              Billing History
            </h3>
          </div>
          
          {user.billing.history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 pl-2">Date</th>
                    <th className="pb-3">Description</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3 pr-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {user.billing.history.map((invoice, index) => (
                    <tr key={invoice.id} className={index !== user.billing.history.length - 1 ? "border-b border-white/5" : ""}>
                      <td className="py-3 pl-2 font-medium text-foreground">{new Date(invoice.date).toLocaleDateString()}</td>
                      <td className="py-3 text-muted-foreground">{invoice.description}</td>
                      <td className="py-3 font-bold text-foreground">${invoice.amount.toFixed(2)}</td>
                      <td className="py-3 pr-2 text-right">
                        <span className={`inline-flex rounded bg-green-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${invoice.status === 'paid' ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
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

      {/* Administrative Actions */}
      <div className="mt-8 rounded-2xl border border-danger/20 bg-danger/5 p-6 backdrop-blur-xl">
        <h3 className="mb-4 text-[15px] font-bold text-danger flex items-center gap-2">
          <AlertCircle size={16} />
          Administrative Actions
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button 
            color="primary" 
            variant="flat" 
            onPress={() => {
              const name = window.prompt("Enter new display name:", user.display_name || '');
              if (name !== null) handleProfileUpdate(name);
            }}
          >
            Edit Name
          </Button>

          <Select
            label="User Role"
            selectedKeys={[user.role || 'user']}
            size="sm"
            className="max-w-[150px]"
            onChange={(e) => {
              if (e.target.value) handleRoleChange(e.target.value);
            }}
          >
            <SelectItem key="user" value="user">User</SelectItem>
            <SelectItem key="super_admin" value="super_admin">Super Admin</SelectItem>
          </Select>

          {user.subscription_tier === 'free' ? (
            <Select
              label="Manual Upgrade"
              placeholder="Select a plan"
              size="sm"
              className="max-w-[200px]"
              onChange={(e) => {
                if (e.target.value) handleManualUpgrade(e.target.value);
              }}
            >
              {plans.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </Select>
          ) : (
            <Button color="warning" variant="flat" onPress={() => handleCancelSub(user.billing.subscriptionId)}>
              Cancel Subscription
            </Button>
          )}

          {user.status === 'active' ? (
            <Button color="warning" variant="flat" onPress={() => handleStatusChange('suspended')}>Suspend User</Button>
          ) : (
            <Button color="success" variant="flat" onPress={() => handleStatusChange('active')}>Unsuspend User</Button>
          )}

          {user.status !== 'banned' && (
            <Button color="danger" variant="flat" onPress={() => handleStatusChange('banned')}>Ban User</Button>
          )}

          <Button color="danger" variant="solid" onPress={handleDelete}>Delete User</Button>
        </div>
      </div>

      {/* Support Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        classNames={{
          base: "bg-background border border-white/10",
          header: "border-b border-white/5",
          footer: "border-t border-white/5",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Contact Support</ModalHeader>
              <ModalBody className="py-6">
                <Select 
                  label="Request Type"
                  selectedKeys={supportType}
                  onSelectionChange={(keys) => setSupportType(keys as Set<string>)}
                  classNames={{
                    trigger: "bg-white/5 border border-white/10 hover:bg-white/10",
                  }}
                >
                  <SelectItem key="upgrade">Upgrade Plan</SelectItem>
                  <SelectItem key="downgrade">Downgrade Plan</SelectItem>
                  <SelectItem key="cancel">Cancel Subscription</SelectItem>
                  <SelectItem key="billing">Billing Issue</SelectItem>
                </Select>
                
                <Textarea 
                  label="Message"
                  placeholder="How can we help you?"
                  value={supportMessage}
                  onValueChange={setSupportMessage}
                  minRows={4}
                  classNames={{
                    inputWrapper: "bg-white/5 border border-white/10 hover:bg-white/10",
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="danger" 
                  onPress={() => handleSupportSubmit(onClose)}
                  isLoading={isSubmitting}
                  className="bg-gradient-to-r from-red-600 to-orange-500 font-bold text-white shadow-md"
                >
                  Submit Request
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
