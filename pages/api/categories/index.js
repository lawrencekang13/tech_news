import connectDB from '../../../lib/db';
import Category from '../../../models/Category';
import { successResponse, errorResponse } from '../../../lib/apiResponse';
import redis from '../../../lib/redis';

/**
 * @desc    获取分类列表
 * @route   GET /api/categories
 * @access  Public
 */
export default async function handler(req, res) {
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

    // 缓存结果（5分钟）
    try {
      await redis.set(cacheKey, JSON.stringify(categories), 300);
    } catch (cacheError) {
      console.warn('Redis cache set error:', cacheError);
    }

    return successResponse(res, categories, '获取分类列表成功');
  } catch (error) {
    console.error('获取分类列表失败:', error);
    return errorResponse(res, '获取分类列表失败', 500);
  }
}