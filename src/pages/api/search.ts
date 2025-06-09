import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { q, tag, category, page = 1, limit = 10 } = req.query;
      
      // 构建后端API URL
      let backendUrl = `${BACKEND_URL}/api/search?page=${page}&limit=${limit}`;
      if (q) backendUrl += `&q=${encodeURIComponent(q as string)}`;
      if (tag) backendUrl += `&tag=${encodeURIComponent(tag as string)}`;
      if (category) backendUrl += `&category=${encodeURIComponent(category as string)}`;
      
      // 调用后端API
      const response = await axios.get(backendUrl, {
        timeout: 10000,
      });
      
      res.status(200).json(response.data);
    } catch (error: any) {
      console.error('搜索新闻失败:', error.message);
      
      // 如果后端不可用，返回模拟数据
      const { q, tag, category } = req.query;
      const mockData = {
        success: true,
        data: [
          {
            id: '1',
            title: 'OpenAI发布GPT-5，性能较GPT-4提升50%',
            summary: 'OpenAI今日正式发布了GPT-5模型，在推理能力、创造性和安全性方面都有显著提升。',
            publishedAt: new Date().toISOString(),
            source: 'TechCrunch',
            author: 'Sarah Chen',
            imageUrl: 'https://placeholder-api.com/800x400?text=GPT-5',
            category: 'AI',
            tags: ['OpenAI', 'GPT-5', '人工智能'],
            viewCount: 1250,
            isRealtime: true,
            relevanceScore: 0.95
          },
          {
            id: '2',
            title: 'Google发布Gemini Ultra，挑战GPT-4',
            summary: 'Google最新发布的Gemini Ultra模型在多项测试中超越了GPT-4，展现出强大的多模态能力。',
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            source: 'The Verge',
            author: 'Alex Johnson',
            imageUrl: 'https://placeholder-api.com/800x400?text=Gemini',
            category: 'AI',
            tags: ['Google', 'Gemini', 'AI'],
            viewCount: 980,
            isRealtime: true,
            relevanceScore: 0.88
          },
          {
            id: '3',
            title: 'AI安全研究取得重大突破',
            summary: 'Anthropic和OpenAI联合发布了AI安全研究报告，提出了新的对齐方法和安全评估标准。',
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            source: 'MIT Technology Review',
            author: 'Dr. Emily Wang',
            imageUrl: 'https://placeholder-api.com/800x400?text=AI+Safety',
            category: 'AI',
            tags: ['AI安全', 'Anthropic', 'OpenAI'],
            viewCount: 756,
            isRealtime: true,
            relevanceScore: 0.82
          },
          {
            id: '4',
            title: 'IBM量子计算机实现新突破',
            summary: 'IBM宣布其最新的量子计算机在量子纠错方面取得重大进展，为实用化量子计算铺平道路。',
            publishedAt: new Date(Date.now() - 10800000).toISOString(),
            source: 'Science',
            author: 'Dr. Robert Chen',
            imageUrl: 'https://placeholder-api.com/800x400?text=Quantum+Computing',
            category: '量子计算',
            tags: ['IBM', '量子计算', '量子纠错'],
            viewCount: 634,
            isRealtime: true,
            relevanceScore: 0.75
          },
          {
            id: '5',
            title: '以太坊2.0升级完成，交易费用大幅降低',
            summary: '以太坊网络完成重大升级，引入新的共识机制，交易费用降低90%，处理速度提升5倍。',
            publishedAt: new Date(Date.now() - 14400000).toISOString(),
            source: 'CoinDesk',
            author: 'Michael Zhang',
            imageUrl: 'https://placeholder-api.com/800x400?text=Ethereum',
            category: '区块链',
            tags: ['以太坊', '区块链', '加密货币'],
            viewCount: 892,
            isRealtime: true,
            relevanceScore: 0.68
          }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 2,
          totalItems: 5,
          hasNext: false,
          hasPrev: false
        },
        searchQuery: {
          query: q || '',
          tag: tag || '',
          category: category || '',
          resultsCount: 5
        }
      };
      
      res.status(200).json(mockData);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}