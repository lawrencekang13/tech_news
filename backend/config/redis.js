const redis = require('redis');

/**
 * 创建Redis客户端
 * @returns {Object} Redis客户端实例
 */
const createRedisClient = () => {
  // 从环境变量获取Redis配置，如果不存在则使用默认值
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  
  // 创建Redis客户端
  const client = redis.createClient({
    url: redisUrl,
    socket: {
      reconnectStrategy: false // 禁用重连策略
    }
  });
  
  // 连接错误处理
  client.on('error', (err) => {
    console.error('Redis连接错误:', err);
  });
  
  // 连接成功处理
  client.on('connect', () => {
    console.log('Redis已连接');
  });
  
  // 连接就绪处理
  client.on('ready', () => {
    console.log('Redis已就绪');
  });
  
  return client;
};

module.exports = { createRedisClient };