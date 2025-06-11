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
  env: {
    // 在 Vercel 构建时，VERCEL_URL 环境变量会自动由 Vercel 注入，
    // 它包含了部署的完整 URL (例如 https://your-deployment-url.vercel.app)。
    // 我们利用它来构建 NEXT_PUBLIC_API_BASE_URL。
    NEXT_PUBLIC_API_BASE_URL: `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
    // 确保你的 .env.local 中的其他 NEXT_PUBLIC_ 变量也在这里被引用
    // 例如：
    // NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    // NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    // ... 其他 NEXT_PUBLIC_ 变量
  },
  // === 添加 env 配置结束 ===
};

module.exports = nextConfig;
