"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import React from "react";
import { Crown, Sparkles } from "lucide-react";

interface UpgradeNoticeProps {
  title: string;
  description: string;
}

const UpgradeNotice: React.FC<UpgradeNoticeProps> = ({ title, description }) => {
  return (
    <div className="flex h-[60dvh] min-h-[400px] flex-col items-center justify-center px-4">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-background/50 p-8 text-center backdrop-blur-xl shadow-2xl sm:p-12 max-w-lg w-full">
        {/* Glow effect behind */}
        <div className="absolute left-1/2 top-0 -z-10 h-[150px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-danger/40 blur-[80px]" />
        
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-red-600/20 shadow-[0_0_30px_rgba(220,38,38,0.2)] border border-red-500/20">
          <Crown className="size-10 text-orange-500 drop-shadow-md" />
        </div>
        
        <h3 className="mb-3 text-3xl font-black text-foreground">{title}</h3>
        
        <p className="mx-auto mb-8 max-w-sm text-[15px] leading-relaxed text-muted-foreground font-medium">
          {description}
        </p>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button 
            as={Link} 
            href="/pricing"
            color="danger" 
            size="lg" 
            className="w-full sm:w-auto font-bold shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:scale-105 transition-transform"
            endContent={<Sparkles size={18} />}
          >
            Upgrade to Pro
          </Button>
          <Button 
            as={Link} 
            href="/"
            variant="flat" 
            color="default" 
            size="lg" 
            className="w-full sm:w-auto font-semibold bg-white/5"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeNotice;
