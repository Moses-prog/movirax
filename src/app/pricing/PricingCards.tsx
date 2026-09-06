'use client';

import React from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { Card, CardBody, CardHeader, Button, Divider, addToast } from '@heroui/react';
import { CheckCircle2, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
        router.refresh();
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
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxx-X',
    tx_ref: \movirax-\-\\,
    amount: plan.price,
    currency: plan.currency,
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.email || '',
      phone_number: '',
      name: user?.name || '',
    },
    customizations: {
      title: \MoviraX \\,
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
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-3xl font-black text-foreground">
            {plan.currency === 'NGN' ? '₦' : '$'}{plan.price}
          </span>
          <span className="text-sm font-medium text-muted-foreground">/{plan.interval}</span>
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

        <Button 
          color="danger" 
          className="w-full font-bold shadow-md hover:scale-[1.02] transition-transform"
          onPress={() => {
            if (!user) {
              addToast({ title: 'Please login to subscribe', color: 'danger' });
              // router.push('/login'); 
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
