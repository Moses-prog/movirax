"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils/helpers";

export interface BrandLogoProps {
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ className }) => {
  return (
    <Link href="/" className="group flex items-center">
      <Image
        /* FIXED: Always use "/" to refer to the public folder. 
           Do NOT include "public/" or "../" in the path.
        */
        src="/moviraxlogo.png" 
        alt="Movirax Logo"
        width={180} 
        height={50}
        priority
        className={cn(
          "h-auto w-auto object-contain transition-transform group-hover:scale-105",
          className
        )}
      />
    </Link>
  );
};

export default BrandLogo;