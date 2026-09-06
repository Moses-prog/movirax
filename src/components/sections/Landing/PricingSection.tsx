'use client';

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

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
    <section className="py-32 px-4 lg:px-8 max-w-[1200px] mx-auto transition-colors">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-4 text-gray-900 dark:text-white transition-colors">Choose Your Journey</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 transition-colors">Unlock the full potential of your cinematic universe.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Tier */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2.5rem] p-10 flex flex-col shadow-sm dark:shadow-none transition-colors"
        >
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Basic</h3>
            <div className="text-4xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">Free</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">Everything you need to start tracking.</p>
          </div>
          
          <ul className="space-y-4 mb-10 flex-1">
            <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 transition-colors">
              <Check className="w-5 h-5 text-gray-400 dark:text-gray-500" /> <span>Basic Watchlist Management</span>
            </li>
            <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 transition-colors">
              <Check className="w-5 h-5 text-gray-400 dark:text-gray-500" /> <span>Standard Quality Posters</span>
            </li>
            <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 transition-colors">
              <Check className="w-5 h-5 text-gray-400 dark:text-gray-500" /> <span>Community Access</span>
            </li>
            <li className="flex items-center space-x-3 text-gray-400 dark:text-gray-600 transition-colors">
              <X className="w-5 h-5" /> <span>Advanced Analytics</span>
            </li>
            <li className="flex items-center space-x-3 text-gray-400 dark:text-gray-600 transition-colors">
              <X className="w-5 h-5" /> <span>Ad-Free Experience</span>
            </li>
          </ul>

          <Link href="/auth?form=register" className="block w-full">
            <button className="w-full py-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-2xl font-semibold transition-colors border border-gray-200 dark:border-white/10">
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
          className="relative group"
        >
          {/* Animated Glow Border */}
          <div className="absolute -inset-[2px] bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-[2.5rem] opacity-70 group-hover:opacity-100 blur-sm transition-opacity duration-500 animate-pulse" />
          
          <div className="relative h-full bg-white dark:bg-[#121212] rounded-[2.5rem] p-10 flex flex-col shadow-xl dark:shadow-none transition-colors">
            <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-bl-2xl rounded-tr-[2.5rem]">
              Most Popular
            </div>
            
            <div className="mb-8 mt-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Movira X Premium</h3>
              <div className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 dark:from-red-400 dark:to-yellow-400 mb-2">
                {currency}{lowestPrice}<span className="text-lg text-gray-500 font-normal">/{interval}</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">For the absolute cinema purist.</p>
            </div>
            
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center space-x-3 text-gray-900 dark:text-white transition-colors">
                <Check className="w-5 h-5 text-red-500" /> <span>Unlimited Watchlists & Tags</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-900 dark:text-white transition-colors">
                <Check className="w-5 h-5 text-red-500" /> <span>4K Resolution Posters</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-900 dark:text-white transition-colors">
                <Check className="w-5 h-5 text-red-500" /> <span>Deep Movie Analytics</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-900 dark:text-white transition-colors">
                <Check className="w-5 h-5 text-red-500" /> <span>100% Ad-Free Experience</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-900 dark:text-white transition-colors">
                <Check className="w-5 h-5 text-red-500" /> <span>Early Access to Features</span>
              </li>
            </ul>

            <Link href="/pricing" className="block w-full">
              <button className="w-full py-4 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-2xl font-bold transition-transform hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                Start 7-Day Trial
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
