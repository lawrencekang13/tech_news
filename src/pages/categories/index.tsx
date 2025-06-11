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
export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const { id: slug } = params as { id: string };
    
    // 获取分类详情
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const categoryUrl = `<span class="math-inline">\{API\_BASE\_URL\}/api/categories/</span>{slug}`;
    
    console.log('BUILD_LOG_CATEGORIES_ID: getStaticProps - Fetching category detail from:', categoryUrl); // <-- 添加日志
    const categoryRes = await fetch(categoryUrl);
    
    if (!categoryRes.ok) {
      const errorText = await categoryRes.text();
      console.error(`BUILD_LOG_CATEGORIES_ID: getStaticProps - Category API response not OK: ${categoryRes.status} - ${errorText}`); // <-- 详细错误日志
      throw new Error(`获取分类详情失败: ${categoryRes.status}`);
    }
    
    const categoryData = await categoryRes.json();
    console.log('BUILD_LOG_CATEGORIES_ID: getStaticProps - Category API response data:', JSON.stringify(categoryData, null, 2)); // <-- 打印完整数据
    const category = categoryData.data || createDefaultCategory(slug);
    
    // 获取该分类下的新闻
    const newsUrl = `<span class="math-inline">\{API\_BASE\_URL\}/api/category/</span>{slug}?page=1`;
    
    console.log('BUILD_LOG_CATEGORIES_ID: getStaticProps - Fetching category news from:', newsUrl); // <-- 添加日志
    const newsRes = await fetch(newsUrl);
    
    if (!newsRes.ok) {
