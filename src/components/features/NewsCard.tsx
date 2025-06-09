import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
// First install react-hot-toast: npm install react-hot-toast
import { toast } from 'react-hot-toast';
import AIInsightCard from './AIInsightCard';
import CategorySelectionModal from './CategorySelectionModal';
import { News } from '@/types';
import { saveNews, unsaveNews } from '@/api/user';

type NewsCardProps = {
  news: News;
  isSaved?: boolean;
  onSaveStatusChange?: (newsId: string, isSaved: boolean) => void;
};

const NewsCard: React.FC<NewsCardProps> = ({ news, isSaved = false, onSaveStatusChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [localIsSaved, setLocalIsSaved] = useState(isSaved);
  const [isSaving, setIsSaving] = useState(false);
  
  // 格式化发布时间
  const formattedDate = formatDistanceToNow(new Date(news.publishDate), {
    addSuffix: true,
    locale: zhCN,
  });
  
  // 切换保存状态
  const toggleSave = async () => {
    if (localIsSaved) {
      try {
        // 如果已经保存，则调用API取消保存资讯
        await unsaveNews(news.id);
        setLocalIsSaved(false);
        if (onSaveStatusChange) {
          onSaveStatusChange(news.id, false);
        }
        toast.success('已从收藏中移除');
      } catch (error) {
        console.error('取消保存资讯失败:', error);
        toast.error('操作失败，请稍后重试');
      }
    } else {
      // 如果未保存，则打开分类选择模态框
      setIsModalOpen(true);
    }
  };
  
  // 保存资讯
  const handleSaveNews = async () => {
    if (selectedCategories.length === 0) {
      toast.error('请至少选择一个分类');
      return;
    }
    
    setIsSaving(true);
    try {
      // 调用API保存资讯，并传递选中的分类
      await saveNews(news.id, selectedCategories);
      setLocalIsSaved(true);
      setIsModalOpen(false);
      if (onSaveStatusChange) {
        onSaveStatusChange(news.id, true);
      }
      toast.success(`已添加到收藏: ${selectedCategories.map(getCategoryName).join(', ')}`);
    } catch (error) {
      console.error('保存资讯失败:', error);
      toast.error('保存失败，请稍后重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 获取分类名称
  const getCategoryName = (categoryId: string) => {
    const categoryMap: Record<string, string> = {
      'ai': '人工智能',
      'quantum-computing': '量子计算',
      'blockchain': '区块链',
      'biotech': '生物科技',
      'ar-vr': 'AR/VR',
      'autonomous-vehicles': '自动驾驶',
    };
    return categoryMap[categoryId] || categoryId;
  };

  return (
    <div className="card hover:translate-y-[-4px] transition-all duration-300">
      {/* 资讯图片 */}
      {news.imageUrl && (
        <Link href={`/news/${news.id}`} className="block relative h-48 rounded-md overflow-hidden mb-4">
          <Image 
            src={news.imageUrl} 
            alt={news.title}
            fill
            className="object-cover"
          />
        </Link>
      )}

      {/* 资讯元信息 */}
      <div className="flex items-center text-sm text-secondary-500 mb-2">
        <span className="badge badge-primary mr-2">
          {getCategoryName(news.category)}
        </span>
        <span>{news.source}</span>
        <span className="mx-2">•</span>
        <span>{formattedDate}</span>
      </div>

      {/* 资讯标题 */}
      <h2 className="text-xl font-bold mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
        <Link href={`/news/${news.id}`}>
          {news.title}
        </Link>
      </h2>

      {/* AI小总结 */}
      <div className="mb-4">
        <AIInsightCard 
          summary={news.summary} 
          mode="compact" 
          maxLines={3} 
        />
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-2">
        {news.tags && news.tags.length > 0 && news.tags.slice(0, 3).map((tag) => (
          <Link 
            key={tag} 
            href={`/search?tag=${encodeURIComponent(tag)}`}
            className="badge badge-secondary hover:bg-secondary-200 transition-colors"
          >
            {tag}
          </Link>
        ))}
        {news.tags && news.tags.length > 3 && (
          <span className="badge badge-secondary">+{news.tags.length - 3}</span>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-secondary-100">
        {news.sourceUrl ? (
          <a 
            href={news.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center"
          >
            阅读全文
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        ) : (
          <Link 
            href={`/news/${news.id}`} 
            className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center"
          >
            阅读全文
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        )}
        <button 
          onClick={toggleSave}
          className={`flex items-center space-x-1 ${localIsSaved ? 'text-primary-500' : 'text-secondary-500 hover:text-primary-500'} transition-colors`}
          disabled={isSaving}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={localIsSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span className="text-sm">{isSaving ? '保存中...' : (localIsSaved ? '已保存' : '保存')}</span>
        </button>
      </div>
      
      {/* 分类选择模态框 */}
      <CategorySelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={[
          { id: 'ai', name: '人工智能', slug: 'ai' },
          { id: 'quantum-computing', name: '量子计算', slug: 'quantum-computing' },
          { id: 'blockchain', name: '区块链', slug: 'blockchain' },
          { id: 'biotech', name: '生物科技', slug: 'biotech' },
          { id: 'ar-vr', name: 'AR/VR', slug: 'ar-vr' },
          { id: 'autonomous-vehicles', name: '自动驾驶', slug: 'autonomous-vehicles' },
        ]}
        selectedCategory={selectedCategories[0] || ''}
        onSelectCategory={(category) => {
          // 更新为支持多分类，接收字符串或字符串数组
          if (Array.isArray(category)) {
            setSelectedCategories(category);
          } else if (category) {
            setSelectedCategories([category]);
          } else {
            setSelectedCategories([]);
          }
        }}
        onSave={handleSaveNews}
      />
    </div>
  );
};

export default NewsCard;