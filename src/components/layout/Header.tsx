import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import * as categoryService from '@/services/categoryService';
import { Category } from '@/types';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // 模拟用户登录状态
  const isLoggedIn = false;

  // 处理搜索提交
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // 获取导航分类
  const { data: navCategories = [] } = useQuery(
    'navCategories',
    () => categoryService.getNavCategories(),
    {
      staleTime: 60 * 60 * 1000, // 1小时
    }
  );

  // 构建导航链接
  const navLinks = [
    { name: '首页', href: '/' },
    ...navCategories
      .filter((category: Category) => category.showInNav)
      .sort((a: Category, b: Category) => (a.priority || 0) - (b.priority || 0))
      .slice(0, 4) // 只显示前4个分类
      .map((category: Category) => ({
        name: category.name,
        href: `/categories/${category.slug}`,
        icon: category.icon
      })),
    { name: '更多', href: '/categories' },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-xl font-bold text-secondary-900">科技资讯</span>
          </Link>

          {/* 桌面导航 */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-secondary-700 hover:text-primary-500 ${router.pathname === link.href ? 'font-medium text-primary-500' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* 搜索框 */}
          <div className="hidden md:block flex-grow max-w-md mx-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="搜索科技资讯..."
                className="input pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-primary-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* 用户菜单 */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center space-x-1">
                  <div className="w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center">
                    <span className="text-secondary-700 font-medium">U</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link href="/user/profile" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                    个人中心
                  </Link>
                  <Link href="/user/saved" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                    已保存资讯
                  </Link>
                  <Link href="/user/settings" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                    设置
                  </Link>
                  <button className="block w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                    退出登录
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link href="/auth/login" className="btn-outline">
                  登录
                </Link>
                <Link href="/auth/register" className="btn-primary">
                  注册
                </Link>
              </div>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden text-secondary-500 hover:text-secondary-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-100">
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                placeholder="搜索科技资讯..."
                className="input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`text-secondary-700 hover:text-primary-500 ${router.pathname === link.href ? 'font-medium text-primary-500' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex space-x-2">
              {isLoggedIn ? (
                <>
                  <Link href="/user/profile" className="btn-secondary flex-1 text-center">
                    个人中心
                  </Link>
                  <button className="btn-outline flex-1">
                    退出登录
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn-outline flex-1 text-center">
                    登录
                  </Link>
                  <Link href="/auth/register" className="btn-primary flex-1 text-center">
                    注册
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;