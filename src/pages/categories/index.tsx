import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from 'react-query';
import * as categoryService from '@/services/categoryService';
import { Category } from '@/types';

const CategoriesPage: React.FC = () => {
  // 获取所有分类
  const { data: categories = [], isLoading, isError } = useQuery(
    'allCategories',
    () => categoryService.getAllCategories(),
    {
      staleTime: 60 * 60 * 1000, // 1小时
    }
  );

  // 按照父分类ID对分类进行分组
  const groupedCategories = React.useMemo(() => {
    const grouped: Record<string, Category[]> = {};
    
    // 先找出所有顶级分类（没有父分类的）
    const topLevelCategories = categories.filter((category: Category) => !category.parentId);
    
    // 将顶级分类作为键，对应的值是该顶级分类下的所有子分类
    topLevelCategories.forEach((topCategory: Category) => {
      grouped[topCategory.id as keyof typeof grouped] = categories.filter(
        (category: Category) => category.parentId === topCategory.id
      );
    });
    
    return {
      topLevel: topLevelCategories,
      grouped
    };
  }, [categories]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-secondary-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-secondary-200 rounded w-2/3 mb-8"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-secondary-200 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-danger mb-2">获取分类列表失败</div>
        <button 
          className="btn-primary"
          onClick={() => window.location.reload()}
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>全部分类 - 科技前沿资讯</title>
        <meta name="description" content="浏览所有科技前沿资讯分类" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">全部分类</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 渲染顶级分类 */}
          {groupedCategories.topLevel.map((category: Category) => (
            <div key={category.id} className="border border-secondary-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <Link href={`/categories/${category.slug}`} className="block">
                <h2 className="text-xl font-semibold mb-3 text-primary-600 hover:text-primary-700 transition-colors">
                  {category.icon && <span className="mr-2">{category.icon}</span>}
                  {category.name}
                </h2>
              </Link>
              
              {category.description && (
                <p className="text-secondary-600 mb-4 text-sm">{category.description}</p>
              )}
              
              {/* 渲染子分类 */}
              {groupedCategories.grouped[category.id as keyof typeof groupedCategories.grouped]?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-secondary-700 mb-2">相关分类：</h3>
                  <div className="flex flex-wrap gap-2">
                    {groupedCategories.grouped[category.id as keyof typeof groupedCategories.grouped].map((subCategory: Category) => (
                      <Link 
                        key={subCategory.id} 
                        href={`/categories/${subCategory.slug}`}
                        className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded hover:bg-secondary-200 transition-colors"
                      >
                        {subCategory.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;