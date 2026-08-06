"use client";

import { motion } from "framer-motion";
import { Users, Star, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function CommunitySection() {
  return (
    <section className="py-32 px-4 lg:px-8 max-w-[1400px] mx-auto relative overflow-hidden transition-colors">
      <div className="absolute top-1/2 left-1/2 w-full max-w-3xl h-96 bg-red-600/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-8 transition-colors">
            <Users className="w-4 h-4 text-red-600 dark:text-red-500" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gray-600 dark:text-gray-300">Community</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-6 text-gray-900 dark:text-white transition-colors">
            Film is better <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 dark:from-red-500 dark:to-red-300">when shared.</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-8 transition-colors">
            Follow friends, discover curated lists from top critics, and join discussions about the hidden gems you just unearthed. Movira X is a thriving ecosystem of passionate cinephiles.
          </p>
          
          <ul className="space-y-4">
             {[
               { icon: Star, text: "Share your ratings and instant reviews." },
               { icon: Users, text: "Follow friends and see their activity feeds." },
               { icon: MessageCircle, text: "Comment and debate on community watchlists." }
             ].map((item, i) => (
               <li key={i} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 transition-colors">
                 <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-white/5 flex items-center justify-center text-red-600 dark:text-red-500 transition-colors">
                   <item.icon className="w-4 h-4" />
                 </div>
                 <span>{item.text}</span>
               </li>
             ))}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative h-[500px] w-full"
        >
           {/* Mock Social UI */}
           <div className="absolute top-10 right-10 w-80 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-2xl z-20 transition-colors">
              <div className="flex items-center space-x-4 mb-4">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-yellow-500" />
                 <div>
                    <div className="font-semibold text-gray-900 dark:text-white transition-colors">Elena Rodriguez</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Watched 2h ago</div>
                 </div>
              </div>
              <div className="flex space-x-1 text-red-500 mb-2">
                <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current opacity-30" />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">"Absolutely mesmerizing cinematography. The pacing in the second act was a masterclass in tension."</p>
           </div>

           <div className="absolute bottom-10 left-0 w-80 bg-white/90 dark:bg-[#1a1a1a]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-2xl z-10 transition-colors">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Trending Lists</h4>
              <div className="space-y-3">
                 {[
                   { name: "Sci-Fi Masterpieces", author: "Alex Chen", movies: 42 },
                   { name: "A24 Ranked", author: "Sarah J.", movies: 118 },
                   { name: "Rainy Day Comfort", author: "Mike T.", movies: 15 }
                 ].map((list, i) => (
                   <div key={i} className="flex justify-between items-center group cursor-pointer">
                      <div>
                         <div className="text-sm text-gray-800 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{list.name}</div>
                         <div className="text-xs text-gray-500 transition-colors">by {list.author}</div>
                      </div>
                      <div className="text-xs font-semibold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-lg transition-colors">{list.movies} items</div>
                   </div>
                 ))}
              </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
