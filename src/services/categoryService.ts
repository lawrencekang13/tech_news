import axios from 'axios';
import { Category } from '@/types';

const API_URL = '/api';

/**
 * 获取所有分类
 * @returns {Promise<Category[]>} 分类列表
 */
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data.data || [];
  } catch (error) {
    console.error('获取分类列表失败:', error);
    return [];
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
    const response = await axios.get(`${API_URL}/categories/${slug}`);
    return response.data.data || null;
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
    const response = await axios.get(`${API_URL}/categories?nav=true`);
    return response.data.data || [];
  } catch (error) {
    console.error('获取导航分类列表失败:', error);
    return [];
  }
};