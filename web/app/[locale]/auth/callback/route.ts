// web/app/[locale]/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server' // Use server client here
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  // Get locale from the URL path if needed, though might not be strictly necessary for callback
  const locale = requestUrl.pathname.split('/')[1] || 'en'; // Default locale if not found

  if (code) {
    const supabase = await createClient(); // Use server client helper

    try {
        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Successful exchange, redirect to home or intended page
            // **Important:** Check if profile exists after OAuth login and create if needed
            // This is a good place to trigger profile check/creation for SOCIAL logins
            // (You might redirect to a specific server component that handles this check)
            return NextResponse.redirect(`${origin}/${locale}`); // Redirect to localized home page
        } else {
            console.error("Auth callback error during code exchange:", error);
        }
    } catch (e) {
        console.error("Auth callback unexpected error:", e);
    }

  }

  // If code is missing or exchange fails, redirect to an error page or login
  return NextResponse.redirect(`${origin}/${locale}/login?message=auth_error`);
}