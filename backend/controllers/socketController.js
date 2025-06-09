const News = require('../models/News');

// 存储活跃连接
const activeConnections = new Map();
// 存储用户在线状态
const onlineUsers = new Map();
// 存储房间信息
const rooms = new Map();

// 验证中间件
const authMiddleware = (socket, next) => {
  // 获取token
  const token = socket.handshake.auth.token;
  
  if (!token) {
    // 允许匿名连接，但标记为未认证
    socket.auth = { authenticated: false };
    return next();
  }
  
  try {
    // 这里可以添加JWT验证逻辑
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // socket.auth = { authenticated: true, user: decoded };
    
    // 简化版，仅作示例
    socket.auth = { authenticated: true, userId: 'user-123' };
    return next();
  } catch (error) {
    return next(new Error('认证失败'));
  }
};

// 初始化Socket.IO
exports.initializeSocket = (io) => {
  // 创建新闻命名空间
  const newsNamespace = io.of('/news');
  
  // 应用中间件
  newsNamespace.use(authMiddleware);
  
  // 连接事件
  newsNamespace.on('connection', async (socket) => {
    try {
      const clientIp = socket.handshake.address;
      const isAuthenticated = socket.auth?.authenticated || false;
      const userId = socket.auth?.userId || 'anonymous-' + socket.id;
      
      console.log(`客户端连接: ${socket.id} | IP: ${clientIp} | 认证: ${isAuthenticated} | 用户: ${userId}`);
      
      // 存储连接信息
      activeConnections.set(socket.id, {
        socket,
        userId,
        isAuthenticated,
        connectedAt: new Date(),
        subscriptions: {
          categories: [],
          tags: []
        },
        rooms: []
      });
      
      // 更新用户在线状态
      if (isAuthenticated) {
        onlineUsers.set(userId, socket.id);
        // 通知其他用户该用户上线
        socket.broadcast.emit('user:online', { userId });
      }
      
      // 发送欢迎消息
      socket.emit('connection:success', {
        message: '连接成功',
        socketId: socket.id,
        isAuthenticated
      });
      
      // 处理新闻订阅
      socket.on('subscribe:news', async (data) => {
        try {
          const { categories = [], tags = [] } = data;
          
          // 更新用户订阅信息
          const connection = activeConnections.get(socket.id);
          if (connection) {
            connection.subscriptions = { categories, tags };
            
            // 加入相应的房间
            categories.forEach(category => {
              const roomName = `category:${category}`;
              socket.join(roomName);
              connection.rooms.push(roomName);
              
              // 更新房间信息
              if (!rooms.has(roomName)) {
                rooms.set(roomName, new Set());
              }
              rooms.get(roomName).add(socket.id);
            });
            
            tags.forEach(tag => {
              const roomName = `tag:${tag}`;
              socket.join(roomName);
              connection.rooms.push(roomName);
              
              // 更新房间信息
              if (!rooms.has(roomName)) {
                rooms.set(roomName, new Set());
              }
              rooms.get(roomName).add(socket.id);
            });
          }
          
          // 发送初始数据
          const query = {};
          if (categories.length > 0) {
            query.category = { $in: categories };
          }
          if (tags.length > 0) {
            query.tags = { $in: tags };
          }
          
          const latestNews = await News.find(query || {})
            .sort({ publishDate: -1 })
            .limit(10);
          
          socket.emit('news:initial', {
            news: latestNews,
            subscriptions: { categories, tags }
          });
          
          console.log(`客户端 ${socket.id} 订阅了新闻 | 分类: ${categories.join(', ')} | 标签: ${tags.join(', ')}`);
        } catch (error) {
          console.error(`订阅新闻时出错: ${error.message}`);
          socket.emit('error', { message: '订阅新闻失败', error: error.message });
        }
      });
      
      // 处理取消订阅
      socket.on('unsubscribe:news', (data) => {
        try {
          const { categories = [], tags = [] } = data;
          const connection = activeConnections.get(socket.id);
          
          if (connection) {
            // 从房间中移除
            categories.forEach(category => {
              const roomName = `category:${category}`;
              socket.leave(roomName);
              
              // 更新连接的房间列表
              connection.rooms = connection.rooms.filter(r => r !== roomName);
              
              // 更新房间信息
              if (rooms.has(roomName)) {
                rooms.get(roomName).delete(socket.id);
                if (rooms.get(roomName).size === 0) {
                  rooms.delete(roomName);
                }
              }
            });
            
            tags.forEach(tag => {
              const roomName = `tag:${tag}`;
              socket.leave(roomName);
              
              // 更新连接的房间列表
              connection.rooms = connection.rooms.filter(r => r !== roomName);
              
              // 更新房间信息
              if (rooms.has(roomName)) {
                rooms.get(roomName).delete(socket.id);
                if (rooms.get(roomName).size === 0) {
                  rooms.delete(roomName);
                }
              }
            });
            
            // 更新订阅信息
            connection.subscriptions.categories = connection.subscriptions.categories.filter(
              c => !categories.includes(c)
            );
            connection.subscriptions.tags = connection.subscriptions.tags.filter(
              t => !tags.includes(t)
            );
          }
          
          socket.emit('news:unsubscribed', {
            message: '取消订阅成功',
            unsubscribed: { categories, tags }
          });
          
          console.log(`客户端 ${socket.id} 取消订阅了新闻 | 分类: ${categories.join(', ')} | 标签: ${tags.join(', ')}`);
        } catch (error) {
          console.error(`取消订阅新闻时出错: ${error.message}`);
          socket.emit('error', { message: '取消订阅新闻失败', error: error.message });
        }
      });
      
      // 获取在线用户
      socket.on('get:online-users', () => {
        socket.emit('online-users', { users: Array.from(onlineUsers.keys()) });
      });
      
      // 获取活跃房间
      socket.on('get:active-rooms', () => {
        const activeRooms = {};
        for (const [roomName, members] of rooms.entries()) {
          activeRooms[roomName] = members.size;
        }
        socket.emit('active-rooms', { rooms: activeRooms });
      });
      
      // 心跳检测
      socket.on('ping', () => {
        socket.emit('pong', { timestamp: Date.now() });
      });
      
      // 断开连接
      socket.on('disconnect', (reason) => {
        console.log(`客户端断开连接: ${socket.id} | 原因: ${reason}`);
        
        // 获取连接信息
        const connection = activeConnections.get(socket.id);
        if (connection) {
          // 如果是认证用户，更新在线状态
          if (connection.isAuthenticated && connection.userId) {
            onlineUsers.delete(connection.userId);
            // 通知其他用户该用户下线
            socket.broadcast.emit('user:offline', { userId: connection.userId });
          }
          
          // 从所有房间中移除
          connection.rooms.forEach(roomName => {
            if (rooms.has(roomName)) {
              rooms.get(roomName).delete(socket.id);
              if (rooms.get(roomName).size === 0) {
                rooms.delete(roomName);
              }
            }
          });
        }
        
        // 删除连接信息
        activeConnections.delete(socket.id);
      });
      
      // 错误处理
      socket.on('error', (error) => {
        console.error(`Socket错误: ${socket.id}`, error);
      });
      
    } catch (error) {
      console.error(`处理Socket连接时出错: ${error.message}`);
      socket.emit('error', { message: '服务器错误', error: error.message });
    }
  });
  
  // 命名空间错误处理
  newsNamespace.on('error', (error) => {
    console.error('命名空间错误:', error);
  });
  
  // 创建管理命名空间（可选，用于管理员操作）
  const adminNamespace = io.of('/admin');
  
  // 管理员命名空间需要更严格的认证
  adminNamespace.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('需要管理员权限'));
    }
    
    try {
      // 这里可以添加管理员JWT验证逻辑
      // const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
      // if (!decoded.isAdmin) throw new Error('不是管理员');
      // socket.auth = { authenticated: true, user: decoded };
      
      // 简化版，仅作示例
      socket.auth = { authenticated: true, userId: 'admin-123', isAdmin: true };
      return next();
    } catch (error) {
      return next(new Error('管理员认证失败'));
    }
  });
  
  adminNamespace.on('connection', (socket) => {
    console.log(`管理员连接: ${socket.id}`);
    
    // 获取所有连接信息
    socket.on('get:connections', () => {
      const connections = [];
      for (const [socketId, connection] of activeConnections.entries()) {
        connections.push({
          socketId,
          userId: connection.userId,
          isAuthenticated: connection.isAuthenticated,
          connectedAt: connection.connectedAt,
          subscriptions: connection.subscriptions,
          rooms: connection.rooms
        });
      }
      socket.emit('connections', { connections });
    });
    
    // 强制断开特定连接
    socket.on('disconnect:user', ({ socketId }) => {
      const targetSocket = io.of('/news').sockets.get(socketId);
      if (targetSocket) {
        targetSocket.disconnect(true);
        socket.emit('user:disconnected', { socketId, success: true });
      } else {
        socket.emit('user:disconnected', { socketId, success: false, error: '找不到指定的连接' });
      }
    });
    
    // 广播系统消息
    socket.on('broadcast:system-message', ({ message, target }) => {
      if (target === 'all') {
        io.of('/news').emit('system:message', { message });
      } else if (target.startsWith('category:') || target.startsWith('tag:')) {
        io.of('/news').to(target).emit('system:message', { message });
      } else {
        socket.emit('broadcast:error', { error: '无效的目标' });
      }
    });
  });
};

