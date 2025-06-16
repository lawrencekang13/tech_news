import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  summary: string;
  content: string;
  publishDate: Date;
  creator?: string;
  author?: string;
  link: string;
  category: string;
  tags: string[];
  media?: any;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  publishDate: {
    type: Date,
    required: true
  },
  creator: {
    type: String,
    trim: true
  },
  author: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  media: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// 创建索引
NewsSchema.index({ title: 'text', summary: 'text', content: 'text' });
NewsSchema.index({ category: 1 });
NewsSchema.index({ publishDate: -1 });
NewsSchema.index({ link: 1 }, { unique: true });

export default mongoose.models.News || mongoose.model<INews>('News', NewsSchema);