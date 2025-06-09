import { useEffect } from 'react';
import { useRouter } from 'next/router';

// 这个页面用于处理分类根路径的重定向
const CategoryIndexRedirect = () => {
  const router = useRouter();
  
  useEffect(() => {
    // 重定向到分类列表页面
    router.replace('/categories/');
  }, [router]);
  
  return null; // 不渲染任何内容，因为会立即重定向
};

export default CategoryIndexRedirect;