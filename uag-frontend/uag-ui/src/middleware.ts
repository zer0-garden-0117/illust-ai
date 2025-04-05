import createMiddleware from 'next-intl/middleware';
import { locales, localePrefix, defaultLocale } from './configs/i18n/config';

export default createMiddleware({
  defaultLocale,
  locales,
  localePrefix
});

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(en|ja|zh-Hant|zh-Hans|ko|ms|th|de|fr|vi|id|fil|pt)/:path*',

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};