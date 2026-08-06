"use client";

import { useEffect, useState } from "react";
import useSupabaseUser from "@/hooks/useSupabaseUser";
import { Spinner } from "@heroui/react";
import dynamic from "next/dynamic";
import LandingPage from "@/components/sections/Landing/LandingPage";

const ContinueWatching = dynamic(() => import("@/components/sections/Home/ContinueWatching"));
const HomePageList = dynamic(() => import("@/components/sections/Home/List"));

const HomePage = () => {
  return (
    <div className="flex flex-col gap-3 md:gap-8">
      <ContinueWatching />
      <HomePageList />
    </div>
  );
};

export default function RootPage() {
  const { data: user, isLoading } = useSupabaseUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Show movies to authenticated users
  if (user) {
    return <HomePage />;
  }

  // Show landing page to unauthenticated visitors
  return <LandingPage />;
}