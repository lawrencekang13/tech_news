# API路由与SSR/ISR页面实现指南

本文档详细说明了如何在Next.js项目中实现API路由(pages/api/*)和服务器端渲染(SSR)/增量静态再生成(ISR)页面，以及实现过程中所需的资源和注意事项。

## 目录

1. [API路由实现](#api路由实现)
2. [SSR页面实现](#ssr页面实现)
3. [ISR页面实现](#isr页面实现)
4. [所需资源](#所需资源)
5. [最佳实践](#最佳实践)

## API路由实现

### 什么是API路由

Next.js的API路由允许你在`pages/api`目录下创建API端点，这些端点会被映射到`/api/*`路径下。API路由是完全在服务器端运行的，不会增加客户端的JavaScript包大小。

### 示例实现

我们已经实现了一个获取热门新闻的API路由：`src/pages/api/news/trending.ts`

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { limit = 5 } = req.query;
      
      // 构建后端API URL
      const backendUrl = `${BACKEND_URL}/api/news/trending?limit=${limit}`;
      
      // 调用后端API
      const response = await axios.get(backendUrl, {
        timeout: 10000,
      });
      
      // 返回数据
      res.status(200).json(response.data);
    } catch (error: any) {
      console.error('获取热门新闻失败:', error.message);
      
      // 返回错误响应
      res.status(error.response?.status || 500).json({
        success: false,
        message: '获取热门新闻失败',
        error: error.message
      });
    }
  } else {
    // 不支持的HTTP方法
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ 
      success: false, 
      message: `不支持 ${req.method} 方法` 
    });
  }
}
```

### API路由的关键点

1. **请求处理**：使用`req`对象获取请求参数、头信息等
2. **响应生成**：使用`res`对象设置状态码、头信息，并返回JSON数据
3. **HTTP方法处理**：根据`req.method`区分处理不同的HTTP方法
4. **错误处理**：捕获异常并返回适当的错误响应
5. **环境变量**：使用`process.env`访问环境变量

## SSR页面实现

### 什么是SSR

服务器端渲染(Server-Side Rendering, SSR)是指在服务器上渲染页面，然后将完整的HTML发送到客户端。这有助于提高首屏加载速度和SEO。在Next.js中，使用`getServerSideProps`函数实现SSR。

### 示例实现

我们已经实现了一个使用SSR的热门新闻页面：`src/pages/trending.tsx`

```typescript
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // 在服务器端调用API获取热门新闻
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const apiUrl = `${protocol}://${host}/api/news/trending?limit=10`;
    
    const res = await fetch(apiUrl);
    
    if (!res.ok) {
      throw new Error(`获取热门新闻失败: ${res.status}`);
    }
    
    const data = await res.json();
    
    // 返回props给页面组件
    return {
      props: {
        trendingNews: data.data?.news || [],
        lastUpdated: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('获取热门新闻失败:', error);
    
    // 出错时返回空数据
    return {
      props: {
        trendingNews: [],
        lastUpdated: new Date().toISOString(),
      },
    };
  }
};
```

### SSR的关键点

1. **`getServerSideProps`函数**：在每次请求时在服务器端执行
2. **数据获取**：在服务器端获取数据，可以访问服务器端资源
3. **返回props**：将获取的数据作为props传递给页面组件
4. **错误处理**：处理数据获取过程中的错误
5. **请求上下文**：可以访问请求上下文，如查询参数、cookies等

## ISR页面实现

### 什么是ISR

增量静态再生成(Incremental Static Regeneration, ISR)是Next.js的一个功能，它允许你在构建时预渲染页面，并在后台定期重新生成页面。这结合了静态生成的性能优势和服务器端渲染的数据新鲜度。

### 示例实现

我们已经实现了两个使用ISR的页面：

1. 分类详情页：`src/pages/category/[id].tsx`
2. 新闻详情页：`src/pages/news/[id]-static.tsx`

以下是分类详情页的关键代码：

```typescript
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // 获取所有分类的slug
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const apiUrl = `${protocol}://${host}/api/categories?nav=true`;
    
    const res = await fetch(apiUrl);
    
    if (!res.ok) {
      throw new Error(`获取分类失败: ${res.status}`);
    }
    
    const data = await res.json();
    const categories = data.data || [];
    
    // 为每个分类生成路径
    const paths = categories.map((category: Category) => ({
      params: { id: category.slug },
    }));
    
    return {
      paths,
      fallback: true,
    };
  } catch (error) {
    console.error('获取分类路径失败:', error);
    
    return {
      paths: [],
      fallback: true,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    // ... 获取数据的代码 ...
    
    return {
      props: {
        category,
        news,
        pagination,
        lastUpdated: new Date().toISOString(),
      },
      // 设置页面重新生成的时间间隔（秒）
      revalidate: 900, // 15分钟
    };
  } catch (error) {
    // ... 错误处理 ...
  }
};
```

### ISR的关键点

1. **`getStaticPaths`函数**：定义哪些页面在构建时预渲染
2. **`fallback`选项**：
   - `false`：未预渲染的路径返回404
   - `true`：未预渲染的路径在客户端渲染
   - `'blocking'`：未预渲染的路径在服务器端渲染
3. **`getStaticProps`函数**：在构建时获取数据
4. **`revalidate`选项**：设置页面重新生成的时间间隔（秒）
5. **增量更新**：只有被访问的页面会在后台重新生成

## 所需资源

### 开发环境

1. **Node.js**：推荐使用v14.x或更高版本
2. **npm**或**yarn**：包管理工具

### 依赖包

1. **next**：Next.js框架
2. **react**和**react-dom**：React库
3. **axios**：用于发起HTTP请求
4. **typescript**：类型支持

### 环境变量

在`.env.local`文件中配置以下环境变量：

```
BACKEND_URL=http://localhost:5001  # 后端API地址
NEXT_PUBLIC_API_URL=/api  # 前端API路径前缀
```

### API文档

1. [Next.js API路由文档](https://nextjs.org/docs/api-routes/introduction)
2. [Next.js数据获取文档](https://nextjs.org/docs/basic-features/data-fetching)

## 最佳实践

### API路由最佳实践

1. **职责分离**：API路由应该只负责请求处理和响应生成，业务逻辑应该放在单独的服务层
2. **错误处理**：始终包含适当的错误处理和日志记录
3. **验证**：验证请求参数和权限
4. **缓存控制**：设置适当的缓存头
5. **CORS处理**：处理跨域请求

### SSR最佳实践

1. **选择性使用**：只在需要SEO或需要访问请求上下文的页面使用SSR
2. **性能优化**：减少`getServerSideProps`中的数据获取时间
3. **缓存**：使用CDN或Edge缓存SSR页面
4. **错误边界**：在客户端使用错误边界捕获渲染错误

### ISR最佳实践

1. **合理设置revalidate**：根据数据更新频率设置合适的重新生成间隔
2. **预渲染重要页面**：在`getStaticPaths`中预渲染重要或热门的页面
3. **处理fallback状态**：为`fallback: true`的页面提供良好的加载状态
4. **按需重新验证**：考虑使用Next.js的按需重新验证API

### 通用最佳实践

1. **TypeScript**：使用TypeScript增强代码可靠性
2. **组件拆分**：将页面拆分为可重用的组件
3. **服务层**：创建服务层处理数据获取和业务逻辑
4. **错误处理**：实现全面的错误处理策略
5. **性能监控**：监控页面性能和服务器负载

## 结论

API路由、SSR和ISR是Next.js提供的强大功能，可以帮助你构建高性能、SEO友好的应用。根据页面的具体需求选择合适的渲染策略：

- **客户端渲染**：适用于私有页面或不需要SEO的交互式页面
- **SSR**：适用于需要访问请求上下文或内容频繁更新的页面
- **ISR**：适用于内容相对稳定但需要定期更新的页面
- **静态生成**：适用于完全静态的页面

通过合理组合这些策略，可以为用户提供最佳的体验。