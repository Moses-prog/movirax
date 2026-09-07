'use client';

import React, { useState } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { addToast, Input, Button } from '@heroui/react';
import { Film } from 'lucide-react';
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
    <div className="grid gap-10 md:grid-cols-2 max-w-4xl mx-auto px-4">
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

  const isAnnual = plan.interval === 'annual';
  const themeColor = isAnnual ? 'bg-[#ffcc00]' : 'bg-[#e50914]';
  const textColor = isAnnual ? 'text-black' : 'text-white';
  const mutedTextColor = isAnnual ? 'text-black/70' : 'text-white/70';
  const inputBg = isAnnual ? 'bg-black/10' : 'bg-black/20';

  return (
    <div className={`relative overflow-hidden flex flex-col h-full rounded-sm shadow-2xl ${themeColor} transform transition-transform hover:scale-[1.02]`}>
      
      {/* Left Film Edge */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#111] flex flex-col items-center py-2 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.5)]">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="w-4 h-3 bg-white/10 rounded-[2px] mb-2 flex-shrink-0 shadow-inner" />
        ))}
      </div>
      
      {/* Right Film Edge */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-[#111] flex flex-col items-center py-2 z-10 shadow-[-2px_0_10px_rgba(0,0,0,0.5)]">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="w-4 h-3 bg-white/10 rounded-[2px] mb-2 flex-shrink-0 shadow-inner" />
        ))}
      </div>

      <div className={`px-12 pt-10 pb-8 flex-grow flex flex-col z-0 ${textColor}`}>
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          {isAnnual && (
             <div className="bg-black text-[#ffcc00] text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-sm mb-4">
               Director's Cut
             </div>
          )}
          <h3 className="text-3xl font-black uppercase tracking-widest mb-2 font-mono drop-shadow-md">
            {plan.name}
          </h3>
          <div className="flex items-baseline justify-center gap-1 drop-shadow-md">
            <span className="text-5xl font-black font-mono">
              {plan.currency === 'NGN' ? '₦' : '$'}{finalPrice}
            </span>
            <span className={`text-sm font-bold uppercase ${mutedTextColor}`}>/{plan.interval}</span>
          </div>
        </div>
        
        {/* Features */}
        <ul className={`flex flex-col gap-4 mb-8 flex-grow font-bold uppercase text-[12px] tracking-wide ${mutedTextColor}`}>
          <li className="flex items-center justify-center gap-2">
            <Film size={16} className={textColor} /> Unlimited Movies
          </li>
          <li className="flex items-center justify-center gap-2">
            <Film size={16} className={textColor} /> No Commercials
          </li>
          <li className="flex items-center justify-center gap-2">
            <Film size={16} className={textColor} /> All Devices
          </li>
        </ul>

        {/* Receipt / Breakdown */}
        <div className={`${inputBg} rounded-sm p-4 mb-6 flex flex-col gap-3 font-mono text-xs ${textColor}`}>
          <div className="flex justify-between items-center">
            <span className="opacity-80">BOX OFFICE</span>
            <span className="font-bold">{plan.currency === 'NGN' ? '₦' : '$'}{plan.price}</span>
          </div>

          {hasAdminDiscount && (
            <div className="flex justify-between items-center">
              <span className="opacity-80">STUDIO DISCOUNT</span>
              <span className="font-bold">-{plan.discount}%</span>
            </div>
          )}

          {appliedDiscount && (
            <div className="flex justify-between items-center">
              <span className="opacity-80">PROMO APPLIED</span>
              <span className="font-bold">-{appliedDiscount}%</span>
            </div>
          )}

          <div className="border-t border-current opacity-20 my-1" />
          
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold">TOTAL DUE</span>
            <span className="font-black">{plan.currency === 'NGN' ? '₦' : '$'}{finalPrice}</span>
          </div>
        </div>

        {/* Promo */}
        <div className="flex gap-2 mb-6">
          <Input 
            placeholder="PROMO CODE" 
            value={promoCode} 
            onValueChange={setPromoCode}
            size="sm"
            isDisabled={!!appliedDiscount}
            classNames={{ inputWrapper: `${inputBg} border-transparent ${textColor} font-mono uppercase rounded-sm` }}
          />
          {appliedDiscount ? (
            <Button 
              size="sm" 
              className="bg-black text-white font-bold uppercase rounded-sm"
              onPress={() => {
                setAppliedDiscount(null);
                setPromoCode('');
                addToast({ title: 'Promo code removed', color: 'default' });
              }}
            >
              DEL
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="bg-black text-white font-bold uppercase rounded-sm"
              onPress={handleApplyPromo}
              isLoading={checkingPromo}
              isDisabled={!promoCode}
            >
              ADD
            </Button>
          )}
        </div>

        <Button 
          className="w-full font-black text-lg h-14 bg-black text-white uppercase tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform rounded-sm"
          onPress={() => {
            if (!user) {
              addToast({ title: 'Please login to subscribe', color: 'danger' });
              router.push('/auth'); 
              return;
            }
            handleFlutterPayment({
              callback: (response) => onSuccess(response, plan),
              onClose: () => {
                addToast({ title: 'Payment cancelled', color: 'default' });
              },
            });
          }}
        >
          Get Ticket
        </Button>
      </div>
    </div>
  );
}
