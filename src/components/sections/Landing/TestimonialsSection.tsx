"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  { quote: "The most beautiful way to track what I watch. It's ruined Letterboxd for me.", author: "TechRadar", role: "Review" },
  { quote: "Finally, a movie app that feels like a premium cinematic experience. The UI is gorgeous.", author: "Sarah Jenkins", role: "Film Critic" },
  { quote: "Organizing my 2,000+ watchlist has never been easier. The smart tags are a lifesaver.", author: "Marcus D.", role: "Power User" },
  { quote: "It’s like having a personal IMAX theater database in my pocket. Absolutely stunning.", author: "IndieWire", role: "Review" },
  { quote: "The performance is buttery smooth. Movira X is setting the new standard for web apps.", author: "UX Collective", role: "Design Review" },
];

export default function TestimonialsSection() {
  // Duplicate array to create a seamless infinite loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-24 overflow-hidden border-y border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0a0a0a] transition-colors">
      <div className="mb-12 text-center">
         <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2 transition-colors">Don't just take our word for it</h2>
         <p className="text-gray-600 dark:text-gray-400 transition-colors">Join thousands of cinephiles who have already made the switch.</p>
      </div>

      <div className="relative flex overflow-x-hidden">
        {/* Left Gradient Mask */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-gray-50 to-transparent dark:from-[#0a0a0a] dark:to-transparent z-10" />
        
        {/* Right Gradient Mask */}
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-gray-50 to-transparent dark:from-[#0a0a0a] dark:to-transparent z-10" />

        <motion.div
          className="flex space-x-6 px-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
        >
          {duplicatedTestimonials.map((testimonial, i) => (
            <div 
              key={i} 
              className="w-[400px] flex-shrink-0 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl p-8 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors shadow-sm dark:shadow-none cursor-default group"
            >
              <Quote className="w-8 h-8 text-red-600/20 dark:text-red-500/20 group-hover:text-red-600/50 dark:group-hover:text-red-500/50 transition-colors mb-6" />
              <p className="text-lg text-gray-800 dark:text-gray-200 mb-8 font-medium leading-relaxed transition-colors">"{testimonial.quote}"</p>
              <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-900" />
                 <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white transition-colors">{testimonial.author}</div>
                    <div className="text-xs text-red-600 dark:text-red-400 uppercase tracking-wider transition-colors">{testimonial.role}</div>
                 </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
