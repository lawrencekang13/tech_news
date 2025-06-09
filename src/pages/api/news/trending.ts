import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { limit = 5 } = req.query;
      
      // 构建后端API URL
      const backendUrl = `${BACKEND_URL}/api/news/trending?limit=${limit}`;
      
      // 调用后端API
      const response = await axios.get(backendUrl, {
        timeout: 10000,
      });
      
      // 返回数据
      res.status(200).json(response.data);
    } catch (error: any) {
      console.error('获取热门新闻失败:', error.message);
      
      // 返回错误响应
      res.status(error.response?.status || 500).json({
        success: false,
        message: '获取热门新闻失败',
        error: error.message
      });
    }
  } else {
    // 不支持的HTTP方法
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ 
      success: false, 
      message: `不支持 ${req.method} 方法` 
    });
  }
}