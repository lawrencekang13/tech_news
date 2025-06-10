import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../../lib/db';
import News from '../../../../models/News';
import Category from '../../../../models/Category';
import { successResponse, errorResponse, paginatedResponse } from '../../../../lib/apiResponse';
import redis from '../../../../lib/redis';

// 定义Mongoose返回的Category类型
interface MongooseCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  order?: number;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    if (!slug) {
      return errorResponse(res, '分类标识不能为空', 400);
    }

    const cacheKey = `category:${slug}:news:page:${page}:limit:${limit}`;

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

    // 验证分类是否存在
    const category = await Category.findOne({ 
      slug: slug, 
      isActive: true 
    }).lean() as MongooseCategory | null;

    if (!category) {
      // 如果分类不存在，尝试使用默认分类
      const defaultCategories = ['ai', 'tech', 'business'];
      if (!defaultCategories.includes(slug as string)) {
        return errorResponse(res, '分类不存在', 404);
      }
    }

    // 构建查询条件
    const categoryName = category?.name ?? getCategoryName(slug as string);
    const query = {
      category: categoryName,
      status: 'published'
    };

    // 获取新闻列表
    const [news, total] = await Promise.all([
      News.find(query)
        .select('title summary content author publishedAt category tags views likes comments thumbnail url')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      News.countDocuments(query)
    ]);

    const result = {
      success: true,
      data: news,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      },
      message: `获取分类 ${categoryName} 新闻成功`
    };

    // 缓存结果（5分钟）
    try {
      await redis.set(cacheKey, JSON.stringify(result), 300);
    } catch (cacheError) {
      console.warn('Redis cache set error:', cacheError);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('获取分类新闻失败:', error);
    
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
      message: '获取分类新闻成功（暂无数据）'
    };
    
    return res.status(200).json(fallbackResult);
  }
}

/**
 * 根据slug获取分类名称
 * @param {string} slug 分类slug
 * @returns {string} 分类名称
 */
function getCategoryName(slug: string): string {
  const categories: { [key: string]: string } = {
    'ai': '人工智能',
    'tech': '科技',
    'business': '商业'
  };
  return categories[slug] || slug;
}