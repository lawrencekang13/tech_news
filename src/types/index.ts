// 定义通用的资讯类型接口
export type News = {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  publishDate: string;
  source: string;
  sourceUrl?: string;
  imageUrl?: string;
  content?: string;
  author?: string;
  viewCount?: number;
  isRealtime?: boolean;
  realtimeSource?: string;
  lastUpdated?: string;
  structuredInfo?: StructuredInfoData;
  visualizationData?: VisualizationData;
  relatedNews?: RelatedNews[];
};

// 定义相关新闻类型
export type RelatedNews = {
  id: string;
  title: string;
  category?: string;
};

// 定义分类类型接口
export type Category = {
  id?: string;
  slug: string;
  name: string;
  description?: string;
  aliases?: string[];
  showInNav?: boolean;
  icon?: string;
  color?: string;
  parentId?: string;
  metadata?: Record<string, any>;
  priority?: number;
};

// 定义可视化数据类型
export type VisualizationData = {
  type: 'bar_chart' | 'line_chart' | 'pie_chart' | 'performance_comparison';
  title: string;
  data: any[];
  xAxisKey?: string;
  yAxisKeys?: string[];
  pieKey?: string;
  valueKey?: string;
  colors?: string[];
};

// 定义结构化信息类型
export type Entity = {
  name: string;
  type: string;
  description: string;
};

export type Metric = {
  name: string;
  value: string;
  description: string;
};

export type TimelineEvent = {
  date: string;
  event: string;
};

export type StructuredInfoData = {
  entities?: Entity[];
  metrics?: Metric[];
  timeline?: TimelineEvent[];
};