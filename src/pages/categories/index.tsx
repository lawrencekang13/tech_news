import React from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { getAllCategories } from '@/services/categoryService';
import { Category } from '@/types';
import Layout from '@/components/layout/Layout';
import Head from 'next/head';

export const getStaticProps: GetStaticProps = async () => {
  try {
    const categories = await getAllCategories();
    
    return {
      props: {
        categories,
        lastUpdated: new Date().toISOString(),
      },
      revalidate: 300, // 每5分钟重新生成页面
    };
  } catch (error) {
    console.error('获取分类列表失败:', error);
    return {
      props: {
        categories: [],
        lastUpdated: new Date().toISOString(),
      },
      revalidate: 60,
    };
  }
};

interface CategoriesPageProps {
  categories: Category[];
  lastUpdated: string;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ categories, lastUpdated }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>新闻分类 - 全球科技新闻</title>
        <meta name="description" content="浏览所有新闻分类，找到您感兴趣的科技资讯" />
      </Head>

      <Layout>
        <h1 className="text-3xl font-bold mb-8">新闻分类</h1>
        <p className="text-gray-600 mb-8">选择您感兴趣的分类，获取最新的科技资讯</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: Category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 cursor-pointer border border-gray-200 hover:border-blue-300">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">{category.name}</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{category.description}</p>
                <div className="mt-4 text-blue-600 text-sm font-medium">
                  查看更多 →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">暂无分类数据</p>
          </div>
        )}

        <div className="text-sm text-gray-500 mt-8 text-right">
          最后更新: {new Date(lastUpdated).toLocaleString()}
        </div>
      </Layout>
    </div>
  );
};

export default CategoriesPage;
 

