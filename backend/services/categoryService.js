/**
 * 分类服务
 * 处理分类相关的功能，包括分类映射和查询等
 */

const Category = require('../models/Category');
// 移除cacheService引用

/**
 * 获取所有分类
 * @param {boolean} asTree - 是否以树形结构返回
 * @returns {Promise<Array>} - 分类数组
 */
async function getAllCategories(asTree = false) {
  try {
    // 从数据库获取所有分类
    const categories = await Category.find({ isActive: true }).sort({ 'metadata.priority': 1 });
    
    // 如果不需要树形结构，直接返回数组
    if (!asTree) {
      return categories;
    }
    
    // 构建树形结构
    const categoryTree = buildCategoryTree(categories);
    return categoryTree;
  } catch (error) {
    console.error('获取分类列表时出错:', error);
    return [];
  }
}

/**
 * 通过slug获取分类
 * @param {string} slug - 分类标识符
 * @returns {Promise<Object|null>} - 分类对象或null
 */
async function getCategoryBySlug(slug) {
  try {
    // 从数据库获取分类
    const category = await Category.findOne({ slug, isActive: true });
    if (!category) {
      return null;
    }
    
    // 获取子分类
    const children = await Category.find({ parentId: category._id, isActive: true });
    const result = category.toObject();
    result.children = children;
    
    return result;
  } catch (error) {
    console.error(`获取分类 ${slug} 时出错:`, error);
    return null;
  }
}

/**
 * 构建分类树
 * @param {Array} categories - 分类数组
 * @param {string|null} parentId - 父分类ID
 * @returns {Array} - 树形结构的分类数组
 */
function buildCategoryTree(categories, parentId = null) {
  return categories
    .filter(category => {
      // 如果parentId为null，则查找顶级分类
      // 否则查找指定父分类的子分类
      return parentId === null 
        ? !category.parentId 
        : category.parentId && category.parentId.toString() === parentId.toString();
    })
    .map(category => {
      // 转换为普通对象
      const categoryObj = category.toObject ? category.toObject() : category;
      
      // 递归查找子分类
      const children = buildCategoryTree(categories, category._id);
      if (children.length > 0) {
        categoryObj.children = children;
      }
      
      return categoryObj;
    });
}

/**
 * 获取分类映射表
 * 用于将各种分类名称映射到标准分类
 * @returns {Promise<Object>} - 分类映射表
 */
async function getCategoryMapping() {
  try {
    // 从数据库获取所有分类
    const categories = await Category.find({ isActive: true });
    
    // 构建映射表
    const mapping = {};
    
    categories.forEach(category => {
      // 添加主slug映射
      mapping[category.slug] = category.slug;
      
      // 添加别名映射
      if (Array.isArray(category.aliases)) {
        category.aliases.forEach(alias => {
          mapping[alias] = category.slug;
        });
      }
    });
    
    return mapping;
  } catch (error) {
    console.error('获取分类映射表时出错:', error);
    return {};
  }
}

/**
 * 映射分类名称到标准分类
 * @param {string} categoryName - 原始分类名称
 * @param {string} source - 来源名称（可选）
 * @returns {Promise<string>} - 映射后的标准分类
 */
async function mapCategoryName(categoryName, source = '') {
  try {
    if (!categoryName && !source) {
      return 'general';
    }
    
    // 获取分类映射表
    const mapping = await getCategoryMapping();
    
    // 尝试直接映射
    if (categoryName) {
      const normalizedName = categoryName.toLowerCase().trim();
      
      // 直接匹配
      if (mapping[normalizedName]) {
        return mapping[normalizedName];
      }
      
      // 部分匹配
      for (const [key, value] of Object.entries(mapping)) {
        if (normalizedName.includes(key)) {
          return value;
        }
      }
    }
    
    // 尝试从来源名称推断
    if (source) {
      const normalizedSource = source.toLowerCase().trim();
      
      for (const [key, value] of Object.entries(mapping)) {
        if (normalizedSource.includes(key)) {
          return value;
        }
      }
    }
    
    // 默认分类
    return 'general';
  } catch (error) {
    console.error('映射分类名称时出错:', error);
    return 'general';
  }
}

/**
 * 清除分类缓存（已禁用）
 * @returns {Promise<void>}
 */
async function clearCategoryCache() {
  try {
    // 缓存功能已禁用，此函数仅保留API兼容性
    console.log('缓存功能已禁用，无需清除分类缓存');
  } catch (error) {
    console.error('清除分类缓存时出错:', error);
  }
}

module.exports = {
  getAllCategories,
  getCategoryBySlug,
  getCategoryMapping,
  mapCategoryName,
  clearCategoryCache
};