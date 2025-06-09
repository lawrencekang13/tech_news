/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // output: 'standalone',
  images: {
    domains: ['placeholder-api.com', 'blogger.googleusercontent.com', 'platform.theverge.com'], // 添加theverge域名
  },
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
  },
}

module.exports = nextConfig