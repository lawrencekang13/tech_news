/**
 * 初始化分类数据脚本
 * 将硬编码的分类数据迁移到数据库中
 */

const mongoose = require('mongoose');
const Category = require('../models/Category');
const config = require('../config');

// 连接数据库
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 初始分类数据
const initialCategories = [
  {
    name: '人工智能',
    slug: 'ai',
    description: '人工智能（AI）是计算机科学的一个分支，致力于创建能够模拟人类智能的系统。最新的AI技术包括机器学习、深度学习、自然语言处理和计算机视觉等领域的突破。',
    aliases: ['ai', 'artificial-intelligence', 'machine-learning', 'deep-learning'],
    showInNavigation: true,
    icon: 'ai-icon',
    metadata: {
      color: '#3498db',
      priority: 1
    }
  },
  {
    name: '量子计算',
    slug: 'quantum-computing',
    description: '量子计算利用量子力学原理进行信息处理，有潜力解决传统计算机难以处理的复杂问题。量子比特、量子纠缠和量子算法是这一领域的核心概念。',
    aliases: ['quantum', 'quantum-computers', 'quantum-physics'],
    showInNavigation: true,
    icon: 'quantum-icon',
    metadata: {
      color: '#9b59b6',
      priority: 2
    }
  },
  {
    name: '区块链',
    slug: 'blockchain',
    description: '区块链是一种分布式账本技术，通过密码学确保数据的安全性和不可篡改性。它是加密货币的基础技术，同时也在供应链、金融和身份验证等领域有广泛应用。',
    aliases: ['crypto', 'cryptocurrency', 'bitcoin', 'ethereum'],
    showInNavigation: true,
    icon: 'blockchain-icon',
    metadata: {
      color: '#f39c12',
      priority: 3
    }
  },
  {
    name: '生物科技',
    slug: 'biotech',
    description: '生物科技结合了生物学和技术创新，用于医疗、农业和环境保护等领域。基因编辑、合成生物学和生物信息学是当前生物科技的热门研究方向。',
    aliases: ['biotechnology', 'genetics', 'genomics', 'crispr'],
    showInNavigation: true,
    icon: 'biotech-icon',
    metadata: {
      color: '#2ecc71',
      priority: 4
    }
  },
  {
    name: 'AR/VR',
    slug: 'ar-vr',
    description: '增强现实（AR）和虚拟现实（VR）技术创造了新的人机交互方式，AR将虚拟信息叠加到现实世界，而VR则创造完全沉浸式的虚拟环境。',
    aliases: ['augmented-reality', 'virtual-reality', 'mixed-reality', 'xr'],
    showInNavigation: true,
    icon: 'ar-vr-icon',
    metadata: {
      color: '#e74c3c',
      priority: 5
    }
  },
  {
    name: '自动驾驶',
    slug: 'autonomous-vehicles',
    description: '自动驾驶技术利用传感器、人工智能和高精度地图，使车辆能够感知环境并做出决策，减少人为干预。从辅助驾驶到完全自动驾驶的发展正在改变交通和出行方式。',
    aliases: ['self-driving', 'autonomous-cars', 'driverless'],
    showInNavigation: true,
    icon: 'autonomous-icon',
    metadata: {
      color: '#1abc9c',
      priority: 6
    }
  },
  {
    name: '科技',
    slug: 'tech',
    description: '科技新闻涵盖了各种技术创新、产品发布和行业趋势，包括消费电子、软件开发、互联网服务和新兴技术等领域。',
    aliases: ['technology', 'tech-news', 'gadgets', 'electronics'],
    showInNavigation: true,
    icon: 'tech-icon',
    metadata: {
      color: '#34495e',
      priority: 7
    }
  },
  {
    name: '商业',
    slug: 'business',
    description: '商业新闻关注企业动态、市场趋势、经济政策和投资机会，为读者提供商业世界的最新发展和分析。',
    aliases: ['finance', 'economy', 'markets', 'investment'],
    showInNavigation: true,
    icon: 'business-icon',
    metadata: {
      color: '#2980b9',
      priority: 8
    }
  },
  {
    name: '政治',
    slug: 'politics',
    description: '政治新闻报道国内外政治事件、政策变化、选举和国际关系，帮助读者了解影响社会的政治决策和发展。',
    aliases: ['government', 'policy', 'elections', 'international-relations'],
    showInNavigation: false,
    icon: 'politics-icon',
    metadata: {
      color: '#8e44ad',
      priority: 9
    }
  },
  {
    name: '健康',
    slug: 'health',
    description: '健康新闻涵盖医疗研究、健康生活方式、疾病预防和医疗政策等内容，为读者提供维护和改善健康的信息。',
    aliases: ['medicine', 'wellness', 'healthcare', 'fitness'],
    showInNavigation: true,
    icon: 'health-icon',
    metadata: {
      color: '#27ae60',
      priority: 10
    }
  },
  {
    name: '科学',
    slug: 'science',
    description: '科学新闻报道各领域的科学发现、研究进展和科学政策，包括物理、化学、生物、天文和环境科学等。',
    aliases: ['research', 'discoveries', 'physics', 'astronomy'],
    showInNavigation: true,
    icon: 'science-icon',
    metadata: {
      color: '#16a085',
      priority: 11
    }
  },
  {
    name: '体育',
    slug: 'sports',
    description: '体育新闻报道各类体育赛事、运动员表现和体育产业发展，满足体育爱好者对赛事结果和体育动态的需求。',
    aliases: ['athletics', 'games', 'olympics', 'football'],
    showInNavigation: false,
    icon: 'sports-icon',
    metadata: {
      color: '#d35400',
      priority: 12
    }
  },
  {
    name: '娱乐',
    slug: 'entertainment',
    description: '娱乐新闻关注电影、音乐、电视和名人动态，为读者提供流行文化和娱乐产业的最新信息。',
    aliases: ['culture', 'movies', 'music', 'celebrities'],
    showInNavigation: false,
    icon: 'entertainment-icon',
    metadata: {
      color: '#c0392b',
      priority: 13
    }
  },
  {
    name: '国际',
    slug: 'world',
    description: '国际新闻报道全球重大事件、国际关系和各国发展，帮助读者了解世界各地的重要动态。',
    aliases: ['international', 'global', 'foreign'],
    showInNavigation: false,
    icon: 'world-icon',
    metadata: {
      color: '#2c3e50',
      priority: 14
    }
  },
  {
    name: '国内',
    slug: 'national',
    description: '国内新闻关注国家层面的重要事件、政策变化和社会发展，为读者提供国家整体情况的报道。',
    aliases: ['domestic', 'country', 'nation'],
    showInNavigation: false,
    icon: 'national-icon',
    metadata: {
      color: '#7f8c8d',
      priority: 15
    }
  },
  {
    name: '本地',
    slug: 'local',
    description: '本地新闻报道特定地区或城市的事件、发展和问题，关注对当地居民直接相关的信息。',
    aliases: ['regional', 'city', 'community'],
    showInNavigation: false,
    icon: 'local-icon',
    metadata: {
      color: '#95a5a6',
      priority: 16
    }
  },
  {
    name: '综合',
    slug: 'general',
    description: '综合新闻涵盖各类主题的重要信息，为读者提供广泛的新闻覆盖，不限于特定领域。',
    aliases: ['general-news', 'miscellaneous', 'mixed'],
    showInNavigation: false,
    icon: 'general-icon',
    metadata: {
      color: '#bdc3c7',
      priority: 17
    }
  }
];

// 导入分类数据
async function importCategories() {
  try {
    // 清空现有分类
    await Category.deleteMany({});
    console.log('已清空现有分类数据');
    
    // 导入新分类
    const result = await Category.insertMany(initialCategories);
    console.log(`成功导入 ${result.length} 个分类`);
    
    // 输出导入的分类
    console.log('导入的分类:');
    result.forEach(cat => {
      console.log(`- ${cat.name} (${cat.slug})`);
    });
    
    console.log('分类数据初始化完成');
  } catch (error) {
    console.error('初始化分类数据时出错:', error);
  } finally {
    // 关闭数据库连接
    mongoose.disconnect();
  }
}

// 执行导入
importCategories();