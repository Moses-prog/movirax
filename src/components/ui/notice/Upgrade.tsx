"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import React from "react";

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

interface UpgradeNoticeProps {
  title: string;
  description: string;
}

const UpgradeNotice: React.FC<UpgradeNoticeProps> = ({ title, description }) => {
  return (
    <div className="flex min-h-[50dvh] flex-col items-center justify-center px-4 py-12">
      <div className="relative overflow-hidden w-full max-w-md border border-white/10 bg-zinc-900 shadow-2xl p-8 text-center sm:p-10 rounded-2xl">
        
        {/* SVG Ribbon Texture */}
        <FilmStripPattern colorClass="text-red-500" bgClass="stroke-zinc-900" />
        
        {/* Content */}
        <div className="relative z-10">
          <h3 className="mb-3 text-2xl font-bold text-white tracking-tight">{title}</h3>
          
          <p className="mx-auto mb-8 text-[15px] leading-relaxed text-zinc-300">
            {description}
          </p>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button 
              as={Link} 
              href="/pricing"
              className="w-full sm:w-auto font-bold bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-500 h-12 px-8"
            >
              Upgrade to Pro
            </Button>
            <Button 
              as={Link} 
              href="/"
              variant="bordered" 
              className="w-full sm:w-auto font-medium border-white/20 text-white hover:bg-white/5 rounded-xl h-12 px-6"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeNotice;
