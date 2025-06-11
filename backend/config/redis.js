const axios = require('axios');

/**
 * 创建Upstash Redis REST API客户端
 * @returns {Object} Redis客户端实例
 */
const createRedisClient = () => {
  // 从环境变量获取Redis配置
  const redisUrl = process.env.REDIS_URL;
  const redisToken = process.env.REDIS_TOKEN;
  
  if (!redisUrl || !redisToken) {
    console.error('缺少Redis配置: REDIS_URL或REDIS_TOKEN未设置');
    // 返回一个空客户端，保持接口兼容性
    return {
      connect: async () => {},
      quit: async () => 'OK',
      on: () => {},
      set: async () => 'OK',
      get: async () => null,
      del: async () => 1,
      scan: async () => ({ keys: [] }),
      isReady: false
    };
  }
  
  // 创建Upstash Redis REST API客户端
  const client = {
    isReady: true,
    
    // 连接方法（为了兼容性）
    connect: async () => {
      console.log('Redis已连接');
      return true;
    },
    
    // 关闭连接方法（为了兼容性）
    quit: async () => {
      console.log('Redis已断开连接');
      return 'OK';
    },
    
    // 事件监听方法（为了兼容性）
    on: (event, callback) => {
      if (event === 'ready') {
        callback();
      }
      return client;
    },
    
    // 设置键值对
    set: async (key, value, options = {}) => {
      try {
        const command = options.EX ? ['SET', key, value, 'EX', options.EX] : ['SET', key, value];
        const response = await axios.post(redisUrl, command, {
          headers: {
            'Authorization': `Bearer ${redisToken}`,
            'Content-Type': 'application/json'
          }
        });
        return response.data.result;
      } catch (error) {
        console.error('Redis SET错误:', error.message);
        return null;
      }
    },
    
    // 获取值
    get: async (key) => {
      try {
        const command = ['GET', key];
        const response = await axios.post(redisUrl, command, {
          headers: {
            'Authorization': `Bearer ${redisToken}`,
            'Content-Type': 'application/json'
          }
        });
        return response.data.result;
      } catch (error) {
        console.error('Redis GET错误:', error.message);
        return null;
      }
    },
    
    // 删除键
    del: async (key) => {
      try {
        const command = ['DEL', key];
        const response = await axios.post(redisUrl, command, {
          headers: {
            'Authorization': `Bearer ${redisToken}`,
            'Content-Type': 'application/json'
          }
        });
        return response.data.result;
      } catch (error) {
        console.error('Redis DEL错误:', error.message);
        return 0;
      }
    },
    
    // 扫描键
    scan: async (cursor, options = {}) => {
      try {
        const command = ['SCAN', cursor || '0'];
        if (options.MATCH) {
          command.push('MATCH', options.MATCH);
        }
        if (options.COUNT) {
          command.push('COUNT', options.COUNT);
        }
        
        const response = await axios.post(redisUrl, command, {
          headers: {
            'Authorization': `Bearer ${redisToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        const [nextCursor, keys] = response.data.result;
        return { cursor: nextCursor, keys };
      } catch (error) {
        console.error('Redis SCAN错误:', error.message);
        return { cursor: '0', keys: [] };
      }
    }
  };
  
  return client;
};

module.exports = { createRedisClient };