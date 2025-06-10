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

    const { slug } = req.query;
    
    if (!slug) {
      return errorResponse(res, '分类标识不能为空', 400);
    }

    const cacheKey = `category:${slug}`;

    // 尝试从Redis获取缓存
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        const category = JSON.parse(cached);
        return successResponse(res, category, '获取分类详情成功');
      }
    } catch (cacheError) {
      console.warn('Redis cache error:', cacheError);
    }

    const category = await Category.findOne({ 
      slug: slug, 
      isActive: true 
    }).lean();

    if (!category) {
      // 返回默认分类数据
      const defaultCategory = getDefaultCategory(slug as string);
      if (defaultCategory) {
        return successResponse(res, defaultCategory, '获取分类详情成功（默认数据）');
      }
      return errorResponse(res, '分类不存在', 404);
    }

    // 缓存结果（10分钟）
    try {
      await redis.set(cacheKey, JSON.stringify(category), 600);
    } catch (cacheError) {
      console.warn('Redis cache set error:', cacheError);
    }

    return successResponse(res, category, '获取分类详情成功');
  } catch (error) {
    console.error('获取分类详情失败:', error);
    
    // 如果数据库连接失败，返回默认分类
    const defaultCategory = getDefaultCategory(req.query.slug as string);
    if (defaultCategory) {
      return successResponse(res, defaultCategory, '获取分类详情成功（默认数据）');
    }
    
    return errorResponse(res, '获取分类详情失败', 500);
  }
}

function getDefaultCategory(slug: string) {
  const defaultCategories: { [key: string]: any } = {
    'ai': {
      _id: '1',
      name: '人工智能',
      slug: 'ai',
      description: '人工智能领域的最新发展和突破',
      icon: '🤖',
      color: '#3B82F6',
      order: 1,
      isActive: true
    },
    'tech': {
      _id: '2',
      name: '科技',
      slug: 'tech',
      description: '科技行业的最新动态和创新',
      icon: '💻',
      color: '#10B981',
      order: 2,
      isActive: true
    },
    'business': {
      _id: '3',
      name: '商业',
      slug: 'business',
      description: '商业财经领域的重要资讯',
      icon: '💼',
      color: '#F59E0B',
      order: 3,
      isActive: true
    }
  };
  
  return defaultCategories[slug] || null;
}