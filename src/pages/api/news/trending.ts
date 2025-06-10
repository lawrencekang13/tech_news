import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../../lib/db';
import News from '../../../../models/News';
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

    const { limit = 5 } = req.query;
    const limitNum = parseInt(limit as string);

    // 构建缓存键
    const cacheKey = `news:trending:limit:${limitNum}`;

    // 尝试从Redis获取缓存
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        const result = JSON.parse(cached);
        return res.status(200).json(result);
      }
    } catch (cacheError) {
      console.warn('Redis cache error:', cacheError);
    }

    // 获取热门新闻（按浏览量和点赞数排序）
    const trendingNews = await News.find({ 
      status: 'published',
      publishedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // 最近7天
    })
      .select('title summary author publishedAt category tags views likes comments thumbnail url')
      .sort({ 
        views: -1, 
        likes: -1, 
        publishedAt: -1 
      })
      .limit(limitNum)
      .lean();

    const result = {
      success: true,
      data: trendingNews,
      message: '获取热门新闻成功'
    };

    // 缓存结果（10分钟）
    try {
      await redis.set(cacheKey, JSON.stringify(result), 600);
    } catch (cacheError) {
      console.warn('Redis cache set error:', cacheError);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('获取热门新闻失败:', error);
    
    // 如果数据库连接失败，返回空结果
    const fallbackResult = {
      success: true,
      data: [],
      message: '获取热门新闻成功（暂无数据）'
    };
    
    return res.status(200).json(fallbackResult);
  }
}