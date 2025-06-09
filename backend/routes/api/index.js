const express = require('express');
const router = express.Router();

// 导入路由
const newsRoutes = require('./news');
const categoryRoutes = require('../categoryRoutes');
const userRoutes = require('./user');

// 使用路由
router.use('/news', newsRoutes);
router.use('/categories', categoryRoutes);
router.use('/user', userRoutes);

module.exports = router;