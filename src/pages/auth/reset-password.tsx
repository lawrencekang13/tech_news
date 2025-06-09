import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);

  // 验证令牌有效性
  useEffect(() => {
    if (token) {
      // 实际项目中，这里会验证令牌的有效性
      // const verifyToken = async () => {
      //   try {
      //     const response = await fetch(`/api/auth/verify-reset-token?token=${token}`);
      //     if (!response.ok) {
      //       setIsTokenValid(false);
      //     }
      //   } catch (error) {
      //     setIsTokenValid(false);
      //   }
      // };
      // 
      // verifyToken();
      
      // 模拟令牌验证
      // 这里假设令牌有效
      setIsTokenValid(true);
    }
  }, [token]);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.password) {
      newErrors.password = '请输入新密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度不能少于6个字符';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认新密码';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 清除之前的错误
    setResetError('');
    
    // 验证表单
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 实际项目中，这里会调用重置密码API
      // const response = await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     token,
      //     password: formData.password,
      //   }),
      // });
      // 
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || '重置密码失败');
      // }
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟成功
      console.log('密码重置成功', { token, password: formData.password });
      
      // 显示成功信息
      setIsSuccess(true);
      
      // 3秒后重定向到登录页面
      setTimeout(() => {
        router.push('/auth/login?reset=success');
      }, 3000);
      
    } catch (error) {
      // 显示错误
      setResetError(error instanceof Error ? error.message : '重置密码失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 如果令牌无效，显示错误信息
  if (!isTokenValid) {
    return (
      <>
        <Head>
          <title>重置密码 - 科技资讯</title>
          <meta name="description" content="重置您的科技资讯账户密码" />
        </Head>

        <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
            <div>
              <h1 className="text-center text-3xl font-bold text-secondary-900">链接已失效</h1>
              <p className="mt-2 text-center text-sm text-secondary-600">
                您的密码重置链接已失效或已过期
              </p>
            </div>
            
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded relative" role="alert">
              <div className="flex">
                <div className="py-1">
                  <svg className="fill-current h-6 w-6 text-danger-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM10 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">无效的重置链接</p>
                  <p className="text-sm">请重新申请密码重置，获取新的重置链接。</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Link 
                href="/auth/forgot-password" 
                className="btn-primary inline-flex justify-center px-4 py-2"
              >
                重新申请密码重置
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>重置密码 - 科技资讯</title>
        <meta name="description" content="重置您的科技资讯账户密码" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
          <div>
            <h1 className="text-center text-3xl font-bold text-secondary-900">重置密码</h1>
            <p className="mt-2 text-center text-sm text-secondary-600">
              请输入您的新密码
            </p>
          </div>
          
          {isSuccess ? (
            <div className="mt-8 space-y-6">
              <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded relative" role="alert">
                <div className="flex">
                  <div className="py-1">
                    <svg className="fill-current h-6 w-6 text-success-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold">密码重置成功</p>
                    <p className="text-sm">您的密码已成功重置，即将跳转到登录页面...</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {resetError && (
                <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{resetError}</span>
                </div>
              )}
              
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-secondary-700">
                      新密码
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className={`input-primary w-full ${errors.password ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      {errors.password && (
                        <p className="mt-1 text-sm text-danger-600">{errors.password}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700">
                      确认新密码
                    </label>
                    <div className="mt-1">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        className={`input-primary w-full ${errors.confirmPassword ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-danger-600">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn-primary w-full flex justify-center items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        重置中...
                      </>
                    ) : '重置密码'}
                  </button>
                </div>
              </form>
            </>
          )}
          
          <div className="mt-6 text-center">
            <Link 
              href="/auth/login" 
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              返回登录
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;