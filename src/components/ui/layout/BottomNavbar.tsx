"use client";

import { siteConfig } from "@/config/site";
import clsx from "clsx";
import { Link } from "@heroui/link";
import { usePathname } from "next/navigation";
import { Chip } from "@heroui/chip";
import useSupabaseUser from "@/hooks/useSupabaseUser";

const BottomNavbar = () => {
  const pathName = usePathname();
  const { data: user, isLoading } = useSupabaseUser();
  
  const hrefs = siteConfig.navItems.map((item) => item.href);
  const show = hrefs.includes(pathName) && user && !isLoading;

  return (
    show && (
      <>
        {/* Spacer for page content */}
        <div className="pt-28 md:hidden" />
        
        {/* LIFTED: pb-[calc(max(1.5rem,env(safe-area-inset-bottom))+1.2rem)] 
            This forces the bar up significantly for iPhones.
        */}
        <div className="fixed bottom-0 left-0 z-50 block h-fit w-full border-t border-white/10 bg-background/95 backdrop-blur-xl pt-4 pb-[calc(max(1.5rem,env(safe-area-inset-bottom))+1.2rem)] md:hidden">
          <div className="mx-auto grid h-full max-w-lg grid-cols-5">
            {siteConfig.navItems.map((item) => {
              const isActive = pathName === item.href;
              return (
                <Link
                  href={item.href}
                  key={item.href}
                  className="flex items-center justify-center text-foreground"
                >
                  <div className="flex flex-col items-center justify-center">
                    <Chip
                      size="lg"
                      variant={isActive ? "solid" : "light"}
                      color={isActive ? "primary" : "default"}
                      classNames={{
                        /* BOLDER ICONS: Added 'stroke-[2px]' and 'font-bold' to the icon container */
                        base: clsx("py-1 transition-all h-10 w-14 mb-1", { 
                            "scale-110 shadow-2xl shadow-primary/40": isActive 
                        }),
                        content: "flex items-center justify-center stroke-[2px] font-bold text-lg",
                      }}
                    >
                      {isActive ? item.activeIcon : item.icon}
                    </Chip>
                    <p className={clsx("text-[11px] tracking-tight transition-colors", { 
                        "font-black text-primary": isActive,
                        "text-foreground/60": !isActive 
                    })}>
                      {item.label}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </>
    )
  );
};

export default BottomNavbar;