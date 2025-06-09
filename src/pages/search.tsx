import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useQuery } from 'react-query';
import NewsCard from '@/components/features/NewsCard';
import CategoryFilter from '@/components/features/CategoryFilter';
import { News } from '@/types';

// 模拟搜索API
const searchNews = async (query: string, tag?: string, category?: string): Promise<News[]> => {
  // 实际项目中，这里会调用真实的API
  // const res = await fetch(`/api/search?q=${query}&tag=${tag}&category=${category}`);
  // return res.json();
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟的资讯数据
      const allNews = [
        {
          id: '1',
          title: 'OpenAI发布GPT-5，性能较GPT-4提升50%',
          summary: 'OpenAI今日发布了最新的大型语言模型GPT-5，相比前代GPT-4，在推理能力、创造性和多模态理解方面有显著提升。该模型在标准基准测试中表现出色，特别是在复杂推理任务上。',
          category: 'ai',
          tags: ['OpenAI', 'GPT-5', '人工智能', '大语言模型'],
          publishDate: '2023-11-15T08:30:00Z',
          source: 'Tech News Daily',
          imageUrl: 'https://placeholder-api.com/800x400?text=GPT-5',
        },
        {
          id: '2',
          title: 'Google DeepMind推出Gemini模型，与GPT-5展开竞争',
          summary: 'Google DeepMind正式发布了Gemini大型语言模型，这是其对标OpenAI GPT系列的最新作品。Gemini在多模态理解和知识推理方面表现出色，将在Google各产品线中逐步部署。',
          category: 'ai',
          tags: ['Google', 'DeepMind', 'Gemini', '人工智能', '大语言模型'],
          publishDate: '2023-11-18T10:15:00Z',
          source: 'AI Insider',
          imageUrl: 'https://placeholder-api.com/800x400?text=Gemini',
        },
        {
          id: '3',
          title: 'AI安全联盟呼吁加强大型语言模型的监管框架',
          summary: 'AI安全联盟发布了一份关于大型语言模型潜在风险的报告，呼吁各国政府和科技公司共同建立更严格的监管框架，以确保AI发展的安全性和可控性。',
          category: 'ai',
          tags: ['AI安全', '监管', '人工智能', '政策'],
          publishDate: '2023-11-20T14:45:00Z',
          source: 'Tech Policy Today',
          imageUrl: 'https://placeholder-api.com/800x400?text=AI+Safety',
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
        },
        {
          id: '5',
          title: '以太坊完成重大网络升级，提高交易处理能力',
          summary: '以太坊网络完成了名为"上海"的重大升级，此次升级显著提高了网络的交易处理能力，并降低了Gas费用，为去中心化应用的发展提供了更好的基础设施支持。',
          category: 'blockchain',
          tags: ['以太坊', '区块链', '网络升级', '去中心化'],
          publishDate: '2023-11-05T11:30:00Z',
          source: 'Blockchain Daily',
          imageUrl: 'https://placeholder-api.com/800x400?text=Ethereum',
        },
      ];

      // 根据查询参数过滤资讯
      let filteredNews = [...allNews];
      
      if (query) {
        const lowerQuery = query.toLowerCase();
        filteredNews = filteredNews.filter(news => 
          news.title.toLowerCase().includes(lowerQuery) || 
          news.summary.toLowerCase().includes(lowerQuery)
        );
      }
      
      if (tag) {
        filteredNews = filteredNews.filter(news => 
          news.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        );
      }
      
      if (category) {
        filteredNews = filteredNews.filter(news => news.category === category);
      }

      resolve(filteredNews);
    }, 800); // 模拟网络延迟
  });
};

