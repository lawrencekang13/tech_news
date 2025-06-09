import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;
  
  if (req.method === 'GET') {
    try {
      // 调用后端API获取分类详情
      const response = await axios.get(
        `${BACKEND_URL}/api/categories/${slug}`,
        { timeout: 10000 }
      );
      
      res.status(200).json(response.data);
    } catch (error: any) {
      console.error(`获取分类 ${slug} 详情失败:`, error.message);
      
      // 如果后端不可用，返回模拟数据
      const mockCategoryData = {
        success: true,
        data: {
          id: '1',
          slug: slug,
          name: getCategoryName(slug as string),
          description: getCategoryDescription(slug as string),
          showInNav: true,
          icon: `${slug}-icon`,
          aliases: [],
          metadata: {
            color: '#3B82F6',
            relatedCategories: ['ai', 'tech']
          }
        },
        message: '获取分类详情成功（模拟数据）'
      };
      
      res.status(200).json(mockCategoryData);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function getCategoryName(slug: string): string {
  const categories: { [key: string]: string } = {
    'ai': '人工智能',
    'quantum-computing': '量子计算',
    'blockchain': '区块链',
    'biotech': '生物科技',
    'ar-vr': 'AR/VR',
    'autonomous-vehicles': '自动驾驶'
  };
  return categories[slug] || slug;
}

function getCategoryDescription(slug: string): string {
  const descriptions: { [key: string]: string } = {
    'ai': '人工智能领域的最新发展和突破',
    'quantum-computing': '量子计算技术的前沿研究和应用',
    'blockchain': '区块链和加密货币的最新动态',
    'biotech': '生物技术和医疗健康的创新进展',
    'ar-vr': '虚拟现实和增强现实技术的发展',
    'autonomous-vehicles': '自动驾驶技术的最新进展'
  };
  return descriptions[slug] || `${slug}相关的科技新闻`;
}