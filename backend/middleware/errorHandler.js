const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // MongoDB 错误
  if (err.name === 'CastError') {
    return errorResponse(res, '资源不存在', 404);
  }

  // 验证错误
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return errorResponse(res, message, 400);
  }

  // 重复键错误
  if (err.code === 11000) {
    return errorResponse(res, '数据已存在', 400);
  }

  // 默认服务器错误
  return errorResponse(res, err.message || '服务器错误', err.statusCode || 500);
};

module.exports = errorHandler;