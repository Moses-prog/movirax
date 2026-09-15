'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Save, RefreshCcw, Percent } from 'lucide-react';
import { Button, Input, addToast, Card, CardBody, CardHeader, Divider, Spinner } from '@heroui/react';
import { getPricingPlans, updatePricingPlan, PricingPlan } from '@/lib/subscriptions';

export default function PricingSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const dbPlans = await getPricingPlans();
      setPlans(dbPlans.filter(p => p.gateway === 'flutterwave'));
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
          <p className="text-default-500 mt-1">Configure global pricing and payment gateways</p>
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
              <h3 className="text-lg font-bold text-foreground">Flutterwave Pricing (NGN)</h3>
              <p className="text-sm text-default-500">Localized African pricing</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="px-6 py-6">
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map(plan => (
                <Card key={plan.id} className="border border-divider bg-transparent shadow-none">
                  <CardBody className="flex flex-col gap-5 p-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-default-500 flex items-center gap-2">
                      <RefreshCcw size={14} /> {plan.name} ({plan.interval})
                    </h4>
                    <div className="flex flex-col gap-4">
                      <Input
                        label="Price"
                        labelPlacement="outside"
                        placeholder="0.00"
                        type="number"
                        value={plan.price.toString()}
                        onValueChange={(v) => handleUpdatePrice(plan.id, 'price', v)}
                        startContent={<span className="text-default-400 font-bold">₦</span>}
                        variant="faded"
                      />
                      <Input
                        label="Discount"
                        labelPlacement="outside"
                        placeholder="0"
                        type="number"
                        value={(plan.discount || 0).toString()}
                        onValueChange={(v) => handleUpdatePrice(plan.id, 'discount', v)}
                        endContent={<Percent size={14} className="text-default-400" />}
                        variant="faded"
                      />
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
