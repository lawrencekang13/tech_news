import { useEffect } from 'react';
import { useRouter } from 'next/router';

// 这个页面用于处理分类详情页面的重定向
const CategoryDetailRedirect = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  useEffect(() => {
    if (slug) {
      // 重定向到正确的分类详情页面
      router.replace(`/category/${slug}`);
    }
  }, [router, slug]);
  
  return null; // 不渲染任何内容，因为会立即重定向
};

export default CategoryDetailRedirect;
