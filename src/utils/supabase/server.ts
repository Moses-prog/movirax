import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "../env";
import { Database } from "./types";

export async function createClient(admin?: boolean) {
  const cookieStore = await cookies();

  // Use ANON_KEY for regular users, SERVICE_ROLE_KEY for admin operations
  const key = admin 
    ? env.SUPABASE_SERVICE_ROLE_KEY 
    : env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!env.NEXT_PUBLIC_SUPABASE_URL || !key) {
    throw new Error(
      "Missing Supabase environment variables. " +
      "Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local"
    );
  }

  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
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
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
          console.error("Failed to set cookies:", error);
        }
      },
    },
  });
}