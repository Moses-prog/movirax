"use client";

import useSupabaseUser from "@/hooks/useSupabaseUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

/**
 * ProtectedLayout wrapper
 * Use this to wrap any route that requires authentication
 * Unauthenticated users will be redirected to home page
 */
export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { data: user, isLoading } = useSupabaseUser();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // If not loading and no user, redirect to home
    if (isMounted && !isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading, router, isMounted]);

  // Show loading state while checking auth
  if (!isMounted || isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Show content only if authenticated
  if (user) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
}