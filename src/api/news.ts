import { News, Category } from '@/types';
// 移除对axios的依赖，使用fetch API
// import axios from 'axios';

const API_URL = '/api';

// 获取资讯详情
export const fetchNewsById = async (id: string): Promise<News> => {
  try {
    const response = await fetch(`${API_URL}/news/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('新闻不存在');
      }
      throw new Error(data.message || '获取新闻详情失败');
    }
    
    return data.data;
  } catch (error) {
    console.error('获取新闻详情失败:', error);
    throw error;
  }
};

// 获取分类列表
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    const data = await response.json();
    return data.data || [];
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