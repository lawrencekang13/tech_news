const mongoose = require('mongoose');

// 保存的资讯模式
const SavedNewsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  newsId: {
    type: String,
    required: true
  },
  categories: {
    type: [String],  // 修改为字符串数组，支持多个分类
    required: true,
    default: []      // 默认为空数组
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

// 创建复合索引，确保每个用户只能保存同一条资讯一次
SavedNewsSchema.index({ userId: 1, newsId: 1 }, { unique: true });

module.exports = mongoose.model('SavedNews', SavedNewsSchema);