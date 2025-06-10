import connectDB from '../../lib/db';
import redisClient from '../../lib/redis';
import { successResponse, errorResponse } from '../../lib/apiResponse';

/**
 * @desc    健康检查接口
 * @route   GET /api/health
 * @access  Public
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return errorResponse(res, '方法不允许', 405);
  }

  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: 'unknown',
      redis: 'unknown'
    }
  };

  // 检查数据库连接
  try {
    await connectDB();
    healthStatus.services.database = 'healthy';
  } catch (error) {
    console.error('数据库健康检查失败:', error);
    healthStatus.services.database = 'unhealthy';
    healthStatus.status = 'degraded';
  }

  // 检查Redis连接
  try {
    await redisClient.set('health_check', 'ok', 10);
    const result = await redisClient.get('health_check');
    if (result === 'ok') {
      healthStatus.services.redis = 'healthy';
    } else {
      healthStatus.services.redis = 'unhealthy';
      healthStatus.status = 'degraded';
    }
  } catch (error) {
    console.error('Redis健康检查失败:', error);
    healthStatus.services.redis = 'unhealthy';
    healthStatus.status = 'degraded';
  }

  // 根据服务状态确定HTTP状态码
  const httpStatus = healthStatus.status === 'healthy' ? 200 : 503;

  return res.status(httpStatus).json(healthStatus);
}