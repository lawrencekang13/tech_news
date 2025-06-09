require('dotenv').config({path: './backend/.env'});
const dataSourceService = require('./backend/services/dataSourceService');
const mongoose = require('mongoose');
const News = require('./backend/models/News');

async function main() {
  try {
    console.log('MongoDB URI:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB连接成功');
    
    const rssFeeds = process.env.RSS_FEEDS ? process.env.RSS_FEEDS.split(',') : [];
    console.log('RSS源:', rssFeeds);
    
    if (rssFeeds.length > 0) {
      // 测试第一个RSS源
      const feedUrl = rssFeeds[0].trim();
      console.log(`正在处理RSS源: ${feedUrl}`);
      
      try {
        // 获取RSS源数据
        const newsItems = await dataSourceService.fetchFromRSS(feedUrl);
        console.log(`从RSS源获取了 ${newsItems.length} 条新闻`);
        
        if (newsItems.length > 0) {
          // 打印第一条新闻的详细信息
          console.log('第一条新闻示例:');
          console.log(JSON.stringify(newsItems[0], null, 2));
          
          // 处理并保存新闻数据
          const processedCount = await dataSourceService.processNewsItems(newsItems);
          console.log(`成功处理了 ${processedCount} 条新闻`);
          
          // 查询数据库中的新闻数量
          const newsCount = await News.countDocuments();
          console.log(`数据库中现有 ${newsCount} 条新闻`);
        }
      } catch (error) {
        console.error(`处理RSS源 ${feedUrl} 时出错:`, error);
      }
    }
  } catch (error) {
    console.error('执行出错:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB连接已关闭');
  }
}

main();