import connectDB from '../../lib/db';
import News from '../../models/News';
import { News as NewsType } from '@/types';

/**
 * 服务器端新闻服务
 * 直接调用数据库操作，用于 getStaticProps 和 getStaticPaths
 */

/**
 * 获取热门新闻
 * @param limit 限制数量
 * @returns Promise<NewsType[]>
 */
export async function getTrendingNewsServer(limit: number = 10): Promise<NewsType[]> {
  try {
    await connectDB();

    // 获取热门新闻（按浏览量和点赞数排序）
    const trendingNews = await News.find({ 
      status: 'published',
      publishedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // 最近7天
    })
      .select('title summary author publishedAt category tags views likes comments thumbnail url')
      .sort({ 
        views: -1, 
        likes: -1, 
        publishedAt: -1 
      })
      .limit(limit)
      .lean();

    // 如果没有数据，返回模拟数据
    if (!trendingNews || trendingNews.length === 0) {
      return getMockTrendingNews(limit);
    }

    // 转换为前端类型
    return trendingNews.map((news: any) => {
      const newsData = news as any;
      return {
        id: newsData._id.toString(),
        title: newsData.title || '',
        summary: newsData.summary || '',
        content: newsData.content || '',
        publishDate: newsData.publishedAt || newsData.publishDate || new Date().toISOString(),
        source: newsData.source || 'Unknown',
        sourceUrl: newsData.sourceUrl || '',
        author: newsData.author || 'Unknown',
        imageUrl: newsData.thumbnail || newsData.imageUrl || '',
        category: newsData.category || '',
        tags: newsData.tags || [],
        viewCount: newsData.views || 0,
        isRealtime: newsData.isRealtime || false,
        realtimeSource: newsData.realtimeSource || '',
        lastUpdated: newsData.updatedAt?.toString() || newsData.lastUpdated || new Date().toISOString()
      };
    });
  } catch (error) {
    console.error('获取热门新闻失败:', error);
    return getMockTrendingNews(limit);
  }
}

/**
 * 根据ID获取新闻详情
 * @param id 新闻ID
 * @returns Promise<NewsType | null>
 */
export async function getNewsByIdServer(id: string): Promise<NewsType | null> {
  try {
    await connectDB();

    const news = await News.findById(id).lean();
    
    if (!news) {
      // 如果数据库中没有，返回模拟数据
      return getMockNewsById(id);
    }

    // 转换为前端类型
    const newsData = news as any;
    return {
      id: newsData._id.toString(),
      title: newsData.title || '',
      summary: newsData.summary || '',
      content: newsData.content || '',
      publishDate: newsData.publishedAt || newsData.publishDate || new Date().toISOString(),
      source: newsData.source || 'Unknown',
      sourceUrl: newsData.sourceUrl || '',
      author: newsData.author || 'Unknown',
      imageUrl: newsData.thumbnail || newsData.imageUrl || '',
      category: newsData.category || '',
      tags: newsData.tags || [],
      viewCount: newsData.views || 0,
      isRealtime: newsData.isRealtime || false,
      realtimeSource: newsData.realtimeSource || '',
      lastUpdated: newsData.updatedAt?.toString() || newsData.lastUpdated || new Date().toISOString()
    };
  } catch (error) {
    console.error(`获取新闻 ${id} 详情失败:`, error);
    return getMockNewsById(id);
  }
}

/**
 * 根据分类获取新闻
 * @param category 分类slug
 * @param page 页码
 * @param limit 每页数量
 * @returns Promise<{news: NewsType[], pagination: any}>
 */
