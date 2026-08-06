import { createClient } from "@/utils/supabase/server";

/**
 * Get the currently authenticated user from the server
 * This works with magic links, email/password, and phone auth
 */
export async function getAuthenticatedUser() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Auth error:", error.message);
      return null;
    }

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("getAuthenticatedUser error:", error);
    return null;
  }
}

/**
 * Middleware to ensure user is authenticated
 * Throws error if not logged in
 */
export async function requireAuth() {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Authentication required. Please log in first.");
  }

  return user;
}