const Search = () => {
  const router = useRouter();
  const { q, tag, category } = router.query;
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  // 当URL参数变化时更新选中的分类
  useEffect(() => {
    if (category && typeof category === 'string') {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(undefined);
    }
  }, [category]);

  // 处理分类变化
  const handleCategoryChange = (category: string | null) => {
    const newCategory = category || undefined;
    setSelectedCategory(newCategory);
    
    const query = { ...router.query };
    if (newCategory) {
      query.category = newCategory;
    } else {
      delete query.category;
    }
    
    router.push({
      pathname: '/search',
      query,
    });
  };

  // 获取搜索结果
  const { data: searchResults, isLoading, isError } = useQuery(
    ['search', q, tag, selectedCategory],
    () => searchNews(
      typeof q === 'string' ? q : '',
      typeof tag === 'string' ? tag : undefined,
      selectedCategory
    ),
    {
      enabled: !!(q || tag || selectedCategory),
      staleTime: 5 * 60 * 1000, // 5分钟
    }
  );

  // 构建页面标题
  const getPageTitle = () => {
    if (q) return `搜索：${q}`;
    if (tag) return `标签：${tag}`;
    if (selectedCategory) {
      const categoryMap: Record<string, string> = {
        'ai': '人工智能',
        'quantum-computing': '量子计算',
        'blockchain': '区块链',
        'biotech': '生物科技',
        'ar-vr': 'AR/VR',
        'autonomous-vehicles': '自动驾驶',
      };
      return `分类：${categoryMap[selectedCategory] || selectedCategory}`;
    }
    return '搜索';
  };

  return (
    <>
      <Head>
        <title>{getPageTitle()} - 科技资讯</title>
        <meta name="description" content={`科技资讯搜索结果 - ${getPageTitle()}`} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-4">
            {getPageTitle()}
          </h1>
          
          {/* 搜索框 */}
          <div className="mb-6">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const searchQuery = formData.get('search') as string;
                
                if (searchQuery.trim()) {
                  router.push({
                    pathname: '/search',
                    query: { 
                      ...router.query,
                      q: searchQuery.trim(),
                    },
                  });
                }
              }}
              className="flex w-full max-w-2xl"
            >
              <input
                type="text"
                name="search"
                placeholder="搜索科技资讯..."
                defaultValue={typeof q === 'string' ? q : ''}
                className="input-primary flex-grow"
              />
              <button type="submit" className="btn-primary ml-2">
                搜索
              </button>
            </form>
          </div>

          {/* 当前搜索条件展示 */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {q && (
              <div className="badge badge-secondary flex items-center">
                <span className="mr-1">关键词：{q}</span>
                <button 
                  onClick={() => {
                    const query = { ...router.query };
                    delete query.q;
                    router.push({ pathname: '/search', query });
                  }}
                  className="ml-1 text-secondary-500 hover:text-secondary-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {tag && (
              <div className="badge badge-secondary flex items-center">
                <span className="mr-1">标签：{tag}</span>
                <button 
                  onClick={() => {
                    const query = { ...router.query };
                    delete query.tag;
                    router.push({ pathname: '/search', query });
                  }}
                  className="ml-1 text-secondary-500 hover:text-secondary-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* 分类筛选 */}
          <CategoryFilter 
            categories={[
              { slug: '', name: '全部' },
              { slug: 'ai', name: '人工智能' },
              { slug: 'quantum-computing', name: '量子计算' },
              { slug: 'blockchain', name: '区块链' },
              { slug: 'biotech', name: '生物科技' },
              { slug: 'ar-vr', name: 'AR/VR' },
              { slug: 'autonomous-vehicles', name: '自动驾驶' },
            ]}
            selectedCategory={selectedCategory || ''} 
            onSelectCategory={handleCategoryChange} 
          />
        </div>

        {/* 搜索结果 */}
        <div className="space-y-6">
          {isLoading ? (
            // 加载状态
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-8 bg-secondary-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded w-1/2 mb-1"></div>
                  <div className="h-4 bg-secondary-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : isError ? (
            // 错误状态
            <div className="text-center py-10">
              <div className="text-danger mb-2">搜索失败，请重试</div>
              <button 
                className="btn-primary"
                onClick={() => router.reload()}
              >
                重试
              </button>
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            // 有搜索结果
            <>
              <div className="text-secondary-600 mb-4">
                找到 {searchResults.length} 条相关资讯
              </div>
              {searchResults.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </>
          ) : (
            // 无搜索结果
            <div className="text-center py-10">
              <div className="text-secondary-600 mb-2">
                未找到相关资讯
              </div>
              <p className="text-secondary-500">
                请尝试使用其他关键词或清除筛选条件
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;