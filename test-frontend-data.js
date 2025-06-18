// 创建测试数据来验证前端显示
const testNewsData = [
  {
    id: '1',
    title: 'OpenAI发布GPT-5：人工智能的新里程碑',
    summary: 'OpenAI今天正式发布了GPT-5模型，在推理能力、多模态理解和代码生成方面都有显著提升。新模型在多个基准测试中超越了前代产品...',
    content: 'OpenAI今天正式发布了GPT-5模型，标志着人工智能技术的又一重大突破。据官方介绍，GPT-5在推理能力、多模态理解和代码生成方面都有显著提升...',
    publishDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2小时前
    source: 'TechCrunch',
    author: 'Sarah Chen',
    imageUrl: '',
    sourceUrl: 'https://techcrunch.com/2024/01/15/openai-gpt5-release',
    category: '人工智能',
    tags: ['OpenAI', 'GPT-5', '人工智能', '机器学习'],
    isRealtime: true,
    realtimeSource: 'rss',
    views: 1250,
    likes: 89,
    shares: 34,
    trending: true
  },
  {
    id: '2',
    title: 'Apple Vision Pro 2代曝光：更轻薄设计，价格更亲民',
    summary: '据可靠消息源透露，苹果正在开发Vision Pro的第二代产品，新设备将采用更轻薄的设计，同时价格也将更加亲民...',
    content: '据多个可靠消息源透露，苹果正在积极开发Vision Pro的第二代产品。新设备预计将在2024年下半年发布，采用更轻薄的设计...',
    publishDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4小时前
    source: 'The Verge',
    author: 'Tom Warren',
    imageUrl: '',
    sourceUrl: 'https://www.theverge.com/2024/01/15/apple-vision-pro-2-rumors',
    category: '移动设备',
    tags: ['Apple', 'Vision Pro', 'AR', 'VR', '混合现实'],
    isRealtime: true,
    realtimeSource: 'rss',
    views: 890,
    likes: 67,
    shares: 23,
    trending: false
  },
  {
    id: '3',
    title: 'Google推出Gemini Ultra：挑战GPT-4的新AI模型',
    summary: 'Google今日发布了其最新的AI模型Gemini Ultra，声称在多项基准测试中超越了OpenAI的GPT-4模型...',
    content: 'Google今日正式发布了其最新的人工智能模型Gemini Ultra，这是该公司迄今为止最强大的AI系统...',
    publishDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6小时前
    source: 'Wired',
    author: 'Will Knight',
    imageUrl: '',
    sourceUrl: 'https://www.wired.com/story/google-gemini-ultra-ai-model/',
    category: '人工智能',
    tags: ['Google', 'Gemini', 'AI', '机器学习', 'GPT-4'],
    isRealtime: true,
    realtimeSource: 'rss',
    views: 1456,
    likes: 112,
    shares: 45,
    trending: true
  },
  {
    id: '4',
    title: 'Tesla FSD Beta 12.0发布：完全自动驾驶更进一步',
    summary: 'Tesla发布了FSD Beta 12.0版本，新版本采用了端到端神经网络架构，在城市道路驾驶方面有显著改进...',
    content: 'Tesla今天发布了其全自动驾驶(FSD) Beta的12.0版本，这是该系统的一个重大更新...',
    publishDate: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8小时前
    source: 'Engadget',
    author: 'Roberto Baldwin',
    imageUrl: '',
    sourceUrl: 'https://www.engadget.com/tesla-fsd-beta-12-autonomous-driving',
    category: '自动驾驶',
    tags: ['Tesla', 'FSD', '自动驾驶', '神经网络', 'AI'],
    isRealtime: true,
    realtimeSource: 'rss',
    views: 723,
    likes: 54,
    shares: 18,
    trending: false
  },
  {
    id: '5',
    title: 'Meta发布Llama 3：开源大语言模型的新标杆',
    summary: 'Meta今日开源了其最新的大语言模型Llama 3，该模型在多个NLP任务上表现出色，为开源AI社区带来新的突破...',
    content: 'Meta今日正式发布并开源了其最新的大语言模型Llama 3，这是该公司Llama系列的最新版本...',
    publishDate: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10小时前
    source: 'TechCrunch',
    author: 'Kyle Wiggers',
    imageUrl: '',
    sourceUrl: 'https://techcrunch.com/2024/01/15/meta-llama-3-open-source',
    category: '人工智能',
    tags: ['Meta', 'Llama 3', '开源', '大语言模型', 'NLP'],
    isRealtime: true,
    realtimeSource: 'rss',
    views: 1089,
    likes: 78,
    shares: 29,
    trending: false
  },
  {
    id: '6',
    title: 'Microsoft Copilot Pro订阅服务正式上线',
    summary: 'Microsoft今天宣布推出Copilot Pro订阅服务，为个人用户提供更强大的AI助手功能，月费20美元...',
    content: 'Microsoft今天正式宣布推出Copilot Pro订阅服务，这是该公司为个人用户提供的高级AI助手服务...',
    publishDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12小时前
    source: 'The Verge',
    author: 'Tom Warren',
    imageUrl: '',
    sourceUrl: 'https://www.theverge.com/2024/01/15/microsoft-copilot-pro-subscription',
    category: '软件服务',
    tags: ['Microsoft', 'Copilot', 'AI助手', '订阅服务'],
    isRealtime: true,
    realtimeSource: 'rss',
    views: 567,
    likes: 43,
    shares: 15,
    trending: false
  }
];

console.log('测试新闻数据已生成:');
console.log(`共 ${testNewsData.length} 条新闻`);
console.log('\n最新新闻:');
testNewsData.forEach((news, i) => {
  const publishDate = new Date(news.publishDate);
  const hoursAgo = (new Date() - publishDate) / (1000 * 60 * 60);
  console.log(`${i+1}. ${news.title}`);
  console.log(`   发布时间: ${publishDate.toLocaleString('zh-CN')} (${hoursAgo.toFixed(1)}小时前)`);
  console.log(`   来源: ${news.source}`);
  console.log(`   sourceUrl: ${news.sourceUrl}`);
  console.log('');
});

// 将数据写入JSON文件供前端使用
const fs = require('fs');
fs.writeFileSync('./test-news-data.json', JSON.stringify(testNewsData, null, 2));
console.log('测试数据已保存到 test-news-data.json');