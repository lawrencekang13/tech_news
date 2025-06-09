import { useEffect } from 'react';
import { useRouter } from 'next/router';

const UserProfileRedirect = () => {
  const router = useRouter();
  
  useEffect(() => {
    // 重定向到主个人资料页面
    router.replace('/profile');
  }, [router]);
  
  return null; // 不渲染任何内容，因为会立即重定向
};

export default UserProfileRedirect;