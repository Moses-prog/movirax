import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | MoviraX',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-foreground tracking-tight">Privacy Policy</h1>
      
      <div className="space-y-8 text-muted-foreground leading-relaxed text-[15px] sm:text-base">
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">1. Data We Collect</h2>
          <p>
            When you use MoviraX, we collect information you provide directly to us (such as account details, 
            email, and name) as well as data automatically collected through your use of the platform 
            (such as movies you track, watchlists, and viewing history).
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">2. How We Use Your Data</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Provide, maintain, and improve our cinematic tracking services.</li>
            <li>Process transactions and send related information (e.g., subscription receipts).</li>
            <li>Personalize your experience and deliver personalized recommendations.</li>
            <li>Communicate with you regarding updates, security alerts, and support messages.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">3. Data Sharing</h2>
          <p>
            We do not sell your personal data. We may share information with trusted third-party service 
            providers who assist us in operating our platform (such as our payment gateway, Flutterwave, 
            or our database provider, Supabase). All third-party providers are strictly bound to secure 
            your data and only use it for the intended operational purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">4. Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information. 
            However, no method of transmission over the internet or electronic storage is 100% secure, 
            and we cannot guarantee absolute security. Payment details are never stored on our servers; 
            they are handled entirely by our PCI-compliant payment processors.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information at any time via 
            your account settings. If you wish to permanently delete your account and all associated 
            data, you can contact our support team or use the built-in deletion tools.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">6. Changes to this Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make significant changes, we will 
            notify you through the platform or by email prior to the changes taking effect.
          </p>
        </section>

        <div className="pt-8 border-t border-border mt-16 text-sm text-muted-foreground">
          Last updated: September 2026
        </div>
      </div>
    </div>
  );
}
