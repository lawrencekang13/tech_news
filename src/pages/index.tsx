import { useState, useEffect } from 'react';
import Head from 'next/head';
import NewsCard from '@/components/features/NewsCard';
import CategoryFilter from '@/components/features/CategoryFilter';
import { useQuery } from 'react-query';
import { News, Category } from '@/types';
import * as categoryService from '@/services/categoryService';
import { fetchSavedNews } from '@/api/user';

// 获取资讯数据的API
const fetchNews = async (categorySlug: string = '') => {
  try {
    const url = categorySlug 
      ? `/api/news?category=${encodeURIComponent(categorySlug)}`
      : '/api/news';
    
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const result = await res.json();
    // 后端返回的数据结构是 {success: true, data: [...], pagination: {...}}
    // 我们需要提取 data 数组
    return result.data || [];
  } catch (error) {
    console.error('获取新闻数据失败:', error);
    // 返回空数组，让UI显示加载失败状态
    return [];
  }
};

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [savedNewsIds, setSavedNewsIds] = useState<string[]>([]);
  
  // 获取资讯数据
  const { data: newsData, isLoading, isError } = useQuery(
    ['news', selectedCategory],
    () => fetchNews(selectedCategory),
    {
      staleTime: 5 * 60 * 1000, // 5分钟
    }
  );
  
  // 获取用户保存的资讯ID列表
  useEffect(() => {
    const getSavedNewsIds = async () => {
      try {
        const savedNews = await fetchSavedNews();
        const ids = savedNews.map((item: any) => item.id);
        setSavedNewsIds(ids);
      } catch (error) {
        console.error('获取保存的资讯失败:', error);
      }
    };
    
    getSavedNewsIds();
  }, []);
  
  // 处理保存状态变化
  const handleSaveStatusChange = (newsId: string, isSaved: boolean) => {
    if (isSaved) {
      setSavedNewsIds(prev => [...prev, newsId]);
    } else {
      setSavedNewsIds(prev => prev.filter(id => id !== newsId));
    }
  };

  // 获取分类列表
  const { data: categoriesData } = useQuery(
    'categories',
    () => categoryService.getNavCategories(),
    {
      staleTime: 60 * 60 * 1000, // 1小时
    }
  );

  // 构建分类列表，添加"全部"选项
  const categories = [
    { slug: '', name: '全部' },
    ...(categoriesData || []).map((category: Category) => ({
      slug: category.slug,
      name: category.name
    }))
  ];

  return (
    <>
      <Head>
        <title>科技资讯 - 全球最新科技动态</title>
      </Head>

      <div className="space-y-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-900">探索全球最新科技资讯</h1>
          <p className="mt-2 text-secondary-600 max-w-2xl mx-auto">
            通过AI小总结快速了解核心内容，结构化信息和可视化呈现帮助您深入洞察科技趋势
          </p>
        </div>

        {/* 分类筛选 */}
        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />

        {/* 资讯列表 */}
        <div className="space-y-6">
          {isLoading ? (
            // 加载状态
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="h-48 bg-secondary-200 rounded-md mb-4"></div>
                  <div className="h-6 bg-secondary-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-secondary-200 rounded mb-4"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-secondary-200 rounded w-16"></div>
                    <div className="h-6 bg-secondary-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            // 错误状态
            <div className="text-center py-10">
              <div className="text-danger mb-2">获取资讯失败</div>
              <button 
                className="btn-primary"
                onClick={() => window.location.reload()}
              >
                重试
              </button>
            </div>
          ) : (
            // 资讯列表
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsData?.map((news: News) => (
                <NewsCard 
                  key={news.id} 
                  news={news} 
                  isSaved={savedNewsIds.includes(news.id)}
                  onSaveStatusChange={handleSaveStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;