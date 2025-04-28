// web/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

// Import Supabase functions (using the correct package)
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// --- Function: Get User Preferred Locale ---
function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const filteredLanguages = languages.filter(lang => lang !== '*');

  if (filteredLanguages.length === 0) {
    return i18n.defaultLocale;
  }

  try {
    return matchLocale(filteredLanguages, locales, i18n.defaultLocale);
  } catch (e) {
    console.warn("Locale matching failed:", e);
    return i18n.defaultLocale;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // === 1. Handle i18n Locale Detection and Redirection ===
  const pathnameIsMissingLocale = // ... (i18n logic as before) ...
  if (pathnameIsMissingLocale) {
      // ... (i18n redirect logic as before) ...
      // return NextResponse.redirect(...) // Redirect if needed
  }

  // === 2. Handle Supabase Session Refresh (using the pattern from the official guide) ===

  // Create an initial response object.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client for middleware.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // The 'response' object is used here, matching the guide
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // The 'response' object is used here, matching the guide
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Refresh session by loading user data from cookie/header
  await supabase.auth.getUser();

  // (Optional) Add authentication-based route protection here...

  // Return the response, potentially modified with updated Supabase auth cookies
  return response;
}

export const config = {
  matcher: [
     // ... (your matcher as before) ...
    '/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|favicon.ico).*)',
  ],
}