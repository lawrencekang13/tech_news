import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/db';
import News from '../../../models/News';
import { createApiResponse } from '../../../lib/apiResponse';

// RSS解析器
import Parser from 'rss-parser';

// RSS解析器类型声明
interface RSSParserOptions {
  customFields?: {
    item?: string[][];
    feed?: string[][];
  };
}

interface RSSParser {
  parseURL(url: string): Promise<any>;
  parseString(xml: string): Promise<any>;
}

interface CustomItem {
  title: string;
  contentSnippet?: string;
  content?: string;
  contentEncoded?: string;
  pubDate?: string;
  isoDate?: string;
  creator?: string;
  author?: string;
  link: string;
  categories?: string[];
  media?: any;
}

interface CustomFeed {
  title: string;
  items: CustomItem[];
}

const parser = new Parser<CustomFeed, CustomItem>({
  customFields: {
    item: [
      ['media:content', 'media'],
      ['content:encoded', 'contentEncoded']
    ]
  }
});

// RSS源配置
const RSS_SOURCES = [
  'https://feeds.feedburner.com/TechCrunch',
  'https://www.wired.com/feed/rss',
  'https://www.theverge.com/rss/index.xml',
  'https://techcrunch.com/feed/',
  'https://www.engadget.com/rss.xml'
];

/**
 * 从RSS源获取数据
 */
async function fetchFromRSS(feedUrl: string) {
  try {
    console.log(`正在从RSS源获取数据: ${feedUrl}`);
    
    const feed = await parser.parseURL(feedUrl);
    console.log(`从RSS源 ${feed.title} 获取了 ${feed.items.length} 条新闻`);
    
    return feed.items.map((item: CustomItem) => {
      // 确定分类
      const category = determineCategoryFromFeed(feed.title, item.categories);
      
      // 提取标签
      const tags = item.categories || extractTags(item.title, item.contentSnippet || '');
      
      return {
        title: item.title,
        summary: item.contentSnippet || '',
        content: item.contentEncoded || item.content || item.contentSnippet || '',
        publishDate: new Date(item.pubDate || item.isoDate || new Date().toISOString()),
        source: feed.title,
        author: item.creator || item.author || feed.title,
        imageUrl: extractImageFromContent(item.contentEncoded || item.content || '') || '',
        sourceUrl: item.link,
        category,
        tags: Array.isArray(tags) ? tags : [tags].filter(Boolean),
        isRealtime: true,
        realtimeSource: 'rss',
        views: 0,
        likes: 0,
        shares: 0,
        trending: false
      };
    });
  } catch (error) {
    console.error(`从RSS源获取数据时出错: ${(error as Error).message}`);
    return [];
  }
}

/**
 * 从Feed标题和分类中确定新闻分类
 */
function determineCategoryFromFeed(feedTitle: string, categories?: string[]) {
  // 尝试从Feed分类中确定
  if (categories && categories.length > 0) {
    const category = categories[0].toLowerCase();
    if (category.includes('ai') || category.includes('artificial')) return '人工智能';
    if (category.includes('tech') || category.includes('technology')) return '科技前沿';
    if (category.includes('mobile') || category.includes('phone')) return '移动设备';
    if (category.includes('web') || category.includes('internet')) return '互联网';
    if (category.includes('security') || category.includes('cyber')) return '网络安全';
  }
  
  // 尝试从Feed标题中确定
  return mapCategory(feedTitle, '');
}

/**
 * 映射分类
 */
function mapCategory(source: string, originalCategory: string) {
  const sourceTitle = source.toLowerCase();
  const category = originalCategory.toLowerCase();
  
  // AI相关
  if (sourceTitle.includes('ai') || category.includes('ai') || 
      sourceTitle.includes('artificial') || category.includes('artificial') ||
      sourceTitle.includes('machine learning') || category.includes('machine learning')) {
    return '人工智能';
  }
  
  // 科技前沿
  if (sourceTitle.includes('tech') || category.includes('tech') ||
      sourceTitle.includes('wired') || sourceTitle.includes('verge') ||
      sourceTitle.includes('engadget')) {
    return '科技前沿';
  }
  
  // 移动设备
  if (sourceTitle.includes('mobile') || category.includes('mobile') ||
      sourceTitle.includes('phone') || category.includes('phone') ||
      sourceTitle.includes('android') || category.includes('android') ||
      sourceTitle.includes('ios') || category.includes('ios')) {
    return '移动设备';
  }
  
  // 互联网
  if (sourceTitle.includes('web') || category.includes('web') ||
      sourceTitle.includes('internet') || category.includes('internet') ||
      sourceTitle.includes('social') || category.includes('social')) {
    return '互联网';
  }
  
  // 网络安全
  if (sourceTitle.includes('security') || category.includes('security') ||
      sourceTitle.includes('cyber') || category.includes('cyber') ||
      sourceTitle.includes('privacy') || category.includes('privacy')) {
    return '网络安全';
  }
  
  // 默认分类
  return '科技前沿';
}

/**
 * 提取标签
 */