// 向订阅者发送新闻更新
exports.broadcastNewsUpdate = async (newNews) => {
  try {
    const io = global.io;
    if (!io) return;
    
    const newsNamespace = io.of('/news');
    
    // 向相关分类房间广播
    const categoryRoom = `category:${newNews.category}`;
    newsNamespace.to(categoryRoom).emit('news:update', { type: 'new', news: newNews });
    
    // 向相关标签房间广播
    newNews.tags.forEach(tag => {
      const tagRoom = `tag:${tag}`;
      newsNamespace.to(tagRoom).emit('news:update', { type: 'new', news: newNews });
    });
    
    // 记录广播信息
    console.log(`广播新闻更新: ${newNews.title} | 分类: ${newNews.category} | 标签: ${newNews.tags.join(', ')}`);
    
    return true;
  } catch (error) {
    console.error(`广播新闻更新时出错: ${error.message}`);
    return false;
  }
};

// 广播新闻更新
exports.broadcastNewsEdit = async (updatedNews) => {
  try {
    const io = global.io;
    if (!io) return;
    
    const newsNamespace = io.of('/news');
    
    // 向相关分类房间广播
    const categoryRoom = `category:${updatedNews.category}`;
    newsNamespace.to(categoryRoom).emit('news:update', { type: 'edit', news: updatedNews });
    
    // 向相关标签房间广播
    updatedNews.tags.forEach(tag => {
      const tagRoom = `tag:${tag}`;
      newsNamespace.to(tagRoom).emit('news:update', { type: 'edit', news: updatedNews });
    });
    
    return true;
  } catch (error) {
    console.error(`广播新闻编辑时出错: ${error.message}`);
    return false;
  }
};

