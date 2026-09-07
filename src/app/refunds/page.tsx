import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | MoviraX',
};

export default function RefundsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-foreground tracking-tight">Refund & Cancellation Policy</h1>
      
      <div className="space-y-8 text-muted-foreground leading-relaxed text-[15px] sm:text-base">
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">1. Digital Subscriptions</h2>
          <p>
            MoviraX provides premium digital subscription services ("MoviraX Pro"). Because our service grants 
            immediate access to digital features, content, and analytics, all subscription purchases are final 
            and non-refundable, except as expressly stated in this policy or as required by applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">2. Subscription Cancellations</h2>
          <p>
            You may cancel your MoviraX Pro subscription at any time through your account dashboard or billing settings. 
            When you cancel a subscription, you will continue to have access to the premium features until the end 
            of your current billing cycle (e.g., the end of the month for monthly plans, or the end of the year for annual plans). 
            We do not provide prorated refunds for mid-cycle cancellations.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">3. Accidental Purchases & Exceptions</h2>
          <p>
            If you believe your account was charged accidentally or there was fraudulent activity, please contact our 
            billing support team within 7 days of the charge. We review these requests on a case-by-case basis. 
            Issuing a refund is at the sole discretion of MoviraX and does not obligate us to issue the same 
            refund in the future.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">4. Payment Failures & Account Suspension</h2>
          <p>
            If a subscription payment fails, your premium access will be temporarily suspended until the payment issue 
            is resolved. No partial refunds or credits will be issued for periods where the account was suspended due 
            to payment failures.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Refund Policy, please contact our support team before making a purchase.
          </p>
        </section>

        <div className="pt-8 border-t border-border mt-16 text-sm text-muted-foreground">
          Last updated: September 2026
        </div>
      </div>
    </div>
  );
}
