require('dotenv').config({path: './backend/.env'});
const mongoose = require('mongoose');

async function main() {
  try {
    console.log('MongoDB URI:', process.env.MONGO_URI);
    
    // 设置连接选项，增加超时时间
    const options = {
      connectTimeoutMS: 30000, // 连接超时时间30秒
      socketTimeoutMS: 30000, // Socket超时时间30秒
      serverSelectionTimeoutMS: 30000, // 服务器选择超时时间30秒
    };
    
    // 连接MongoDB
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('MongoDB连接成功');
    
    // 获取所有集合
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('数据库中的集合:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // 如果有news集合，查询其中的文档数量
    if (collections.some(c => c.name === 'news')) {
      const newsCount = await mongoose.connection.db.collection('news').countDocuments();
      console.log(`news集合中有 ${newsCount} 条文档`);
      
      // 如果有文档，查询一条示例
      if (newsCount > 0) {
        const sample = await mongoose.connection.db.collection('news').findOne();
        console.log('示例文档:');
        console.log(JSON.stringify(sample, null, 2));
      }
    }
  } catch (error) {
    console.error('MongoDB连接或操作出错:', error);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('MongoDB连接已关闭');
    }
  }
}

main();