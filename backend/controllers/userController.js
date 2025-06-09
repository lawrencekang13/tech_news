const SavedNews = require('../models/SavedNews');
const News = require('../models/News');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    获取用户保存的资讯列表
 * @route   GET /api/user/saved
 * @access  Private
 */
exports.getSavedNews = async (req, res) => {
  try {
    // 在实际项目中，userId应该从认证中间件获取
    // 这里为了演示，我们使用请求中的userId或默认值
    const userId = req.userId || 'default-user-id';
    
    // 获取用户保存的所有资讯ID
    const savedNewsItems = await SavedNews.find({ userId }).sort({ savedAt: -1 });
    
    // 如果没有保存的资讯，返回空数组
    if (savedNewsItems.length === 0) {
      return successResponse(res, { savedNews: [] });
    }
    
    // 获取所有资讯的详细信息
    const newsIds = savedNewsItems.map(item => item.newsId);
    const newsItems = await News.find({ id: { $in: newsIds } });
    
    // 将保存时间添加到资讯对象中
    const savedNews = newsItems.map(news => {
      const savedItem = savedNewsItems.find(item => item.newsId === news.id);
      return {
        ...news.toObject(),
        savedAt: savedItem.savedAt,
        savedCategories: savedItem.categories // 更新为categories数组
      };
    });
    
    return successResponse(res, { savedNews });
  } catch (error) {
    console.error('获取保存的资讯失败:', error);
    return errorResponse(res, '获取保存的资讯失败', 500);
  }
};

/**
 * @desc    保存资讯
 * @route   POST /api/user/saved
 * @access  Private
 */
exports.saveNews = async (req, res) => {
  try {
    const { newsId, categories } = req.body;
    
    // 验证请求数据
    if (!newsId) {
      return errorResponse(res, '资讯ID不能为空', 400);
    }
    
    // 确保categories是数组
    const categoriesToSave = Array.isArray(categories) ? categories : 
                           (categories ? [categories] : []);
    
    // 在实际项目中，userId应该从认证中间件获取
    const userId = req.userId || 'default-user-id';
    
    // 检查资讯是否存在
    const newsExists = await News.findOne({ id: newsId });
    if (!newsExists) {
      return errorResponse(res, '资讯不存在', 404);
    }
    
    // 创建或更新保存的资讯
    await SavedNews.findOneAndUpdate(
      { userId, newsId },
      { userId, newsId, categories: categoriesToSave },
      { upsert: true, new: true }
    );
    
    return successResponse(res, { message: '资讯保存成功' });
  } catch (error) {
    console.error('保存资讯失败:', error);
    
    // 处理重复保存的情况
    if (error.code === 11000) {
      return successResponse(res, { message: '资讯已保存' });
    }
    
    return errorResponse(res, '保存资讯失败', 500);
  }
};

/**
 * @desc    取消保存资讯
 * @route   DELETE /api/user/saved/:id
 * @access  Private
 */
exports.unsaveNews = async (req, res) => {
  try {
    const { id: newsId } = req.params;
    
    // 在实际项目中，userId应该从认证中间件获取
    const userId = req.userId || 'default-user-id';
    
    // 删除保存的资讯
    const result = await SavedNews.findOneAndDelete({ userId, newsId });
    
    if (!result) {
      return errorResponse(res, '未找到保存的资讯', 404);
    }
    
    return successResponse(res, { message: '已取消保存资讯' });
  } catch (error) {
    console.error('取消保存资讯失败:', error);
    return errorResponse(res, '取消保存资讯失败', 500);
  }
};