function extractTags(title: string, content: string) {
  const text = `${title} ${content}`.toLowerCase();
  const tags = [];
  
  // 技术标签
  if (text.includes('ai') || text.includes('artificial intelligence')) tags.push('人工智能');
  if (text.includes('machine learning') || text.includes('ml')) tags.push('机器学习');
  if (text.includes('deep learning')) tags.push('深度学习');
  if (text.includes('blockchain')) tags.push('区块链');
  if (text.includes('cryptocurrency') || text.includes('bitcoin')) tags.push('加密货币');
  if (text.includes('cloud') || text.includes('aws') || text.includes('azure')) tags.push('云计算');
  if (text.includes('5g') || text.includes('network')) tags.push('网络技术');
  if (text.includes('iot') || text.includes('internet of things')) tags.push('物联网');
  if (text.includes('vr') || text.includes('virtual reality')) tags.push('虚拟现实');
  if (text.includes('ar') || text.includes('augmented reality')) tags.push('增强现实');
  
  // 公司标签
  if (text.includes('apple')) tags.push('苹果');
  if (text.includes('google')) tags.push('谷歌');
  if (text.includes('microsoft')) tags.push('微软');
  if (text.includes('amazon')) tags.push('亚马逊');
  if (text.includes('meta') || text.includes('facebook')) tags.push('Meta');
  if (text.includes('tesla')) tags.push('特斯拉');
  if (text.includes('openai')) tags.push('OpenAI');
  
  return tags.length > 0 ? tags : ['科技资讯'];
}

/**
 * 从内容中提取图片URL
 */
function extractImageFromContent(content: string) {
  if (!content) return '';
  
  // 尝试从HTML内容中提取图片
  const imgRegex = /<img[^>]+src="([^"]+)"/i;
  const match = content.match(imgRegex);
  
  if (match && match[1]) {
    return match[1];
  }
  
  // 尝试提取其他图片URL格式
  const urlRegex = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i;
  const urlMatch = content.match(urlRegex);
  
  return urlMatch ? urlMatch[0] : '';
}

interface NewsItem {
  title: string;
  summary: string;
  content: string;
  publishDate: Date;
  source: string;
  author: string;
  imageUrl: string;
  sourceUrl: string;
  category: string;
  tags: string[];
  isRealtime: boolean;
  realtimeSource: string;
  views: number;
  likes: number;
  shares: number;
  trending: boolean;
}

/**
 * 处理新闻数据并保存到数据库
 */
async function processNewsItems(newsItems: NewsItem[]) {
  let savedCount = 0;
  let updatedCount = 0;
  
  for (const item of newsItems) {
    try {
      // 检查是否已存在相同标题的新闻
      const existingNews = await News.findOne({ 
        title: item.title,
        source: item.source 
      });
      
      if (existingNews) {
        // 更新现有新闻
        await News.findByIdAndUpdate(existingNews._id, {
          ...item,
          lastUpdated: new Date()
        });
        updatedCount++;
      } else {
        // 创建新新闻
        const news = new News(item);
        await news.save();
        savedCount++;
      }
    } catch (error) {
      console.error(`保存新闻时出错: ${(error as Error).message}`);
    }
  }
  
  return { savedCount, updatedCount };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json(createApiResponse(false, null, '方法不被允许'));
  }
  
  try {
    // 连接数据库
    await connectDB();
    
    console.log('开始从RSS源获取数据...');
    
    let totalSaved = 0;
    let totalUpdated = 0;
    const results = [];
    
    // 处理每个RSS源
    for (const feedUrl of RSS_SOURCES) {
      try {
        console.log(`处理RSS源: ${feedUrl}`);
        
        // 获取RSS数据
        const newsItems = await fetchFromRSS(feedUrl);
        
        if (newsItems.length > 0) {
          // 保存到数据库
          const { savedCount, updatedCount } = await processNewsItems(newsItems);
          
          totalSaved += savedCount;
          totalUpdated += updatedCount;
          
          results.push({
            source: feedUrl,
            fetched: newsItems.length,
            saved: savedCount,
            updated: updatedCount
          });
          
          console.log(`RSS源 ${feedUrl}: 获取 ${newsItems.length} 条，保存 ${savedCount} 条，更新 ${updatedCount} 条`);
        } else {
          results.push({
            source: feedUrl,
            fetched: 0,
            saved: 0,
            updated: 0,
            error: '未获取到数据'
          });
        }
      } catch (error) {
        console.error(`处理RSS源 ${feedUrl} 时出错:`, (error as Error).message);
        results.push({
          source: feedUrl,
          fetched: 0,
          saved: 0,
          updated: 0,
          error: (error as Error).message
        });
      }
    }
    
    console.log(`RSS数据获取完成: 总共保存 ${totalSaved} 条新闻，更新 ${totalUpdated} 条新闻`);
    
    return res.status(200).json(createApiResponse(true, {
      totalSaved,
      totalUpdated,
      results
    }, `成功处理RSS数据: 保存 ${totalSaved} 条，更新 ${totalUpdated} 条`));
    
  } catch (error) {
    console.error('RSS数据获取失败:', error);
    return res.status(500).json(createApiResponse(false, null, `RSS数据获取失败: ${(error as Error).message}`));
  }
}