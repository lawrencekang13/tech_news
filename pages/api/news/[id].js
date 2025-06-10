import connectDB from '../../../lib/db';
import News from '../../../models/News';
import { successResponse, errorResponse } from '../../../lib/apiResponse';
import redisClient from '../../../lib/redis';
import mongoose from 'mongoose';

/**
 * @desc    获取新闻详情
 * @route   GET /api/news/:id
 * @access  Public
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return errorResponse(res, '方法不允许', 405);
  }

  try {
    await connectDB();

    const newsId = req.query.id;
    
    // 验证ID格式
    if (!newsId || newsId === 'undefined') {
      return errorResponse(res, '无效的新闻ID', 400);
    }
    
    // 检查是否为有效的MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return errorResponse(res, '无效的新闻ID格式', 400);
    }

    // 构建缓存键
    const cacheKey = `news_detail:${newsId}`;
    
    // 尝试从缓存获取数据
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        const newsData = JSON.parse(cachedData);
        // 异步更新浏览量
        updateViewCount(newsId);
        return successResponse(res, newsData);
      }
    } catch (cacheError) {
      console.warn('缓存读取失败:', cacheError);
    }

    const news = await News.findById(newsId).lean();
    
    if (!news) {
      return errorResponse(res, '新闻不存在', 404);
    }

    // 异步更新浏览量
    updateViewCount(newsId);

    // 缓存结果
    try {
      const cacheTime = parseInt(process.env.CACHE_TTL_NEWS_DETAIL) || 3600; // 1小时
      await redisClient.set(cacheKey, JSON.stringify(news), cacheTime);
    } catch (cacheError) {
      console.warn('缓存写入失败:', cacheError);
    }

    return successResponse(res, news);
  } catch (error) {
    console.error('获取新闻详情失败:', error);
    return errorResponse(res, '获取新闻详情失败', 500);
  }
}

/**
 * 异步更新浏览量
 * @param {string} newsId - 新闻ID
 */
async function updateViewCount(newsId) {
  try {
    await News.findByIdAndUpdate(newsId, { $inc: { views: 1 } });
  } catch (error) {
    console.error('更新浏览量失败:', error);
  }
}