export async function getNewsByCategoryServer(
  categorySlug: string, 
  page: number = 1, 
  pageSize: number = 20
): Promise<{ news: NewsType[], pagination: { total: number, page: number, pageSize: number } }> {
  try {
    await connectDB();
    
    const skip = (page - 1) * pageSize;
    
    const [news, total] = await Promise.all([
      News.find({ category: categorySlug })
        .sort({ publishDate: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      News.countDocuments({ category: categorySlug })
    ]);
    
    const formattedNews = news.map((item: any) => {
      const itemData = item as any;
      return {
        id: itemData._id.toString(),
        title: itemData.title || '',
        summary: itemData.summary || '',
        content: itemData.content || '',
        publishDate: itemData.publishedAt || itemData.publishDate || new Date().toISOString(),
        source: itemData.source || 'Unknown',
        sourceUrl: itemData.sourceUrl || '',
        author: itemData.author || 'Unknown',
        imageUrl: itemData.thumbnail || itemData.imageUrl || '',
        category: itemData.category || '',
        tags: itemData.tags || [],
        viewCount: itemData.views || 0,
        isRealtime: itemData.isRealtime || false,
        realtimeSource: itemData.realtimeSource || '',
        lastUpdated: itemData.updatedAt?.toString() || itemData.lastUpdated || new Date().toISOString()
      };
    });
    
    return {
      news: formattedNews,
      pagination: {
        total,
        page,
        pageSize
      }
    };
  } catch (error) {
    console.error('Error fetching news by category:', error);
    
    // 返回模拟数据作为后备
    const mockNews = Array.from({ length: Math.min(pageSize, 5) }, (_, index) => ({
      id: `mock-${categorySlug}-${index + 1}`,
      title: `${categorySlug} 相关新闻 ${index + 1}`,
      summary: `这是关于 ${categorySlug} 的新闻摘要 ${index + 1}`,
      content: `这是关于 ${categorySlug} 的详细新闻内容 ${index + 1}`,
      category: categorySlug,
      publishDate: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
      source: 'Mock Source',
      sourceUrl: '',
      author: 'Unknown',
      imageUrl: '/images/placeholder-news.jpg',
      tags: [categorySlug, 'news'],
      viewCount: 0,
      isRealtime: false,
      realtimeSource: '',
      lastUpdated: new Date().toISOString()
    }));
    
    return {
      news: mockNews,
      pagination: {
        total: mockNews.length,
        page,
        pageSize
      }
    };
  }
}

/**
 * 获取相关新闻
 * @param category 分类
 * @param excludeId 排除的新闻ID
 * @param limit 限制数量
 * @returns Promise<NewsType[]>
 */
export async function getRelatedNewsServer(
  category: string, 
  excludeId: string, 
  limit: number = 3
): Promise<NewsType[]> {
  try {
    await connectDB();

    const relatedNews = await News.find({ 
      category, 
      status: 'published',
      _id: { $ne: excludeId }
    })
      .select('title summary author publishedAt category tags views likes comments thumbnail url')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    // 转换为前端类型
    return relatedNews.map((news: any) => {
      const newsData = news as any;
      return {
        id: newsData._id.toString(),
        title: newsData.title || '',
        summary: newsData.summary || '',
        content: newsData.content || '',
        publishDate: newsData.publishedAt || newsData.publishDate || new Date().toISOString(),
        source: newsData.source || 'Unknown',
        sourceUrl: newsData.sourceUrl || '',
        author: newsData.author || 'Unknown',
        imageUrl: newsData.thumbnail || newsData.imageUrl || '',
        category: newsData.category || '',
        tags: newsData.tags || [],
        viewCount: newsData.views || 0,
        isRealtime: newsData.isRealtime || false,
        realtimeSource: newsData.realtimeSource || '',
        lastUpdated: newsData.updatedAt?.toString() || newsData.lastUpdated || new Date().toISOString()
      };
    });
  } catch (error) {
    console.error(`获取相关新闻失败:`, error);
    return [];
  }
}

// 模拟数据函数
function getMockTrendingNews(limit: number): NewsType[] {
  const mockNews = [
    {
      id: '1',
      title: 'OpenAI发布GPT-5，性能较GPT-4提升50%',
      summary: 'OpenAI今日正式发布了GPT-5模型，在推理能力、创造性和安全性方面都有显著提升。',
      content: '',
      publishDate: new Date().toISOString(),
      source: 'TechCrunch',
      sourceUrl: 'https://techcrunch.com',
      author: 'Sarah Chen',
      imageUrl: '',
      category: 'ai',
      tags: ['OpenAI', 'GPT-5', '人工智能'],
      viewCount: 1250,
      isRealtime: true,
      realtimeSource: 'NewsAPI',
      lastUpdated: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Google DeepMind推出Gemini模型，与GPT-5展开竞争',
      summary: 'Google DeepMind发布了最新的Gemini模型，在多项基准测试中表现优异。',
      content: '',
      publishDate: new Date().toISOString(),
      source: 'The Verge',
      sourceUrl: 'https://theverge.com',
      author: 'Alex Johnson',
      imageUrl: '',
      category: 'ai',
      tags: ['Google', 'DeepMind', 'Gemini'],
      viewCount: 980,
      isRealtime: true,
      realtimeSource: 'NewsAPI',
      lastUpdated: new Date().toISOString()
    }
  ];
  
  return mockNews.slice(0, limit);
}

function getMockNewsById(id: string): NewsType | null {
  const mockNews = getMockTrendingNews(10);
  return mockNews.find(news => news.id === id) || null;
}

function getMockNewsByCategory(category: string, limit: number): NewsType[] {
  const mockNews = getMockTrendingNews(10);
  return mockNews.filter(news => news.category === category).slice(0, limit);
}