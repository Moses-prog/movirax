import React from 'react';

export const FilmStripPattern = ({ colorClass, bgClass, className = '' }: { colorClass: string, bgClass: string, className?: string }) => (
  <svg 
    className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${colorClass} ${className}`} 
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
