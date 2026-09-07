import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | MoviraX',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-foreground tracking-tight">Terms of Service</h1>
      
      <div className="space-y-8 text-muted-foreground leading-relaxed text-[15px] sm:text-base">
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
          <p>
            Welcome to MoviraX. By accessing or using our platform, you agree to be bound by these Terms of Service. 
            Please read them carefully before using our services. MoviraX provides a premium cinematic 
            tracking, analytics, and collection platform designed for movie enthusiasts.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">2. User Accounts</h2>
          <p>
            To access certain features of MoviraX, you must register for an account. You agree to provide accurate, 
            current, and complete information during the registration process. You are solely responsible for safeguarding 
            your password and for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">3. Subscriptions & Billing</h2>
          <p>
            MoviraX offers premium subscription tiers ("MoviraX Pro"). By selecting a premium tier, you agree to pay the 
            subscription fees indicated. Payments are securely processed via our payment partners (e.g., Flutterwave). 
            Your subscription will automatically renew unless canceled prior to the end of the current billing cycle.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">4. Acceptable Use Policy</h2>
          <p>
            You agree to use MoviraX only for lawful purposes. You must not:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Attempt to reverse engineer, decompile, or hack the platform.</li>
            <li>Use automated scripts, spiders, or scrapers to collect data from MoviraX.</li>
            <li>Upload or share content that is malicious, offensive, or violates intellectual property rights.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
          <p>
            The MoviraX platform, its design, structure, and original content are owned by MoviraX and are protected by 
            copyright, trademark, and other intellectual property laws. Movie posters, titles, and metadata are provided 
            via third-party APIs (e.g., TMDB) and remain the property of their respective owners.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">6. Termination</h2>
          <p>
            We may terminate or suspend your access to the service immediately, without prior notice or liability, 
            for any reason whatsoever, including without limitation if you breach the Terms. You may cancel your account 
            at any time through your account settings.
          </p>
        </section>

        <div className="pt-8 border-t border-border mt-16 text-sm text-muted-foreground">
          Last updated: September 2026
        </div>
      </div>
    </div>
  );
}
