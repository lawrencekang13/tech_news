// src/pages/categories/[slug].tsx

import React, { useState } from 'react';
import { GetStaticProps, GetStaticPaths, GetStaticPropsResult } from 'next'; // 确保 GetStaticPropsResult 也被导入
import { useRouter } from 'next/router';
import Head from 'next/head';
import NewsCard from '@/components/features/NewsCard';
import { News, Category } from '@/types'; // 确保 News 和 Category 类型被正确导入

// 接口定义必须在 getStaticProps 使用它之前
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
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${API_BASE_URL}/api/categories?nav=true`;
    
    console.log('BUILD_LOG_CATEGORIES_ID: getStaticPaths - Fetching categories from:', apiUrl);
    const res = await fetch(apiUrl);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`BUILD_LOG_CATEGORIES_ID: getStaticPaths - API response not OK: ${res.status} - ${errorText}`);
      throw new Error(`获取分类失败: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('BUILD_LOG_CATEGORIES_ID: getStaticPaths - API response data:', JSON.stringify(data, null, 2));
    
    const categories = data.data || [];
    
    const paths = categories.map((category: Category) => ({
      params: { id: category.slug },
    }));
    
    return {
      paths,
      fallback: true,
    };
  } catch (error) {
    console.error('BUILD_LOG_CATEGORIES_ID: getStaticPaths - Error:', error);
    return {
      paths: [],
      fallback: true,
    };
  }
};

// 为每个路径获取数据
// 确保 CategoryPageProps 接口在定义 getStaticProps 之前就已经存在
export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({ params }) => {
  try {
    const { id: slug } = params as { id: string };
    
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const categoryUrl = `${API_BASE_URL}/api/categories/${slug}`;
    
    console.log('BUILD_LOG_CATEGORIES_ID: getStaticProps - Fetching category detail from:', categoryUrl);
    const categoryRes = await fetch(categoryUrl);
    
    if (!categoryRes.ok) {
      const errorText = await categoryRes.text();
      console.error(`BUILD_LOG_CATEGORIES_ID: getStaticProps - Category API response not OK: ${categoryRes.status} - ${errorText}`);
      throw new Error(`获取分类详情失败: ${categoryRes.status}`);
    }
    
    const categoryData = await categoryRes.json();
    console.log('BUILD_LOG_CATEGORIES_ID: getStaticProps - Category API response data:', JSON.stringify(categoryData, null, 2));
    const category = categoryData.data || createDefaultCategory(slug);
    
    const newsUrl = `${API_BASE_URL}/api/category/${slug}?page=1`;
    
    console.log('BUILD_LOG_CATEGORIES_ID: getStaticProps - Fetching category news from:', newsUrl);
    const newsRes = await fetch(newsUrl);
    
    if (!newsRes.ok) {
      const errorText = await newsRes.text();
      console.error(`BUILD_LOG_CATEGORIES_ID: getStaticProps - News API response not OK: ${newsRes.status} - ${errorText}`);
      throw new Error(`获取分类新闻失败: ${newsRes.status}`);
    }
    
    const newsData = await newsRes.json();
    console.log('BUILD_LOG_CATEGORIES_ID: getStaticProps - News API response data:', JSON.stringify(newsData, null, 2));
    const { news = [], pagination = { total: 0, page: 1, pageSize: 10 } } = newsData.data || {};
    
    return {
      props: {
        category,
        news,
        pagination,
        lastUpdated: new Date().toISOString(),
      },
      revalidate: 900,
    };
  } catch (error) {
    console.error('BUILD_LOG_CATEGORIES_ID: getStaticProps - Error:', error);
    
    return {
      props: {
        category: createDefaultCategory(params?.id as string || 'unknown'),
        news: [],
        pagination: { total: 0, page: 1, pageSize: 10 },
        lastUpdated: new Date().toISOString(),
      },
      revalidate: 60,
    };
  }
};

const createDefaultCategory = (slug: string): Category => {
  return {
    id: slug,
    slug: slug,
    name: slug,
    description: `关于${slug}的最新资讯`,
    showInNav: false,
    aliases: [],
    metadata: {}
  };
};

const CategoryPage: React.FC<CategoryPageProps> = ({ 
  category, 
  news,
  pagination,
  lastUpdated 
}) => {
  const router = useRouter();
  const [sortOption, setSortOption] = useState('latest');
  
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
  
  const formattedLastUpdated = new Date(lastUpdated).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
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
