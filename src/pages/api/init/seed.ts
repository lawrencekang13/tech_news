import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/db';
import News from '../../../models/News';
import { createApiResponse } from '../../../lib/apiResponse';

// 示例新闻数据
const seedNewsData = [
  {
    title: 'OpenAI发布GPT-4 Turbo，性能大幅提升',
    summary: 'OpenAI在最新的开发者大会上发布了GPT-4 Turbo模型，在处理速度和准确性方面都有显著提升，同时降低了API调用成本。',
    content: `OpenAI在今天举行的首届开发者大会上正式发布了GPT-4 Turbo，这是GPT-4的升级版本，带来了多项重要改进。

**主要特性：**

1. **更大的上下文窗口**：GPT-4 Turbo支持高达128,000个token的上下文长度，相当于约300页的文本，这使得模型能够处理更长的文档和对话。

2. **更新的知识截止时间**：模型的训练数据更新至2024年4月，包含了更多最新的信息和事件。

3. **更好的指令遵循**：在复杂任务的执行上表现更加出色，能够更准确地理解和执行用户的指令。

4. **降低的成本**：API调用成本比GPT-4降低了3倍，使得更多开发者能够负担得起使用这项技术。

5. **多模态能力**：支持文本、图像和音频的输入，为开发者提供了更多的应用可能性。

**开发者工具：**

OpenAI还发布了一系列新的开发者工具，包括：
- Assistants API：让开发者更容易构建AI助手
- GPTs：允许用户创建自定义版本的ChatGPT
- 新的文本转语音API
- 改进的DALL-E 3 API

这些更新标志着AI技术在实用性和可访问性方面的重大进步，预计将推动更多创新应用的出现。`,
    category: '人工智能',
    tags: ['OpenAI', 'GPT-4', '人工智能', 'API', '机器学习'],
    publishDate: new Date('2024-01-15T10:00:00Z'),
    source: 'AI科技前沿',
    author: '李明',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    sourceUrl: 'https://example.com/openai-gpt4-turbo',
    views: 1250,
    likes: 89,
    shares: 34,
    trending: true,
    isRealtime: false
  },
  {
    title: '苹果Vision Pro正式发售，混合现实时代来临',
    summary: '苹果的首款混合现实头显Vision Pro今日正式发售，售价3499美元起，标志着消费级AR/VR设备进入新纪元。',
    content: `苹果公司今天正式开始销售其革命性的混合现实头显Vision Pro，这款设备被认为是苹果自iPhone以来最重要的产品发布。

**产品特性：**

1. **超高分辨率显示**：每只眼睛配备超过4K分辨率的micro-OLED显示屏，提供前所未有的视觉体验。

2. **空间计算**：通过先进的传感器阵列和机器学习算法，实现精确的手势识别和眼球追踪。

3. **无缝集成**：与iPhone、iPad和Mac完美集成，用户可以在虚拟空间中使用熟悉的应用程序。

4. **EyeSight技术**：当有人接近时，设备会显示用户的眼睛，保持社交连接。

**应用场景：**

- **工作生产力**：在虚拟空间中创建多个屏幕，提高工作效率
- **娱乐体验**：观看电影、玩游戏获得沉浸式体验
- **社交互动**：与朋友和家人进行虚拟聚会
- **创意设计**：在3D空间中进行设计和建模

**市场反应：**

尽管价格高昂，但Vision Pro的预订情况超出预期。分析师预测，这款设备将开启混合现实设备的大众化时代，推动整个行业的发展。

苹果CEO蒂姆·库克表示："Vision Pro代表了计算的未来，它将改变我们工作、娱乐和连接的方式。"`,
    category: '移动设备',
    tags: ['苹果', 'Vision Pro', 'AR', 'VR', '混合现实', '可穿戴设备'],
    publishDate: new Date('2024-01-14T14:30:00Z'),
    source: '科技日报',
    author: '王芳',
    imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&h=400&fit=crop',
    sourceUrl: 'https://example.com/apple-vision-pro-launch',
    views: 2100,
    likes: 156,
    shares: 78,
    trending: true,
    isRealtime: false
  },
  {
    title: '谷歌推出Gemini Ultra，挑战GPT-4的AI霸主地位',
    summary: '谷歌发布了其最强大的AI模型Gemini Ultra，在多项基准测试中超越了GPT-4，标志着AI竞争进入新阶段。',
    content: `谷歌今天正式发布了Gemini Ultra，这是其迄今为止最强大的人工智能模型，在多个关键基准测试中超越了OpenAI的GPT-4。

**技术突破：**

1. **多模态原生设计**：Gemini Ultra从一开始就被设计为多模态模型，能够无缝处理文本、图像、音频和视频。

2. **超强推理能力**：在MMLU（大规模多任务语言理解）测试中，Gemini Ultra成为首个超越人类专家表现的模型。

3. **代码生成优化**：在编程任务上表现出色，能够理解和生成多种编程语言的代码。

4. **高效架构**：采用了新的Transformer架构变体，在保持高性能的同时提高了计算效率。

**性能对比：**

- **MMLU基准**：90.0%（超越GPT-4的86.4%）
- **代码生成**：在HumanEval测试中达到74.4%
- **数学推理**：在GSM8K测试中达到94.4%
- **多模态理解**：在多项视觉-语言任务中领先

**应用集成：**

Gemini Ultra将首先在Google的Bard Advanced中提供，随后会集成到Google的各项服务中，包括搜索、Gmail、Google Docs等。

**行业影响：**

这一发布重新点燃了AI领域的竞争，预计将推动整个行业在模型能力和应用创新方面的快速发展。分析师认为，这标志着AI技术进入了一个新的发展阶段。`,
    category: '人工智能',
    tags: ['谷歌', 'Gemini', 'AI模型', '机器学习', '多模态AI'],
    publishDate: new Date('2024-01-13T09:15:00Z'),
    source: 'TechCrunch',
    author: 'Sarah Chen',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
    sourceUrl: 'https://example.com/google-gemini-ultra',
    views: 1890,
    likes: 134,
    shares: 67,
    trending: true,
    isRealtime: false
  },
  {
    title: '特斯拉FSD Beta V12发布，完全自动驾驶更进一步',
    summary: '特斯拉发布了FSD Beta V12版本，采用端到端神经网络架构，在自动驾驶能力上实现了重大突破。',
    content: `特斯拉今天向部分用户推送了FSD（Full Self-Driving）Beta V12版本，这是该公司自动驾驶技术的一个重要里程碑。

**技术革新：**

1. **端到端神经网络**：V12版本完全摒弃了传统的规则编程，采用纯神经网络架构来处理驾驶决策。

2. **更自然的驾驶行为**：系统现在能够更像人类驾驶员一样做出决策，包括在复杂路况下的判断。

3. **改进的路径规划**：在城市道路、高速公路和停车场等各种环境下都有显著改善。

4. **更好的物体识别**：对行人、自行车、其他车辆和交通标志的识别准确率大幅提升。

**用户反馈：**

早期测试用户报告称，V12版本在以下方面有明显改进：
- 更平滑的转弯和变道
- 更好的交通灯和停车标志识别
- 在复杂交叉路口的表现更加自信
- 减少了不必要的干预

**安全考量：**

特斯拉强调，尽管技术有了重大进步，但驾驶员仍需要保持警觉并随时准备接管车辆。公司继续收集数据以进一步改进系统。

**未来展望：**

马斯克表示，V12是实现完全自动驾驶的重要一步，预计在未来几个月内会有更多改进版本发布。特斯拉的目标是在2024年实现真正的无人驾驶能力。`,
    category: '智能汽车',
    tags: ['特斯拉', 'FSD', '自动驾驶', '神经网络', '人工智能'],
    publishDate: new Date('2024-01-12T16:45:00Z'),
    source: 'Electrek',
    author: 'Fred Lambert',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=400&fit=crop',
    sourceUrl: 'https://example.com/tesla-fsd-v12',
    views: 1650,
    likes: 112,
    shares: 45,
    trending: false,
    isRealtime: false
  },
  {
    title: 'Meta发布Code Llama 70B，开源AI编程助手新突破',
    summary: 'Meta发布了Code Llama 70B模型，这是迄今为止最大的开源代码生成模型，为开发者提供了强大的编程辅助工具。',
    content: `Meta今天发布了Code Llama 70B，这是其Code Llama系列中最大的模型，专门针对代码生成和编程任务进行了优化。

**模型特性：**

1. **700亿参数**：这是目前最大的开源代码生成模型，提供了前所未有的代码理解和生成能力。

2. **多语言支持**：支持Python、C++、Java、PHP、TypeScript、C#、Bash等多种编程语言。

3. **长上下文理解**：支持最多100,000个token的上下文长度，能够理解大型代码库。

4. **指令微调**：经过专门的指令微调，能够更好地理解和执行编程相关的指令。

**性能表现：**

在多项编程基准测试中，Code Llama 70B表现出色：
- **HumanEval**：67.8%的通过率
- **MBPP**：82.6%的准确率
- **MultiPL-E**：在多语言编程任务中领先

**开源优势：**

与闭源的编程AI助手不同，Code Llama 70B的开源特性带来了多个优势：
- 完全的数据隐私保护
- 可以本地部署和定制
- 社区可以贡献改进
- 免费使用，无API调用限制

**应用场景：**

- **代码补全**：智能补全代码片段
- **代码解释**：解释复杂代码的功能
- **调试辅助**：帮助发现和修复bug
- **代码重构**：优化和改进现有代码
- **文档生成**：自动生成代码文档

**开发者反响：**

开源社区对这一发布表示热烈欢迎，认为这将大大降低AI编程助手的使用门槛，推动编程工具的民主化。`,
    category: '人工智能',
    tags: ['Meta', 'Code Llama', '开源AI', '代码生成', '编程助手'],
    publishDate: new Date('2024-01-11T11:20:00Z'),
    source: 'The Verge',
    author: 'Alex Heath',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    sourceUrl: 'https://example.com/meta-code-llama-70b',
    views: 980,
    likes: 76,
    shares: 23,
    trending: false,
    isRealtime: false
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json(createApiResponse(false, null, '方法不被允许'));
  }
  
  try {
    // 连接数据库
    await connectDB();
    
    // 检查数据库中是否已有新闻数据
    const existingNewsCount = await News.countDocuments();
    
    if (existingNewsCount > 0) {
      return res.status(200).json(createApiResponse(true, {
        message: '数据库中已有新闻数据，无需初始化',
        existingCount: existingNewsCount
      }));
    }
    
    console.log('开始初始化新闻数据...');
    
    // 插入示例数据
    const insertedNews = await News.insertMany(seedNewsData);
    
    console.log(`成功插入 ${insertedNews.length} 条示例新闻`);
    
    return res.status(200).json(createApiResponse(true, {
      insertedCount: insertedNews.length,
      message: '新闻数据初始化成功'
    }, `成功初始化 ${insertedNews.length} 条新闻数据`));
    
  } catch (error) {
    console.error('初始化新闻数据失败:', error);
    return res.status(500).json(createApiResponse(false, null, `初始化失败: ${(error as Error).message}`));
  }
}