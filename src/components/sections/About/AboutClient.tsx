"use client";
import InteractiveTour from "./InteractiveTour";
import { motion } from "framer-motion";

export default function AboutClient() {
  return (
    <div className="flex flex-col w-full pb-20">
      {/* Mini Hero that hands off to the tour */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center pt-20 pb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-danger/10 text-danger border border-danger/20 mb-4 text-xs font-bold uppercase tracking-widest">
          Interactive Masterclass
        </div>
      </motion.div>
      <InteractiveTour />
    </div>
  );
}