// pages/news/[id].tsx

import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
// 如果您在页面组件中使用了 React Query，请确保正确导入
// import { useQuery } from 'react-query'; 
// 如果您在页面组件中使用了 date-fns，请确保正确导入
// import { format } from 'date-fns';
// import { zhCN } from 'date-fns/locale';
// 如果您在页面组件中使用了 react-hot-toast，请确保正确导入
// import { toast } from 'react-hot-toast'; 

// 导入你的类型定义
import { News, RelatedNews, StructuredInfoData, VisualizationData } from '@/types'; 

// 如果您的页面组件中直接调用了API函数，请确保导入
// import { fetchNewsDetail, fetchCategories } from '@/api/news';
// import { saveNews as saveNewsToCategory, unsaveNews, fetchSavedNews as apiFetchSavedNews } from '@/api/user';

// 如果您的页面组件中直接使用了这些组件，请确保导入
// import StructuredInfo from '@/components/features/StructuredInfo';
// import Visualization from '@/components/features/Visualization';
// import AIInsightCard from '@/components/features/AIInsightCard';
// import CategorySelectionModal from '@/components/features/CategorySelectionModal';

interface NewsDetailPageProps {
  news: News;
  relatedNews: News[];
  lastUpdated: string;
}

// 定义后端 API 的基础 URL
// 在构建时（Node.js环境）和客户端运行时都会使用
// 确保在 .env.local 或 .env.production 中设置 NEXT_PUBLIC_API_BASE_URL
// 例如：NEXT_PUBLIC_API_BASE_URL=http://localhost:3000 (本地开发时后端地址)
// 部署到AWS后，需要设置为你的 API Gateway 或 CloudFront 的 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'; 

// 获取所有可能的路径 (getStaticPaths)
// 用于静态生成动态路由页面
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // 直接调用服务器端服务获取热门新闻
    const { getTrendingNewsServer } = await import('@/services/serverNewsService');
    const news = await getTrendingNewsServer(50);
    
    // 为每个新闻生成路径
    const paths = news.map((item: News) => ({
      params: { id: item.id },
    }));
    
    return {
      paths,
      fallback: 'blocking', // 对于未预渲染的页面，在服务器端渲染
    };
  } catch (error) {
    console.error('getStaticPaths error:', error);
    
    // 出错时返回空路径
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

// 为每个路径获取数据 (getStaticProps)
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;
  
  try {
    // 直接调用服务器端服务获取新闻详情
    const { getNewsByIdServer, getRelatedNewsServer } = await import('@/services/serverNewsService');
    
    console.log('BUILD_LOG_NEWS_ID: getStaticProps - Fetching news detail directly from database');
    
    const news = await getNewsByIdServer(id);
    
    if (!news) {
      return {
        notFound: true,
      };
    }
    
    console.log('BUILD_LOG_NEWS_ID: getStaticProps - News data:', JSON.stringify(news, null, 2));
    
    // 获取相关新闻
     let relatedNews: News[] = [];
    try {
      relatedNews = await getRelatedNewsServer(id, news.category, 5);
      console.log('BUILD_LOG_NEWS_ID: getStaticProps - Related news data:', JSON.stringify(relatedNews, null, 2));
    } catch (relatedError) {
      console.error('BUILD_LOG_NEWS_ID: getStaticProps - Error fetching related news:', relatedError);
    }
    
    return {
      props: {
        news,
        relatedNews,
        lastUpdated: new Date().toISOString(),
      },
      revalidate: 300, // 5分钟后重新生成页面
    };
  } catch (error) {
    console.error('BUILD_LOG_NEWS_ID: getStaticProps - Error:', error);
    
    // 出错时返回 notFound
    return {
      notFound: true,
    };
  }
};

const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ 
  news, 
  relatedNews,
  lastUpdated 
}) => {
  const router = useRouter();
  
  // 如果页面正在fallback状态（首次访问未预渲染的SSG/ISR页面），显示加载状态
  if (router.isFallback) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-secondary-200 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-secondary-200 rounded w-1/3 mb-8"></div>
          <div className="h-64 bg-secondary-200 rounded mb-6"></div>
          <div className="h-4 bg-secondary-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-secondary-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }
  
  // 格式化最后更新时间
  const formattedLastUpdated = new Date(lastUpdated).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  // 格式化发布日期
  const formattedPublishDate = new Date(news.publishDate).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Head>
        <title>{news.title} - 科技资讯</title>
        <meta name="description" content={news.summary} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
          
          <div className="flex flex-wrap items-center text-secondary-600 mb-6">
            <span className="mr-4">
              <span className="font-medium">来源:</span> {news.source}
            </span>
            <span className="mr-4">
              <span className="font-medium">发布于:</span> {formattedPublishDate}
            </span>
            {news.category && (
              <Link 
                href={`/category/${news.category}`}
                className="mr-4 text-primary-600 hover:underline"
              >
                #{news.category}
              </Link>
            )}
          </div>
          
          <p className="text-sm text-secondary-500 mb-6">
            此页面最后更新于: {formattedLastUpdated}
          </p>
        </div>

        {/* 新闻内容 */}
        <div className="prose max-w-none mb-8">
          {(news as any).image && (
            <div className="mb-6">
              <img 
                src={(news as any).image}
                alt={news.title} 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}
          
          <div className="bg-secondary-50 border-l-4 border-primary-500 p-4 mb-6">
            <p className="font-medium">{news.summary}</p>
          </div>
          
          <div dangerouslySetInnerHTML={{ __html: news.content || '<p>暂无详细内容</p>' }} />
        </div>

        {/* 标签 */}
        {news.tags && news.tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">相关标签</h2>
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag: string) => (
                <Link 
                  key={tag} 
                  href={`/search?tag=${encodeURIComponent(tag)}`}
                  className="bg-secondary-100 hover:bg-secondary-200 text-secondary-800 px-3 py-1 rounded-full text-sm transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 相关新闻 */}
        {relatedNews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">相关资讯</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((item: News) => (
                <div key={item.id} className="border border-secondary-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <Link href={`/news/${item.id}`}>
                    {(item as any).image && (
                      <img 
                        src={(item as any).image}
                        alt={item.title} 
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-medium text-lg mb-2 line-clamp-2">{item.title}</h3>
                      <p className="text-secondary-600 text-sm line-clamp-3">{item.summary}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 返回按钮 */}
        <div className="mt-8 flex justify-between items-center">
          <button 
            onClick={() => router.back()}
            className="btn-secondary"
          >
            返回上一页
          </button>
          
          {/* 这里保留 '查看动态版本' 链接，尽管SSG+fallback 'blocking' 意味着所有页面最终都是静态生成的 */}
          <Link 
            href={`/news/${news.id}`} 
            className="text-primary-600 hover:underline"
          >
            查看动态版本
          </Link>
        </div>
      </div>
    </>
  );
};

export default NewsDetailPage;
