import React, { useState } from 'react';
import Head from 'next/head';

const UserSettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '张三',
    email: 'zhangsan@example.com',
    notifyNewArticles: true,
    notifyWeeklySummary: true,
  });

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 实际项目中，这里会调用API更新用户设置
      console.log('保存的设置:', formData);
      
      setSuccessMessage('设置已成功保存');
    } catch (error) {
      console.error('保存设置失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>账户设置 - 科技资讯</title>
        <meta name="description" content="管理您的账户设置和通知偏好" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-secondary-900 mb-6">账户设置</h1>
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* 个人信息 */}
              <div>
                <h2 className="text-lg font-medium text-secondary-900 mb-4">个人信息</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
                      姓名
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                      邮箱
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input"
                      disabled
                    />
                    <p className="text-xs text-secondary-500 mt-1">邮箱地址不可更改</p>
                  </div>
                </div>
              </div>

              {/* 通知设置 */}
              <div>
                <h2 className="text-lg font-medium text-secondary-900 mb-4">通知设置</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifyNewArticles"
                        name="notifyNewArticles"
                        type="checkbox"
                        checked={formData.notifyNewArticles}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 border-secondary-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="notifyNewArticles" className="font-medium text-secondary-700">
                        新资讯通知
                      </label>
                      <p className="text-secondary-500">当有与您兴趣相关的新资讯发布时，通过邮件通知您</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifyWeeklySummary"
                        name="notifyWeeklySummary"
                        type="checkbox"
                        checked={formData.notifyWeeklySummary}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 border-secondary-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="notifyWeeklySummary" className="font-medium text-secondary-700">
                        每周资讯摘要
                      </label>
                      <p className="text-secondary-500">每周向您发送一次精选科技资讯摘要</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 保存按钮 */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? '保存中...' : '保存设置'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserSettingsPage;