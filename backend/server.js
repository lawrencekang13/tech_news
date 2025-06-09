const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const cronJobs = require('./services/cronJobs');
// 移除cacheService引用

// 导入Socket控制器
const socketController = require('./controllers/socketController');

// 加载环境变量
dotenv.config();

// 连接数据库
connectDB();

// 初始化Express应用
const app = express();

// 创建HTTP服务器
const server = http.createServer(app);

// 初始化Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000, // 60秒无响应断开连接
  pingInterval: 25000, // 25秒发送一次心跳
  connectTimeout: 10000, // 连接超时时间
  transports: ['websocket', 'polling'], // 传输方式
});

// 将io实例存储为全局变量，以便在其他模块中使用
global.io = io;

// 初始化Socket控制器
socketController.initializeSocket(io);

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 路由
app.use('/', routes);

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  
  // 初始化定时任务
  cronJobs.initializeJobs();
  console.log('定时任务已初始化');
});

// 处理未捕获的异常
process.on('unhandledRejection', (err) => {
  console.log('未处理的异步拒绝:', err.message);
  // 停止定时任务
  cronJobs.stopAllJobs();
  // 关闭服务器并退出进程
  process.exit(1);
});

// 处理进程退出
process.on('SIGINT', () => {
  console.log('服务器正在关闭...');
  // 停止定时任务
  cronJobs.stopAllJobs();
  // 退出进程
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('服务器正在关闭...');
  // 停止定时任务
  cronJobs.stopAllJobs();
  // 退出进程
  process.exit(0);
});