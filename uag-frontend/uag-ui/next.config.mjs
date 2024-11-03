import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './src/configs/i18n/i18n.ts',
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false
  experimental: {
    scrollRestoration: false,
}
};

export default withNextIntl(nextConfig);