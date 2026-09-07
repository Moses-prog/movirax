"use client";

import { siteConfig } from "@/config/site";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSupabaseUser from "@/hooks/useSupabaseUser";

const BottomNavbar = () => {
  const pathName = usePathname();
  const { data: user, isLoading } = useSupabaseUser();
  
  const hrefs = siteConfig.navItems.map((item) => item.href);
  const show = hrefs.includes(pathName) && user && !isLoading;

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-white/10 bg-black pb-safe md:hidden">
      <div className="mx-auto flex h-[4rem] max-w-md items-center justify-between px-6">
        {siteConfig.navItems.map((item) => {
          const isActive = pathName === item.href;
          return (
            <Link
              href={item.href}
              key={item.href}
              className="flex flex-col items-center justify-center gap-1 min-w-[3.5rem] tap-highlight-transparent"
            >
              <div 
                className={clsx("flex h-[1.35rem] w-[1.35rem] items-center justify-center", {
                  "text-white": isActive,
                  "text-zinc-500": !isActive
                })}
              >
                {isActive ? item.activeIcon : item.icon}
              </div>
              <span 
                className={clsx("text-[10px]", { 
                  "text-white font-medium": isActive,
                  "text-zinc-500": !isActive 
                })}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavbar;
