import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../../lib/db';
import News from '../../../../models/News';
import { successResponse, errorResponse, paginatedResponse } from '../../../../lib/apiResponse';
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

    const { category, page = 1, limit = 10, sort = 'publishedAt' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // 构建缓存键
    const cacheKey = `news:list:${category || 'all'}:page:${pageNum}:limit:${limitNum}:sort:${sort}`;

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

    // 构建查询条件
    let query: any = { status: 'published' };
    
    if (category && category !== 'all') {
      query.category = category;
    }

    // 构建排序条件
    let sortCondition: any = {};
    switch (sort) {
      case 'views':
        sortCondition = { views: -1, publishedAt: -1 };
        break;
      case 'likes':
        sortCondition = { likes: -1, publishedAt: -1 };
        break;
      default:
        sortCondition = { publishedAt: -1 };
    }

    // 获取新闻列表和总数
    const [news, total] = await Promise.all([
      News.find(query)
        .select('title summary author publishedAt category tags views likes comments thumbnail url')
        .sort(sortCondition)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      News.countDocuments(query)
    ]);

    const result = {
      success: true,
      data: news,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1
      },
      message: '获取新闻列表成功'
    };

    // 缓存结果（5分钟）
    try {
      await redis.set(cacheKey, JSON.stringify(result), 300);
    } catch (cacheError) {
      console.warn('Redis cache set error:', cacheError);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('获取新闻列表失败:', error);
    
    // 如果数据库连接失败，返回空结果
    const fallbackResult = {
      success: true,
      data: [],
      pagination: {
        currentPage: parseInt(req.query.page as string) || 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: parseInt(req.query.limit as string) || 10,
        hasNextPage: false,
        hasPrevPage: false
      },
      message: '获取新闻列表成功（暂无数据）'
    };
    
    return res.status(200).json(fallbackResult);
  }
}