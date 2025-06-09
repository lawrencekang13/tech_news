import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Category } from '../../types';

type CategorySelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string | string[]) => void; // 修改为接受字符串或字符串数组
  onSave: () => void;
};

const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
  onSave,
}) => {
  // 修改为数组以支持多选
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // 当模态框打开时，初始化本地选择的分类
  React.useEffect(() => {
    // 如果有预选分类，则初始化为包含该分类的数组
    setSelectedCategories(selectedCategory ? [selectedCategory] : []);
  }, [selectedCategory, isOpen]);

  // 处理分类选择 - 修改为切换选择状态
  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategories(prev => {
      // 如果已选中，则移除；否则添加
      if (prev.includes(categorySlug)) {
        return prev.filter(slug => slug !== categorySlug);
      } else {
        return [...prev, categorySlug];
      }
    });
  };

  // 处理保存 - 直接传递所有选中的分类
  const handleSave = () => {
    if (selectedCategories.length > 0) {
      // 传递所有选中的分类，而不仅仅是第一个
      onSelectCategory(selectedCategories);
      onSave();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="选择分类">
      <div className="mb-4">
        <p className="text-secondary-600 mb-4">
          请为此资讯选择一个或多个分类，以便更好地组织您保存的内容。
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategorySelect(category.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategories.includes(category.slug)
                  ? 'bg-primary-500 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              {category.icon && <span className="mr-1">{category.icon}</span>}
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 border-t border-secondary-200 pt-4">
        <button
          type="button"
          className="btn-secondary"
          onClick={onClose}
        >
          取消
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={handleSave}
          disabled={selectedCategories.length === 0}
        >
          保存
        </button>
      </div>
    </Modal>
  );
};

export default CategorySelectionModal;