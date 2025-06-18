const Parser = require('rss-parser');
const mongoose = require('mongoose');

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
  'https://www.theverge.com/rss/index.xml',
  'https://techcrunch.com/feed/',
  'https://www.engadget.com/rss.xml'
];

async function testRSSFetch() {
  console.log('开始测试RSS抓取...');
  
  for (const feedUrl of RSS_SOURCES) {
    try {
      console.log(`\n正在测试RSS源: ${feedUrl}`);
      
      const feed = await parser.parseURL(feedUrl);
      console.log(`RSS源标题: ${feed.title}`);
      console.log(`获取到 ${feed.items.length} 条新闻`);
      
      if (feed.items.length > 0) {
        const latestItem = feed.items[0];
        console.log(`最新新闻标题: ${latestItem.title}`);
        console.log(`发布时间: ${latestItem.pubDate || latestItem.isoDate}`);
        console.log(`链接: ${latestItem.link}`);
        
        // 检查发布时间是否是最近的
        const publishDate = new Date(latestItem.pubDate || latestItem.isoDate);
        const now = new Date();
        const hoursDiff = (now - publishDate) / (1000 * 60 * 60);
        console.log(`距离现在: ${hoursDiff.toFixed(1)} 小时`);
        
        if (hoursDiff > 24) {
          console.log('⚠️  警告: 最新新闻超过24小时');
        } else {
          console.log('✅ 新闻时效性正常');
        }
      }
      
    } catch (error) {
      console.error(`❌ RSS源 ${feedUrl} 测试失败:`, error.message);
    }
  }
}

// 运行测试
testRSSFetch().then(() => {
  console.log('\n测试完成');
}).catch(error => {
  console.error('测试出错:', error);
});