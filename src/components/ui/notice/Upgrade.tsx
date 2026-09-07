"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import React from "react";

interface UpgradeNoticeProps {
  title: string;
  description: string;
}

const UpgradeNotice: React.FC<UpgradeNoticeProps> = ({ title, description }) => {
  return (
    <div className="flex min-h-[50dvh] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-white/10 bg-zinc-900/40 p-8 text-center sm:p-10 rounded-xl">
        <h3 className="mb-3 text-2xl font-semibold text-white tracking-tight">{title}</h3>
        
        <p className="mx-auto mb-8 text-[15px] leading-relaxed text-zinc-400">
          {description}
        </p>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button 
            as={Link} 
            href="/pricing"
            className="w-full sm:w-auto font-medium bg-white text-black rounded-lg"
          >
            Upgrade to Pro
          </Button>
          <Button 
            as={Link} 
            href="/"
            variant="bordered" 
            className="w-full sm:w-auto font-medium border-white/20 text-white hover:bg-white/5 rounded-lg"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeNotice;
