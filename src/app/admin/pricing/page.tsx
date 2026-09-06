'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Save, ShieldCheck, Clock, Gift, Percent, RefreshCcw } from 'lucide-react';
import { Button, Input, addToast, Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { Switch } from '@heroui/switch';
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
    return <div className="p-8 text-center"><div className="animate-spin size-8 border-4 border-danger border-t-transparent rounded-full mx-auto" /></div>;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="m-0 mb-1 text-3xl font-extrabold tracking-tight text-foreground">Pricing Settings</h1>
          <p className="m-0 text-sm font-medium text-muted-foreground">Configure global pricing and payment gateways</p>
        </div>
        
        <Button
          color="danger"
          className="bg-gradient-to-r from-red-600 to-orange-500 font-bold text-white shadow-md"
          startContent={<Save size={18} />}
          onPress={handleSave}
          isLoading={isSaving}
        >
          Save Changes
        </Button>
      </header>

      <div className="grid gap-6">
        <Card className="border border-[#0EA5E9]/20 bg-background/50 shadow-[0_0_20px_rgba(14,165,233,0.05)] backdrop-blur-xl relative overflow-hidden">
          <CardHeader className="flex items-center gap-3 px-6 pt-6 pb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#0EA5E9]/20 text-[#0EA5E9]">
              <DollarSign size={20} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-foreground">Flutterwave Pricing (NGN)</h3>
              <p className="text-[12px] font-medium text-muted-foreground">Localized African pricing</p>
            </div>
          </CardHeader>
          <Divider className="bg-white/5" />
          <CardBody className="px-6 py-6">
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map(plan => (
                <div key={plan.id} className="flex flex-col gap-4 rounded-xl border border-white/5 bg-white/5 p-5">
                  <h4 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <RefreshCcw size={14} /> {plan.name} ({plan.interval})
                  </h4>
                  <div className="flex flex-col gap-3">
                    <Input
                      label="Price"
                      type="number"
                      value={plan.price.toString()}
                      onValueChange={(v) => handleUpdatePrice(plan.id, 'price', v)}
                      startContent={<span className="text-muted-foreground font-bold">₦</span>}
                      classNames={{ inputWrapper: "bg-background border border-white/10" }}
                    />
                    <Input
                      label="Discount"
                      type="number"
                      value={(plan.discount || 0).toString()}
                      onValueChange={(v) => handleUpdatePrice(plan.id, 'discount', v)}
                      endContent={<Percent size={14} className="text-muted-foreground" />}
                      classNames={{ inputWrapper: "bg-background border border-white/10" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
