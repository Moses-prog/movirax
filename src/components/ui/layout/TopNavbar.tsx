"use client";

import BackButton from "@/components/ui/button/BackButton";
import { siteConfig } from "@/config/site";
import useSupabaseUser from "@/hooks/useSupabaseUser";
import { cn } from "@/utils/helpers";
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { useWindowScroll } from "@mantine/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import FullscreenToggleButton from "../button/FullscreenToggleButton";
import InstallAppButton from "../button/InstallAppButton";
import UserProfileButton from "../button/UserProfileButton";
import SearchInput from "../input/SearchInput";
import ThemeSwitchDropdown from "../input/ThemeSwitchDropdown";
import BrandLogo from "../other/BrandLogo";
import { getUserSubscription, UserSubscription } from "@/lib/subscriptions";

const ScrollFadeBackground = () => {
  const [{ y }] = useWindowScroll();
  const opacity = Math.min((y / 1000) * 5, 1);
  return (
    <div
      className="border-background bg-background absolute inset-0 h-full w-full border-b pointer-events-none"
      style={{ opacity }}
    />
  );
};

const SubscriptionBadge = ({ userId }: { userId: string }) => {
  const [sub, setSub] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getUserSubscription(userId);
        setSub(data);
      } catch (e) {}
      setLoading(false);
    }
    load();
  }, [userId]);

  if (loading) return <div className="h-7 w-20 animate-pulse bg-white/10 rounded-full hidden sm:block" />;
  
  if (sub && sub.status === 'active') {
    return (
      <Button as={Link} href="/profile" size="sm" color="warning" variant="flat" className="font-bold border border-warning/20 bg-warning/10 text-warning hidden sm:flex h-8">
        {sub.pricing_plans?.name || 'Pro'}
      </Button>
    );
  }

  return (
    <Button as={Link} href="/pricing" size="sm" color="danger" className="font-bold shadow-md hidden sm:flex h-8">
      Upgrade Plan
    </Button>
  );
};

const TopNavbar = () => {
  const pathName = usePathname();
  const { data: user, isLoading } = useSupabaseUser();
  const hrefs = siteConfig.navItems.map((item) => item.href);
  const show = hrefs.includes(pathName);
  const tv = pathName.includes("/tv/");
  const player = pathName.includes("/player");
  const auth = pathName.includes("/auth");
  const admin = pathName.startsWith("/admin");
  const showGuestActions = !user && !isLoading;
  const showAuthenticatedNav = !!user;

  if (auth || player || admin) return null;

  return (
    <Navbar
      disableScrollHandler
      isBlurred={false}
      position="sticky"
      maxWidth="full"
      classNames={{ wrapper: "px-4 md:px-8 max-w-full" }}
      className={cn("w-[100vw] max-w-[100vw] h-16 bg-transparent z-50 border-b border-transparent transition-colors overflow-x-hidden", {
        "bg-background/80 backdrop-blur-md border-white/10": show,
      })}
    >
      {!show && <ScrollFadeBackground />}
      <NavbarBrand className="min-w-0 shrink">
        {showAuthenticatedNav && !show ? (
          <BackButton href={tv ? "/?content=tv" : "/"} />
        ) : (
          <BrandLogo className="max-w-[130px] sm:max-w-[180px]" />
        )}
      </NavbarBrand>
      {showAuthenticatedNav && show && !pathName.startsWith("/search") && (
        <NavbarContent className="hidden w-full max-w-xs lg:max-w-lg gap-2 md:flex" justify="center">
          <NavbarItem className="w-full">
            <Link href="/search" className="w-full">
              <SearchInput
                className="pointer-events-none"
                placeholder="Search your favorite movies..."
              />
            </Link>
          </NavbarItem>
        </NavbarContent>
      )}
      <NavbarContent justify="end">
        {showGuestActions ? (
          <>
            <NavbarItem className="flex gap-0.5 sm:gap-2">
              <ThemeSwitchDropdown />
              <InstallAppButton />
              <FullscreenToggleButton />
            </NavbarItem>
            <NavbarItem className="hidden sm:flex">
              <Button as={Link} href="/auth" variant="light">
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} href="/auth?form=register" color="primary" className="h-8 min-w-16 px-2 text-xs sm:h-10 sm:min-w-20 sm:px-4 sm:text-sm">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        ) : showAuthenticatedNav ? (
          <>
            <NavbarItem className="flex gap-0.5 sm:gap-2 items-center">
              {user && <SubscriptionBadge userId={user.id} />}
              <ThemeSwitchDropdown />
              <InstallAppButton />
              <FullscreenToggleButton />
            </NavbarItem>
            <NavbarItem>
              <UserProfileButton />
            </NavbarItem>
          </>
        ) : null}
      </NavbarContent>
    </Navbar>
  );
};

export default TopNavbar;
