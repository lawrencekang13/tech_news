import connectDB from '../../../lib/db';
import News from '../../../models/News';
import { successResponse, errorResponse } from '../../../lib/apiResponse';
import redisClient from '../../../lib/redis';

/**
 * @desc    获取RSS新闻数据
 * @route   POST /api/rss/fetch
 * @access  Private (用于定时任务)
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return errorResponse(res, '方法不允许', 405);
  }

  // 简单的API密钥验证（在生产环境中应该使用更安全的方式）
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.RSS_API_KEY && process.env.NODE_ENV === 'production') {
    return errorResponse(res, '未授权访问', 401);
  }

  try {
    await connectDB();

    const rssSources = process.env.RSS_SOURCES?.split(',') || [];
    const fetchedNews = [];
    const errors = [];

    for (const rssUrl of rssSources) {
      try {
        const news = await fetchRSSFeed(rssUrl.trim());
        fetchedNews.push(...news);
      } catch (error) {
        console.error(`获取RSS源失败 ${rssUrl}:`, error);
        errors.push({ source: rssUrl, error: error.message });
      }
    }

    // 保存新闻到数据库
    let savedCount = 0;
    for (const newsItem of fetchedNews) {
      try {
        // 检查是否已存在（基于标题和来源URL）
        const existing = await News.findOne({
          title: newsItem.title,
          sourceUrl: newsItem.sourceUrl
        });

        if (!existing) {
          const news = new News(newsItem);
          await news.save();
          savedCount++;
        }
      } catch (saveError) {
        console.error('保存新闻失败:', saveError);
        errors.push({ news: newsItem.title, error: saveError.message });
      }
    }

    // 清除相关缓存
    try {
      const cacheKeys = await redisClient.keys('news_list:*');
      if (cacheKeys.length > 0) {
        for (const key of cacheKeys) {
          await redisClient.del(key);
        }
      }
    } catch (cacheError) {
      console.warn('清除缓存失败:', cacheError);
    }

    return successResponse(res, {
      totalFetched: fetchedNews.length,
      savedCount,
      errors: errors.length > 0 ? errors : null,
      timestamp: new Date().toISOString()
    }, `成功获取 ${fetchedNews.length} 条新闻，保存 ${savedCount} 条新闻`);

  } catch (error) {
    console.error('RSS获取失败:', error);
    return errorResponse(res, 'RSS获取失败', 500);
  }
}

/**
 * 获取RSS源数据
 * @param {string} rssUrl - RSS源URL
 * @returns {Promise<Array>} 新闻数组
 */
async function fetchRSSFeed(rssUrl) {
  try {
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const xmlText = await response.text();
    
    // 简单的XML解析（在生产环境中建议使用专门的XML解析库）
    const items = parseRSSItems(xmlText, rssUrl);
    
    return items;
  } catch (error) {
    console.error(`获取RSS源失败 ${rssUrl}:`, error);
    throw error;
  }
}

/**
 * 简单的RSS XML解析
 * @param {string} xmlText - XML文本
 * @param {string} sourceUrl - 来源URL
 * @returns {Array} 解析后的新闻项
 */
function parseRSSItems(xmlText, sourceUrl) {
  const items = [];
  
  // 使用正则表达式简单解析（生产环境建议使用xml2js等库）
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  const titleRegex = /<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>|<title[^>]*>([\s\S]*?)<\/title>/i;
  const descRegex = /<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description[^>]*>([\s\S]*?)<\/description>/i;
  const linkRegex = /<link[^>]*>([\s\S]*?)<\/link>/i;
  const pubDateRegex = /<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i;
  
  let match;
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemXml = match[1];
    
    const titleMatch = titleRegex.exec(itemXml);
    const descMatch = descRegex.exec(itemXml);
    const linkMatch = linkRegex.exec(itemXml);
    const pubDateMatch = pubDateRegex.exec(itemXml);
    
    if (titleMatch && linkMatch) {
      const title = (titleMatch[1] || titleMatch[2] || '').trim();
      const description = (descMatch?.[1] || descMatch?.[2] || '').trim();
      const link = linkMatch[1].trim();
      const pubDate = pubDateMatch?.[1] ? new Date(pubDateMatch[1]) : new Date();
      
      // 提取域名作为来源
      const sourceName = new URL(sourceUrl).hostname.replace('www.', '');
      
      items.push({
        title: cleanHtml(title),
        summary: cleanHtml(description).substring(0, 500),
        content: cleanHtml(description),
        category: 'tech', // 默认分类
        tags: ['rss', sourceName],
        publishDate: pubDate,
        source: sourceName,
        sourceUrl: link,
        trending: false,
        isRealtime: true
      });
    }
  }
  
  return items;
}

/**
 * 清理HTML标签
 * @param {string} html - HTML文本
 * @returns {string} 清理后的文本
 */
function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '') // 移除HTML标签
    .replace(/&nbsp;/g, ' ') // 替换&nbsp;
    .replace(/&amp;/g, '&')   // 替换&amp;
    .replace(/&lt;/g, '<')   // 替换&lt;
    .replace(/&gt;/g, '>')   // 替换&gt;
    .replace(/&quot;/g, '"') // 替换&quot;
    .trim();
}