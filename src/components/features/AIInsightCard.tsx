import React, { useState } from 'react';

type FeedbackType = 'like' | 'dislike' | null;

type AIInsightCardProps = {
  summary: string;                 // AI生成的摘要内容
  mode?: 'compact' | 'detailed';   // 显示模式：简洁或详细
  maxLines?: number;              // 最大显示行数
  showFeedback?: boolean;         // 是否显示反馈按钮
  onFeedback?: (feedback: 'like' | 'dislike') => void;  // 反馈回调
  className?: string;             // 自定义样式类
};

const AIInsightCard: React.FC<AIInsightCardProps> = ({
  summary,
  mode = 'detailed',
  maxLines,
  showFeedback = false,
  onFeedback,
  className,
}) => {
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [expanded, setExpanded] = useState(false);

  // 处理反馈
  const handleFeedback = (type: 'like' | 'dislike') => {
    setFeedback(type);
    if (onFeedback) {
      onFeedback(type);
    }
  };

  // 根据模式设置样式
  const containerClasses = `ai-summary ${
    mode === 'compact' ? 'p-3' : 'p-4'
  } ${className || ''}`;

  // 根据模式设置摘要样式
  const summaryClasses = `text-secondary-700 ${
    mode === 'compact' && !expanded && maxLines === undefined
      ? 'text-sm line-clamp-3'
      : 'text-base'
  } ${
    maxLines !== undefined && !expanded ? `line-clamp-${maxLines}` : ''
  }`;

  return (
    <div className={containerClasses}>
      <div className="flex items-center text-primary-600 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className={`${mode === 'compact' ? 'h-4 w-4' : 'h-5 w-5'} mr-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="font-medium">AI小总结</span>
      </div>
      
      <p className={summaryClasses}>{summary}</p>
      
      {/* 展开/收起按钮 */}
      {maxLines && summary.length > 150 && (
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-primary-500 text-sm mt-1 hover:text-primary-600 transition-colors"
        >
          {expanded ? '收起' : '展开全文'}
        </button>
      )}
      
      {/* 反馈按钮 */}
      {showFeedback && (
        <div className="flex items-center mt-3 space-x-4">
          <button 
            onClick={() => handleFeedback('like')}
            className={`flex items-center text-sm ${feedback === 'like' ? 'text-primary-500' : 'text-secondary-500 hover:text-primary-500'} transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill={feedback === 'like' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span>有帮助</span>
          </button>
          <button 
            onClick={() => handleFeedback('dislike')}
            className={`flex items-center text-sm ${feedback === 'dislike' ? 'text-danger-500' : 'text-secondary-500 hover:text-danger-500'} transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill={feedback === 'dislike' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
            </svg>
            <span>无帮助</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AIInsightCard;