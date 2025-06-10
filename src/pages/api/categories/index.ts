import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../../lib/db';
import Category from '../../../../models/Category';
import { successResponse, errorResponse } from '../../../../lib/apiResponse';
import redis from '../../../../lib/redis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { nav } = req.query;
    const cacheKey = nav ? 'categories:nav' : 'categories:all';

    // 尝试从Redis获取缓存
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        const categories = JSON.parse(cached);
        return successResponse(res, categories, '获取分类列表成功');
      }
    } catch (cacheError) {
      console.warn('Redis cache error:', cacheError);
    }

    // 构建查询
    let query = { isActive: true };
    
    // 如果是导航请求，只返回基本信息
    let selectFields = nav ? 'name slug icon color order' : '';
    
    const categories = await Category.find(query)
      .select(selectFields)
      .sort({ order: 1, name: 1 })
      .lean();

    // 如果没有分类数据，返回默认分类
    if (!categories || categories.length === 0) {
      const defaultCategories = [
        {
          _id: '1',
          name: '人工智能',
          slug: 'ai',
          icon: '🤖',
          color: '#3B82F6',
          order: 1,
          description: '人工智能相关新闻'
        },
        {
          _id: '2',
          name: '科技',
          slug: 'tech',
          icon: '💻',
          color: '#10B981',
          order: 2,
          description: '科技行业新闻'
        },
        {
          _id: '3',
          name: '商业',
          slug: 'business',
          icon: '💼',
          color: '#F59E0B',
          order: 3,
          description: '商业财经新闻'
        }
      ];
      
      return successResponse(res, defaultCategories, '获取分类列表成功');
    }

    // 缓存结果（5分钟）
    try {
      await redis.set(cacheKey, JSON.stringify(categories), 300);
    } catch (cacheError) {
      console.warn('Redis cache set error:', cacheError);
    }

    return successResponse(res, categories, '获取分类列表成功');
  } catch (error) {
    console.error('获取分类列表失败:', error);
    
    // 如果数据库连接失败，返回默认分类
    const fallbackCategories = [
      {
        _id: '1',
        name: '人工智能',
        slug: 'ai',
        icon: '🤖',
        color: '#3B82F6',
        order: 1
      },
      {
        _id: '2',
        name: '科技',
        slug: 'tech',
        icon: '💻',
        color: '#10B981',
        order: 2
      }
    ];
    
    return successResponse(res, fallbackCategories, '获取分类列表成功（使用默认数据）');
  }
}