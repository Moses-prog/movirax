'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Save, RefreshCcw, Percent, CreditCard } from 'lucide-react';
import { Button, Input, addToast, Card, CardBody, CardHeader, Divider, Spinner, Chip } from '@heroui/react';
import { getPricingPlans, updatePricingPlan, PricingPlan } from '@/lib/subscriptions';
import { syncPlanToPaystack } from '@/app/actions/paystack';

export default function PricingSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const dbPlans = await getPricingPlans();
      // Load all plans, remove flutterwave filter
      setPlans(dbPlans.filter(p => p.is_active !== false));
      setIsLoading(false);
    }
    load();
  }, []);

  const handleUpdatePrice = (id: string, field: string, value: string) => {
    setPlans(plans.map(p => p.id === id ? { ...p, [field]: Number(value) } : p));
  };

  const handleSave = async () => {
    setIsSaving(true);
    let success = true;
    for (const plan of plans) {
      const ok = await updatePricingPlan(plan.id, { price: plan.price, discount: plan.discount });
      if (!ok) success = false;
    }
    setIsSaving(false);
    
    if (success) {
      addToast({ title: "Pricing settings saved successfully", color: "success" });
    } else {
      addToast({ title: "Some updates failed", color: "danger" });
    }
  };

  const handleSyncPaystack = async (plan: PricingPlan) => {
    setIsSyncing(plan.id);
    const res = await syncPlanToPaystack({
      id: plan.id,
      name: plan.name,
      interval: plan.interval,
      amount: plan.price,
      currency: plan.currency,
      paystack_plan_code: plan.paystack_plan_code
    });

    if (res.error) {
      addToast({ title: `Paystack Sync Failed: ${res.error}`, color: 'danger' });
    } else {
      addToast({ title: 'Synced with Paystack!', color: 'success' });
      // Update local state
      setPlans(plans.map(p => p.id === plan.id ? { ...p, paystack_plan_code: res.plan_code } : p));
    }
    setIsSyncing(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spinner size="lg" color="danger" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl flex flex-col gap-6 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Pricing Settings</h1>
          <p className="text-default-500 mt-1">Configure global pricing and synchronize with payment gateways.</p>
        </div>
        
        <Button
          color="danger"
          startContent={<Save size={18} />}
          onPress={handleSave}
          isLoading={isSaving}
          className="font-bold shadow-lg shadow-danger-500/30"
        >
          Save Changes
        </Button>
      </header>

      <div className="grid gap-6">
        <Card className="border-none shadow-sm bg-background/60 dark:bg-default-100/50">
          <CardHeader className="flex items-center gap-3 px-6 pt-6 pb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <DollarSign size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Subscription Plans</h3>
              <p className="text-sm text-default-500">Manage plan pricing and Paystack sync</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-0">
            <div className="flex flex-col">
              {plans.map((plan, index) => (
                <React.Fragment key={plan.id}>
                  <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex flex-col gap-1 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-semibold text-foreground">{plan.name}</h4>
                        <Chip size="sm" color="default" variant="flat" className="uppercase text-xs font-bold">
                          {plan.interval}
                        </Chip>
                      </div>
                      <p className="text-sm text-default-500">
                        {plan.currency === 'NGN' ? '₦' : '$'}{plan.price} / {plan.interval}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 flex-grow max-w-2xl">
                      <Input
                        type="number"
                        label="Base Price"
                        placeholder="0.00"
                        value={plan.price.toString()}
                        onValueChange={(val) => handleUpdatePrice(plan.id, 'price', val)}
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-sm">{plan.currency}</span>
                          </div>
                        }
                        className="w-full sm:w-32"
                        variant="bordered"
                      />
                      
                      <Input
                        type="number"
                        label="Admin Discount"
                        placeholder="0"
                        value={plan.discount.toString()}
                        onValueChange={(val) => handleUpdatePrice(plan.id, 'discount', val)}
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <Percent size={14} className="text-default-400" />
                          </div>
                        }
                        endContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-sm">%</span>
                          </div>
                        }
                        className="w-full sm:w-32"
                        variant="bordered"
                      />

                      <div className="flex flex-col items-end gap-2 ml-auto">
                        <Button 
                          color={plan.paystack_plan_code ? "success" : "primary"}
                          variant="flat"
                          startContent={<CreditCard size={16} />}
                          isLoading={isSyncing === plan.id}
                          onPress={() => handleSyncPaystack(plan)}
                        >
                          {plan.paystack_plan_code ? "Update Paystack Plan" : "Create on Paystack"}
                        </Button>
                        {plan.paystack_plan_code && (
                          <span className="text-xs text-success-500 font-mono">
                            Synced: {plan.paystack_plan_code}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < plans.length - 1 && <Divider className="mx-6 w-auto" />}
                </React.Fragment>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
