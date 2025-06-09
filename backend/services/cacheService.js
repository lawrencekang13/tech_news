// 移除Redis依赖，创建一个空服务
// 定义一个空客户端对象，保持接口兼容性
let client = {
  quit: async () => 'OK',
  on: () => {}
};
let redisAvailable = false;

console.log('缓存功能已禁用');

/**
 * 移除内存缓存实现，保留函数签名以保持兼容性
 */

/**
 * 从缓存中获取数据 (已禁用)
 * @param {string} key - 缓存键
 * @returns {Promise<any>} - 始终返回null
 */
async function getCache(key) {
  // 缓存功能已禁用，直接返回null
  return null;
}

/**
 * 将数据存入缓存 (已禁用)
 * @param {string} key - 缓存键
 * @param {any} data - 要缓存的数据
 * @param {number} ttl - 过期时间（秒），默认1小时
 * @returns {Promise<boolean>} - 始终返回true
 */
async function setCache(key, data, ttl = 3600) {
  // 缓存功能已禁用，直接返回成功
  return true;
}

/**
 * 删除缓存 (已禁用)
 * @param {string} key - 缓存键
 * @returns {Promise<boolean>} - 始终返回true
 */
async function deleteCache(key) {
  // 缓存功能已禁用，直接返回成功
  return true;
}

/**
 * 清除匹配模式的所有缓存 (已禁用)
 * @param {string} pattern - 缓存键模式，如 'news:*'
 * @returns {Promise<boolean>} - 始终返回true
 */
async function clearCachePattern(pattern) {
  // 缓存功能已禁用，直接返回成功
  return true;
}

/**
 * 生成新闻列表的缓存键 (保留兼容性)
 * @param {Object} params - 查询参数
 * @returns {string} - 缓存键
 */
function generateNewsListCacheKey(params) {
  const { page = 1, limit = 10, category, source, sortBy = 'publishedAt', order = 'desc' } = params;
  return `news:list:${page}:${limit}:${category || 'all'}:${source || 'all'}:${sortBy}:${order}`;
}

/**
 * 生成新闻详情的缓存键 (保留兼容性)
 * @param {string} newsId - 新闻ID
 * @returns {string} - 缓存键
 */
function generateNewsCacheKey(newsId) {
  return `news:detail:${newsId}`;
}

/**
 * 生成搜索结果的缓存键 (保留兼容性)
 * @param {string} query - 搜索查询
 * @param {Object} params - 其他查询参数
 * @returns {string} - 缓存键
 */
function generateSearchCacheKey(query, params = {}) {
  const { page = 1, limit = 10 } = params;
  return `news:search:${query}:${page}:${limit}`;
}

/**
 * 检查Redis是否可用 (已禁用)
 * @returns {boolean} - 始终返回false
 */
function isRedisAvailable() {
  return false;
}

/**
 * 当新闻更新时，清除相关缓存 (已禁用)
 * @param {string} newsId - 新闻ID
 * @returns {Promise<void>}
 */
async function invalidateNewsCache(newsId) {
  // 缓存功能已禁用，不执行任何操作
  return;
}

module.exports = {
  client,
  getCache,
  setCache,
  deleteCache,
  clearCachePattern,
  generateNewsListCacheKey,
  generateNewsCacheKey,
  generateSearchCacheKey,
  invalidateNewsCache,
  isRedisAvailable
};