import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { env } from "../env";
import { Database } from "./types";

export async function createClient(admin?: boolean) {
  if (!env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
  }

  // If admin is true, return a pure admin client WITHOUT cookies to properly bypass RLS
  if (admin) {
    const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.");
    }
    return createSupabaseClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  const cookieStore = await cookies();
  const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable.");
  }

  return createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => 
            cookieStore.set(name, value, options)
          );
        } catch (error) {
          console.error("Failed to set cookies:", error);
        }
      },
    },
  });
}