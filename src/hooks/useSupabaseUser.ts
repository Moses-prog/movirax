"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { queryClient } from "@/app/providers";
import { addToast } from "@heroui/react";

type AuthUserData = User & {
  username: string;
  subscription_tier?: string;
  subscription_status?: string;
};

const fetchUser = async (): Promise<AuthUserData | null> => {
  let AuthUser: AuthUserData | null = null;

  const supabase = createClient();

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error.message);

    addToast({
      title: "Error fetching user",
      description: error.message,
      color: "danger",
    });

    return null;
  }

    if (user) {
      const { data: usernameData } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();
        
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("subscription_tier, subscription_status")
        .eq("id", user.id)
        .single();

      if (usernameData) {
        AuthUser = {
          ...user,
          username: usernameData.username,
          subscription_tier: profileData?.subscription_tier || 'free',
          subscription_status: profileData?.subscription_status || 'active',
        };
      }
    }

  return AuthUser;
};

const useSupabaseUser = () => {
  const supabase = createClient();

  const query = useQuery({
    queryKey: ["supabase-user"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      queryClient.invalidateQueries({ queryKey: ["supabase-user"] });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, queryClient]);

  return query;
};

export default useSupabaseUser;
