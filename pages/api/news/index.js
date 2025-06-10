import connectDB from '../../../lib/db';
import News from '../../../models/News';
import { successResponse, errorResponse } from '../../../lib/apiResponse';
import redisClient from '../../../lib/redis';

/**
 * @desc    获取新闻列表
 * @route   GET /api/news
 * @access  Public
 * @params  page, limit, category, trending
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return errorResponse(res, '方法不允许', 405);
  }

  try {
    await connectDB();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const categoryId = req.query.category;
    const trending = req.query.trending === 'true';
    const realtime = req.query.realtime === 'true';

    // 构建缓存键
    const cacheKey = `news_list:${page}:${limit}:${categoryId || 'all'}:${trending}:${realtime}`;
    
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
    const query = {};
    if (categoryId) {
      query.category = categoryId;
    }
    if (trending) {
      query.trending = true;
    }
    if (realtime) {
      query.isRealtime = true;
    }

    // 执行查询
    const news = await News.find(query)
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // 使用lean()提高性能

    // 获取总数
    const total = await News.countDocuments(query);

    // 构建响应数据
    const responseData = {
      news,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    // 如果请求了特定分类，添加分类信息到响应中
    if (categoryId) {
      responseData.category = {
        id: categoryId,
        name: categoryId,
        description: ''
      };
    }

    // 缓存结果
    try {
      const cacheTime = parseInt(process.env.CACHE_TTL_NEWS_LIST) || 1800; // 30分钟
      await redisClient.set(cacheKey, JSON.stringify(responseData), cacheTime);
    } catch (cacheError) {
      console.warn('缓存写入失败:', cacheError);
    }

    return successResponse(res, responseData);
  } catch (error) {
    console.error('获取新闻列表失败:', error);
    return errorResponse(res, '获取新闻列表失败', 500);
  }
}