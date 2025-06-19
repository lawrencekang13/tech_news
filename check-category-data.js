require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

async function main() {
  try {
    console.log('MongoDB URI:', process.env.MONGO_URI);
    
    // 设置连接选项
    const options = {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
    };
    
    // 连接MongoDB
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('MongoDB连接成功');
    
    // 检查categories集合
    console.log('\n=== 检查分类数据 ===');
    const categoriesCount = await mongoose.connection.db.collection('categories').countDocuments();
    console.log(`categories集合中有 ${categoriesCount} 条文档`);
    
    if (categoriesCount > 0) {
      const categories = await mongoose.connection.db.collection('categories').find({}).toArray();
      console.log('所有分类:');
      categories.forEach(cat => {
        console.log(`- slug: "${cat.slug}", name: "${cat.name}", isActive: ${cat.isActive}`);
      });
    }
    
    // 检查news集合中的category字段
    console.log('\n=== 检查新闻数据中的category字段 ===');
    const newsCount = await mongoose.connection.db.collection('news').countDocuments();
    console.log(`news集合中有 ${newsCount} 条文档`);
    
    if (newsCount > 0) {
      // 获取所有不同的category值
      const distinctCategories = await mongoose.connection.db.collection('news').distinct('category');
      console.log('新闻中的所有category值:');
      distinctCategories.forEach(cat => {
        console.log(`- "${cat}"`);
      });
      
      // 统计每个category的文档数量
      console.log('\n每个category的文档数量:');
      for (const cat of distinctCategories) {
        const count = await mongoose.connection.db.collection('news').countDocuments({ category: cat });
        console.log(`- "${cat}": ${count} 条`);
      }
      
      // 查看几个示例文档的category字段
      console.log('\n示例文档的category字段:');
      const samples = await mongoose.connection.db.collection('news').find({}).limit(5).toArray();
      samples.forEach((doc, index) => {
        console.log(`${index + 1}. title: "${doc.title?.substring(0, 50)}...", category: "${doc.category}"`);
      });
    }
    
  } catch (error) {
    console.error('操作出错:', error);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('\nMongoDB连接已关闭');
    }
  }
}

main();