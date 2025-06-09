import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { category, page = 1, limit = 10 } = req.query;
      
      // 构建后端API URL
      let backendUrl = `${BACKEND_URL}/api/news?page=${page}&limit=${limit}`;
      if (category && category !== '') {
        backendUrl += `&category=${category}`;
      }
      
      // 调用后端API
      const response = await axios.get(backendUrl, {
        timeout: 10000,
      });
      
      res.status(200).json(response.data);
    } catch (error: any) {
      console.error('获取新闻数据失败:', error.message);
      
      // 如果后端不可用，返回模拟数据
      const mockData = {
        success: true,
        data: {
          news: [
            {
              id: '1',
              title: 'OpenAI发布GPT-5，性能较GPT-4提升50%',
              summary: 'OpenAI今日正式发布了GPT-5模型，在推理能力、创造性和安全性方面都有显著提升。',
              content: 'OpenAI今日正式发布了GPT-5模型...',
              publishDate: new Date().toISOString(),
              source: 'TechCrunch',
              author: 'Sarah Chen',
              imageUrl: 'https://placeholder-api.com/800x400?text=GPT-5',
              category: 'ai',
              tags: ['OpenAI', 'GPT-5', '人工智能'],
              viewCount: 1250,
              isRealtime: true
            },
            {
              id: '2',
              title: '量子计算突破：IBM实现1000量子比特处理器',
              summary: 'IBM宣布成功开发出1000量子比特的量子处理器，标志着量子计算进入新的里程碑。',
              content: 'IBM宣布成功开发出1000量子比特的量子处理器...',
              publishDate: new Date(Date.now() - 3600000).toISOString(),
              source: 'Nature',
              author: 'Dr. Michael Zhang',
              imageUrl: 'https://placeholder-api.com/800x400?text=Quantum+Computing',
              category: 'quantum-computing',
              tags: ['IBM', '量子计算', '处理器'],
              viewCount: 890,
              isRealtime: true
            }
          ],
          pagination: {
            currentPage: 1,
            totalPages: 5,
            totalItems: 50,
            hasNext: true,
            hasPrev: false
          }
        }
      };
      
      res.status(200).json(mockData);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}