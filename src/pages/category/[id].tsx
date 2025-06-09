import React, { useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NewsCard from '@/components/features/NewsCard';
import { News, Category } from '@/types';

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
    // 获取所有分类的slug
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const apiUrl = `${protocol}://${host}/api/categories?nav=true`;
    
    const res = await fetch(apiUrl);
    
    if (!res.ok) {
      throw new Error(`获取分类失败: ${res.status}`);
    }
    
    const data = await res.json();
    const categories = data.data || [];
    
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
    console.error('获取分类路径失败:', error);
    
    // 出错时返回空路径
    return {
      paths: [],
      fallback: true,
    };
  }
};

// 为每个路径获取数据
export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const { id: slug } = params as { id: string };
    
    // 获取分类详情
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const categoryUrl = `${protocol}://${host}/api/categories/${slug}`;
    
    const categoryRes = await fetch(categoryUrl);
    
    if (!categoryRes.ok) {
      throw new Error(`获取分类详情失败: ${categoryRes.status}`);
    }
    
    const categoryData = await categoryRes.json();
    const category = categoryData.data || createDefaultCategory(slug);
    
    // 获取该分类下的新闻
    const newsUrl = `${protocol}://${host}/api/category/${slug}?page=1`;
    
    const newsRes = await fetch(newsUrl);
    
    if (!newsRes.ok) {
      throw new Error(`获取分类新闻失败: ${newsRes.status}`);
    }
    
    const newsData = await newsRes.json();
    const { news = [], pagination = { total: 0, page: 1, pageSize: 10 } } = newsData.data || {};
    
    // 返回props给页面组件
    return {
      props: {
        category,
        news,
        pagination,
        lastUpdated: new Date().toISOString(),
      },
      // 设置页面重新生成的时间间隔（秒）
      // 每15分钟重新获取数据
      revalidate: 900,
    };
  } catch (error) {
    console.error('获取分类详情失败:', error);
    
    // 如果获取数据失败，返回默认数据
    return {
      props: {
        category: createDefaultCategory(params?.id as string || 'unknown'),
        news: [],
        pagination: { total: 0, page: 1, pageSize: 10 },
        lastUpdated: new Date().toISOString(),
      },
      // 即使返回默认数据，也需要设置revalidate
      revalidate: 60, // 1分钟后重试
    };
  }
};

// 创建默认分类
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