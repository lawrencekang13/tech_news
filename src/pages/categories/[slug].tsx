// src/pages/categories/[slug].tsx

import React, { useState } from 'react';
// 修正：确保 GetStaticPaths 和 GetStaticProps 都被导入
import { GetStaticProps, GetStaticPaths } from 'next'; 
import { useRouter } from 'next/router';
import Head from 'next/head';
import NewsCard from '@/components/features/NewsCard';
import { News, Category } from '@/types';

// ... (imports and interface CategoryPageProps remain the same)

// 获取所有可能的路径
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${API_BASE_URL}/api/categories?nav=true`;
    
    console.log('BUILD_LOG_CATEGORIES_ID: getStaticPaths - Fetching categories from:', apiUrl); // <-- 添加日志
    const res = await fetch(apiUrl);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`BUILD_LOG_CATEGORIES_ID: getStaticPaths - API response not OK: ${res.status} - ${errorText}`); // <-- 详细错误日志
      throw new Error(`获取分类失败: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('BUILD_LOG_CATEGORIES_ID: getStaticPaths - API response data:', JSON.stringify(data, null, 2)); // <-- 打印完整数据
    
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
    console.error('BUILD_LOG_CATEGORIES_ID: getStaticPaths - Error:', error); // <-- 捕获错误日志
    
    // 出错时返回空路径
    return {
      paths: [],
      fallback: true,
    };
  }
};

// 为每个路径获取数据
// ❗ 修正这里的类型定义，明确指出返回的是 GetStaticPropsResult
export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({ params }) => {
  try {
    const { id: slug } = params as { id: string };
    
    // 获取分类详情
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const categoryUrl = `${API_BASE_URL}/api/categories/${slug}`;
    
    console.log('BUILD_LOG_CATEGORIES_ID: getStaticProps - Fetching category detail from:', categoryUrl); // <-- 添加日志
    const categoryRes = await fetch(categoryUrl);
    
    if (!categoryRes.ok) {
      const errorText = await categoryRes.text();
      console.error(`BUILD_LOG_CATEGORIES_ID: getStaticProps - Category API response not OK: ${categoryRes.status} - ${errorText}`); // <-- 详细错误日志
      // 这里的 throw error 会被 catch 捕获，确保 catch 块的返回是完整的
      throw new Error(`获取分类详情失败: ${categoryRes.status}`);
    }
    
    const categoryData = await categoryRes.json();
    console.log('BUILD_LOG_CATEGORIES_ID: getStaticProps - Category API response data:', JSON.stringify(categoryData, null, 2)); // <-- 打印完整数据
    const category = categoryData.data || createDefaultCategory(slug);
    
    // 获取该分类下的新闻
    const newsUrl = `${API_BASE_URL}/api/category/${slug}?page=1`;
    
    console.log('BUILD_LOG_CATEGORIES_ID: getStaticProps - Fetching category news from:', newsUrl); // <-- 添加日志
    const newsRes = await fetch(newsUrl);
    
    if (!newsRes.ok) {
      const errorText = await newsRes.text();
      console.error(`BUILD_LOG_CATEGORIES_ID: getStaticProps - News API response not OK: ${newsRes.status} - ${errorText}`); // <-- 详细错误日志
      // 这里的 throw error 会被 catch 捕获，确保 catch 块的返回是完整的
      throw new Error(`获取分类新闻失败: ${newsRes.status}`);
    }
    
    const newsData = await newsRes.json();
    console.log('BUILD_LOG_CATEGORIES_ID: getStaticProps - News API response data:', JSON.stringify(newsData, null, 2)); // <-- 打印完整数据
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
    console.error('BUILD_LOG_CATEGORIES_ID: getStaticProps - Error:', error); // <-- 捕获错误日志
    
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

// ... (createDefaultCategory 和 CategoryPage 组件代码保持不变)
