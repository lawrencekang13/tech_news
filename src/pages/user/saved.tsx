import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

import { fetchSavedNews as apiFetchSavedNews, unsaveNews } from '@/api/user';

// 获取用户保存的资讯
const fetchSavedNews = async () => {
  try {
    // 调用API获取保存的资讯
    const savedNews = await apiFetchSavedNews();
    return { savedNews };
  } catch (error) {
    console.error('获取保存的资讯失败:', error);
    throw error;
  }
};

// 获取分类名称
const getCategoryName = (categoryId: string) => {
  const categoryMap: Record<string, string> = {
    'ai': '人工智能',
    'quantum-computing': '量子计算',
    'blockchain': '区块链',
    'biotech': '生物科技',
    'ar-vr': 'AR/VR',
    'autonomous-vehicles': '自动驾驶',
  };
  return categoryMap[categoryId] || categoryId;
};

// 格式化日期
const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
};

// 修改组件名称以匹配文件名
const SavedPage = () => {
  // 获取保存的资讯
  const { data, isLoading, isError } = useQuery(
    'savedNews',
    fetchSavedNews,
    {
      staleTime: 5 * 60 * 1000, // 5分钟
    }
  );

  // 移除保存的资讯
  const handleRemoveSaved = async (id: string) => {
    try {
      // 调用API删除保存的资讯
      await unsaveNews(id);
      // 重新获取数据
      window.location.reload();
      toast.success('资讯已从收藏中移除');
    } catch (error) {
      console.error('移除保存的资讯失败:', error);
      toast.error('移除失败，请稍后重试');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-secondary-200 rounded w-48 mb-6"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-secondary-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-danger mb-2">获取保存的资讯失败</div>
        <button 
          className="btn-primary"
          onClick={() => window.location.reload()}
        >
          重试
        </button>
      </div>
    );
  }

  const { savedNews = [] } = data as { savedNews: Array<{
    id: string;
    title: string;
    summary: string;
    category: string;
    tags: string[];
    publishDate: string;
    source: string;
    imageUrl: string;
    savedAt: string;
    savedCategories?: string[]; // 添加savedCategories字段
  }> };

  return (
    <>
      <Head>
        <title>已保存资讯 - 科技资讯</title>
        <meta name="description" content="查看您保存的科技资讯" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-secondary-900">已保存资讯</h1>
          <span className="text-secondary-600">
            共 {savedNews.length} 条
          </span>
        </div>

        {savedNews.length > 0 ? (
          <div className="space-y-4">
            {savedNews.map((news) => (
              <div key={news.id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row">
                {news.imageUrl && (
                  <div className="relative h-40 md:h-32 md:w-48 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-4">
                    <Image 
                      src={news.imageUrl} 
                      alt={news.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/news/${news.id}`} className="text-lg font-semibold text-secondary-900 hover:text-primary-600 mb-2 block">
                        {news.title}
                      </Link>
                      <p className="text-secondary-600 text-sm mb-3">{news.summary}</p>
                    </div>
                    <button 
                      className="text-secondary-400 hover:text-danger p-1"
                      onClick={() => handleRemoveSaved(news.id)}
                      title="取消保存"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center text-sm text-secondary-500 mt-2">
                    <span className="mr-3">
                      <span className="font-medium text-primary-600">
                        {news.savedCategories && news.savedCategories.length > 0 
                          ? news.savedCategories.map(cat => getCategoryName(cat)).join(', ')
                          : getCategoryName(news.category)}
                      </span>
                    </span>
                    <span className="mr-3">{news.source}</span>
                    <span className="mr-3">发布于 {formatDate(news.publishDate)}</span>
                    <span>保存于 {formatDate(news.savedAt)}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {news.tags && news.tags.map((tag) => (
                      <Link 
                        key={tag} 
                        href={`/search?tag=${encodeURIComponent(tag)}`}
                        className="inline-block bg-secondary-100 text-secondary-600 text-xs px-2 py-1 rounded hover:bg-secondary-200"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-secondary-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-secondary-900 mb-2">暂无保存的资讯</h3>
            <p className="text-secondary-600 mb-4">浏览资讯并点击保存按钮，将感兴趣的内容添加到这里</p>
            <Link href="/" className="btn-primary">
              浏览最新资讯
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default SavedPage;