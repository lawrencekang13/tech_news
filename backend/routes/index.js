const express = require('express');
const router = express.Router();

// 导入API路由
const apiRoutes = require('./api');

// 使用API路由
router.use('/api', apiRoutes);

// 根路由
router.get('/', (req, res) => {
  res.json({ message: '欢迎使用科技资讯API' });
});

module.exports = router;