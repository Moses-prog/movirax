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
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-white/5 bg-background/85 backdrop-blur-2xl pb-safe md:hidden shadow-[0_-15px_40px_rgba(0,0,0,0.5)]">
      <div className="mx-auto flex h-[4.5rem] max-w-md items-center justify-between px-6">
        {siteConfig.navItems.map((item) => {
          const isActive = pathName === item.href;
          return (
            <Link
              href={item.href}
              key={item.href}
              className="flex flex-col items-center justify-center gap-1.5 min-w-[3.5rem] tap-highlight-transparent"
            >
              <div 
                className={clsx("flex h-[1.35rem] w-[1.35rem] items-center justify-center transition-all duration-300", {
                  "text-primary scale-110 drop-shadow-[0_0_8px_rgba(229,9,20,0.5)]": isActive,
                  "text-muted-foreground hover:text-foreground": !isActive
                })}
              >
                {isActive ? item.activeIcon : item.icon}
              </div>
              <span 
                className={clsx("text-[10px] transition-colors", { 
                  "text-primary font-bold": isActive,
                  "text-muted-foreground font-medium": !isActive 
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
