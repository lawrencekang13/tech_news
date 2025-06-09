import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;
  const page = req.query.page ? Number(req.query.page) : 1;
  
  if (req.method === 'GET') {
    try {
      // 调用后端API获取分类新闻
      const response = await axios.get(
        `${BACKEND_URL}/api/news?category=${slug}&page=${page}`,
        { timeout: 10000 }
      );
      
      res.status(200).json(response.data);
    } catch (error: any) {
      console.error(`获取分类 ${slug} 新闻失败:`, error.message);
      
      // 如果后端不可用，返回模拟数据
      const mockNewsData = {
        success: true,
        data: {
          news: [
            {
              id: '1',
              title: `${slug}领域的重大突破`,
              summary: `这是关于${slug}领域的一条模拟新闻，用于在后端API不可用时显示。`,
              category: slug as string,
              tags: ['科技', '创新'],
              publishDate: new Date().toISOString(),
              source: '科技前沿',
              sourceUrl: 'https://example.com',
              imageUrl: 'https://via.placeholder.com/800x450',
              author: '模拟作者'
            },
            {
              id: '2',
              title: `${slug}技术的最新应用`,
              summary: `这是另一条关于${slug}领域的模拟新闻，展示了该技术的最新应用场景。`,
              category: slug as string,
              tags: ['应用', '创新'],
              publishDate: new Date(Date.now() - 86400000).toISOString(), // 一天前
              source: '科技日报',
              sourceUrl: 'https://example.com',
              imageUrl: 'https://via.placeholder.com/800x450',
              author: '模拟作者'
            }
          ],
          pagination: {
            total: 2,
            page: page,
            pageSize: 10
          }
        },
        message: '获取分类新闻成功（模拟数据）'
      };
      
      res.status(200).json(mockNewsData);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}