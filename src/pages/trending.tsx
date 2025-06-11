import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import NewsCard from '@/components/features/NewsCard';
import { News } from '@/types';

interface TrendingPageProps {
  trendingNews: News[];
  lastUpdated: string;
}

// 服务器端获取热门新闻数据
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // 在服务器端调用API获取热门新闻
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${API_BASE_URL}/api/news/trending?limit=10`;
    
    const res = await fetch(apiUrl);
    
    if (!res.ok) {
      throw new Error(`获取热门新闻失败: ${res.status}`);
    }
    
    const data = await res.json();
    
    // 返回props给页面组件
    return {
      props: {
        trendingNews: data.data?.news || [],
        lastUpdated: new Date().toISOString(),
      },
      // 设置页面重新生成的时间间隔（秒）
      // 每10分钟重新获取数据
      revalidate: 600,
    };
  } catch (error) {
    console.error('获取热门新闻失败:', error);
    
    // 出错时返回空数据
    return {
      props: {
        trendingNews: [],
        lastUpdated: new Date().toISOString(),
      },
    };
  }
};

const TrendingPage: React.FC<TrendingPageProps> = ({ trendingNews, lastUpdated }) => {
  // 格式化最后更新时间
  const formattedLastUpdated = new Date(lastUpdated).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return (
    <>
      <Head>
        <title>热门科技资讯 - 实时更新</title>
        <meta name="description" content="浏览当前最热门的科技新闻和趋势话题" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">热门科技资讯</h1>
          <p className="text-secondary-600">
            实时追踪全球科技领域的热门话题和趋势
          </p>
          <p className="text-sm text-secondary-500 mt-2">
            最后更新: {formattedLastUpdated}
          </p>
        </div>

        {/* 热门资讯列表 */}
        {trendingNews.length > 0 ? (
          <div className="space-y-6">
            {trendingNews.map((news: News) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="text-secondary-600 mb-2">
              暂无热门资讯
            </div>
            <p className="text-secondary-500">
              请稍后再来查看
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default TrendingPage;