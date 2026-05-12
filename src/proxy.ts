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

export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`, `Logo_primary.png`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
