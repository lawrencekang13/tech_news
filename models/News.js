import mongoose from 'mongoose';

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
  sourceUrl: { type: String, required: true },
  imageUrl: String,
  author: String,
  trending: { type: Boolean, default: false },
  isRealtime: { type: Boolean, default: false },
  structuredInfo: StructuredInfoSchema,
  visualizationData: [VisualizationDataSchema],
  aiSummary: String,
  readTime: Number,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 }
}, {
  timestamps: true
});

// 创建索引
NewsSchema.index({ publishDate: -1 });
NewsSchema.index({ category: 1 });
NewsSchema.index({ trending: 1 });
NewsSchema.index({ tags: 1 });
NewsSchema.index({ title: 'text', summary: 'text', content: 'text' });

export default mongoose.models.News || mongoose.model('News', NewsSchema);