import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // 获取查询参数
    const { nav, parent, limit = 50 } = req.query;
    
    // 处理nav参数，确保它是字符串
    const navValue = Array.isArray(nav) ? nav[0] : nav;
    
    try {
      // 构建请求URL
      let url = `${BACKEND_URL}/api/categories`;
      const params = new URLSearchParams();
      
      if (navValue) params.append('nav', navValue);
      
      // 处理其他参数
      const parentValue = Array.isArray(parent) ? parent[0] : parent;
      if (parentValue) params.append('parent', parentValue);
      
      const limitValue = Array.isArray(limit) ? limit[0] : limit;
      if (limitValue) params.append('limit', limitValue as string);
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
      
      // 调用后端API获取分类列表
      const response = await axios.get(url, { timeout: 10000 });
      
      res.status(200).json(response.data);
    } catch (error: any) {
      console.error('获取分类列表失败:', error.message);
      
      // 如果后端不可用，返回模拟数据
      const mockCategories = [
        {
          id: '1',
          slug: 'ai',
          name: '人工智能',
          description: '人工智能领域的最新发展和突破',
          showInNav: true,
          icon: 'ai-icon',
          priority: 10
        },
        {
          id: '2',
          slug: 'quantum-computing',
          name: '量子计算',
          description: '量子计算技术的前沿研究和应用',
          showInNav: true,
          icon: 'quantum-icon',
          priority: 20
        },
        {
          id: '3',
          slug: 'blockchain',
          name: '区块链',
          description: '区块链和加密货币的最新动态',
          showInNav: true,
          icon: 'blockchain-icon',
          priority: 30
        },
        {
          id: '4',
          slug: 'biotech',
          name: '生物科技',
          description: '生物技术和医疗健康的创新进展',
          showInNav: true,
          icon: 'biotech-icon',
          priority: 40
        }
      ];
      
      // 根据查询参数过滤模拟数据
      let filteredCategories = [...mockCategories];
      
      // 使用之前定义的navValue变量
      if (navValue === 'true') {
        filteredCategories = filteredCategories.filter(cat => cat.showInNav === true);
      }
      
      const mockData = {
        success: true,
        data: filteredCategories,
        message: '获取分类列表成功（模拟数据）'
      };
      
      res.status(200).json(mockData);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}