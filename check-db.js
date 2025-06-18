const mongoose = require('mongoose');
const News = require('./models/News');

async function checkDatabase() {
  try {
    console.log('正在连接数据库...');
    await mongoose.connect('mongodb://localhost:27017/global-tech-news');
    console.log('数据库连接成功');
    
    // 检查新闻总数
    const totalCount = await News.countDocuments();
    console.log(`数据库中共有 ${totalCount} 条新闻`);
    
    if (totalCount > 0) {
      // 获取最新的5条新闻
      const latestNews = await News.find()
        .sort({publishDate: -1})
        .limit(5)
        .select('title publishDate sourceUrl source')
        .lean();
      
      console.log('\n最新5条新闻:');
      latestNews.forEach((news, i) => {
        const publishDate = new Date(news.publishDate);
        const hoursAgo = (new Date() - publishDate) / (1000 * 60 * 60);
        console.log(`${i+1}. ${news.title.substring(0, 60)}...`);
        console.log(`   发布时间: ${publishDate.toLocaleString('zh-CN')} (${hoursAgo.toFixed(1)}小时前)`);
        console.log(`   来源: ${news.source}`);
        console.log(`   sourceUrl: ${news.sourceUrl ? '有' : '无'}`);
        console.log('');
      });
      
      // 检查最近24小时的新闻
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentCount = await News.countDocuments({
        publishDate: { $gte: yesterday }
      });
      console.log(`最近24小时内的新闻数量: ${recentCount}`);
      
      // 检查有sourceUrl的新闻数量
      const withSourceUrlCount = await News.countDocuments({
        sourceUrl: { $exists: true, $ne: null, $ne: '' }
      });
      console.log(`有sourceUrl的新闻数量: ${withSourceUrlCount}`);
      
    } else {
      console.log('数据库中没有新闻数据');
    }
    
  } catch (error) {
    console.error('检查数据库时出错:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('数据库连接已关闭');
  }
}

checkDatabase();