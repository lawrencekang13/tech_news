const News = require('../models/News');
const { successResponse, errorResponse } = require('../utils/apiResponse');
// 移除未使用的cacheService引用
const dataSourceService = require('../services/dataSourceService');

/**
 * @desc    获取新闻列表
 * @route   GET /api/news
 * @access  Public
 * @params  page, limit, category, trending
 */
exports.getNewsList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const categoryId = req.query.category; // Renamed for clarity
    const trending = req.query.trending === 'true';
    const realtime = req.query.realtime === 'true';
    

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
      .sort({ publishDate: -1 }) // 默认按最新发布排序，可根据 sort 参数调整
      .skip(skip)
      .limit(limit);

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
      // 从分类服务获取分类详情
      const categoryService = require('../services/categoryService');
      const category = await categoryService.getCategoryBySlug(categoryId);
      
      if (category) {
        responseData.category = {
          id: category.slug,
          name: category.name,
          description: category.description,
          icon: category.icon,
          metadata: category.metadata
        };
      } else {
        responseData.category = { id: categoryId, name: categoryId, description: '' };
      }
    }

    // 返回结果
    return successResponse(res, responseData);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    获取新闻详情
 * @route   GET /api/news/:id
 * @access  Public
 */
exports.getNewsDetail = async (req, res, next) => {
  try {
    const newsId = req.params.id;
    
    // 验证ID格式
    if (!newsId || newsId === 'undefined') {
      return errorResponse(res, '无效的新闻ID', 400);
    }
    
    // 检查是否为有效的MongoDB ObjectId
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return errorResponse(res, '无效的新闻ID格式', 400);
    }

    const news = await News.findById(newsId);

    if (!news) {
      return errorResponse(res, '新闻不存在或已被删除', 404);
    }
    
    // 如果是实时新闻，异步更新浏览量
    if (news.isRealtime) {
      dataSourceService.updateNewsViewCount(newsId).catch(err => {
        console.error(`更新新闻浏览量时出错: ${err.message}`);
      });
    }

    return successResponse(res, news);
  } catch (error) {
    console.error(`获取新闻详情时出错: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    搜索新闻
 * @route   GET /api/news/search
 * @access  Public
 * @params  keyword, tags, category, page, limit
 */
exports.searchNews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const keyword = req.query.keyword || '';
    const tags = req.query.tags ? req.query.tags.split(',') : [];
    const categorySlug = req.query.category || '';
    const sort = req.query.sort || 'date'; // 'date', 'relevance'

    // 构建查询条件
    const query = {};

    // 关键词搜索（标题、摘要、内容）
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { summary: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } }
      ];
    }

    // 标签筛选
    if (tags.length > 0) {
      query.tags = { $in: tags };
    }

    // 分类筛选
    if (categorySlug) {
      // 使用分类服务获取分类信息
      const categoryService = require('../services/categoryService');
      const category = await categoryService.getCategoryBySlug(categorySlug);
      
      if (category) {
        // 如果找到分类，使用其slug进行筛选
        query.category = categorySlug;
      } else {
        // 如果找不到分类，尝试使用原始值
        query.category = categorySlug;
      }
    }

    // 执行查询
    const news = await News.find(query)
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit);

    // 获取总数
    const total = await News.countDocuments(query);

    // 返回结果
    return successResponse(res, {
      news,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    获取热门新闻
 * @route   GET /api/news/trending
 * @access  Public
 */
exports.getTrendingNews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    // 查询热门新闻
    const trendingNews = await News.find({ trending: true })
      .sort({ viewCount: -1, publishDate: -1 })
      .limit(limit);
    
    return successResponse(res, trendingNews);
  } catch (error) {
    next(error);
  }
};