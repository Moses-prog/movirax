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
    color: "from-red-500 to-red-700",
  },
  {
    icon: Globe2,
    value: "16",
    label: "Streaming Servers",
    description: "Multiple global servers so you always find a working stream, every time.",
    color: "from-orange-500 to-red-600",
  },
  {
    icon: Tv2,
    value: "4K",
    label: "Quality Streams",
    description: "Crystal clear streams up to 4K resolution, ad-free and buffer-free.",
    color: "from-red-600 to-pink-600",
  },
  {
    icon: Zap,
    value: "0s",
    label: "Wait Time",
    description: "No sign-up walls, no paywalls. Click a title. It plays. That simple.",
    color: "from-yellow-500 to-red-500",
  },
];

export default function CommunitySection() {
  return (
    <section className="py-32 px-4 lg:px-8 max-w-[1400px] mx-auto relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[400px] bg-red-600/10 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">Why MoviraX</span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6">
            Built different.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              Watch different.
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            No other platform indexes this much content across this many servers — completely free.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 rounded-3xl p-8 transition-all duration-300 cursor-default overflow-hidden"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-6 shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>

              {/* Number */}
              <div className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-1 tabular-nums`}>
                {stat.value}
              </div>
              <div className="text-white font-semibold text-lg mb-3">{stat.label}</div>
              <p className="text-gray-500 text-sm leading-relaxed">{stat.description}</p>

              {/* Hover glow */}
              <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="relative bg-gradient-to-r from-red-950/60 via-red-900/40 to-red-950/60 border border-red-500/20 rounded-3xl p-12 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-4xl lg:text-5xl font-black text-white mb-4">
              The internet's best movies.<br />All in one place.
            </h3>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              Join thousands of viewers who ditched the subscriptions.
            </p>
            <Link href="/auth?form=register">
              <button className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl text-lg transition-all hover:scale-105 shadow-xl shadow-red-600/30">
                Start Watching Free
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}