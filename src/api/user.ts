import axios from 'axios';
import { News } from '@/types';

const API_URL = '/api/user';

// 获取用户保存的资讯列表
export const fetchSavedNews = async (): Promise<News[]> => {
  try {
    const response = await axios.get(`${API_URL}/saved`);
    return response.data.data.savedNews || [];
  } catch (error) {
    console.error('获取保存的资讯失败:', error);
    throw error;
  }
};

// 保存资讯
export const saveNews = async (newsId: string, categories: string | string[]): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/saved`, { newsId, categories });
    return response.data.data;
  } catch (error) {
    console.error('保存资讯失败:', error);
    throw error;
  }
};

// 取消保存资讯
export const unsaveNews = async (newsId: string): Promise<{ message: string }> => {
  try {
    const response = await axios.delete(`${API_URL}/saved/${newsId}`);
    return response.data.data;
  } catch (error) {
    console.error('取消保存资讯失败:', error);
    throw error;
  }
};