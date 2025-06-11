const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

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
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 10000,
  transports: ['websocket', 'polling'],
});

// 将io实例存储为全局变量
global.io = io;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 添加一个简单的测试路由
app.get('/api/test', (req, res) => {
  console.log('收到测试请求');
  res.json({ message: '服务器正常工作' });
});

// 添加一个根路由
app.get('/', (req, res) => {
  console.log('收到根路径请求');
  res.json({ message: '欢迎访问API服务器' });
});

// 路由
app.use('/', routes);

// 错误处理中间件
app.use(errorHandler);

// 强制使用5005端口，并监听所有网络接口
const PORT = 5005;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`服务器运行在 http://${HOST}:${PORT}`);
  console.log(`也可以通过 http://localhost:${PORT} 或 http://127.0.0.1:${PORT} 访问`);
  console.log(`本机IP地址: http://192.168.1.8:${PORT}`);
  console.log('已禁用定时任务以避免错误');
});

// 处理未捕获的异常
process.on('unhandledRejection', (err) => {
  console.log('未处理的异步拒绝:', err.message);
  // 关闭服务器并退出进程
  process.exit(1);
});

// 处理进程退出
process.on('SIGINT', () => {
  console.log('服务器正在关闭...');
  // 退出进程
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('服务器正在关闭...');
  // 退出进程
  process.exit(0);
});