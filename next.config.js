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

  // === 添加以下 env 配置 ===
  // next.config.js 错误的 env 语法
  env: {
    // 正确的 JavaScript 语法：使用三元运算符和反引号 `` ` `` 包裹模板字符串
    NEXT_PUBLIC_API_BASE_URL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
  },
  // === 添加 env 配置结束 ===
};

module.exports = nextConfig;
