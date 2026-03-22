/**
 * MongoDB 数据库配置
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 6+ 不再需要这些选项，但保留用于参考
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB 连接成功：${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB 连接错误：${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
