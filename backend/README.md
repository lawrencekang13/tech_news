# 科技资讯网站后端API

这是一个为科技资讯网站提供后端服务的API项目，使用Node.js、Express和MongoDB开发。

## 功能特性

- 获取科技资讯列表（支持分页和分类筛选）
- 获取科技资讯详情
- 搜索科技资讯（支持关键词、标签和分类筛选）
- 获取热门科技资讯
- 实时更新科技资讯（WebSocket支持）
- 结构化信息和可视化数据支持
- 自动从多个来源获取最新资讯
- 缓存机制提高性能

## 技术栈

- **Node.js**: JavaScript运行时环境
- **Express**: Web应用框架
- **MongoDB**: NoSQL数据库
- **Mongoose**: MongoDB对象模型工具
- **Socket.IO**: 实时双向通信库
- **Redis**: 高性能缓存数据库
- **Axios**: HTTP客户端
- **Cheerio**: HTML解析库
- **RSS-Parser**: RSS源解析库
- **Node-cron**: 定时任务调度库

## 项目结构

```
backend/
├── config/         # 配置文件
├── controllers/    # 控制器
├── middleware/     # 中间件
├── models/         # 数据模型
├── routes/         # 路由
│   └── api/        # API路由
├── services/       # 服务
│   ├── cacheService.js    # 缓存服务
│   ├── cronJobs.js        # 定时任务服务
│   └── dataSourceService.js # 数据源服务
├── utils/          # 工具函数
├── .env            # 环境变量
├── .env.example    # 环境变量示例
├── package.json    # 项目依赖
├── README.md       # 项目说明
└── server.js       # 服务器入口文件
```

## 安装和使用

### 前提条件

- Node.js (v14+)
- MongoDB

### 安装步骤

1. 克隆项目

```bash
git clone <项目地址>
cd backend
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

创建`.env`文件，参考`.env.example`配置数据库连接等信息。

4. 填充示例数据（可选）

```bash
npm run seed
```

5. 启动服务器

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

服务器将在`http://localhost:5000`启动。

## API文档

### 获取新闻列表

```
GET /api/news
```

查询参数：
- `page`: 页码（默认1）
- `limit`: 每页数量（默认10）
- `category`: 分类（可选）

### 获取热门新闻

```
GET /api/news/trending
```

查询参数：
- `limit`: 返回数量（默认10）

### 获取新闻详情

```
GET /api/news/:id
```

### 搜索新闻

```
GET /api/news/search
```

查询参数：
- `keyword`: 搜索关键词（可选）
- `tags`: 标签，逗号分隔（可选）
- `category`: 分类（可选）
- `page`: 页码（默认1）
- `limit`: 每页数量（默认10）

## WebSocket API

项目使用Socket.IO实现实时功能，提供以下命名空间和事件：

### 新闻命名空间 (/news)

#### 客户端发送事件

- `subscribe`: 订阅特定分类或标签的新闻更新
  ```javascript
  // 示例：订阅科技和AI分类的新闻
  socket.emit('subscribe', { categories: ['tech', 'ai'], tags: [] });
  ```

- `unsubscribe`: 取消订阅特定分类或标签的新闻更新
  ```javascript
  // 示例：取消订阅科技分类的新闻
  socket.emit('unsubscribe', { categories: ['tech'], tags: [] });
  ```

- `getOnlineUsers`: 获取当前在线用户数量

- `getActiveRooms`: 获取当前活跃的订阅房间

- `heartbeat`: 发送心跳包保持连接

#### 服务器发送事件

- `initialNews`: 连接成功后发送的初始新闻数据

- `newsCreated`: 新闻创建时发送

- `newsUpdated`: 新闻更新时发送

- `newsDeleted`: 新闻删除时发送

- `onlineUsers`: 返回当前在线用户数量

- `activeRooms`: 返回当前活跃的订阅房间

- `error`: 发生错误时发送

### 管理员命名空间 (/admin)

需要管理员权限才能访问此命名空间。

#### 客户端发送事件

- `getConnections`: 获取所有连接信息

- `disconnectUser`: 强制断开特定用户的连接

- `broadcastMessage`: 向所有用户广播系统消息

## 许可证

MIT