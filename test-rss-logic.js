const Parser = require('rss-parser');

// RSS解析器配置
const parser = new Parser({
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
  'https://www.theverge.com/rss/index.xml'
];

// 模拟数据库中的现有新闻（用于测试查重逻辑）
const existingNews = [];

// 模拟查重逻辑（使用链接作为唯一标识）
function findExistingNews(sourceUrl) {
  return existingNews.find(news => news.sourceUrl === sourceUrl);
}

// 处理新闻项目（模拟修复后的查重逻辑）
function processNewsItems(newsItems) {
  let savedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  for (const item of newsItems) {
    try {
      // 使用链接作为唯一标识进行查重（修复后的逻辑）
      const existingNewsItem = findExistingNews(item.sourceUrl);
      
      if (existingNewsItem) {
        // 更新现有新闻
        Object.assign(existingNewsItem, {
          ...item,
          lastUpdated: new Date()
        });
        updatedCount++;
        console.log(`更新新闻: ${item.title.substring(0, 50)}...`);
      } else {
        // 创建新新闻
        existingNews.push({
          ...item,
          id: Date.now() + Math.random(), // 模拟数据库ID
          lastUpdated: new Date()
        });
        savedCount++;
        console.log(`保存新闻: ${item.title.substring(0, 50)}...`);
      }
    } catch (error) {
      console.error(`处理新闻项目时出错: ${error.message}`);
      skippedCount++;
    }
  }

  return { savedCount, updatedCount, skippedCount };
}

// 从RSS源获取数据
async function fetchFromRSS(feedUrl) {
  try {
    console.log(`正在获取RSS源: ${feedUrl}`);
    const feed = await parser.parseURL(feedUrl);
    
    return feed.items.map(item => {
      const publishedAt = new Date(item.pubDate || item.isoDate || new Date());
      
      return {
        title: item.title || '无标题',
        content: item.contentEncoded || item.content || item.summary || '',
        summary: (item.contentEncoded || item.content || item.summary || '').substring(0, 200) + '...',
        publishedAt,
        source: feed.title,
        author: item.creator || item.author || feed.title,
        imageUrl: '',
        sourceUrl: item.link,
        category: '科技前沿',
        tags: [],
        isRealtime: true,
        realtimeSource: 'rss',
        views: 0,
        likes: 0,
        shares: 0,
        trending: false
      };
    });
  } catch (error) {
    console.error(`从RSS源获取数据时出错: ${error.message}`);
    return [];
  }
}

// 测试修复后的RSS抓取功能
async function testRSSLogic() {
  console.log('开始测试RSS抓取和查重逻辑...');
  
  let totalSaved = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  
  // 第一轮：获取新闻
  console.log('\n=== 第一轮：获取新闻 ===');
  for (const feedUrl of RSS_SOURCES) {
    try {
      const newsItems = await fetchFromRSS(feedUrl);
      console.log(`从 ${feedUrl} 获取到 ${newsItems.length} 条新闻`);
      
      if (newsItems.length > 0) {
        const result = processNewsItems(newsItems.slice(0, 5)); // 只处理前5条
        totalSaved += result.savedCount;
        totalUpdated += result.updatedCount;
        totalSkipped += result.skippedCount;
        
        console.log(`处理结果 - 新增: ${result.savedCount}, 更新: ${result.updatedCount}, 跳过: ${result.skippedCount}`);
      }
      
    } catch (error) {
      console.error(`处理RSS源 ${feedUrl} 时出错:`, error.message);
    }
  }
  
  console.log(`\n第一轮总计:`);
  console.log(`新增新闻: ${totalSaved}`);
  console.log(`更新新闻: ${totalUpdated}`);
  console.log(`跳过新闻: ${totalSkipped}`);
  console.log(`数据库中现有新闻数量: ${existingNews.length}`);
  
  // 第二轮：再次获取相同新闻，测试查重逻辑
  console.log('\n=== 第二轮：测试查重逻辑 ===');
  let secondRoundSaved = 0;
  let secondRoundUpdated = 0;
  let secondRoundSkipped = 0;
  
  for (const feedUrl of RSS_SOURCES.slice(0, 1)) { // 只测试第一个源
    try {
      const newsItems = await fetchFromRSS(feedUrl);
      console.log(`从 ${feedUrl} 再次获取到 ${newsItems.length} 条新闻`);
      
      if (newsItems.length > 0) {
        const result = processNewsItems(newsItems.slice(0, 5)); // 只处理前5条
        secondRoundSaved += result.savedCount;
        secondRoundUpdated += result.updatedCount;
        secondRoundSkipped += result.skippedCount;
        
        console.log(`处理结果 - 新增: ${result.savedCount}, 更新: ${result.updatedCount}, 跳过: ${result.skippedCount}`);
      }
      
    } catch (error) {
      console.error(`处理RSS源 ${feedUrl} 时出错:`, error.message);
    }
  }
  
  console.log(`\n第二轮总计:`);
  console.log(`新增新闻: ${secondRoundSaved}`);
  console.log(`更新新闻: ${secondRoundUpdated}`);
  console.log(`跳过新闻: ${secondRoundSkipped}`);
  console.log(`数据库中现有新闻数量: ${existingNews.length}`);
  
  // 显示最新的新闻
  const latestNews = existingNews
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 5);
  
  console.log(`\n最新的5条新闻:`);
  latestNews.forEach((news, index) => {
    const hoursAgo = (new Date() - new Date(news.publishedAt)) / (1000 * 60 * 60);
    console.log(`${index + 1}. ${news.title.substring(0, 60)}... (${hoursAgo.toFixed(1)}小时前)`);
  });
  
  // 验证查重逻辑
  console.log(`\n=== 查重逻辑验证 ===`);
  if (secondRoundSaved === 0 && secondRoundUpdated > 0) {
    console.log('✅ 查重逻辑工作正常：没有重复保存新闻，正确更新了现有新闻');
  } else if (secondRoundSaved > 0) {
    console.log('⚠️  查重逻辑可能有问题：重复保存了新闻');
  } else {
    console.log('ℹ️  无法确定查重逻辑状态');
  }
}

// 运行测试
testRSSLogic().then(() => {
  console.log('\n测试完成');
}).catch(error => {
  console.error('测试出错:', error);
});