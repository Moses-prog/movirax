'use client';

import { motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

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

export default function PricingSection() {
  const [lowestPrice, setLowestPrice] = useState('4.99');
  const [currency, setCurrency] = useState('$');
  const [interval, setInterval] = useState('mo');

  useEffect(() => {
    async function loadPlans() {
      const supabase = createClient();
      const { data } = await supabase.from('pricing_plans').select('*').eq('gateway', 'flutterwave').order('price').limit(1).single();
      if (data) {
        const hasDiscount = data.discount && data.discount > 0;
        const finalPrice = hasDiscount 
          ? (data.price - (data.price * (data.discount / 100))).toFixed(2) 
          : data.price.toString();
        
        setLowestPrice(finalPrice);
        setCurrency(data.currency === 'NGN' ? '₦' : '$');
        setInterval(data.interval === 'monthly' ? 'mo' : (data.interval === 'annual' ? 'yr' : data.interval));
      }
    }
    loadPlans();
  }, []);

  return (
    <section className="py-32 px-4 lg:px-8 max-w-[1200px] mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-foreground">Choose Your Journey</h2>
        <p className="text-xl text-muted-foreground">Unlock the full potential of your cinematic universe.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
        {/* Free Tier */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full md:w-[380px] bg-background border border-border rounded-2xl p-10 flex flex-col shadow-sm"
        >
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Basic</h3>
            <div className="text-4xl font-black text-foreground mb-2">Free</div>
            <p className="text-muted-foreground text-sm">Everything you need to start tracking.</p>
          </div>
          
          <ul className="space-y-4 mb-10 flex-1">
            <li className="flex items-center gap-3 text-sm text-foreground"><CheckCircle2 className="w-5 h-5 text-default-400" /> Basic Watchlist Management</li>
            <li className="flex items-center gap-3 text-sm text-foreground"><CheckCircle2 className="w-5 h-5 text-default-400" /> Standard Quality Posters</li>
            <li className="flex items-center gap-3 text-sm text-foreground"><CheckCircle2 className="w-5 h-5 text-default-400" /> Community Access</li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground"><X className="w-5 h-5" /> Advanced Analytics</li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground"><X className="w-5 h-5" /> Ad-Free Experience</li>
          </ul>

          <Link href="/auth?form=register" className="block w-full">
            <button className="w-full py-3 bg-default-100 hover:bg-default-200 text-foreground rounded-xl font-medium transition-colors border border-border">
              Get Started
            </button>
          </Link>
        </motion.div>

        {/* Premium Tier */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1 }}
          className="w-full md:w-[380px] relative overflow-hidden flex flex-col h-full rounded-2xl shadow-xl bg-zinc-900 border border-white/10 transition-transform hover:scale-[1.02]"
        >
          {/* SVG Ribbon Texture */}
          <FilmStripPattern colorClass="text-red-500" bgClass="stroke-zinc-900" />

          <div className="px-10 pt-10 pb-8 flex-grow flex flex-col z-10 relative">
            <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-bl-xl rounded-tr-2xl shadow-lg">
              Most Popular
            </div>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">MoviraX Pro</h3>
              <div className="flex items-baseline gap-1 text-white mb-2">
                <span className="text-4xl font-black">{currency}{lowestPrice}</span>
                <span className="text-sm font-medium text-zinc-400">/{interval}</span>
              </div>
              <p className="text-zinc-400 text-sm">For the absolute cinema purist.</p>
            </div>
            
            <ul className="flex flex-col gap-4 mb-10 flex-grow font-medium text-sm text-zinc-300">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-red-500" /> Unlimited Watchlists & Tags</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-red-500" /> 4K Resolution Posters</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-red-500" /> Deep Movie Analytics</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-red-500" /> 100% Ad-Free Experience</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-red-500" /> Early Access to Features</li>
            </ul>

            <Link href="/pricing" className="block w-full mt-auto">
              <button className="w-full py-3 bg-red-600 text-white hover:bg-red-500 rounded-xl font-bold transition-colors shadow-lg">
                View All Plans
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
