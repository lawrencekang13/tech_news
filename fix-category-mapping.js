require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

// 数据库连接
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB 连接成功');
  } catch (error) {
    console.error('MongoDB 连接失败:', error);
    process.exit(1);
  }
}

// News模型
const newsSchema = new mongoose.Schema({
  title: String,
  summary: String,
  content: String,
  publishDate: Date,
  source: String,
  author: String,
  imageUrl: String,
  link: String,
  category: String,
  tags: [String],
  isRealtime: Boolean,
  realtimeSource: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  trending: { type: Boolean, default: false },
  lastUpdated: Date
});

const News = mongoose.model('News', newsSchema);

// 中文分类名到slug的映射
const categoryMapping = {
  '人工智能': 'ai',
  '科技前沿': 'tech',
  '移动设备': 'mobile',
  '互联网': 'internet',
  '网络安全': 'security',
  '区块链': 'blockchain',
  '量子计算': 'quantum-computing',
  '生物技术': 'biotech',
  '太空探索': 'space'
};

// 反向映射：从source判断分类
function determineCategoryFromSource(source, title, content) {
  const sourceTitle = source.toLowerCase();
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();
  
  // AI相关
  if (sourceTitle.includes('ai') || titleLower.includes('ai') || 
      sourceTitle.includes('artificial') || titleLower.includes('artificial') ||
      sourceTitle.includes('machine learning') || titleLower.includes('machine learning') ||
      contentLower.includes('人工智能') || contentLower.includes('机器学习')) {
    return 'ai';
  }
  
  // 区块链
  if (sourceTitle.includes('blockchain') || titleLower.includes('blockchain') ||
      sourceTitle.includes('crypto') || titleLower.includes('crypto') ||
      titleLower.includes('bitcoin') || contentLower.includes('区块链') ||
      contentLower.includes('加密货币')) {
    return 'blockchain';
  }
  
  // 移动设备
  if (sourceTitle.includes('mobile') || titleLower.includes('mobile') ||
      sourceTitle.includes('phone') || titleLower.includes('phone') ||
      sourceTitle.includes('android') || titleLower.includes('android') ||
      sourceTitle.includes('ios') || titleLower.includes('ios') ||
      contentLower.includes('手机') || contentLower.includes('移动设备')) {
    return 'mobile';
  }
  
  // 网络安全
  if (sourceTitle.includes('security') || titleLower.includes('security') ||
      sourceTitle.includes('cyber') || titleLower.includes('cyber') ||
      sourceTitle.includes('privacy') || titleLower.includes('privacy') ||
      contentLower.includes('网络安全') || contentLower.includes('隐私')) {
    return 'security';
  }
  
  // 太空探索
  if (sourceTitle.includes('space') || titleLower.includes('space') ||
      sourceTitle.includes('nasa') || titleLower.includes('nasa') ||
      titleLower.includes('rocket') || titleLower.includes('satellite') ||
      contentLower.includes('太空') || contentLower.includes('火箭') ||
      contentLower.includes('卫星')) {
    return 'space';
  }
  
  // 生物技术
  if (sourceTitle.includes('bio') || titleLower.includes('bio') ||
      titleLower.includes('medical') || titleLower.includes('health') ||
      contentLower.includes('生物技术') || contentLower.includes('医疗')) {
    return 'biotech';
  }
  
  // 量子计算
  if (titleLower.includes('quantum') || contentLower.includes('量子')) {
    return 'quantum-computing';
  }
  
  // 互联网
  if (sourceTitle.includes('web') || titleLower.includes('web') ||
      sourceTitle.includes('internet') || titleLower.includes('internet') ||
      sourceTitle.includes('social') || titleLower.includes('social') ||
      contentLower.includes('互联网') || contentLower.includes('社交')) {
    return 'internet';
  }
  
  // 默认为科技前沿
  return 'tech';
}

async function fixCategoryMapping() {
  try {
    await connectDB();
    
    console.log('开始修复分类映射...');
    
    // 获取所有新闻
    const allNews = await News.find({});
    console.log(`找到 ${allNews.length} 条新闻`);
    
    let updatedCount = 0;
    
    for (const news of allNews) {
      let newCategory = news.category;
      
      // 如果category是中文名称，转换为slug
      if (categoryMapping[news.category]) {
        newCategory = categoryMapping[news.category];
      } 
      // 如果category是"general"或其他，根据source、title、content重新判断
      else if (news.category === 'general' || !news.category) {
        newCategory = determineCategoryFromSource(
          news.source || '', 
          news.title || '', 
          news.content || ''
        );
      }
      
      // 如果分类有变化，更新数据库
      if (newCategory !== news.category) {
        await News.findByIdAndUpdate(news._id, { 
          category: newCategory,
          lastUpdated: new Date()
        });
        updatedCount++;
        console.log(`更新新闻: ${news.title.substring(0, 50)}... 分类: ${news.category} -> ${newCategory}`);
      }
    }
    
    console.log(`\n修复完成！共更新了 ${updatedCount} 条新闻的分类`);
    
    // 统计各分类的新闻数量
    const categoryCounts = await News.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n各分类新闻数量:');
    categoryCounts.forEach(cat => {
      console.log(`${cat._id}: ${cat.count} 条`);
    });
    
  } catch (error) {
    console.error('修复分类映射时出错:', error);
  } finally {
    await mongoose.disconnect();
    console.log('数据库连接已关闭');
  }
}

fixCategoryMapping();