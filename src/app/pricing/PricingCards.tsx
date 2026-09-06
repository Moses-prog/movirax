'use client';

import React, { useState } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { Card, CardBody, CardHeader, Button, Divider, addToast, Input } from '@heroui/react';
import { CheckCircle2, Crown, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { validatePromoCode } from '@/lib/promotions';

export default function PricingCards({ plans, user }: { plans: any[], user: any }) {
  const router = useRouter();

  const handlePaymentSuccess = async (response: any, plan: any) => {
    addToast({ title: 'Payment Processing...', color: 'primary' });
    
    // Call our backend API to verify the payment
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction_id: response.transaction_id,
          tx_ref: response.tx_ref,
          plan_id: plan.id,
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        addToast({ title: 'Subscription Activated!', color: 'success' });
        closePaymentModal();
        router.push('/profile');
      } else {
        addToast({ title: data.error || 'Payment verification failed', color: 'danger' });
      }
    } catch (e) {
      addToast({ title: 'An error occurred', color: 'danger' });
    }
  };

  if (!plans.length) {
    return <div className="text-center text-muted-foreground">No plans currently available.</div>;
  }

  return (
    <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} user={user} onSuccess={handlePaymentSuccess} router={router} />
      ))}
    </div>
  );
}

function PlanCard({ plan, user, onSuccess, router }: { plan: any, user: any, onSuccess: any, router: any }) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [checkingPromo, setCheckingPromo] = useState(false);

  // Calculate final discounted price
  const hasAdminDiscount = plan.discount && plan.discount > 0;
  
  let baseAmount = plan.price;
  if (hasAdminDiscount) {
    baseAmount = baseAmount - (baseAmount * (plan.discount / 100));
  }
  if (appliedDiscount) {
    baseAmount = baseAmount - (baseAmount * (appliedDiscount / 100));
  }
  const finalPrice = baseAmount.toFixed(2);
  const hasAnyDiscount = hasAdminDiscount || appliedDiscount;

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setCheckingPromo(true);
    const res = await validatePromoCode(promoCode);
    if (res.valid && res.discount) {
      setAppliedDiscount(res.discount);
      addToast({ title: `Promo applied: ${res.discount}% off!`, color: 'success' });
    } else {
      addToast({ title: res.error || 'Invalid code', color: 'danger' });
      setAppliedDiscount(null);
    }
    setCheckingPromo(false);
  };

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxx-X',
    tx_ref: `movirax-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    amount: Number(finalPrice),
    currency: plan.currency,
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.email || '',
      phone_number: '',
      name: user?.name || '',
    },
    customizations: {
      title: `MoviraX ${plan.name}`,
      description: 'Subscription Payment',
      logo: 'https://movirax.vercel.app/icons/android/android-launchericon-192-192.png',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <Card className="border border-white/10 bg-background/50 backdrop-blur-xl relative overflow-hidden h-full flex flex-col">
      <CardHeader className="flex flex-col items-start gap-2 px-6 pt-8 pb-4">
        {plan.interval === 'annual' && (
          <div className="absolute top-0 right-0 bg-danger text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
            Best Value
          </div>
        )}
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          {plan.name} <Crown size={18} className="text-yellow-500" />
        </h3>
        <div className="flex flex-col items-start gap-0 mt-2">
          {hasAnyDiscount && (
            <span className="text-sm font-bold text-muted-foreground line-through opacity-70">
              {plan.currency === 'NGN' ? '₦' : '$'}{plan.price}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-foreground">
              {plan.currency === 'NGN' ? '₦' : '$'}{finalPrice}
            </span>
            <span className="text-sm font-medium text-muted-foreground">/{plan.interval}</span>
          </div>
        </div>
      </CardHeader>
      
      <Divider className="bg-white/5" />
      
      <CardBody className="px-6 py-6 flex-grow flex flex-col">
        <ul className="flex flex-col gap-4 mb-8 flex-grow">
          <li className="flex items-center gap-3 text-sm text-foreground">
            <CheckCircle2 size={16} className="text-danger" /> Unlimited Movies & TV Shows
          </li>
          <li className="flex items-center gap-3 text-sm text-foreground">
            <CheckCircle2 size={16} className="text-danger" /> Ad-Free Experience
          </li>
          <li className="flex items-center gap-3 text-sm text-foreground">
            <CheckCircle2 size={16} className="text-danger" /> Watch on any device
          </li>
        </ul>

        <div className="flex gap-2 mb-6">
          <Input 
            placeholder="Promo code" 
            value={promoCode} 
            onValueChange={setPromoCode}
            size="sm"
            startContent={<Tag size={14} className="text-muted-foreground" />}
            classNames={{ inputWrapper: "bg-white/5 border border-white/10" }}
          />
          <Button 
            size="sm" 
            variant="flat" 
            onPress={handleApplyPromo}
            isLoading={checkingPromo}
            isDisabled={!promoCode || !!appliedDiscount}
          >
            Apply
          </Button>
        </div>

        <Button 
          color="danger" 
          className="w-full font-bold shadow-md hover:scale-[1.02] transition-transform"
          onPress={() => {
            if (!user) {
              addToast({ title: 'Please login to subscribe', color: 'danger' });
              router.push('/auth'); 
              return;
            }
            handleFlutterPayment({
              callback: (response) => onSuccess(response, plan),
              onClose: () => {},
            });
          }}
        >
          Subscribe Now
        </Button>
      </CardBody>
    </Card>
  );
}
