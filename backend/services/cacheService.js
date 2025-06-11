const { createRedisClient } = require('../config/redis');

// 创建Redis客户端
let client = createRedisClient();
let redisAvailable = true;

// 初始化Redis连接
async function initializeRedis() {
  try {
    if (client.connect) {
      await client.connect();
    }
    redisAvailable = true;
    console.log('Redis缓存服务已启用');
  } catch (error) {
    redisAvailable = false;
    console.error('Redis连接失败，缓存功能已禁用:', error.message);
  }
}

// 初始化Redis
initializeRedis().catch(err => {
  console.error('Redis初始化错误:', err.message);
});

/**
 * 从缓存中获取数据
 * @param {string} key - 缓存键
 * @returns {Promise<any>} - 缓存的数据或null
 */
async function getCache(key) {
  if (!redisAvailable) return null;
  
  try {
    const data = await client.get(key);
    if (!data) return null;
    
    return JSON.parse(data);
  } catch (error) {
    console.error(`获取缓存错误 [${key}]:`, error.message);
    return null;
  }
}

/**
 * 将数据存入缓存
 * @param {string} key - 缓存键
 * @param {any} data - 要缓存的数据
 * @param {number} ttl - 过期时间（秒），默认1小时
 * @returns {Promise<boolean>} - 是否成功
 */
async function setCache(key, data, ttl = 3600) {
  if (!redisAvailable) return true;
  
  try {
    const serialized = JSON.stringify(data);
    await client.set(key, serialized, { EX: ttl });
    return true;
  } catch (error) {
    console.error(`设置缓存错误 [${key}]:`, error.message);
    return false;
  }
}

/**
 * 删除缓存
 * @param {string} key - 缓存键
 * @returns {Promise<boolean>} - 是否成功
 */
async function deleteCache(key) {
  if (!redisAvailable) return true;
  
  try {
    await client.del(key);
    return true;
  } catch (error) {
    console.error(`删除缓存错误 [${key}]:`, error.message);
    return false;
  }
}

/**
 * 清除匹配模式的所有缓存
 * @param {string} pattern - 缓存键模式，如 'news:*'
 * @returns {Promise<boolean>} - 是否成功
 */
async function clearCachePattern(pattern) {
  if (!redisAvailable) return true;
  
  try {
    let cursor = '0';
    let keys = [];
    
    do {
      const result = await client.scan(cursor, { MATCH: pattern, COUNT: 100 });
      cursor = result.cursor;
      keys = keys.concat(result.keys);
    } while (cursor !== '0');
    
    if (keys.length > 0) {
      for (const key of keys) {
        await client.del(key);
      }
      console.log(`已清除${keys.length}个缓存项，模式: ${pattern}`);
    }
    
    return true;
  } catch (error) {
    console.error(`清除缓存模式错误 [${pattern}]:`, error.message);
    return false;
  }
}

/**
 * 关闭Redis连接
 */
async function closeRedis() {
  if (redisAvailable && client.quit) {
    try {
      await client.quit();
      console.log('Redis连接已关闭');
    } catch (error) {
      console.error('关闭Redis连接错误:', error.message);
    }
  }
}

// 处理进程退出时关闭Redis连接
process.on('SIGINT', closeRedis);
process.on('SIGTERM', closeRedis);

module.exports = {
  getCache,
  setCache,
  deleteCache,
  clearCachePattern,
  closeRedis
};