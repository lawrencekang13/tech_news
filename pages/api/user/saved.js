import connectDB from '../../../lib/db';
import News from '../../../models/News';
import SavedNews from '../../../models/SavedNews';
import { successResponse, errorResponse } from '../../../lib/apiResponse';

/**
 * @desc    用户保存的资讯管理
 * @route   GET/POST/DELETE /api/user/saved
 * @access  Private (需要用户认证)
 */
export default async function handler(req, res) {
  try {
    await connectDB();

    // 在实际项目中，userId应该从认证中间件获取
    // 这里为了演示，我们使用请求中的userId或默认值
    const userId = req.headers['x-user-id'] || req.body?.userId || 'default-user-id';

    switch (req.method) {
      case 'GET':
        return await getSavedNews(req, res, userId);
      case 'POST':
        return await saveNews(req, res, userId);
      case 'DELETE':
        return await unsaveNews(req, res, userId);
      default:
        return errorResponse(res, '方法不允许', 405);
    }
  } catch (error) {
    console.error('用户保存资讯操作失败:', error);
    return errorResponse(res, '操作失败', 500);
  }
}

/**
 * 获取用户保存的资讯列表
 */
async function getSavedNews(req, res, userId) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 获取用户保存的所有资讯ID
    const savedNewsItems = await SavedNews.find({ userId })
      .sort({ savedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // 如果没有保存的资讯，返回空数组
    if (savedNewsItems.length === 0) {
      return successResponse(res, { 
        savedNews: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0
        }
      });
    }
    
    // 获取所有资讯的详细信息
    const newsIds = savedNewsItems.map(item => item.newsId);
    const newsItems = await News.find({ _id: { $in: newsIds } }).lean();
    
    // 将保存时间添加到资讯对象中
    const savedNews = newsItems.map(news => {
      const savedItem = savedNewsItems.find(item => item.newsId === news._id.toString());
      return {
        ...news,
        savedAt: savedItem?.savedAt,
        savedCategories: savedItem?.categories || []
      };
    });

    // 获取总数
    const total = await SavedNews.countDocuments({ userId });
    
    return successResponse(res, { 
      savedNews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('获取保存的资讯失败:', error);
    return errorResponse(res, '获取保存的资讯失败', 500);
  }
}

/**
 * 保存资讯
 */
async function saveNews(req, res, userId) {
  try {
    const { newsId, categories = [] } = req.body;
    
    if (!newsId) {
      return errorResponse(res, '资讯ID不能为空', 400);
    }
    
    // 检查资讯是否存在
    const newsExists = await News.findById(newsId);
    if (!newsExists) {
      return errorResponse(res, '资讯不存在', 404);
    }
    
    // 检查是否已经保存过
    const existingSaved = await SavedNews.findOne({ userId, newsId });
    if (existingSaved) {
      return errorResponse(res, '资讯已经保存过了', 409);
    }
    
    // 创建保存记录
    const savedNews = new SavedNews({
      userId,
      newsId,
      categories: Array.isArray(categories) ? categories : [categories].filter(Boolean)
    });
    
    await savedNews.save();
    
    return successResponse(res, {
      message: '资讯保存成功',
      savedNews: {
        id: savedNews._id,
        newsId: savedNews.newsId,
        categories: savedNews.categories,
        savedAt: savedNews.savedAt
      }
    }, '资讯保存成功', 201);
  } catch (error) {
    console.error('保存资讯失败:', error);
    return errorResponse(res, '保存资讯失败', 500);
  }
}

/**
 * 取消保存资讯
 */
async function unsaveNews(req, res, userId) {
  try {
    const newsId = req.query.id || req.body?.newsId;
    
    if (!newsId) {
      return errorResponse(res, '资讯ID不能为空', 400);
    }
    
    // 查找并删除保存记录
    const deletedSaved = await SavedNews.findOneAndDelete({ userId, newsId });
    
    if (!deletedSaved) {
      return errorResponse(res, '未找到保存的资讯', 404);
    }
    
    return successResponse(res, {
      message: '取消保存成功',
      deletedSaved: {
        id: deletedSaved._id,
        newsId: deletedSaved.newsId,
        savedAt: deletedSaved.savedAt
      }
    }, '取消保存成功');
  } catch (error) {
    console.error('取消保存资讯失败:', error);
    return errorResponse(res, '取消保存资讯失败', 500);
  }
}