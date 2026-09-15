import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // This refreshes a user's session in the background
  const { data: { user }, error } = await supabase.auth.getUser();

  // Instant-kick mechanism for Banned or Suspended users
  if (user?.user_metadata?.status === 'suspended' || error?.message?.toLowerCase().includes('banned')) {
    await supabase.auth.signOut();
    
    // Only redirect if it's a page request, not an API route
    if (!request.nextUrl.pathname.startsWith('/api/') && !request.nextUrl.pathname.startsWith('/auth')) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/auth';
      redirectUrl.searchParams.set('error', 'true');
      if (user?.user_metadata?.status === 'suspended') {
        redirectUrl.searchParams.set('suspended', 'true');
      }
      
      const redirectResponse = NextResponse.redirect(redirectUrl);
      
      // Transfer the cleared cookies from the signOut operation
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
      });
      
      return redirectResponse;
    }
  }

  return supabaseResponse;
}