// 广播新闻删除
exports.broadcastNewsDelete = async (newsId, category, tags) => {
  try {
    const io = global.io;
    if (!io) return;
    
    const newsNamespace = io.of('/news');
    
    // 向相关分类房间广播
    const categoryRoom = `category:${category}`;
    newsNamespace.to(categoryRoom).emit('news:update', { type: 'delete', newsId });
    
    // 向相关标签房间广播
    tags.forEach(tag => {
      const tagRoom = `tag:${tag}`;
      newsNamespace.to(tagRoom).emit('news:update', { type: 'delete', newsId });
    });
    
    return true;
  } catch (error) {
    console.error(`广播新闻删除时出错: ${error.message}`);
    return false;
  }
};

// 获取所有分类
const getAllCategories = async () => {
  try {
    const categories = await News.distinct('category');
    return categories;
  } catch (error) {
    console.error(`获取所有分类时出错: ${error.message}`);
    return [];
  }
};

// 获取连接统计信息
exports.getConnectionStats = () => {
  return {
    totalConnections: activeConnections.size,
    authenticatedUsers: Array.from(activeConnections.values()).filter(c => c.isAuthenticated).length,
    anonymousUsers: Array.from(activeConnections.values()).filter(c => !c.isAuthenticated).length,
    activeRooms: rooms.size,
    roomDetails: Array.from(rooms.entries()).map(([name, members]) => ({
      name,
      members: members.size
    }))
  };
};