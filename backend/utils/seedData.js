const mongoose = require('mongoose');
const dotenv = require('dotenv');
const News = require('../models/News');

// 加载环境变量
dotenv.config();

// 连接数据库
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tech_news', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 示例新闻数据
const newsData = [
  {
    title: '人工智能在医疗领域的突破性应用',
    summary: '最新研究表明，人工智能技术在医疗诊断方面取得了显著进展，特别是在影像识别和疾病预测方面。',
    content: `人工智能技术正在彻底改变医疗行业的面貌。近期，多项研究表明，基于深度学习的AI系统在某些医学影像诊断任务上已经达到或超过了人类专家的水平。

在放射学领域，AI系统能够快速分析CT扫描和X光片，识别出肺癌、乳腺癌等疾病的早期迹象。例如，谷歌健康部门开发的AI模型在肺癌筛查中比放射科医生提前发现了5%的病例，同时将假阳性率降低了11%。

在皮肤病学方面，基于计算机视觉的AI系统能够分析皮肤病变图像，帮助医生更准确地诊断黑色素瘤等皮肤癌。斯坦福大学研究人员开发的系统在识别皮肤癌方面的准确率已经与皮肤科专家相当。

此外，AI还在药物研发、患者监护和医疗资源分配等方面展现出巨大潜力。例如，DeepMind的AlphaFold系统在蛋白质结构预测方面取得了突破性进展，这对新药研发具有重要意义。

尽管AI在医疗领域取得了显著进展，专家们强调，AI应被视为医生的辅助工具，而非替代品。医疗AI系统的伦理问题、数据隐私保护以及如何将AI无缝集成到现有医疗工作流程中，仍然是需要解决的重要挑战。`,
    category: '人工智能',
    tags: ['人工智能', '医疗科技', '深度学习', '医学诊断'],
    publishDate: new Date('2023-05-15'),
    source: '科技前沿报道',
    author: '张明',
    imageUrl: 'https://example.com/images/ai-medical.jpg',
    structuredInfo: {
      entities: [
        {
          name: 'DeepMind',
          type: '公司',
          description: '谷歌旗下的人工智能研究实验室，开发了AlphaFold系统'
        },
        {
          name: 'AlphaFold',
          type: 'AI系统',
          description: '用于预测蛋白质结构的人工智能系统'
        },
        {
          name: '斯坦福大学',
          type: '研究机构',
          description: '开发了皮肤癌识别AI系统的研究团队所在机构'
        }
      ],
      metrics: [
        {
          name: '肺癌早期发现率提升',
          value: '5%',
          description: 'AI系统比人类医生提前发现肺癌的比例'
        },
        {
          name: '假阳性率降低',
          value: '11%',
          description: 'AI系统在肺癌筛查中降低假阳性的比例'
        }
      ],
      timeline: [
        {
          date: '2020年',
          event: 'DeepMind发布AlphaFold系统'
        },
        {
          date: '2021年',
          event: '谷歌健康部门AI肺癌筛查系统临床试验'
        },
        {
          date: '2022年',
          event: '斯坦福皮肤癌AI诊断系统获FDA批准'
        }
      ]
    },
    visualizationData: {
      type: 'bar',
      title: 'AI在不同医疗领域的准确率对比',
      data: [
        { name: '放射学', 人类专家: 92, AI系统: 94 },
        { name: '皮肤病学', 人类专家: 87, AI系统: 91 },
        { name: '病理学', 人类专家: 96, AI系统: 93 },
        { name: '眼科学', 人类专家: 89, AI系统: 95 }
      ],
      xAxisKey: 'name',
      yAxisKeys: ['人类专家', 'AI系统'],
      colors: ['#8884d8', '#82ca9d']
    }
  },
  {
    title: '量子计算取得重大突破，实现量子优越性',
    summary: '科学家成功演示了量子计算机解决特定问题的能力，远超当前最强大的经典超级计算机。',
    content: `量子计算领域近期取得了具有里程碑意义的突破。研究人员成功演示了"量子优越性"——量子计算机能够在特定任务上远超最强大的经典计算机的能力。

一支国际研究团队使用包含60个量子比特的量子处理器，在200秒内完成了一项特定的计算任务，而世界上最强大的超级计算机需要约10,000年才能完成同样的计算。这一成就标志着量子计算进入了一个新阶段。

量子计算利用量子力学原理，如叠加和纠缠，进行计算。与传统计算机使用的二进制位（0或1）不同，量子比特可以同时处于多种状态，理论上能够提供指数级的计算能力提升。

专家预测，量子计算将对密码学、材料科学、药物发现和人工智能等领域产生革命性影响。例如，量子计算机可能能够破解当前广泛使用的加密系统，同时也能加速新材料和药物的设计过程。

然而，量子计算仍面临诸多挑战，包括量子退相干、错误校正和扩展性问题。目前的量子计算机仍处于早期阶段，主要用于研究目的，距离广泛商业应用还有一段距离。

多家科技巨头和初创公司正在积极投资量子计算研究，竞相开发更强大、更稳定的量子计算机。专家估计，在未来5-10年内，我们可能会看到具有实用价值的量子计算应用出现。`,
    category: '量子计算',
    tags: ['量子计算', '量子优越性', '计算机科学', '前沿技术'],
    publishDate: new Date('2023-06-20'),
    source: '科学技术周刊',
    author: '李强',
    imageUrl: 'https://example.com/images/quantum-computing.jpg',
    structuredInfo: {
      entities: [
        {
          name: '量子比特',
          type: '技术概念',
          description: '量子计算的基本单位，可以同时处于多种状态'
        },
        {
          name: '量子优越性',
          type: '技术里程碑',
          description: '量子计算机在特定任务上超越经典计算机的能力'
        },
        {
          name: '量子退相干',
          type: '技术挑战',
          description: '量子系统与环境相互作用导致量子信息丢失的现象'
        }
      ],
      metrics: [
        {
          name: '量子计算速度提升',
          value: '约5000万倍',
          description: '与最强大的经典超级计算机相比'
        },
        {
          name: '量子处理器规模',
          value: '60量子比特',
          description: '实现量子优越性的量子处理器的规模'
        }
      ],
      timeline: [
        {
          date: '2019年',
          event: '首次实验性证明量子优越性'
        },
        {
          date: '2021年',
          event: '开发出错误率更低的量子处理器'
        },
        {
          date: '2023年',
          event: '60量子比特处理器实现量子优越性'
        }
      ]
    },
    visualizationData: {
      type: 'line',
      title: '量子比特数量增长趋势',
      data: [
        { year: '2015', 量子比特数: 5 },
        { year: '2017', 量子比特数: 20 },
        { year: '2019', 量子比特数: 35 },
        { year: '2021', 量子比特数: 50 },
        { year: '2023', 量子比特数: 60 }
      ],
      xAxisKey: 'year',
      yAxisKeys: ['量子比特数'],
      colors: ['#ff7300']
    }
  },
  {
    title: '可持续能源技术的最新进展：高效太阳能电池',
    summary: '研究人员开发出转换效率超过30%的新型太阳能电池，为可再生能源的大规模应用铺平道路。',
    content: `可持续能源领域迎来重大突破，研究人员成功开发出转换效率超过30%的新型太阳能电池，大幅提高了太阳能发电的经济可行性。

这种新型太阳能电池采用了钙钛矿-硅叠层结构，能够捕获更广范围的太阳光谱。传统的硅基太阳能电池理论效率上限约为29%，而这种新型叠层设计突破了这一限制。

高效率太阳能电池的出现，加上生产成本的持续下降，使太阳能成为最具经济竞争力的能源形式之一。据国际能源署数据，太阳能发电成本在过去十年中下降了约85%，在许多地区已经低于化石燃料发电成本。

除了提高效率，研究人员还在解决太阳能的间歇性问题上取得进展。新型储能技术，如固态电池和液流电池，可以有效存储白天产生的多余电力，供夜间或阴天使用。

各国政府也在加大对可再生能源的支持力度。多个国家已承诺在2050年前实现碳中和，这将进一步推动太阳能等可再生能源的发展和应用。

专家预测，随着技术进步和规模经济效应，太阳能在全球能源结构中的比重将持续上升。到2030年，太阳能可能成为全球最大的电力来源之一，为应对气候变化和实现可持续发展目标做出重要贡献。`,
    category: '可持续能源',
    tags: ['太阳能', '可再生能源', '能源技术', '气候变化'],
    publishDate: new Date('2023-07-10'),
    source: '绿色科技评论',
    author: '王芳',
    imageUrl: 'https://example.com/images/solar-energy.jpg',
    structuredInfo: {
      entities: [
        {
          name: '钙钛矿-硅叠层太阳能电池',
          type: '技术',
          description: '结合钙钛矿和硅材料的高效太阳能电池'
        },
        {
          name: '国际能源署',
          type: '组织',
          description: '提供全球能源数据和分析的国际组织'
        },
        {
          name: '固态电池',
          type: '储能技术',
          description: '使用固态电解质的新型电池技术'
        }
      ],
      metrics: [
        {
          name: '太阳能电池效率',
          value: '30%以上',
          description: '新型叠层太阳能电池的能量转换效率'
        },
        {
          name: '太阳能成本降低',
          value: '85%',
          description: '过去十年太阳能发电成本的降低比例'
        }
      ],
      timeline: [
        {
          date: '2018年',
          event: '钙钛矿太阳能电池效率突破25%'
        },
        {
          date: '2021年',
          event: '钙钛矿-硅叠层电池效率达到28%'
        },
        {
          date: '2023年',
          event: '新型叠层太阳能电池效率突破30%'
        }
      ]
    },
    visualizationData: {
      type: 'pie',
      title: '2023年全球能源结构预测',
      data: [
        { name: '太阳能', value: 25 },
        { name: '风能', value: 20 },
        { name: '水电', value: 15 },
        { name: '核能', value: 10 },
        { name: '天然气', value: 20 },
        { name: '煤炭', value: 10 }
      ],
      pieKey: 'name',
      valueKey: 'value',
      colors: ['#FFBB28', '#00C49F', '#0088FE', '#FF8042', '#A4DE6C', '#8884D8']
    }
  }
];

// 清空并填充数据
const importData = async () => {
  try {
    // 清空集合
    await News.deleteMany();
    console.log('数据已清空');

    // 插入新数据
    await News.insertMany(newsData);
    console.log('数据导入成功');

    process.exit();
  } catch (error) {
    console.error(`错误: ${error.message}`);
    process.exit(1);
  }
};

// 执行数据填充
importData();