// web/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

// Import Supabase functions (using the correct package)
import { createServerClient } from '@supabase/ssr';

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
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );
  if (pathnameIsMissingLocale) {
      const locale = getLocale(request);
      return NextResponse.redirect(
        new URL(`/${locale}${pathname}`, request.url)
      );
  }

  // === 2. Handle Supabase Session Refresh ===

  // Create an initial response object.
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client for middleware using new cookie methods
  // middleware 使用內部 URL 但指定 cookie domain 為外部 IP
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: '35.229.234.32', // 明確指定 cookie domain 為外部 IP
        path: '/',
        sameSite: 'lax',
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => 
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session by loading user data from cookie/header
  const { data: { user }, error } = await supabase.auth.getUser();
  console.log('🔍 Middleware - Auth User:', user ? { id: user.id, email: user.email } : null);
  console.log('🔍 Middleware - Auth Error:', error);

  // (Optional) Add authentication-based route protection here...

  // Return the response, potentially modified with updated Supabase auth cookies
  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|favicon.ico).*)',
  ],
}