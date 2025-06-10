import connectDB from '../../../lib/db';
import Category from '../../../models/Category';
import { successResponse, errorResponse } from '../../../lib/apiResponse';
import redis from '../../../lib/redis';

/**
 * @desc    获取分类详情
 * @route   GET /api/categories/:slug
 * @access  Public
 */
export default async function handler(req, res) {
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
    return errorResponse(res, '获取分类详情失败', 500);
  }
}