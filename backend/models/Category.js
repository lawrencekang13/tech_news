const mongoose = require('mongoose');

/**
 * 分类模式
 * 支持层级结构和元数据
 */
const CategorySchema = new mongoose.Schema({
  // 分类ID，用作URL友好的标识符
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  // 分类名称（显示用）
  name: { 
    type: String, 
    required: true 
  },
  // 分类描述
  description: { 
    type: String, 
    default: '' 
  },
  // 父分类ID，用于创建层级结构
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    default: null 
  },
  // 分类图标（可选）
  icon: { 
    type: String, 
    default: null 
  },
  // 分类顺序（用于自定义排序）
  order: { 
    type: Number, 
    default: 0 
  },
  // 是否在导航中显示
  showInNav: { 
    type: Boolean, 
    default: true 
  },
  // 分类别名（用于映射外部分类）
  aliases: [{ 
    type: String 
  }],
  // 元数据（可扩展的键值对）
  metadata: { 
    type: Map, 
    of: String, 
    default: () => ({}) 
  },
  // 是否启用
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

// 创建索引
CategorySchema.index({ slug: 1 });
CategorySchema.index({ parentId: 1 });
CategorySchema.index({ aliases: 1 });

// 虚拟字段：完整路径
CategorySchema.virtual('path').get(function() {
  return this.parentId ? `${this.parentId.path}/${this.slug}` : this.slug;
});

// 预处理钩子：确保slug格式正确
CategorySchema.pre('save', function(next) {
  if (this.slug) {
    // 转换为小写，移除特殊字符，用连字符替换空格
    this.slug = this.slug
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s]+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Category', CategorySchema);