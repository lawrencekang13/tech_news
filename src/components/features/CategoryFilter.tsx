import React from 'react';

type CategoryItem = {
  slug: string;
  name: string;
  icon?: string;
};

type CategoryFilterProps = {
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium text-secondary-800">资讯分类</h2>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory('')}
            className="text-sm text-primary-500 hover:text-primary-600 flex items-center"
          >
            清除筛选
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 桌面版分类筛选 */}
      <div className="hidden md:flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => onSelectCategory(category.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.slug
                ? 'bg-primary-500 text-white'
                : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
            }`}
          >
            {category.icon && (
              <span className="mr-1">{category.icon}</span>
            )}
            {category.name}
          </button>
        ))}
      </div>

      {/* 移动版分类筛选 */}
      <div className="md:hidden">
        <select
          value={selectedCategory}
          onChange={(e) => onSelectCategory(e.target.value)}
          className="input"
        >
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CategoryFilter;