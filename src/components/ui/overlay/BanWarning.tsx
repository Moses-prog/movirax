"use client";

import useSupabaseUser from "@/hooks/useSupabaseUser";
import { AlertTriangle, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button, addToast, Spinner } from "@heroui/react";
import { signOut } from "@/actions/auth";
import { useState } from "react";
import { useRouter } from "@bprogress/next/app";

export default function BanWarning({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useSupabaseUser();
  const pathName = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Don't intercept in admin panel or support page
  if (pathName?.startsWith("/admin") || pathName?.startsWith("/support")) return <>{children}</>;

  if (isLoading || !user) return <>{children}</>;

  if (user.user_metadata?.status !== "banned") return <>{children}</>;

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    const { success, message } = await signOut();
    addToast({
      title: message,
      color: success ? "primary" : "danger",
    });
    if (!success) {
      setIsLoggingOut(false);
      return;
    }
    router.push("/auth");
  };

  return (
    <>
      {/* Invisible overlay to block all clicks on navbar and sidebar */}
      <div 
        className="fixed inset-0 z-[99998] cursor-not-allowed bg-transparent" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />
      
      {/* Ban Card filling the main content area */}
      <div className="relative z-[99999] flex min-h-[calc(100dvh-64px)] w-full flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-yellow-500/50 bg-yellow-500/10 p-6 text-center shadow-2xl shadow-yellow-500/5">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-yellow-500/20">
            <AlertTriangle className="size-7 text-yellow-500" />
          </div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-yellow-500">
            Account Restricted
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-yellow-500/80">
            Your account has been banned due to a violation of our terms. You no longer have access to this application. If you believe this is a mistake, please contact support.
          </p>
          
          <div className="flex flex-col gap-3 w-full">
            <Button 
              color="warning" 
              variant="flat" 
              className="w-full font-semibold pointer-events-auto"
              size="lg"
              onPress={() => router.push('/support')}
            >
              Contact Support
            </Button>
            <Button 
              color="danger" 
              variant="flat" 
              className="w-full font-semibold pointer-events-auto"
              size="lg"
              onPress={handleLogout}
              startContent={isLoggingOut ? <Spinner size="sm" color="danger" /> : <LogOut className="size-5" />}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
