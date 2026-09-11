"use client";

import { motion } from "framer-motion";
import { Tv2, Film, Globe2, Zap } from "lucide-react";
import Link from "next/link";

const stats = [
  {
    icon: Film,
    value: "1M+",
    label: "Movies & Shows",
    description: "Every title from every major studio, indexed and searchable instantly.",
    watermark: "1M",
  },
  {
    icon: Globe2,
    value: "16",
    label: "Streaming Servers",
    description: "Multiple global servers so you always find a working stream, every time.",
    watermark: "16",
  },
  {
    icon: Tv2,
    value: "4K",
    label: "Quality Streams",
    description: "Crystal clear streams up to 4K resolution with minimal buffering.",
    watermark: "4K",
  },
  {
    icon: Zap,
    value: "0s",
    label: "Wait Time",
    description: "No sign-up walls, no paywalls. Click a title. It plays. That simple.",
    watermark: "0s",
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardVariant = {
  hidden: { opacity: 0, filter: "blur(12px)", scale: 0.95, y: 30 },
  visible: { opacity: 1, filter: "blur(0px)", scale: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

export default function CommunitySection() {
  return (
    <section className="py-32 px-4 lg:px-8 max-w-[1400px] mx-auto relative overflow-hidden">
      {/* Header */}
      <motion.div
        className="text-center mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center space-x-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400">Why MoviraX</span>
        </div>
        <h2 className="text-4xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-6 text-gray-900 dark:text-white transition-colors">
          Built different.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 dark:from-red-500 dark:to-red-300">
            Watch different.
          </span>
        </h2>
        <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto transition-colors">
          No other platform indexes this much content across this many servers — completely free.
        </p>
      </motion.div>

      {/* Stats Grid - matching hero bento card style */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-20"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={cardVariant}
            className="bg-white dark:bg-[#121212] rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-8 flex flex-col justify-between relative overflow-hidden group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-default shadow-sm dark:shadow-none min-h-[220px]"
          >
            {/* Watermark number */}
            <div className="absolute -bottom-6 -right-4 text-[120px] text-black/[0.03] dark:text-white/[0.04] font-black leading-none group-hover:scale-110 transition-transform duration-700 select-none">
              {stat.watermark}
            </div>

            {/* Icon */}
            <div className="w-10 h-10 bg-red-100 dark:bg-white/10 rounded-xl flex items-center justify-center text-red-600 dark:text-red-500 mb-6 transition-colors">
              <stat.icon className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="text-4xl font-semibold text-gray-900 dark:text-white mb-1 tabular-nums transition-colors">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 transition-colors">
                {stat.label}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed transition-colors">
                {stat.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Card - same corporate style */}
      <motion.div
        variants={cardVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="bg-gray-900 dark:bg-white text-white dark:text-black rounded-[2.5rem] p-12 flex flex-col justify-center items-center text-center hover:scale-[1.02] transition-transform cursor-pointer group shadow-xl dark:shadow-none"
      >
        <h3 className="text-3xl lg:text-4xl font-bold mb-3">
          The internet's best movies. All in one place.
        </h3>
        <p className="text-gray-400 dark:text-gray-600 mb-8 max-w-lg">
          Join thousands of viewers who ditched the subscriptions.
        </p>
        <Link href="/auth?form=register">
          <button className="px-8 py-4 bg-white dark:bg-black text-black dark:text-white rounded-2xl font-bold group-hover:bg-red-500 dark:group-hover:bg-red-600 group-hover:text-white transition-colors">
            Start Watching Free
          </button>
        </Link>
      </motion.div>
    </section>
  );
}