const express = require('express');
const router = express.Router();
const { getNewsList, getNewsDetail, searchNews, getTrendingNews } = require('../../controllers/newsController');

// 获取新闻列表
router.get('/', getNewsList);

// 获取热门新闻
router.get('/trending', getTrendingNews);

// 搜索新闻
router.get('/search', searchNews);

// 获取新闻详情
router.get('/:id', getNewsDetail);

module.exports = router;