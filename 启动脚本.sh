#!/bin/bash

# 自媒体博客 APP - 启动脚本
# 使用方法：bash 启动脚本.sh

echo "======================================"
echo "🚀 自媒体博客 APP - 启动脚本"
echo "======================================"

# 检查 MongoDB
echo ""
echo "📊 检查 MongoDB..."
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB 已安装"
    MONGO_RUNNING=$(pgrep -x mongod)
    if [ -z "$MONGO_RUNNING" ]; then
        echo "⚠️  MongoDB 未运行，正在启动..."
        mongod --dbpath /data/db --fork --logpath /var/log/mongodb.log
    else
        echo "✅ MongoDB 正在运行"
    fi
else
    echo "❌ MongoDB 未安装"
    echo "请安装 MongoDB 或使用 Docker:"
    echo "  docker run -d -p 27017:27017 --name mongodb mongo:latest"
    exit 1
fi

# 启动后端
echo ""
echo "🔧 启动后端服务..."
cd "$(dirname "$0")/backend"

if [ ! -d "node_modules" ]; then
    echo "📦 安装后端依赖..."
    npm install
fi

echo "🚀 后端服务启动中..."
npm run dev &
BACKEND_PID=$!
echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"

# 等待后端启动
sleep 5

# 检查后端
echo ""
echo "🧪 测试后端服务..."
curl -s http://localhost:3000/health > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ 后端服务运行正常"
else
    echo "⚠️  后端服务可能未正常启动，请检查日志"
fi

# 启动前端
echo ""
echo "📱 准备启动前端..."
cd "$(dirname "$0")/mobile-app"

if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
fi

echo ""
echo "======================================"
echo "✅ 启动完成！"
echo "======================================"
echo ""
echo "📊 后端服务：http://localhost:3000"
echo "📱 前端服务：运行 'npx expo start' 启动"
echo ""
echo "📝 API 文档：docs/API 文档.md"
echo "📝 启动指南：启动指南.md"
echo ""
echo "按 Ctrl+C 停止后端服务"
echo ""

# 保持脚本运行
wait $BACKEND_PID
