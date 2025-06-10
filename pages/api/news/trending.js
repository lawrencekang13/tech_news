import connectDB from '../../../lib/db';
import News from '../../../models/News';
import { successResponse, errorResponse } from '../../../lib/apiResponse';
import redisClient from '../../../lib/redis';

/**
 * @desc    获取热门新闻
 * @route   GET /api/news/trending
 * @access  Public
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return errorResponse(res, '方法不允许', 405);
  }

  try {
    await connectDB();

    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;

    // 构建缓存键
    const cacheKey = `trending_news:${limit}:${category || 'all'}`;
    
    // 尝试从缓存获取数据
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return successResponse(res, JSON.parse(cachedData));
      }
    } catch (cacheError) {
      console.warn('缓存读取失败:', cacheError);
    }

    // 构建查询条件
    const query = { trending: true };
    if (category) {
      query.category = category;
    }

    // 执行查询 - 按浏览量和发布时间排序
    const trendingNews = await News.find(query)
      .sort({ views: -1, publishDate: -1 })
      .limit(limit)
      .lean();

    const responseData = {
      trendingNews,
      total: trendingNews.length
    };

    // 缓存结果
    try {
      const cacheTime = parseInt(process.env.CACHE_TTL_TRENDING) || 900; // 15分钟
      await redisClient.set(cacheKey, JSON.stringify(responseData), cacheTime);
    } catch (cacheError) {
      console.warn('缓存写入失败:', cacheError);
    }

    return successResponse(res, responseData);
  } catch (error) {
    console.error('获取热门新闻失败:', error);
    return errorResponse(res, '获取热门新闻失败', 500);
  }
}