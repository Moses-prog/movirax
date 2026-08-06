"use client";

import NavbarMenuItems from "../other/NavbarMenuItems";
import { siteConfig } from "@/config/site";
import { usePathname } from "next/navigation";
import useSupabaseUser from "@/hooks/useSupabaseUser";

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathName = usePathname();
  const { data: user, isLoading } = useSupabaseUser();
  const hrefs = siteConfig.navItems.map((item) => item.href);
  const shouldShowSidebar = hrefs.includes(pathName) && user && !isLoading;

  return (
    <div className="flex h-full">
      {shouldShowSidebar && (
        <div className="hidden md:block">
          <div className="left-0 top-0 w-20" />
          <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-20 z-40 border-r border-white/5 bg-background/50 backdrop-blur-md">
            <nav className="flex h-full flex-col justify-center items-center pb-20 text-foreground">
              <NavbarMenuItems size="sm" isVertical withIcon variant="light" />
            </nav>
          </aside>
        </div>
      )}
      {children}
    </div>
  );
};

export default Sidebar;