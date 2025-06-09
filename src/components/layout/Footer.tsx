import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-800 text-secondary-200 py-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 网站信息 */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <span className="text-white font-bold">科技资讯</span>
            </div>
            <p className="text-sm mb-4">
              提供全球最新科技资讯，通过AI小总结、结构化信息和可视化呈现，帮助用户高效获取和理解科技动态。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary-300 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-secondary-300 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="#" className="text-secondary-300 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
          </div>

          {/* 快速链接 */}
          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">
                  分类浏览
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  搜索
                </Link>
              </li>
              <li>
                <Link href="/user/saved" className="hover:text-white transition-colors">
                  已保存资讯
                </Link>
              </li>
            </ul>
          </div>

          {/* 热门分类 */}
          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">热门分类</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/ai" className="hover:text-white transition-colors">
                  人工智能
                </Link>
              </li>
              <li>
                <Link href="/category/quantum-computing" className="hover:text-white transition-colors">
                  量子计算
                </Link>
              </li>
              <li>
                <Link href="/category/blockchain" className="hover:text-white transition-colors">
                  区块链
                </Link>
              </li>
              <li>
                <Link href="/category/biotech" className="hover:text-white transition-colors">
                  生物科技
                </Link>
              </li>
            </ul>
          </div>

          {/* 关于我们 */}
          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">关于我们</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  关于平台
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  联系我们
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  使用条款
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-700 mt-8 pt-6 text-sm text-center">
          <p>© {new Date().getFullYear()} 科技资讯平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;