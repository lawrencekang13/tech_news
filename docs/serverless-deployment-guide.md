# Next.js 应用 Serverless 部署指南

本文档详细说明了如何使用 Serverless Framework 部署 Next.js 应用到 AWS 云平台，实现无服务器架构的部署方案。

## 前提条件

在开始部署之前，请确保您已经满足以下条件：

1. **Node.js 环境**：已安装 Node.js 14.x 或更高版本
2. **AWS 账户**：拥有有效的 AWS 账户
3. **AWS CLI**：已安装并配置 AWS CLI
4. **Serverless Framework**：已全局安装 Serverless Framework
   ```bash
   npm install -g serverless
   ```
5. **AWS 凭证**：已配置 AWS 凭证
   ```bash
   serverless config credentials --provider aws --key YOUR_ACCESS_KEY --secret YOUR_SECRET_KEY
   ```

## 项目结构

确保您的项目结构如下：

```
/
├── .next/               # Next.js 构建输出目录
├── src/                 # 源代码
│   ├── pages/           # Next.js 页面
│   │   ├── api/         # API 路由
│   │   └── ...          # 其他页面
├── public/              # 静态资源
├── next.config.js       # Next.js 配置
├── serverless.yml       # Serverless Framework 配置
└── package.json         # 项目依赖
```

## serverless.yml 配置说明

`serverless.yml` 文件是 Serverless Framework 的核心配置文件，定义了如何部署您的 Next.js 应用：

```yaml
# serverless.yml

# 声明使用 Next.js Serverless Component
component: nextjs

# 服务名称，用于命名AWS资源
name: global-tech-news-app

# 输入参数
inputs:
  nextConfigDir: './'
  memory: 1024 # MB
  timeout: 30 # 秒

# 输出信息
outputs:
  CloudFrontDistributionDomain: ${output:CloudFrontDistributionDomain}
  ApiGatewayUrl: ${output:ApiGatewayUrl}
  BucketName: ${output:BucketName}

# AWS 提供商配置
provider:
  name: aws
  region: ap-southeast-2
```

### 配置项说明

- **component**: 使用的 Serverless 组件，这里是 `nextjs`
- **name**: 服务名称，用于命名 AWS 资源
- **inputs**:
  - **nextConfigDir**: Next.js 项目的根目录
  - **memory**: Lambda 函数的内存配置（MB）
  - **timeout**: Lambda 函数的超时时间（秒）
  - **domain**: （可选）自定义域名配置
- **outputs**: 部署后输出的信息
- **provider**: AWS 提供商配置，包括区域设置

## 部署步骤

### 1. 准备应用

确保您的 Next.js 应用已经准备好部署：

```bash
# 安装依赖
npm install

# 构建应用
npm run build
```

### 2. 安装 Serverless Next.js 组件

```bash
npm install --save-dev @sls-next/serverless-component
```

### 3. 部署应用

```bash
serverless deploy
```

部署过程可能需要几分钟时间。完成后，终端会显示部署信息，包括：

- CloudFront 分发域名（用于访问您的应用）
- API Gateway URL（用于直接访问 API）
- S3 桶名称（存储静态资源）

## 自定义域名配置

如果您想使用自定义域名，请取消注释 `serverless.yml` 中的 `domain` 部分，并替换为您的域名：

```yaml
domain:
  - domain: yourdomain.com
    subdomains:
      www: www
```

然后，您需要在 AWS Route 53 或您的域名注册商处添加相应的 DNS 记录。

## 环境变量配置

要配置环境变量，可以在 `serverless.yml` 的 `inputs` 部分添加 `env` 配置：

```yaml
inputs:
  nextConfigDir: './'
  env:
    BACKEND_URL: 'https://api.example.com'
    NEXT_PUBLIC_API_URL: '/api'
```

## 监控和日志

部署后，您可以通过 AWS CloudWatch 查看应用的日志和监控信息：

1. 登录 AWS 控制台
2. 导航到 CloudWatch 服务
3. 选择 "Logs" > "Log Groups"
4. 查找名为 `/aws/lambda/global-tech-news-app-xxx` 的日志组

## 常见问题

### 部署失败

如果部署失败，请检查以下几点：

1. AWS 凭证是否正确配置
2. 是否有足够的 AWS 权限
3. `serverless.yml` 文件格式是否正确
4. Next.js 应用是否成功构建

### 性能优化

如果您的应用响应较慢，可以尝试：

1. 增加 Lambda 函数的内存配置
2. 优化 Next.js 应用的代码和依赖
3. 使用 ISR（增量静态再生成）减少动态渲染

## 更新部署

当您的应用有更新时，只需重新构建并部署：

```bash
npm run build
serverless deploy
```

## 移除部署

如果您想移除已部署的应用，可以运行：

```bash
serverless remove
```

这将删除所有相关的 AWS 资源，包括 Lambda 函数、API Gateway、CloudFront 分发和 S3 桶。

## 结论

使用 Serverless Framework 部署 Next.js 应用可以帮助您充分利用 AWS 的无服务器架构，实现高可用、自动扩展的应用部署。通过合理配置 `serverless.yml` 文件，您可以根据应用的需求自定义部署选项，优化性能和成本。