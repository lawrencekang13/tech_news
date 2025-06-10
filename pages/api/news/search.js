import connectDB from '../../../lib/db';
import News from '../../../models/News';
import { successResponse, errorResponse } from '../../../lib/apiResponse';
import redisClient from '../../../lib/redis';

/**
 * @desc    搜索新闻
 * @route   GET /api/news/search
 * @access  Public
 * @params  q, page, limit, category
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return errorResponse(res, '方法不允许', 405);
  }

  try {
    await connectDB();

    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;

    if (!query || query.trim() === '') {
      return errorResponse(res, '搜索关键词不能为空', 400);
    }

    // 构建缓存键
    const cacheKey = `search:${encodeURIComponent(query)}:${page}:${limit}:${category || 'all'}`;
    
    // 尝试从缓存获取数据
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return successResponse(res, JSON.parse(cachedData));
      }
    } catch (cacheError) {
      console.warn('缓存读取失败:', cacheError);
    }

    // 构建搜索条件
    const searchQuery = {
      $text: { $search: query }
    };

    if (category) {
      searchQuery.category = category;
    }

    // 执行搜索
    const searchResults = await News.find(searchQuery, {
      score: { $meta: 'textScore' }
    })
      .sort({ score: { $meta: 'textScore' }, publishDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // 获取搜索结果总数
    const total = await News.countDocuments(searchQuery);

    const responseData = {
      results: searchResults,
      query: query,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    // 缓存结果（搜索结果缓存时间较短）
    try {
      const cacheTime = 600; // 10分钟
      await redisClient.set(cacheKey, JSON.stringify(responseData), cacheTime);
    } catch (cacheError) {
      console.warn('缓存写入失败:', cacheError);
    }

    return successResponse(res, responseData);
  } catch (error) {
    console.error('搜索新闻失败:', error);
    return errorResponse(res, '搜索新闻失败', 500);
  }
}