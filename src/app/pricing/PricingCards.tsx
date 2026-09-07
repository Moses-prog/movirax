'use client';

import React, { useState } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { addToast, Input, Button } from '@heroui/react';
import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { validatePromoCode } from '@/lib/promotions';

const FilmStripPattern = ({ colorClass, bgClass }: { colorClass: string, bgClass: string }) => (
  <svg 
    className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${colorClass}`} 
    viewBox="0 0 400 400" 
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="rotate(-20 200 200) translate(-50, -50)" opacity="0.15">
      <path d="M-200,150 Q200,0 600,150 T1000,150" fill="none" stroke="currentColor" strokeWidth="80" />
      <path d="M-200,115 Q200,-35 600,115 T1000,115" fill="none" className={bgClass} strokeWidth="12" strokeDasharray="10 15" />
      <path d="M-200,185 Q200,35 600,185 T1000,185" fill="none" className={bgClass} strokeWidth="12" strokeDasharray="10 15" />
    </g>

    <g transform="rotate(35 200 200) translate(0, 100)" opacity="0.1">
      <path d="M-200,250 Q200,350 600,250 T1000,250" fill="none" stroke="currentColor" strokeWidth="60" />
      <path d="M-200,225 Q200,325 600,225 T1000,225" fill="none" className={bgClass} strokeWidth="8" strokeDasharray="8 12" />
      <path d="M-200,275 Q200,375 600,275 T1000,275" fill="none" className={bgClass} strokeWidth="8" strokeDasharray="8 12" />
    </g>
  </svg>
);

export default function PricingCards({ plans, user }: { plans: any[], user: any }) {
  const router = useRouter();

  const handlePaymentSuccess = async (response: any, plan: any) => {
    addToast({ title: 'Payment Processing...', color: 'primary' });
    
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
    <div className="flex flex-col md:flex-row flex-wrap justify-center items-stretch gap-8 max-w-6xl mx-auto px-4">
      {plans.map((plan) => (
        <div key={plan.id} className="w-full md:w-[380px]">
          <PlanCard plan={plan} user={user} onSuccess={handlePaymentSuccess} router={router} />
        </div>
      ))}
    </div>
  );
}

function PlanCard({ plan, user, onSuccess, router }: { plan: any, user: any, onSuccess: any, router: any }) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [checkingPromo, setCheckingPromo] = useState(false);

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
  const themeColor = isAnnual ? 'text-yellow-500' : 'text-red-500';
  const buttonBg = isAnnual ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-red-600 text-white hover:bg-red-500';
  const tagBg = isAnnual ? 'bg-yellow-500 text-black' : 'bg-red-600 text-white';

  return (
    <div className={`relative overflow-hidden flex flex-col h-full rounded-2xl shadow-xl bg-zinc-900 border border-white/10 transition-transform hover:scale-[1.02]`}>
      
      {/* Cool Film Ribbon SVG Texture */}
      <FilmStripPattern colorClass={themeColor} bgClass="stroke-zinc-900" />

      <div className="px-8 pt-10 pb-8 flex-grow flex flex-col z-10 relative">
        <div className="flex flex-col items-start mb-6">
          {isAnnual && (
             <div className={`${tagBg} text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 shadow-lg`}>
               Best Value
             </div>
          )}
          <h3 className="text-2xl font-bold tracking-tight mb-2 text-white">
            {plan.name}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white">
              {plan.currency === 'NGN' ? '₦' : '$'}{finalPrice}
            </span>
            <span className="text-sm font-medium text-zinc-400">/{plan.interval}</span>
          </div>
        </div>
        
        <ul className="flex flex-col gap-4 mb-8 flex-grow font-medium text-sm text-zinc-300">
          <li className="flex items-center gap-3">
            <CheckCircle2 size={16} className={themeColor} /> Unlimited Movies & TV Shows
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle2 size={16} className={themeColor} /> Ad-Free Experience
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle2 size={16} className={themeColor} /> Watch on any device
          </li>
        </ul>

        <div className="bg-black/40 rounded-xl p-4 mb-6 flex flex-col gap-3 text-sm text-zinc-300 border border-white/5 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <span className="opacity-80">Original Price</span>
            <span className="font-medium text-white">{plan.currency === 'NGN' ? '₦' : '$'}{plan.price}</span>
          </div>

          {hasAdminDiscount && (
            <div className="flex justify-between items-center text-red-400">
              <span className="opacity-80">Special Discount</span>
              <span className="font-medium">-{plan.discount}%</span>
            </div>
          )}

          {appliedDiscount && (
            <div className="flex justify-between items-center text-green-400">
              <span className="opacity-80">Promo Applied</span>
              <span className="font-medium">-{appliedDiscount}%</span>
            </div>
          )}

          <div className="border-t border-white/10 my-1" />
          
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-white">Total Due</span>
            <span className="font-bold text-white">{plan.currency === 'NGN' ? '₦' : '$'}{finalPrice}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Input 
            placeholder="Have a promo code?" 
            value={promoCode} 
            onValueChange={setPromoCode}
            size="sm"
            isDisabled={!!appliedDiscount}
            classNames={{ inputWrapper: "bg-black/40 border border-white/10 text-white uppercase rounded-lg" }}
          />
          {appliedDiscount ? (
            <Button 
              size="sm" 
              className="bg-zinc-800 text-white font-medium rounded-lg"
              onPress={() => {
                setAppliedDiscount(null);
                setPromoCode('');
                addToast({ title: 'Promo code removed', color: 'default' });
              }}
            >
              Remove
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="bg-zinc-800 text-white font-medium rounded-lg"
              onPress={handleApplyPromo}
              isLoading={checkingPromo}
              isDisabled={!promoCode}
            >
              Apply
            </Button>
          )}
        </div>

        <Button 
          className={`w-full font-bold text-base h-12 shadow-xl rounded-xl ${buttonBg}`}
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
          Subscribe Now
        </Button>
      </div>
    </div>
  );
}
