// 移除对axios的依赖，使用fetch API
// import axios from 'axios';
import { Category } from '@/types';

const API_URL = '/api';

/**
 * 获取所有分类
 * @returns {Promise<Category[]>} 分类列表
 */
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('获取分类列表失败:', error);
    // 返回默认分类
    return [
      { id: '1', name: 'AI', slug: 'ai', description: '人工智能相关资讯', icon: '🤖' },
      { id: '2', name: '区块链', slug: 'blockchain', description: '区块链技术资讯', icon: '⛓️' },
      { id: '3', name: '量子计算', slug: 'quantum-computing', description: '量子计算前沿', icon: '⚛️' },
      { id: '4', name: '生物技术', slug: 'biotech', description: '生物技术创新', icon: '🧬' },
      { id: '5', name: '太空探索', slug: 'space', description: '太空科技发展', icon: '🚀' }
    ];
  }
};

/**
 * 根据slug获取分类详情
 * @param {string} slug 分类slug
 * @returns {Promise<Category|null>} 分类详情
 */
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  if (!slug) return null;
  
  try {
    const response = await fetch(`${API_URL}/categories/${slug}`);
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error(`获取分类 ${slug} 详情失败:`, error);
    return null;
  }
};

/**
 * 获取导航分类列表
 * @returns {Promise<Category[]>} 导航分类列表
 */
export const getNavCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/categories?nav=true`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('获取导航分类列表失败:', error);
    return [];
  }
};

// 为了向后兼容，添加getAllCategories别名
export const getAllCategories = fetchCategories;