import React, { useState } from 'react';
import Head from 'next/head';
import AIInsightCard from '@/components/features/AIInsightCard';

type FeedbackType = 'like' | 'dislike' | null;

const AIInsightCardExamples = () => {
  const [feedbackCompact, setFeedbackCompact] = useState<FeedbackType>(null);
  const [feedbackDetailed, setFeedbackDetailed] = useState<FeedbackType>(null);
  
  const shortSummary = 'OpenAI今日发布了最新的大型语言模型GPT-5，相比前代GPT-4，在推理能力、创造性和多模态理解方面有显著提升。';
  
  const longSummary = 'OpenAI今日发布了最新的大型语言模型GPT-5，相比前代GPT-4，在推理能力、创造性和多模态理解方面有显著提升。该模型在标准基准测试中表现出色，特别是在复杂推理任务上。GPT-5在MMLU（大规模多任务语言理解）上达到了92.3%的准确率，超过了当前所有已知的开源和闭源模型。在编程能力评估上，它在HumanEval和MBPP测试中分别达到了94.2%和89.7%的通过率。OpenAI首席科学家Ilya Sutskever表示："GPT-5代表了我们朝着通用人工智能迈出的又一步。它不仅在现有任务上表现更好，还展示了解决以前从未见过的问题类型的能力。"';

  return (
    <div className="container-custom py-8">
      <Head>
        <title>AI小总结组件示例 | 全球最新科技资讯平台</title>
      </Head>
      
      <h1 className="text-3xl font-bold mb-8">AI小总结组件示例</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4">简洁模式 (Compact)</h2>
            <div className="card">
              <AIInsightCard 
                summary={shortSummary} 
                mode="compact" 
              />
            </div>
            <p className="mt-2 text-secondary-500 text-sm">适用于资讯列表页面，简洁展示AI小总结</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">简洁模式 + 行数限制</h2>
            <div className="card">
              <AIInsightCard 
                summary={longSummary} 
                mode="compact" 
                maxLines={2}
              />
            </div>
            <p className="mt-2 text-secondary-500 text-sm">限制显示行数，适用于空间有限的场景</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">简洁模式 + 反馈功能</h2>
            <div className="card">
              <AIInsightCard 
                summary={shortSummary} 
                mode="compact" 
                showFeedback={true}
                onFeedback={(feedback) => setFeedbackCompact(feedback)}
              />
            </div>
            <p className="mt-2 text-secondary-500 text-sm">
              添加反馈功能，收集用户对AI小总结的评价
              {feedbackCompact && (
                <span className="ml-2 font-medium">
                  用户反馈: {feedbackCompact === 'like' ? '👍 有帮助' : '👎 无帮助'}
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4">详细模式 (Detailed)</h2>
            <div className="card">
              <AIInsightCard 
                summary={longSummary} 
                mode="detailed" 
              />
            </div>
            <p className="mt-2 text-secondary-500 text-sm">适用于资讯详情页面，完整展示AI小总结</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">详细模式 + 行数限制 + 展开/收起</h2>
            <div className="card">
              <AIInsightCard 
                summary={longSummary} 
                mode="detailed" 
                maxLines={3}
              />
            </div>
            <p className="mt-2 text-secondary-500 text-sm">默认显示有限行数，提供展开/收起功能</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">详细模式 + 反馈功能</h2>
            <div className="card">
              <AIInsightCard 
                summary={longSummary} 
                mode="detailed" 
                showFeedback={true}
                onFeedback={(feedback) => setFeedbackDetailed(feedback)}
              />
            </div>
            <p className="mt-2 text-secondary-500 text-sm">
              添加反馈功能，收集用户对AI小总结的评价
              {feedbackDetailed && (
                <span className="ml-2 font-medium">
                  用户反馈: {feedbackDetailed === 'like' ? '👍 有帮助' : '👎 无帮助'}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-secondary-100 rounded-lg">
        <h2 className="text-xl font-bold mb-4">组件使用说明</h2>
        <div className="prose max-w-none">
          <p>AIInsightCard组件提供以下属性：</p>
          <ul>
            <li><code>summary</code>: AI生成的摘要内容（必填）</li>
            <li><code>mode</code>: 显示模式，可选 'compact'（简洁）或 'detailed'（详细），默认为 'detailed'</li>
            <li><code>maxLines</code>: 最大显示行数，超出部分将被隐藏并提供展开/收起功能</li>
            <li><code>showFeedback</code>: 是否显示反馈按钮，默认为 false</li>
            <li><code>onFeedback</code>: 反馈回调函数，接收 'like' 或 'dislike' 参数</li>
            <li><code>className</code>: 自定义样式类</li>
          </ul>
          <p>使用示例：</p>
          <pre><code>{`<AIInsightCard 
  summary="AI生成的摘要内容" 
  mode="detailed" 
  maxLines={3}
  showFeedback={true}
  onFeedback={(feedback) => console.log(feedback)}
/>`}</code></pre>
        </div>
      </div>
    </div>
  );
};

export default AIInsightCardExamples;