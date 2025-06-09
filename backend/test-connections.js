const mongoose = require('mongoose');
const redis = require('redis');
const axios = require('axios');
require('dotenv').config();

// 颜色输出函数
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 测试MongoDB连接
async function testMongoDB() {
  try {
    log('blue', '\n🔍 测试MongoDB连接...');
    
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI环境变量未设置');
    }
    
    log('yellow', `连接URI: ${mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    // 测试数据库操作
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    await testCollection.deleteOne({ test: 'connection' });
    
    log('green', '✅ MongoDB连接成功！');
    return true;
  } catch (error) {
    log('red', `❌ MongoDB连接失败: ${error.message}`);
    return false;
  }
}

// 测试Redis连接
async function testRedis() {
  let client;
  try {
    log('blue', '\n🔍 测试Redis连接...');
    
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL环境变量未设置');
    }
    
    log('yellow', `连接URL: ${redisUrl}`);
    
    client = redis.createClient({ url: redisUrl });
    
    client.on('error', (err) => {
      throw new Error(`Redis客户端错误: ${err.message}`);
    });
    
    await client.connect();
    
    // 测试Redis操作
    await client.set('test:connection', 'success', { EX: 10 });
    const result = await client.get('test:connection');
    await client.del('test:connection');
    
    if (result !== 'success') {
      throw new Error('Redis读写测试失败');
    }
    
    log('green', '✅ Redis连接成功！');
    return true;
  } catch (error) {
    log('red', `❌ Redis连接失败: ${error.message}`);
    return false;
  } finally {
    if (client) {
      try {
        await client.quit();
      } catch (e) {
        // 忽略关闭错误
      }
    }
  }
}

// 测试新闻API
async function testNewsAPI() {
  try {
    log('blue', '\n🔍 测试新闻API连接...');
    
    const apiKey = process.env.NEWS_API_KEY;
    const baseUrl = process.env.NEWS_API_BASE_URL;
    
    if (!apiKey) {
      throw new Error('NEWS_API_KEY环境变量未设置');
    }
    
    if (!baseUrl) {
      throw new Error('NEWS_API_BASE_URL环境变量未设置');
    }
    
    log('yellow', `API密钥: ${apiKey.substring(0, 8)}...`);
    log('yellow', `基础URL: ${baseUrl}`);
    
    // 测试API调用 - 获取科技新闻
    const testUrl = `${baseUrl}/top-headlines?category=technology&country=us&pageSize=5`;
    
    const response = await axios.get(testUrl, {
      headers: {
        'X-Api-Key': apiKey
      },
      timeout: 10000
    });
    
    if (response.status !== 200) {
      throw new Error(`API返回状态码: ${response.status}`);
    }
    
    const data = response.data;
    
    if (data.status !== 'ok') {
      throw new Error(`API返回错误: ${data.message || '未知错误'}`);
    }
    
    log('green', `✅ 新闻API连接成功！获取到 ${data.articles?.length || 0} 条新闻`);
    
    // 显示第一条新闻标题作为示例
    if (data.articles && data.articles.length > 0) {
      log('yellow', `示例新闻: ${data.articles[0].title}`);
    }
    
    return true;
  } catch (error) {
    if (error.response) {
      log('red', `❌ 新闻API请求失败: ${error.response.status} - ${error.response.data?.message || error.message}`);
    } else if (error.request) {
      log('red', `❌ 新闻API网络错误: ${error.message}`);
    } else {
      log('red', `❌ 新闻API连接失败: ${error.message}`);
    }
    return false;
  }
}

// 测试RSS源
async function testRSSSources() {
  try {
    log('blue', '\n🔍 测试RSS源连接...');
    
    const rssSources = process.env.RSS_SOURCES;
    if (!rssSources) {
      throw new Error('RSS_SOURCES环境变量未设置');
    }
    
    const sources = rssSources.split(',');
    log('yellow', `配置的RSS源数量: ${sources.length}`);
    
    let successCount = 0;
    
    for (const source of sources) {
      try {
        const response = await axios.get(source.trim(), { timeout: 5000 });
        if (response.status === 200 && response.data.includes('<rss')) {
          log('green', `✅ RSS源可访问: ${source.trim()}`);
          successCount++;
        } else {
          log('red', `❌ RSS源格式错误: ${source.trim()}`);
        }
      } catch (error) {
        log('red', `❌ RSS源不可访问: ${source.trim()} - ${error.message}`);
      }
    }
    
    log('yellow', `RSS源测试完成: ${successCount}/${sources.length} 个源可用`);
    return successCount > 0;
  } catch (error) {
    log('red', `❌ RSS源测试失败: ${error.message}`);
    return false;
  }
}

// 主测试函数
async function runTests() {
  log('blue', '🚀 开始连接测试...');
  log('yellow', '='.repeat(50));
  
  const results = {
    mongodb: await testMongoDB(),
    redis: await testRedis(),
    newsapi: await testNewsAPI(),
    rss: await testRSSSources()
  };
  
  // 关闭MongoDB连接
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  
  log('yellow', '\n' + '='.repeat(50));
  log('blue', '📊 测试结果汇总:');
  
  Object.entries(results).forEach(([service, success]) => {
    const status = success ? '✅ 成功' : '❌ 失败';
    const serviceNames = {
      mongodb: 'MongoDB数据库',
      redis: 'Redis缓存',
      newsapi: '新闻API',
      rss: 'RSS源'
    };
    log(success ? 'green' : 'red', `${serviceNames[service]}: ${status}`);
  });
  
  const successCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  log('yellow', `\n总体状态: ${successCount}/${totalCount} 个服务正常`);
  
  if (successCount === totalCount) {
    log('green', '🎉 所有服务连接正常，项目可以正常运行！');
  } else {
    log('red', '⚠️  部分服务连接失败，请检查配置后重试');
  }
  
  process.exit(successCount === totalCount ? 0 : 1);
}

// 运行测试
runTests().catch(error => {
  log('red', `💥 测试过程中发生未处理的错误: ${error.message}`);
  process.exit(1);
});