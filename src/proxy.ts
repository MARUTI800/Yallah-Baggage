import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { locales } from "./i18n/request";

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: "en",

  // Always use the locale prefix in the URL
  localePrefix: "always",
});

// Next.js 16 recommends a named export 'proxy'
export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico, icon.png, sitemap.xml, robots.txt (metadata files)
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png|sitemap.xml|robots.txt).*)",
  ],
};
