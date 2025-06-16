/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 确保 output: 'standalone' 存在，这对于部署到 Vercel 或其他 Serverless 环境很有用
  // output: 'standalone',
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  images: {
    domains: ["placeholder.com", "blogger.googleusercontent.com", "platform.theverge.com"], // 确保这里包含你的图片域名
  },
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
  },

  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
    MONGO_URI: process.env.MONGO_URI,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_TOKEN: process.env.REDIS_TOKEN,
  }
};

module.exports = nextConfig;
