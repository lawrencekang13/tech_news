const Category = require('../models/Category');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    获取所有分类
 * @route   GET /api/categories
 * @access  Public
 * @params  includeInactive - 是否包含未激活的分类
 */
exports.getAllCategories = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    const showInactive = includeInactive === 'true';
    
    // 构建查询条件
    const query = {};
    if (!showInactive) {
      query.isActive = true;
    }
    
    // 执行查询
    const categories = await Category.find(query).sort({ order: 1, name: 1 });
    
    // 构建分类树结构
    const categoryTree = buildCategoryTree(categories);
    
    return successResponse(res, categoryTree);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    通过slug获取分类
 * @route   GET /api/categories/:slug
 * @access  Public
 */
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    // 查询分类
    const category = await Category.findOne({ slug });
    
    if (!category) {
      return errorResponse(res, '分类不存在', 404);
    }
    
    return successResponse(res, category);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    创建新分类
 * @route   POST /api/categories
 * @access  Private/Admin
 */
exports.createCategory = async (req, res, next) => {
  try {
    const { slug, name, description, parentId, icon, order, showInNav, aliases, metadata } = req.body;
    
    // 检查slug是否已存在
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return errorResponse(res, '分类标识符已存在', 400);
    }
    
    // 如果指定了父分类，检查其是否存在
    if (parentId) {
      const parentCategory = await Category.findById(parentId);
      if (!parentCategory) {
        return errorResponse(res, '父分类不存在', 400);
      }
    }
    
    // 创建新分类
    const newCategory = new Category({
      slug,
      name,
      description,
      parentId: parentId || null,
      icon,
      order: order || 0,
      showInNav: showInNav !== undefined ? showInNav : true,
      aliases: aliases || [],
      metadata: metadata || {}
    });
    
    // 保存到数据库
    await newCategory.save();
    
    return successResponse(res, newCategory, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新分类
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // 不允许直接更新slug（防止URL变化导致的问题）
    if (updateData.slug) {
      delete updateData.slug;
    }
    
    // 查找并更新分类
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return errorResponse(res, '分类不存在', 404);
    }
    
    return successResponse(res, updatedCategory);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除分类
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 检查是否有子分类
    const childCategories = await Category.find({ parentId: id });
    if (childCategories.length > 0) {
      return errorResponse(res, '无法删除含有子分类的分类，请先删除或移动子分类', 400);
    }
    
    // 查找分类
    const category = await Category.findById(id);
    if (!category) {
      return errorResponse(res, '分类不存在', 404);
    }
    
    // 删除分类
    await category.remove();
    
    return successResponse(res, { message: '分类已成功删除' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    批量导入分类
 * @route   POST /api/categories/import
 * @access  Private/Admin
 */
exports.importCategories = async (req, res, next) => {
  try {
    const { categories } = req.body;
    
    if (!Array.isArray(categories) || categories.length === 0) {
      return errorResponse(res, '无效的分类数据', 400);
    }
    
    // 批量插入分类
    const result = await Category.insertMany(categories, { ordered: false });
    
    return successResponse(res, { 
      message: '分类导入成功', 
      count: result.length 
    }, 201);
  } catch (error) {
    // 处理重复键错误
    if (error.code === 11000) {
      return errorResponse(res, '部分分类导入失败：存在重复的slug', 400);
    }
    next(error);
  }
};

/**
 * @desc    获取分类映射表
 * @route   GET /api/categories/mapping
 * @access  Public
 */
exports.getCategoryMapping = async (req, res, next) => {
  try {
    // 查询所有活跃分类
    const categories = await Category.find({ isActive: true });
    
    // 构建映射表
    const mapping = {};
    
    categories.forEach(category => {
      // 主slug映射
      mapping[category.slug] = category.slug;
      
      // 别名映射
      if (Array.isArray(category.aliases)) {
        category.aliases.forEach(alias => {
          mapping[alias] = category.slug;
        });
      }
    });
    
    return successResponse(res, mapping);
  } catch (error) {
    next(error);
  }
};

/**
 * 构建分类树结构
 * @param {Array} categories - 分类列表
 * @returns {Array} - 树形结构的分类列表
 */
function buildCategoryTree(categories) {
  // 创建ID到分类的映射
  const categoryMap = {};
  categories.forEach(category => {
    categoryMap[category._id] = {
      ...category.toObject(),
      children: []
    };
  });
  
  // 构建树结构
  const rootCategories = [];
  
  categories.forEach(category => {
    if (category.parentId && categoryMap[category.parentId]) {
      // 将当前分类添加到父分类的children数组中
      categoryMap[category.parentId].children.push(categoryMap[category._id]);
    } else {
      // 没有父分类或父分类不存在，作为根分类
      rootCategories.push(categoryMap[category._id]);
    }
  });
  
  return rootCategories;
}