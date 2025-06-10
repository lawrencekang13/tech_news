/**
 * Upstash Redis REST API 客户端
 * 适用于Vercel等无服务器环境
 */

const REDIS_URL = process.env.REDIS_URL;
const REDIS_TOKEN = process.env.REDIS_TOKEN;

if (!REDIS_URL || !REDIS_TOKEN) {
  throw new Error('请在环境变量中定义REDIS_URL和REDIS_TOKEN');
}

class RedisClient {
  constructor() {
    this.baseUrl = REDIS_URL;
    this.token = REDIS_TOKEN;
  }

  /**
   * 执行Redis命令
   * @param {Array} command - Redis命令数组
   * @returns {Promise<any>}
   */
  async execute(command) {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        throw new Error(`Redis请求失败: ${response.status}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Redis操作错误:', error);
      throw error;
    }
  }

  /**
   * 设置键值对
   * @param {string} key - 键
   * @param {string} value - 值
   * @param {number} ttl - 过期时间（秒）
   * @returns {Promise<string>}
   */
  async set(key, value, ttl = null) {
    const command = ttl ? ['SET', key, value, 'EX', ttl] : ['SET', key, value];
    return await this.execute(command);
  }

  /**
   * 获取值
   * @param {string} key - 键
   * @returns {Promise<string|null>}
   */
  async get(key) {
    return await this.execute(['GET', key]);
  }

  /**
   * 删除键
   * @param {string} key - 键
   * @returns {Promise<number>}
   */
  async del(key) {
    return await this.execute(['DEL', key]);
  }

  /**
   * 检查键是否存在
   * @param {string} key - 键
   * @returns {Promise<number>}
   */
  async exists(key) {
    return await this.execute(['EXISTS', key]);
  }

  /**
   * 设置过期时间
   * @param {string} key - 键
   * @param {number} seconds - 过期时间（秒）
   * @returns {Promise<number>}
   */
  async expire(key, seconds) {
    return await this.execute(['EXPIRE', key, seconds]);
  }

  /**
   * 获取所有匹配的键
   * @param {string} pattern - 匹配模式
   * @returns {Promise<Array>}
   */
  async keys(pattern) {
    return await this.execute(['KEYS', pattern]);
  }

  /**
   * 列表操作 - 左推入
   * @param {string} key - 键
   * @param {string} value - 值
   * @returns {Promise<number>}
   */
  async lpush(key, value) {
    return await this.execute(['LPUSH', key, value]);
  }

  /**
   * 列表操作 - 右弹出
   * @param {string} key - 键
   * @returns {Promise<string|null>}
   */
  async rpop(key) {
    return await this.execute(['RPOP', key]);
  }

  /**
   * 获取列表长度
   * @param {string} key - 键
   * @returns {Promise<number>}
   */
  async llen(key) {
    return await this.execute(['LLEN', key]);
  }

  /**
   * 获取列表范围
   * @param {string} key - 键
   * @param {number} start - 开始索引
   * @param {number} stop - 结束索引
   * @returns {Promise<Array>}
   */
  async lrange(key, start, stop) {
    return await this.execute(['LRANGE', key, start, stop]);
  }
}

// 创建单例实例
const redisClient = new RedisClient();

export default redisClient;