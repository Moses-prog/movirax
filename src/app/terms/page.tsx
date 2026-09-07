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
            tracking, analytics, and aggregation platform designed for movie enthusiasts. We operate strictly as an indexer and aggregator of third-party streaming APIs and do not host any video files on our own servers.
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
            For information regarding refunds, please review our <a href="/refunds" className="text-foreground underline">Refund Policy</a>.
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
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">6. DISCLAIMER OF WARRANTIES</h2>
          <p className="uppercase text-xs sm:text-sm font-medium tracking-wide">
            The service is provided on an "as is" and "as available" basis. MoviraX expressly disclaims all warranties 
            of any kind, whether express or implied, including, but not limited to, the implied warranties of merchantability, 
            fitness for a particular purpose, and non-infringement. We make no warranty that the service will meet your 
            requirements, be uninterrupted, timely, secure, or error-free.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">7. LIMITATION OF LIABILITY</h2>
          <p className="uppercase text-xs sm:text-sm font-medium tracking-wide">
            In no event shall MoviraX, its directors, employees, partners, agents, suppliers, or affiliates, be liable 
            for any indirect, incidental, special, consequential, or punitive damages, including without limitation, 
            loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of 
            or inability to access or use the service; (ii) any conduct or content of any third party on the service; 
            (iii) any content obtained from the service; and (iv) unauthorized access, use, or alteration of your 
            transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">8. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless MoviraX and its licensee and licensors, and their employees, 
            contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, 
            liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising 
            out of a) your use and access of the Service, by you or any person using your account and password; b) a breach 
            of these Terms, or c) Content posted on the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">9. Governing Law & Dispute Resolution</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which MoviraX operates, 
            without regard to its conflict of law provisions. Any dispute arising from these Terms or the use of the Service 
            shall be subject to binding arbitration, rather than in court, except that you may assert claims in small claims court 
            if your claims qualify. You agree to waive any right to participate in a class action lawsuit or class-wide arbitration.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">10. Termination</h2>
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
