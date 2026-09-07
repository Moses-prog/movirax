import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | MoviraX',
};

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-foreground tracking-tight">Cookie Policy</h1>
      
      <div className="space-y-8 text-muted-foreground leading-relaxed text-[15px] sm:text-base">
        <section>
          <p>
            This Cookie Policy explains how MoviraX uses cookies and similar tracking technologies to recognize you 
            when you visit our platform. It explains what these technologies are, why we use them, and your rights 
            to control our use of them.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">1. What are cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
            Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, 
            as well as to provide reporting information.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">2. Why do we use cookies?</h2>
          <p>
            We use first-party and third-party cookies for several reasons. Some cookies are required for technical 
            reasons in order for our platform to operate, and we refer to these as "essential" or "strictly necessary" cookies. 
            Specifically, we use cookies for:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Authentication:</strong> Keeping you logged in securely (e.g., Supabase authentication sessions).</li>
            <li><strong>Preferences:</strong> Remembering your UI preferences, such as Dark Mode or Light Mode.</li>
            <li><strong>Analytics:</strong> Understanding how users interact with our platform to improve performance and features.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">3. Types of Cookies We Use</h2>
          <p className="mb-4">
            <strong>Essential Cookies:</strong> These are strictly necessary to provide you with services available through 
            our platform. Because these cookies are strictly necessary to deliver the website to you, you cannot refuse them 
            without impacting how our site functions.
          </p>
          <p className="mb-4">
            <strong>Performance and Analytics Cookies:</strong> These cookies collect information that is used in aggregate form 
            to help us understand how our platform is being used or how effective our marketing campaigns are.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">4. How can I control cookies?</h2>
          <p>
            You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls 
            to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access 
            to some functionality and areas of our website may be restricted (such as logging in).
          </p>
        </section>

        <div className="pt-8 border-t border-border mt-16 text-sm text-muted-foreground">
          Last updated: September 2026
        </div>
      </div>
    </div>
  );
}
