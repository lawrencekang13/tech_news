import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/db';
import News from '../../../models/News';
import { successResponse, errorResponse } from '../../../lib/apiResponse';
import redis from '../../../lib/redis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { q, tag, category, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // 构建缓存键
    const cacheKey = `search:q:${q || ''}:tag:${tag || ''}:category:${category || ''}:page:${pageNum}:limit:${limitNum}`;

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
    
    // 文本搜索
    if (q) {
      query.$text = { $search: q as string };
    }
    
    // 标签过滤
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    // 分类过滤
    if (category) {
      query.category = category;
    }

    // 构建排序条件
    let sortCondition: any = {};
    if (q) {
      // 如果有文本搜索，按相关性排序
      sortCondition = { score: { $meta: 'textScore' }, publishedAt: -1 };
    } else {
      // 否则按发布时间排序
      sortCondition = { publishedAt: -1 };
    }

    // 执行搜索
    const searchQuery = News.find(query)
      .select('title summary author publishedAt category tags views likes comments thumbnail url')
      .sort(sortCondition)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // 如果有文本搜索，添加评分
    if (q) {
      searchQuery.select({ score: { $meta: 'textScore' } });
    }

    const [searchResults, total] = await Promise.all([
      searchQuery,
      News.countDocuments(query)
    ]);

    const result = {
      success: true,
      data: searchResults,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1
      },
      searchParams: {
        query: q || '',
        tag: tag || '',
        category: category || ''
      },
      message: '搜索完成'
    };

    // 缓存结果（3分钟）
    try {
      await redis.set(cacheKey, JSON.stringify(result), 180);
    } catch (cacheError) {
      console.warn('Redis cache set error:', cacheError);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('搜索新闻失败:', error);
    
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
      searchParams: {
        query: req.query.q || '',
        tag: req.query.tag || '',
        category: req.query.category || ''
      },
      message: '搜索完成（暂无数据）'
    };
    
    return res.status(200).json(fallbackResult);
  }
}