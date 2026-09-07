import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DMCA & Copyright Policy | MoviraX',
};

export default function DMCAPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-foreground tracking-tight">DMCA & Copyright Policy</h1>
      
      <div className="space-y-8 text-muted-foreground leading-relaxed text-[15px] sm:text-base">
        <section>
          <p>
            MoviraX ("we", "us", or "our") respects the intellectual property rights of others and expects its users to do the same. 
            It is our policy, in appropriate circumstances and at our discretion, to disable and/or terminate the accounts 
            of users who repeatedly infringe or are repeatedly charged with infringing the copyrights or other intellectual 
            property rights of others.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">1. The Digital Millennium Copyright Act</h2>
          <p>
            In accordance with the Digital Millennium Copyright Act of 1998 (the "DMCA"), the text of which may be found on the 
            U.S. Copyright Office website, MoviraX will respond expeditiously to claims of copyright infringement committed 
            using the MoviraX website that are reported to our Designated Copyright Agent.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">2. Notice of Infringement</h2>
          <p>
            If you are a copyright owner, or are authorized to act on behalf of one, please report alleged copyright infringements 
            taking place on or through the site by completing a DMCA Notice of Alleged Infringement and delivering it to our 
            Designated Copyright Agent. Upon receipt of a valid notice, we will take whatever action we deem appropriate, 
            including removal of the challenged material from the site.
          </p>
          <p className="mt-4 font-semibold">To file a DMCA notice, you must provide:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>A physical or electronic signature of a person authorized to act on behalf of the owner of the copyright.</li>
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Identification of the material that is claimed to be infringing and where it is located on our platform.</li>
            <li>Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and email.</li>
            <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized.</li>
            <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the copyright owner.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">3. External Content & APIs</h2>
          <p>
            MoviraX utilizes third-party APIs (such as The Movie Database - TMDB) to display movie metadata, posters, and trailers. 
            MoviraX does not host this media content on our own servers. If you believe an image or trailer provided by a third-party 
            API infringes your copyright, we recommend sending your DMCA notice directly to the source API provider (e.g., TMDB or YouTube).
          </p>
        </section>

        <div className="pt-8 border-t border-border mt-16 text-sm text-muted-foreground">
          Last updated: September 2026
        </div>
      </div>
    </div>
  );
}
