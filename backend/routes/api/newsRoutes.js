const express = require('express');
const router = express.Router();
const newsController = require('../../controllers/newsController');

// 获取新闻列表
router.get('/', newsController.getNewsList);

// 获取热门新闻
router.get('/trending', newsController.getTrendingNews);

// 搜索新闻
router.get('/search', newsController.searchNews);

// 获取新闻详情
router.get('/:id', newsController.getNewsDetail);

module.exports = router;