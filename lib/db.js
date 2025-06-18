import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error('请在环境变量中定义MONGO_URI');
}

/**
 * 全局缓存MongoDB连接
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * 连接MongoDB数据库
 * @returns {Promise<mongoose.Connection>}
 */
async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000, // 30秒服务器选择超时
      socketTimeoutMS: 45000, // 45秒套接字超时
      connectTimeoutMS: 30000, // 30秒连接超时
      maxPoolSize: 10, // 最大连接池大小
      retryWrites: true, // 启用重试写入
      retryReads: true, // 启用重试读取
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB连接成功');
      return mongoose;
    }).catch((error) => {
      console.error('MongoDB连接失败:', error.message);
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;