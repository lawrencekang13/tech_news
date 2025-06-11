import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { getAllCategories, getCategoryBySlug } from '@/services/categoryService';
import { Category, News } from '@/types';
import NewsCard from '@/components/features/NewsCard';
import Layout from '@/components/layout/Layout';
import Head from 'next/head';

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await getAllCategories();
  
  return {
    paths: categories.map((category) => ({
      params: { slug: category.slug },
    })),
    fallback: 'blocking',
  };
};

const createDefaultCategory = (slug: string = 'unknown'): Category => ({
  id: '0',
  name: '未知分类',
  slug,
  description: '未找到该分类',
});

interface IParams extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as IParams;
  
  try {
    // 获取分类详情
    const category = await getCategoryBySlug(slug) || createDefaultCategory(slug);
    
    // 获取该分类下的新闻
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const newsUrl = `${API_BASE_URL}/api/category/${slug}?page=1&limit=20`;
    
    let news: News[] = [];
    try {
      const newsRes = await fetch(newsUrl);
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        news = newsData.data?.news || [];
      }
    } catch (newsError) {
      console.error('获取分类新闻失败:', newsError);
    }
    
    return {
      props: {
        category,
        news,
        lastUpdated: new Date().toISOString(),
      },
      revalidate: 60, // 每分钟重新生成页面
    };
  } catch (error) {
    console.error('获取分类数据失败:', error);
    return {
      props: {
        category: createDefaultCategory(slug),
        news: [],
        lastUpdated: new Date().toISOString(),
      },
      revalidate: 60,
    };
  }
};

interface CategoryPageProps {
  category: Category;
  news: News[];
  lastUpdated: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category, news, lastUpdated }) => {
  const router = useRouter();
  const { name, description } = category;

  if (router.isFallback) {
    return <div>加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{name} - 新闻分类</title>
        <meta name="description" content={description} />
      </Head>

      <Layout>
        <h1 className="text-3xl font-bold mb-4">{name}</h1>
        <p className="text-gray-600 mb-8">{description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item: News) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>

        {news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-secondary-500">暂无相关资讯</p>
          </div>
        )}

        <div className="text-sm text-secondary-500 mt-8 text-right">
          最后更新: {new Date(lastUpdated).toLocaleString()}
        </div>
      </Layout>
    </div>
  );
};

export default CategoryPage;
 

