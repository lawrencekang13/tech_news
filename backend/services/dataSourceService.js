const axios = require('axios');
const Parser = require('rss-parser');
const cheerio = require('cheerio');
const News = require('../models/News');
const socketController = require('../controllers/socketController');

// 创建RSS解析器实例
const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media'],
      ['content:encoded', 'contentEncoded']
    ]
  }
});

/**
 * 从新闻API获取数据
 * @param {string} apiUrl - API URL
 * @param {string} apiKey - API Key
 * @returns {Promise<Array>} - 新闻数据数组
 */
async function fetchFromNewsAPI(apiUrl, apiKey) {
  try {
    console.log(`正在从新闻API获取数据: ${apiUrl}`);
    
    // 构建API请求URL
    const url = `${apiUrl}?apiKey=${apiKey}&language=zh&pageSize=20`;
    
    // 发送请求
    const response = await axios.get(url);
    
    if (!response.data || !response.data.articles) {
      console.error('API响应格式不正确');
      return [];
    }
    
    console.log(`从API获取了 ${response.data.articles.length} 条新闻`);
    
    // 转换为统一格式
    return response.data.articles.map(article => {
      // 确定分类
      const category = mapCategory(article.source.name, article.category || '');
      
      // 提取标签
      const tags = extractTags(article.title, article.description);
      
      return {
        title: article.title,
        summary: article.description || '',
        content: article.content || article.description || '',
        publishDate: new Date(article.publishedAt),
        source: article.source.name,
        author: article.author || article.source.name,
        imageUrl: article.urlToImage || '',
        url: article.url,
        category,
        tags,
        isRealtime: true,
        realtimeSource: 'news-api',
        viewCount: 0,
        trending: false,
        lastUpdated: new Date()
      };
    });
  } catch (error) {
    console.error(`从新闻API获取数据时出错: ${error.message}`);
    return [];
  }
}

/**
 * 从RSS源获取数据
 * @param {string} feedUrl - RSS源URL
 * @returns {Promise<Array>} - 新闻数据数组
 */
async function fetchFromRSS(feedUrl) {
  try {
    console.log(`正在从RSS源获取数据: ${feedUrl}`);
    
    const feed = await parser.parseURL(feedUrl);
    console.log(`从RSS源 ${feed.title} 获取了 ${feed.items.length} 条新闻`);
    
    return await Promise.all(feed.items.map(async item => {
      // 从内容中提取图片
      const imageUrl = extractImageFromContent(item.contentEncoded || item.content || '');
      
      // 确定分类
      const category = determineCategoryFromFeed(feed.title, item.categories);
      
      // 提取标签
      const tags = item.categories || extractTags(item.title, item.contentSnippet);
      
      return {
        title: item.title,
        summary: item.contentSnippet || '',
        content: item.contentEncoded || item.content || '',
        publishDate: new Date(item.pubDate || item.isoDate),
        source: feed.title,
        author: item.creator || item.author || feed.title,
        imageUrl: item.media?.$.url || imageUrl,
        url: item.link,
        category,
        tags: Array.isArray(tags) ? tags : [tags].filter(Boolean),
        isRealtime: true,
        realtimeSource: 'rss',
        viewCount: 0,
        trending: false,
        lastUpdated: new Date()
      };
    }));
  } catch (error) {
    console.error(`从RSS源获取数据时出错: ${error.message}`);
    return [];
  }
}

/**
 * 处理新闻数据
 * @param {Array} newsItems - 新闻数据数组
 * @returns {Promise<number>} - 处理的新闻数量
 */
async function processNewsItems(newsItems) {
  try {
    let newCount = 0;
    let updatedCount = 0;
    
    for (const item of newsItems) {
      // 检查新闻是否已存在（基于标题和来源）
      const existingNews = await News.findOne({
        title: item.title,
        source: item.source
      });
      
      if (existingNews) {
        // 更新现有新闻
        existingNews.summary = item.summary || existingNews.summary;
        existingNews.content = item.content || existingNews.content;
        existingNews.imageUrl = item.imageUrl || existingNews.imageUrl;
        existingNews.tags = [...new Set([...existingNews.tags, ...(item.tags || [])])];
        existingNews.lastUpdated = new Date();
        
        await existingNews.save();
        updatedCount++;
        
        // 广播更新
        await socketController.broadcastNewsEdit(existingNews);
      } else {
        // 创建新新闻
        const newNews = new News(item);
        await newNews.save();
        newCount++;
        
        // 广播新新闻
        await socketController.broadcastNewsUpdate(newNews);
      }
    }
    
    console.log(`处理了 ${newsItems.length} 条新闻: ${newCount} 条新增, ${updatedCount} 条更新`);
    return newsItems.length;
  } catch (error) {
    console.error(`处理新闻数据时出错: ${error.message}`);
    return 0;
  }
}

