import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 定义用户资料的类型接口
interface UserProfile {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    joinDate: string;
  };
  savedNews: Array<{
    id: string;
    title: string;
    summary: string;
    category: string;
    tags: string[];
    publishDate: string;
    source: string;
    imageUrl: string;
    savedAt: string;
  }>;
  readingHistory: Array<{
    id: string;
    title: string;
    category: string;
    publishDate: string;
    source: string;
    readAt: string;
  }>;
}

// 模拟获取用户信息和保存的资讯
const fetchUserProfile = async (): Promise<UserProfile> => {
  // 实际项目中，这里会调用真实的API
  // const res = await fetch('/api/user/profile');
  // return res.json();
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: '1',
          name: '张三',
          email: 'zhangsan@example.com',
          avatar: 'https://placeholder-api.com/150x150?text=User',
          joinDate: '2023-01-15T08:30:00Z',
        },
        savedNews: [
          {
            id: '1',
            title: 'OpenAI发布GPT-5，性能较GPT-4提升50%',
            summary: 'OpenAI今日发布了最新的大型语言模型GPT-5，相比前代GPT-4，在推理能力、创造性和多模态理解方面有显著提升。该模型在标准基准测试中表现出色，特别是在复杂推理任务上。',
            category: 'ai',
            tags: ['OpenAI', 'GPT-5', '人工智能', '大语言模型'],
            publishDate: '2023-11-15T08:30:00Z',
            source: 'Tech News Daily',
            imageUrl: 'https://placeholder-api.com/800x400?text=GPT-5',
            savedAt: '2023-11-15T10:45:00Z',
          },
          {
            id: '4',
            title: '量子计算突破：IBM实现100量子比特稳定操作',
            summary: 'IBM宣布其最新量子计算机成功实现了100量子比特的稳定操作，这一突破为解决复杂的优化问题和模拟量子系统提供了新的可能性。',
            category: 'quantum-computing',
            tags: ['IBM', '量子计算', '量子比特', '技术突破'],
            publishDate: '2023-11-10T09:20:00Z',
            source: 'Quantum Tech Review',
            imageUrl: 'https://placeholder-api.com/800x400?text=Quantum+Computing',
            savedAt: '2023-11-11T14:20:00Z',
          },
          {
            id: '14',
            title: 'Apple发布Vision Pro，重新定义空间计算体验',
            summary: 'Apple正式发布了其首款混合现实头显Vision Pro，融合了AR和VR技术，创造了全新的空间计算平台，为用户提供沉浸式的工作、娱乐和社交体验。',
            category: 'ar-vr',
            tags: ['Apple', 'Vision Pro', '混合现实', '空间计算'],
            publishDate: '2023-11-20T09:00:00Z',
            source: 'Tech Innovations',
            imageUrl: 'https://placeholder-api.com/800x400?text=Vision+Pro',
            savedAt: '2023-11-20T15:30:00Z',
          },
        ],
        readingHistory: [
          {
            id: '2',
            title: 'Google DeepMind推出Gemini模型，与GPT-5展开竞争',
            category: 'ai',
            publishDate: '2023-11-18T10:15:00Z',
            source: 'AI Insider',
            readAt: '2023-11-18T16:45:00Z',
          },
          {
            id: '5',
            title: '以太坊完成重大网络升级，提高交易处理能力',
            category: 'blockchain',
            publishDate: '2023-11-05T11:30:00Z',
            source: 'Blockchain Daily',
            readAt: '2023-11-06T08:15:00Z',
          },
          {
            id: '12',
            title: 'CRISPR基因编辑技术在治疗遗传性心脏病中取得突破',
            category: 'biotech',
            publishDate: '2023-11-18T08:45:00Z',
            source: 'BioMedical Journal',
            readAt: '2023-11-19T10:30:00Z',
          },
          {
            id: '16',
            title: '特斯拉发布全自动驾驶Beta V12，移除雷达依赖',
            category: 'autonomous-vehicles',
            publishDate: '2023-11-22T10:30:00Z',
            source: 'Electric Vehicle News',
            readAt: '2023-11-22T19:45:00Z',
          },
        ],
      });
    }, 800); // 模拟网络延迟
  });
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

