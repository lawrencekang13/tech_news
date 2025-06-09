const mongoose = require('mongoose');

// 实体模式
const EntitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true }
});

// 指标模式
const MetricSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  description: { type: String, required: true }
});

// 时间线事件模式
const TimelineEventSchema = new mongoose.Schema({
  date: { type: String, required: true },
  event: { type: String, required: true }
});

// 结构化信息模式
const StructuredInfoSchema = new mongoose.Schema({
  entities: [EntitySchema],
  metrics: [MetricSchema],
  timeline: [TimelineEventSchema]
});

// 可视化数据模式
const VisualizationDataSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  xAxisKey: String,
  yAxisKeys: [String],
  pieKey: String,
  valueKey: String,
  colors: [String]
});

// 新闻模式
const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  tags: { type: [String], required: true },
  publishDate: { type: Date, required: true, default: Date.now },
  source: { type: String, required: true },
  sourceUrl: { type: String }, // 原始资讯来源URL
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  structuredInfo: StructuredInfoSchema,
  visualizationData: VisualizationDataSchema,
  // 实时功能相关字段
  isRealtime: { type: Boolean, default: false },
  realtimeSource: { type: String, enum: ['api', 'rss', 'crawler', null], default: null },
  viewCount: { type: Number, default: 0 },
  trending: { type: Boolean, default: false },
  lastUpdated: { type: Date }
}, { timestamps: true });

// 创建索引以支持搜索功能
NewsSchema.index({ title: 'text', summary: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('News', NewsSchema);