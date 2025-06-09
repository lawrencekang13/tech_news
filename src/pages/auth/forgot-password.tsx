import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  // 表单验证
  const validateForm = () => {
    if (!email.trim()) {
      setError('请输入邮箱');
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('请输入有效的邮箱地址');
      return false;
    }
    return true;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 清除之前的错误
    setError('');
    
    // 验证表单
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 实际项目中，这里会调用密码重置API
      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      // 
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || '发送重置链接失败');
      // }
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟成功
      console.log('密码重置邮件已发送', email);
      
      // 显示成功信息
      setIsSubmitted(true);
      
    } catch (error) {
      // 显示错误
      setError(error instanceof Error ? error.message : '发送重置链接失败，请重试');
      setIsSubmitted(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>忘记密码 - 科技资讯</title>
        <meta name="description" content="重置您的科技资讯账户密码" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
          <div>
            <h1 className="text-center text-3xl font-bold text-secondary-900">忘记密码</h1>
            <p className="mt-2 text-center text-sm text-secondary-600">
              输入您的邮箱，我们将发送重置密码的链接
            </p>
          </div>
          
          {!isSubmitted ? (
            <>
              {error && (
                <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700">
                    邮箱
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`input-primary w-full ${error ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                      value={email}
                      onChange={handleInputChange}
                    />
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
                        发送中...
                      </>
                    ) : '发送重置链接'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="mt-8 space-y-6">
              <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded relative" role="alert">
                <div className="flex">
                  <div className="py-1">
                    <svg className="fill-current h-6 w-6 text-success-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold">重置链接已发送</p>
                    <p className="text-sm">我们已向 {email} 发送了一封包含密码重置链接的电子邮件。请检查您的收件箱，并按照邮件中的说明进行操作。</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-secondary-600 mb-4">没有收到邮件？</p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  重新发送
                </button>
              </div>
            </div>
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

export default ForgotPasswordPage;