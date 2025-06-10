// 移除对axios的依赖，使用fetch API
// import axios from 'axios';
import { News } from '@/types';

const API_URL = '/api/user';

// 获取用户保存的资讯列表
export const fetchSavedNews = async (): Promise<News[]> => {
  try {
    const response = await fetch(`${API_URL}/saved`);
    const data = await response.json();
    return data.data.savedNews || [];
  } catch (error) {
    console.error('获取保存的资讯失败:', error);
    throw error;
  }
};

// 保存资讯
export const saveNews = async (newsId: string, categories: string | string[]): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_URL}/saved`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newsId, categories }),
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('保存资讯失败:', error);
    throw error;
  }
};

// 取消保存资讯
export const unsaveNews = async (newsId: string): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_URL}/saved/${newsId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('取消保存资讯失败:', error);
    throw error;
  }
};