/**
 * 映射新闻分类
 * @param {string} source - 新闻来源
 * @param {string} originalCategory - 原始分类
 * @returns {string} - 映射后的分类
 */
function mapCategory(source, originalCategory) {
  // 标准化分类
  const categoryMap = {
    'technology': 'tech',
    'tech': 'tech',
    'business': 'business',
    'finance': 'business',
    'economy': 'business',
    'politics': 'politics',
    'government': 'politics',
    'health': 'health',
    'medicine': 'health',
    'science': 'science',
    'sports': 'sports',
    'entertainment': 'entertainment',
    'culture': 'entertainment',
    'world': 'world',
    'international': 'world',
    'national': 'national',
    'local': 'local'
  };
  
  // 尝试从原始分类映射
  if (originalCategory && typeof originalCategory === 'string') {
    const lowerCategory = originalCategory.toLowerCase();
    for (const [key, value] of Object.entries(categoryMap)) {
      if (lowerCategory.includes(key)) {
        return value;
      }
    }
  }
  
  // 尝试从来源名称推断分类
  if (source && typeof source === 'string') {
    const lowerSource = source.toLowerCase();
    for (const [key, value] of Object.entries(categoryMap)) {
      if (lowerSource.includes(key)) {
        return value;
      }
    }
  }
  
  // 默认分类
  return 'general';
}

/**
 * 从标题和摘要中提取标签
 * @param {string} title - 新闻标题
 * @param {string} description - 新闻摘要
 * @returns {Array} - 标签数组
 */
function extractTags(title, description) {
  const text = `${title} ${description || ''}`;
  const words = text.split(/\s+/);
  
  // 提取关键词作为标签
  const potentialTags = words
    .filter(word => word.length > 4) // 过滤短词
    .filter(word => /^[A-Z]/.test(word)) // 首字母大写的词更可能是实体名称
    .map(word => word.replace(/[^a-zA-Z0-9]/g, '')) // 移除标点符号
    .filter(word => word.length > 0);
  
  // 去重并限制标签数量
  return [...new Set(potentialTags)].slice(0, 5);
}

/**
 * 从内容中提取图片URL
 * @param {string} content - HTML内容
 * @returns {string|null} - 图片URL或null
 */
function extractImageFromContent(content) {
  try {
    if (!content) return null;
    
    const $ = cheerio.load(content);
    const img = $('img').first();
    
    return img.attr('src') || null;
  } catch (error) {
    console.error(`从内容中提取图片时出错: ${error.message}`);
    return null;
  }
}

/**
 * 从Feed标题和分类中确定新闻分类
 * @param {string} feedTitle - Feed标题
 * @param {Array|string} categories - 原始分类
 * @returns {string} - 确定的分类
 */
function determineCategoryFromFeed(feedTitle, categories) {
  // 尝试从Feed分类中确定
  if (categories) {
    const cats = Array.isArray(categories) ? categories : [categories];
    for (const cat of cats) {
      if (typeof cat === 'string') {
        const mappedCategory = mapCategory('', cat);
        if (mappedCategory !== 'general') {
          return mappedCategory;
        }
      }
    }
  }
  
  // 尝试从Feed标题中确定
  return mapCategory(feedTitle, '');
}

/**
 * 更新新闻浏览量
 * @param {string} newsId - 新闻ID
 * @returns {Promise<boolean>} - 是否成功
 */
async function updateNewsViewCount(newsId) {
  try {
    const news = await News.findById(newsId);
    if (!news) return false;
    
    news.viewCount = (news.viewCount || 0) + 1;
    
    // 如果浏览量超过阈值，标记为热门
    if (news.viewCount > 100 && !news.trending) {
      news.trending = true;
    }
    
    await news.save();
    return true;
  } catch (error) {
    console.error(`更新新闻浏览量时出错: ${error.message}`);
    return false;
  }
}

/**
 * 更新热门新闻状态
 * @returns {Promise<number>} - 更新的新闻数量
 */
async function updateTrendingStatus() {
  try {
    // 查找浏览量高的新闻
    const highViewNews = await News.find({ viewCount: { $gt: 100 }, trending: false });
    
    // 标记为热门
    for (const news of highViewNews) {
      news.trending = true;
      await news.save();
    }
    
    // 查找浏览量低的热门新闻
    const lowViewTrendingNews = await News.find({ viewCount: { $lt: 50 }, trending: true });
    
    // 取消热门标记
    for (const news of lowViewTrendingNews) {
      news.trending = false;
      await news.save();
    }
    
    return highViewNews.length + lowViewTrendingNews.length;
  } catch (error) {
    console.error(`更新热门新闻状态时出错: ${error.message}`);
    return 0;
  }
}

module.exports = {
  fetchFromNewsAPI,
  fetchFromRSS,
  processNewsItems,
  updateNewsViewCount,
  updateTrendingStatus
};