import connectDB from '../../lib/db';
import Category from '../../models/Category';
import { Category as CategoryType } from '@/types';

/**
 * 服务器端分类服务
 * 直接调用数据库操作，用于 getStaticProps 和 getStaticPaths
 */

/**
 * 获取所有分类
 * @param nav 是否只返回导航所需的基本信息
 * @returns Promise<CategoryType[]>
 */
export async function getAllCategoriesServer(nav: boolean = false): Promise<CategoryType[]> {
  try {
    await connectDB();

    // 构建查询
    const query = { isActive: true };
    
    // 如果是导航请求，只返回基本信息
    const selectFields = nav ? 'name slug icon color order' : '';
    
    const categories = await Category.find(query)
      .select(selectFields)
      .sort({ order: 1, name: 1 })
      .lean();

    // 如果没有分类数据，返回默认分类
    if (!categories || categories.length === 0) {
      const defaultCategories = [
        {
          _id: '1',
          name: '人工智能',
          slug: 'ai',
          icon: '🤖',
          color: '#3B82F6',
          order: 1,
          isActive: true,
          description: 'AI和机器学习相关资讯'
        },
        {
          _id: '2',
          name: '区块链',
          slug: 'blockchain',
          icon: '⛓️',
          color: '#10B981',
          order: 2,
          isActive: true,
          description: '区块链技术和加密货币'
        },
        {
          _id: '3',
          name: '量子计算',
          slug: 'quantum-computing',
          icon: '⚛️',
          color: '#8B5CF6',
          order: 3,
          isActive: true,
          description: '量子计算前沿技术'
        },
        {
          _id: '4',
          name: '生物技术',
          slug: 'biotech',
          icon: '🧬',
          color: '#F59E0B',
          order: 4,
          isActive: true,
          description: '生物技术和医疗创新'
        },
        {
          _id: '5',
          name: '太空探索',
          slug: 'space',
          icon: '🚀',
          color: '#EF4444',
          order: 5,
          isActive: true,
          description: '太空科技和探索'
        }
      ];
      
      return defaultCategories.map(cat => ({
        id: cat._id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        color: cat.color,
        description: cat.description
      }));
    }

    // 转换为前端类型
    return categories.map((cat: any) => ({
      id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || '📰',
      color: cat.color || '#6B7280',
      description: cat.description || ''
    }));
  } catch (error) {
    console.error('获取分类列表失败:', error);
    
    // 返回默认分类
    return [
      { id: '1', name: '人工智能', slug: 'ai', icon: '🤖', color: '#3B82F6', description: 'AI和机器学习相关资讯' },
      { id: '2', name: '区块链', slug: 'blockchain', icon: '⛓️', color: '#10B981', description: '区块链技术和加密货币' },
      { id: '3', name: '量子计算', slug: 'quantum-computing', icon: '⚛️', color: '#8B5CF6', description: '量子计算前沿技术' },
      { id: '4', name: '生物技术', slug: 'biotech', icon: '🧬', color: '#F59E0B', description: '生物技术和医疗创新' },
      { id: '5', name: '太空探索', slug: 'space', icon: '🚀', color: '#EF4444', description: '太空科技和探索' }
    ];
  }
}

/**
 * 根据slug获取分类详情
 * @param slug 分类slug
 * @returns Promise<CategoryType | null>
 */
export async function getCategoryBySlugServer(slug: string): Promise<CategoryType | null> {
  try {
    await connectDB();

    const category = await Category.findOne({ slug, isActive: true }).lean();
    
    if (!category) {
      return null;
    }

    // 转换为前端类型
    return {
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      icon: category.icon || '📰',
      color: category.color || '#6B7280',
      description: category.description || ''
    };
  } catch (error) {
    console.error(`获取分类 ${slug} 详情失败:`, error);
    return null;
  }
}