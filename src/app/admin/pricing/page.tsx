'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  Save, 
  CreditCard, 
  Gift, 
  Clock,
  Percent,
  RefreshCcw,
  ShieldCheck
} from 'lucide-react';
import { Button, Input, addToast, Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { Switch } from '@heroui/switch';

export default function PricingSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  
  // Free Trial State
  const [trialEnabled, setTrialEnabled] = useState(true);
  const [trialDuration, setTrialDuration] = useState('7');

  // Stripe Pricing State
  const [stripeMonthly, setStripeMonthly] = useState('14.99');
  const [stripeQuarterly, setStripeQuarterly] = useState('39.99');
  const [stripeQuarterlyDiscount, setStripeQuarterlyDiscount] = useState('11');
  const [stripeAnnual, setStripeAnnual] = useState('149.99');
  const [stripeAnnualDiscount, setStripeAnnualDiscount] = useState('16');

  // Paystack Pricing State
  const [paystackMonthly, setPaystackMonthly] = useState('4500');
  const [paystackQuarterly, setPaystackQuarterly] = useState('12000');
  const [paystackQuarterlyDiscount, setPaystackQuarterlyDiscount] = useState('11');
  const [paystackAnnual, setPaystackAnnual] = useState('45000');
  const [paystackAnnualDiscount, setPaystackAnnualDiscount] = useState('16');

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    
    addToast({
      title: "Pricing settings saved successfully",
      color: "success"
    });
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="m-0 mb-1 text-3xl font-extrabold tracking-tight text-foreground">Pricing Settings</h1>
          <p className="m-0 text-sm font-medium text-muted-foreground">
            Configure global pricing, discounts, and payment gateways
          </p>
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: General Settings */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Free Trial Settings */}
          <Card className="border border-white/5 bg-background/50 shadow-sm backdrop-blur-xl">
            <CardHeader className="flex items-center gap-3 px-6 pt-6 pb-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/20 text-orange-500">
                <Gift size={20} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-foreground">Free Trial</h3>
                <p className="text-[12px] font-medium text-muted-foreground">Configure trial duration</p>
              </div>
            </CardHeader>
            <Divider className="bg-white/5" />
            <CardBody className="px-6 py-6 flex flex-col gap-6">
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] font-bold text-foreground">Enable Free Trial</span>
                  <span className="text-[12px] text-muted-foreground">Offer a trial for new users</span>
                </div>
                <Switch 
                  isSelected={trialEnabled} 
                  onValueChange={setTrialEnabled}
                  color="danger"
                />
              </div>

              <Input
                label="Trial Duration (Days)"
                type="number"
                value={trialDuration}
                onValueChange={setTrialDuration}
                isDisabled={!trialEnabled}
                startContent={<Clock size={16} className="text-muted-foreground" />}
                classNames={{
                  inputWrapper: "bg-white/5 border border-white/10 hover:bg-white/10 focus-within:border-red-500/50"
                }}
              />
            </CardBody>
          </Card>

          {/* Payment Gateways */}
          <Card className="border border-white/5 bg-background/50 shadow-sm backdrop-blur-xl">
            <CardHeader className="flex items-center gap-3 px-6 pt-6 pb-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-green-500/20 text-green-500">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-foreground">Payment Gateways</h3>
                <p className="text-[12px] font-medium text-muted-foreground">Active integrations</p>
              </div>
            </CardHeader>
            <Divider className="bg-white/5" />
            <CardBody className="px-6 py-6 flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded bg-[#6366F1] flex items-center justify-center text-white font-black italic">S</div>
                  <span className="text-[14px] font-bold text-foreground">Stripe</span>
                </div>
                <span className="text-[12px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded">Active</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded bg-[#0EA5E9] flex items-center justify-center text-white font-black">P</div>
                  <span className="text-[14px] font-bold text-foreground">Paystack</span>
                </div>
                <span className="text-[12px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded">Active</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Pricing Tiers */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Stripe Pricing */}
          <Card className="border border-[#6366F1]/20 bg-background/50 shadow-[0_0_20px_rgba(99,102,241,0.05)] backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6366F1]/10 blur-[50px] pointer-events-none" />
            <CardHeader className="flex items-center gap-3 px-6 pt-6 pb-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#6366F1]/20 text-[#6366F1]">
                <DollarSign size={20} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-foreground">Stripe Pricing (USD)</h3>
                <p className="text-[12px] font-medium text-muted-foreground">Global international pricing</p>
              </div>
            </CardHeader>
            <Divider className="bg-white/5" />
            <CardBody className="px-6 py-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Monthly */}
                <div className="flex flex-col gap-4 rounded-xl border border-white/5 bg-white/5 p-5">
                  <h4 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <RefreshCcw size={14} /> Monthly Plan
                  </h4>
                  <Input
                    label="Price"
                    type="number"
                    value={stripeMonthly}
                    onValueChange={setStripeMonthly}
                    startContent={<span className="text-muted-foreground font-bold">$</span>}
                    classNames={{ inputWrapper: "bg-background border border-white/10 focus-within:border-[#6366F1]" }}
                  />
                </div>

                {/* Quarterly */}
                <div className="flex flex-col gap-4 rounded-xl border border-[#6366F1]/30 bg-[#6366F1]/5 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#6366F1] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-bl-lg">Popular</div>
                  <h4 className="text-[13px] font-bold uppercase tracking-widest text-[#6366F1] flex items-center gap-2">
                    <RefreshCcw size={14} /> 3-Month Plan
                  </h4>
                  <div className="flex flex-col gap-3">
                    <Input
                      label="Price"
                      type="number"
                      value={stripeQuarterly}
                      onValueChange={setStripeQuarterly}
                      startContent={<span className="text-muted-foreground font-bold">$</span>}
                      classNames={{ inputWrapper: "bg-background border border-[#6366F1]/20 focus-within:border-[#6366F1]" }}
                    />
                    <Input
                      label="Discount"
                      type="number"
                      value={stripeQuarterlyDiscount}
                      onValueChange={setStripeQuarterlyDiscount}
                      endContent={<Percent size={14} className="text-muted-foreground" />}
                      classNames={{ inputWrapper: "bg-background border border-[#6366F1]/20 focus-within:border-[#6366F1]" }}
                    />
                  </div>
                </div>

                {/* Annual */}
                <div className="flex flex-col gap-4 rounded-xl border border-white/5 bg-white/5 p-5">
                  <h4 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <RefreshCcw size={14} /> Annual Plan
                  </h4>
                  <div className="flex flex-col gap-3">
                    <Input
                      label="Price"
                      type="number"
                      value={stripeAnnual}
                      onValueChange={setStripeAnnual}
                      startContent={<span className="text-muted-foreground font-bold">$</span>}
                      classNames={{ inputWrapper: "bg-background border border-white/10 focus-within:border-[#6366F1]" }}
                    />
                    <Input
                      label="Discount"
                      type="number"
                      value={stripeAnnualDiscount}
                      onValueChange={setStripeAnnualDiscount}
                      endContent={<Percent size={14} className="text-muted-foreground" />}
                      classNames={{ inputWrapper: "bg-background border border-white/10 focus-within:border-[#6366F1]" }}
                    />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Paystack Pricing */}
          <Card className="border border-[#0EA5E9]/20 bg-background/50 shadow-[0_0_20px_rgba(14,165,233,0.05)] backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0EA5E9]/10 blur-[50px] pointer-events-none" />
            <CardHeader className="flex items-center gap-3 px-6 pt-6 pb-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#0EA5E9]/20 text-[#0EA5E9]">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-foreground">Paystack Pricing (NGN)</h3>
                <p className="text-[12px] font-medium text-muted-foreground">Localized African pricing</p>
              </div>
            </CardHeader>
            <Divider className="bg-white/5" />
            <CardBody className="px-6 py-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Monthly */}
                <div className="flex flex-col gap-4 rounded-xl border border-white/5 bg-white/5 p-5">
                  <h4 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <RefreshCcw size={14} /> Monthly Plan
                  </h4>
                  <Input
                    label="Price"
                    type="number"
                    value={paystackMonthly}
                    onValueChange={setPaystackMonthly}
                    startContent={<span className="text-muted-foreground font-bold">₦</span>}
                    classNames={{ inputWrapper: "bg-background border border-white/10 focus-within:border-[#0EA5E9]" }}
                  />
                </div>

                {/* Quarterly */}
                <div className="flex flex-col gap-4 rounded-xl border border-[#0EA5E9]/30 bg-[#0EA5E9]/5 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#0EA5E9] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-bl-lg">Popular</div>
                  <h4 className="text-[13px] font-bold uppercase tracking-widest text-[#0EA5E9] flex items-center gap-2">
                    <RefreshCcw size={14} /> 3-Month Plan
                  </h4>
                  <div className="flex flex-col gap-3">
                    <Input
                      label="Price"
                      type="number"
                      value={paystackQuarterly}
                      onValueChange={setPaystackQuarterly}
                      startContent={<span className="text-muted-foreground font-bold">₦</span>}
                      classNames={{ inputWrapper: "bg-background border border-[#0EA5E9]/20 focus-within:border-[#0EA5E9]" }}
                    />
                    <Input
                      label="Discount"
                      type="number"
                      value={paystackQuarterlyDiscount}
                      onValueChange={setPaystackQuarterlyDiscount}
                      endContent={<Percent size={14} className="text-muted-foreground" />}
                      classNames={{ inputWrapper: "bg-background border border-[#0EA5E9]/20 focus-within:border-[#0EA5E9]" }}
                    />
                  </div>
                </div>

                {/* Annual */}
                <div className="flex flex-col gap-4 rounded-xl border border-white/5 bg-white/5 p-5">
                  <h4 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <RefreshCcw size={14} /> Annual Plan
                  </h4>
                  <div className="flex flex-col gap-3">
                    <Input
                      label="Price"
                      type="number"
                      value={paystackAnnual}
                      onValueChange={setPaystackAnnual}
                      startContent={<span className="text-muted-foreground font-bold">₦</span>}
                      classNames={{ inputWrapper: "bg-background border border-white/10 focus-within:border-[#0EA5E9]" }}
                    />
                    <Input
                      label="Discount"
                      type="number"
                      value={paystackAnnualDiscount}
                      onValueChange={setPaystackAnnualDiscount}
                      endContent={<Percent size={14} className="text-muted-foreground" />}
                      classNames={{ inputWrapper: "bg-background border border-white/10 focus-within:border-[#0EA5E9]" }}
                    />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
