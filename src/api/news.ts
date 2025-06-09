import { News, Category } from '@/types';
import axios from 'axios';

const API_URL = '/api';

// 获取资讯详情
export const fetchNewsDetail = async (id: string): Promise<News> => {
  // 检查ID是否有效
  if (!id || id === 'undefined') {
    throw new Error('无效的资讯ID');
  }
  
  try {
    const response = await axios.get(`${API_URL}/news/${id}`);
    if (!response.data || !response.data.data) {
      throw new Error('资讯数据格式错误');
    }
    return response.data.data;
  } catch (error) {
    console.error(`获取资讯详情失败:`, error);
    
    // 根据错误类型抛出不同的错误信息
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('资讯不存在或已被删除');
      } else if (error.response?.status === 500) {
        throw new Error('服务器内部错误，请稍后重试');
      } else {
        throw new Error('网络连接失败，请检查网络设置');
      }
    }
    
    throw error;
  }
};

// 获取分类列表
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data.data || [];
  } catch (error) {
    console.error('获取分类列表失败:', error);
    
    // 返回模拟数据（实际项目中应该使用真实API）
    return [
      {
        id: '1',
        slug: 'ai',
        name: '人工智能',
        description: '关于人工智能、机器学习、深度学习等领域的资讯',
        icon: '🤖',
        showInNav: true,
        priority: 1,
      },
      {
        id: '2',
        slug: 'cloud',
        name: '云计算',
        description: '关于云服务、云原生、容器化等领域的资讯',
        icon: '☁️',
        showInNav: true,
        priority: 2,
      },
      {
        id: '3',
        slug: 'security',
        name: '网络安全',
        description: '关于网络安全、数据安全、隐私保护等领域的资讯',
        icon: '🔒',
        showInNav: true,
        priority: 3,
      },
      {
        id: '4',
        slug: 'blockchain',
        name: '区块链',
        description: '关于区块链、加密货币、NFT等领域的资讯',
        icon: '⛓️',
        showInNav: true,
        priority: 4,
      },
      {
        id: '5',
        slug: 'iot',
        name: '物联网',
        description: '关于物联网、智能设备、智能家居等领域的资讯',
        icon: '📱',
        showInNav: true,
        priority: 5,
      },
      {
        id: '6',
        slug: 'ar-vr',
        name: 'AR/VR',
        description: '关于增强现实、虚拟现实等领域的资讯',
        icon: '👓',
        showInNav: false,
        priority: 6,
      },
    ];
  }
};