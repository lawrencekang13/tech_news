require('dotenv').config({path: './backend/.env'});
const { MongoClient } = require('mongodb');
const dataSourceService = require('./backend/services/dataSourceService');

async function main() {
  let client = null;
  
  try {
    console.log('MongoDB URI:', process.env.MONGO_URI);
    
    // 连接MongoDB
    client = new MongoClient(process.env.MONGO_URI, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000
    });
    
    await client.connect();
    console.log('MongoDB连接成功');
    
    // 获取数据库和集合
    const dbName = process.env.MONGO_URI.split('/').pop().split('?')[0];
    const db = client.db(dbName);
    const newsCollection = db.collection('news');
    
    // 获取RSS源
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
          
          // 手动保存新闻数据到MongoDB
          for (const item of newsItems) {
            // 检查新闻是否已存在
            const existingNews = await newsCollection.findOne({
              title: item.title,
              source: item.source
            });
            
            if (existingNews) {
              // 更新现有新闻
              await newsCollection.updateOne(
                { _id: existingNews._id },
                { $set: {
                  summary: item.summary || existingNews.summary,
                  content: item.content || existingNews.content,
                  imageUrl: item.imageUrl || existingNews.imageUrl,
                  tags: [...new Set([...existingNews.tags, ...(item.tags || [])])],
                  lastUpdated: new Date()
                }}
              );
              console.log(`更新了新闻: ${item.title}`);
            } else {
              // 创建新新闻
              await newsCollection.insertOne({
                ...item,
                createdAt: new Date(),
                updatedAt: new Date()
              });
              console.log(`添加了新闻: ${item.title}`);
            }
          }
          
          // 查询数据库中的新闻数量
          const newsCount = await newsCollection.countDocuments();
          console.log(`数据库中现有 ${newsCount} 条新闻`);
        }
      } catch (error) {
        console.error(`处理RSS源 ${feedUrl} 时出错:`, error);
      }
    }
  } catch (error) {
    console.error('执行出错:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB连接已关闭');
    }
  }
}

main();