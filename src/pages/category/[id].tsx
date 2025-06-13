import React, { useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NewsCard from '@/components/features/NewsCard';
import { News, Category } from '@/types';
import { getAllCategoriesServer } from '@/services/serverCategoryService';

interface CategoryPageProps {
  category: Category;
  news: News[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
  lastUpdated: string;
}

// 获取所有可能的路径
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    console.log('BUILD_LOG_CATEGORIES_ID: getStaticPaths - Fetching categories directly from database');
    
    // 直接调用服务器端服务，不使用 fetch
    const categories = await getAllCategoriesServer(true);
    
    console.log('BUILD_LOG_CATEGORIES_ID: getStaticPaths - Categories data:', JSON.stringify(categories, null, 2));
    
    // 为每个分类生成路径
    const paths = categories.map((category: Category) => ({
      params: { id: category.slug },
    }));
    
    return {
      paths,
      // fallback: true 表示如果请求的路径不在预渲染的路径中，
      // Next.js 将在客户端渲染页面
      fallback: true,
    };
  } catch (error) {
    console.error('BUILD_LOG_CATEGORIES_ID: getStaticPaths - Error:', error);
    
    // 出错时返回空路径
    return {
      paths: [],
      fallback: true,
    };
  }
};

// 为每个路径获取数据
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.id as string;
  
  try {
    console.log('BUILD_LOG_CATEGORIES_ID: getStaticProps - Fetching category and news directly from database');
    
    // 直接调用服务器端服务获取分类信息
    const { getCategoryBySlugServer } = await import('@/services/serverCategoryService');
    const { getNewsByCategoryServer } = await import('@/services/serverNewsService');
    
    let category;
    try {
      category = await getCategoryBySlugServer(slug);
      console.log('BUILD_LOG_CATEGORIES_ID: getStaticProps - Category data:', JSON.stringify(category, null, 2));
      
      if (!category) {
        console.log('BUILD_LOG_CATEGORIES_ID: getStaticProps - Category not found, returning notFound');
        return {
          notFound: true,
        };
      }
    } catch (error) {
      console.error('BUILD_LOG_CATEGORIES_ID: getStaticProps - Error fetching category:', error);
      return {
        notFound: true,
      };
    }
    
    // 获取该分类下的新闻
     let news: News[] = [];
     let pagination = { total: 0, page: 1, pageSize: 10 };
    try {
      const result = await getNewsByCategoryServer(slug, 1, 10);
      news = result.news || [];
      pagination = result.pagination || pagination;
      console.log('BUILD_LOG_CATEGORIES_ID: getStaticProps - News data:', JSON.stringify({ news, pagination }, null, 2));
    } catch (error) {
      console.error('BUILD_LOG_CATEGORIES_ID: getStaticProps - Error fetching news:', error);
      news = [];
    }
    
    return {
      props: {
        category,
        news,
        pagination,
        lastUpdated: new Date().toISOString(),
      },
      revalidate: 900, // 15分钟后重新生成页面
    };
  } catch (error) {
    console.error('BUILD_LOG_CATEGORIES_ID: getStaticProps - Error:', error);
    
    // 出错时返回 notFound
    return {
      notFound: true,
    };
  }
};



const CategoryPage: React.FC<CategoryPageProps> = ({ 
  category, 
  news,
  pagination,
  lastUpdated 
}) => {
  const router = useRouter();
  const [sortOption, setSortOption] = useState('latest');
  
  // 如果页面正在fallback状态，显示加载状态
  if (router.isFallback) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-secondary-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-secondary-200 rounded w-2/3 mb-8"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-secondary-200 rounded mb-4"></div>
          ))}
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
  
  // 处理排序变化
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    // 在实际应用中，这里可能需要重新获取数据或者重新排序现有数据
  };

  return (
    <>
      <Head>
        <title>{category?.name || '加载中...'} - 科技前沿资讯</title>
        <meta name="description" content={category?.description || ''} />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category?.name || '加载中...'}</h1>
          <p className="text-gray-600">{category?.description || ''}</p>
          <p className="text-sm text-secondary-500 mt-2">
            最后更新: {formattedLastUpdated}
          </p>
        </div>

        {/* 排序选项 */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-secondary-600">
            共 {pagination?.total || 0} 条资讯
          </div>
          <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-secondary-600">排序：</label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="select-primary"
            >
              <option value="latest">最新发布</option>
              <option value="oldest">最早发布</option>
            </select>
          </div>
        </div>

        {/* 资讯列表 */}
        {news?.length > 0 ? (
          <div className="space-y-6">
            {news.map((item: News) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="text-secondary-600">
              该分类下暂无资讯
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryPage;
