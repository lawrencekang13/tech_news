const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// 获取所有分类（支持树形结构）
router.get('/', categoryController.getAllCategories);

// 获取分类映射表
router.get('/mapping', categoryController.getCategoryMapping);

// 批量导入分类
router.post('/import', categoryController.importCategories);

// 获取单个分类详情
router.get('/:slug', categoryController.getCategoryBySlug);

// 创建新分类
router.post('/', categoryController.createCategory);

// 更新分类
router.put('/:id', categoryController.updateCategory);

// 删除分类
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;