// 格式化日期
const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('saved'); // 'saved', 'history', 'settings'
  
  // 获取用户信息和保存的资讯
  const { data, isLoading, isError } = useQuery(
    'userProfile',
    fetchUserProfile,
    {
      staleTime: 5 * 60 * 1000, // 5分钟
    }
  );

  // 移除保存的资讯
  const handleRemoveSaved = (newsId: string) => {
    // 实际项目中，这里会调用API删除保存的资讯
    console.log(`移除保存的资讯：${newsId}`);
  };

  // 清除阅读历史
  const handleClearHistory = () => {
    // 实际项目中，这里会调用API清除阅读历史
    console.log('清除阅读历史');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-secondary-200 h-16 w-16"></div>
            <div>
              <div className="h-4 bg-secondary-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-secondary-200 rounded w-32"></div>
            </div>
          </div>
          <div className="h-10 bg-secondary-200 rounded"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-secondary-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-danger mb-2">获取用户信息失败</div>
        <button 
          className="btn-primary"
          onClick={() => window.location.reload()}
        >
          重试
        </button>
      </div>
    );
  }

  const { user, savedNews, readingHistory } = data;

  return (
    <>
      <Head>
        <title>个人中心 - 科技资讯</title>
        <meta name="description" content="管理您保存的资讯和个人设置" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* 用户信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
              <Image 
                src={user.avatar} 
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-secondary-900 mb-1">{user.name}</h1>
              <p className="text-secondary-600 mb-2">{user.email}</p>
              <p className="text-sm text-secondary-500">
                注册于 {formatDate(user.joinDate)}
              </p>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="mb-6">
          <div className="border-b border-secondary-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'saved' ? 'border-primary-500 text-primary-600' : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'}`}
                onClick={() => setActiveTab('saved')}
              >
                已保存资讯
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-primary-500 text-primary-600' : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'}`}
                onClick={() => setActiveTab('history')}
              >
                阅读历史
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings' ? 'border-primary-500 text-primary-600' : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'}`}
                onClick={() => setActiveTab('settings')}
              >
                账户设置
              </button>
            </nav>
          </div>
        </div>

        {/* 已保存资讯 */}
        {activeTab === 'saved' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-secondary-900">已保存资讯</h2>
              <span className="text-secondary-600">
                共 {savedNews.length} 条
              </span>
            </div>

            {savedNews.length > 0 ? (
              <div className="space-y-4">
                {savedNews.map((news) => (
                  <div key={news.id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row">
                    {news.imageUrl && (
                      <div className="relative h-40 md:h-32 md:w-48 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-4">
                        <Image 
                          src={news.imageUrl} 
                          alt={news.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between">
                        <Link 
                          href={`/news/${news.id}`}
                          className="text-lg font-medium text-secondary-900 hover:text-primary-600 transition-colors"
                        >
                          {news.title}
                        </Link>
                        <button 
                          onClick={() => handleRemoveSaved(news.id)}
                          className="text-secondary-400 hover:text-danger-500 transition-colors"
                          aria-label="移除"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-1 mb-2">
                        <Link 
                          href={`/category/${news.category}`}
                          className="badge badge-primary mr-2"
                        >
                          {getCategoryName(news.category)}
                        </Link>
                        <span className="text-sm text-secondary-500">
                          {news.source} · {formatDate(news.publishDate)}
                        </span>
                      </div>
                      <p className="text-secondary-600 line-clamp-2 mb-2">{news.summary}</p>
                      <div className="flex flex-wrap gap-2">
                        {news.tags.slice(0, 3).map((tag) => (
                          <Link 
                            key={tag} 
                            href={`/search?tag=${encodeURIComponent(tag)}`}
                            className="badge badge-secondary hover:bg-secondary-200 transition-colors"
                          >
                            {tag}
                          </Link>
                        ))}
                        {news.tags.length > 3 && (
                          <span className="badge badge-secondary">+{news.tags.length - 3}</span>
                        )}
                      </div>
                      <div className="text-xs text-secondary-500 mt-2">
                        保存于 {formatDate(news.savedAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <div className="text-secondary-600 mb-2">
                  您还没有保存任何资讯
                </div>
                <Link href="/" className="btn-primary">
                  浏览资讯
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 阅读历史 */}
        {activeTab === 'history' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-secondary-900">阅读历史</h2>
              {readingHistory.length > 0 && (
                <button 
                  onClick={handleClearHistory}
                  className="text-secondary-500 hover:text-secondary-700 text-sm"
                >
                  清除历史
                </button>
              )}
            </div>

            {readingHistory.length > 0 ? (
              <div className="space-y-2">
                {readingHistory.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link 
                          href={`/news/${item.id}`}
                          className="text-lg font-medium text-secondary-900 hover:text-primary-600 transition-colors"
                        >
                          {item.title}
                        </Link>
                        <div className="mt-1">
                          <Link 
                            href={`/category/${item.category}`}
                            className="badge badge-primary mr-2"
                          >
                            {getCategoryName(item.category)}
                          </Link>
                          <span className="text-sm text-secondary-500">
                            {item.source} · {formatDate(item.publishDate)}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-secondary-500">
                        阅读于 {formatDate(item.readAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <div className="text-secondary-600 mb-2">
                  您还没有阅读历史
                </div>
                <Link href="/" className="btn-primary">
                  浏览资讯
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 账户设置 */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-bold text-secondary-900 mb-4">账户设置</h2>
            
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              {/* 个人信息设置 */}
              <div>
                <h3 className="text-lg font-medium text-secondary-900 mb-4">个人信息</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
                      用户名
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      className="input-primary w-full max-w-md" 
                      defaultValue={user.name} 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                      邮箱
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      className="input-primary w-full max-w-md" 
                      defaultValue={user.email} 
                    />
                  </div>
                  <div>
                    <label htmlFor="avatar" className="block text-sm font-medium text-secondary-700 mb-1">
                      头像
                    </label>
                    <div className="flex items-center">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                        <Image 
                          src={user.avatar} 
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button className="btn-secondary">
                        更换头像
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 密码设置 */}
              <div className="pt-6 border-t border-secondary-200">
                <h3 className="text-lg font-medium text-secondary-900 mb-4">修改密码</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-secondary-700 mb-1">
                      当前密码
                    </label>
                    <input 
                      type="password" 
                      id="current-password" 
                      className="input-primary w-full max-w-md" 
                    />
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-secondary-700 mb-1">
                      新密码
                    </label>
                    <input 
                      type="password" 
                      id="new-password" 
                      className="input-primary w-full max-w-md" 
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-secondary-700 mb-1">
                      确认新密码
                    </label>
                    <input 
                      type="password" 
                      id="confirm-password" 
                      className="input-primary w-full max-w-md" 
                    />
                  </div>
                </div>
              </div>

              {/* 通知设置 */}
              <div className="pt-6 border-t border-secondary-200">
                <h3 className="text-lg font-medium text-secondary-900 mb-4">通知设置</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="email-notification" 
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded" 
                      defaultChecked 
                    />
                    <label htmlFor="email-notification" className="ml-2 block text-sm text-secondary-700">
                      接收邮件通知
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="news-updates" 
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded" 
                      defaultChecked 
                    />
                    <label htmlFor="news-updates" className="ml-2 block text-sm text-secondary-700">
                      接收最新资讯更新
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="weekly-digest" 
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded" 
                      defaultChecked 
                    />
                    <label htmlFor="weekly-digest" className="ml-2 block text-sm text-secondary-700">
                      接收每周精选摘要
                    </label>
                  </div>
                </div>
              </div>

              {/* 保存按钮 */}
              <div className="pt-6 border-t border-secondary-200">
                <button className="btn-primary">
                  保存设置
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;