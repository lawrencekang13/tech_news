const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

// 获取用户保存的资讯
router.get('/saved', userController.getSavedNews);

// 保存资讯
router.post('/saved', userController.saveNews);

// 取消保存资讯
router.delete('/saved/:id', userController.unsaveNews);

module.exports = router;