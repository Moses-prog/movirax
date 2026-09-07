import Link from "next/link";
import React from "react";
import { Film } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="relative bg-[#0a0a0a] border-t border-white/10 pt-20 pb-10 overflow-hidden">
      {/* Subtle Dot Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6 text-white">
              <Film className="w-6 h-6 text-red-600" />
              <span className="font-bold text-xl tracking-tight">MoviraX</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Your definitive cinematic universe. Track, discover, and organize your favorite films without compromise.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Platform</h4>
            <ul className="space-y-3">
              <li><a href="/" className="text-zinc-400 hover:text-white transition-colors text-sm">Home</a></li>
              <li><a href="/pricing" className="text-zinc-400 hover:text-white transition-colors text-sm">Pricing</a></li>
              <li><a href="/auth" className="text-zinc-400 hover:text-white transition-colors text-sm">Sign In</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-3">
              <li><a href="/terms" className="text-zinc-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
              <li><a href="/privacy" className="text-zinc-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="/refunds" className="text-zinc-400 hover:text-white transition-colors text-sm">Refund Policy</a></li>
              <li><a href="/cookies" className="text-zinc-400 hover:text-white transition-colors text-sm">Cookie Policy</a></li>
              <li><a href="/dmca" className="text-zinc-400 hover:text-white transition-colors text-sm">DMCA & Copyright</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Connect</h4>
            <ul className="space-y-3">
              <li><a href="https://twitter.com/movirax" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors text-sm">Twitter / X</a></li>
              <li><a href="https://discord.gg/movirax" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors text-sm">Discord</a></li>
              <li><a href="/support" className="text-zinc-400 hover:text-white transition-colors text-sm">Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} MoviraX. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-zinc-500 text-sm">
            <span>Designed for true cinema lovers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
