#!/bin/bash
# 自媒体项目 - 阿里云一键部署脚本
# 使用方法：在阿里云服务器上运行 bash deploy.sh

set -e

echo "========================================"
echo "🚀 自媒体项目 - 阿里云一键部署脚本"
echo "========================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否以 root 运行
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}请使用 root 用户运行此脚本${NC}"
  echo "运行：sudo bash deploy.sh"
  exit 1
fi

# 1. 系统更新
echo -e "${YELLOW}[1/10] 更新系统...${NC}"
apt-get update && apt-get upgrade -y

# 2. 安装 Node.js
echo -e "${YELLOW}[2/10] 安装 Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
node -v
npm -v

# 3. 安装 MongoDB
echo -e "${YELLOW}[3/10] 安装 MongoDB 7.0...${NC}"
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt-get update
apt-get install -y mongodb-org
systemctl start mongod
systemctl enable mongod
sleep 2
systemctl status mongod --no-pager

# 4. 安装 PM2
echo -e "${YELLOW}[4/10] 安装 PM2...${NC}"
npm install -g pm2

# 5. 安装 Nginx
echo -e "${YELLOW}[5/10] 安装 Nginx...${NC}"
apt-get install -y nginx
systemctl start nginx
systemctl enable nginx

# 6. 安装 Git
echo -e "${YELLOW}[6/10] 安装 Git...${NC}"
apt-get install -y git

# 7. 创建应用目录
echo -e "${YELLOW}[7/10] 创建应用目录...${NC}"
mkdir -p /var/www/selfmedia-app
cd /var/www/selfmedia-app

# 8. 克隆项目
echo -e "${YELLOW}[8/10] 克隆项目代码...${NC}"
if [ -d ".git" ]; then
  echo "项目已存在，执行 git pull..."
  git pull
else
  git clone https://github.com/xiangqinburuouyu/selfmedia-app.git .
fi

# 9. 配置后端
echo -e "${YELLOW}[9/10] 配置后端服务...${NC}"
cd /var/www/selfmedia-app/backend

# 生成随机 JWT 密钥
JWT_SECRET="selfmedia-$(openssl rand -hex 32)"

# 创建 .env 文件
cat > .env << EOF
# 服务器配置
PORT=3000
NODE_ENV=production

# MongoDB 配置
MONGODB_URI=mongodb://localhost:27017/selfmedia-app

# JWT 配置
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRE=7d

# 文件上传配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
EOF

echo "✅ 后端配置文件已创建"

# 安装依赖
npm install --production

# 10. 配置前端
echo -e "${YELLOW}[10/10] 配置前端服务...${NC}"
cd /var/www/selfmedia-app/web

# 安装依赖并构建
npm install
npm run build

# 11. 启动服务
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}启动 PM2 服务...${NC}"
echo -e "${GREEN}========================================${NC}"

cd /var/www/selfmedia-app/backend
pm2 delete selfmedia-backend 2>/dev/null || true
pm2 start server.js --name selfmedia-backend

cd /var/www/selfmedia-app/web
pm2 delete selfmedia-web 2>/dev/null || true
pm2 start npm --name selfmedia-web -- start

pm2 save
pm2 startup | tail -1 | bash 2>/dev/null || true

# 12. 配置 Nginx
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}配置 Nginx 反向代理...${NC}"
echo -e "${GREEN}========================================${NC}"

cat > /etc/nginx/sites-available/selfmedia-app << 'EOF'
server {
    listen 80;
    server_name _;

    # 前端 (Next.js)
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 静态资源
    location /uploads {
        proxy_pass http://localhost:3000/uploads;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# 启用配置
ln -sf /etc/nginx/sites-available/selfmedia-app /etc/nginx/sites-enabled/selfmedia-app
rm -f /etc/nginx/sites-enabled/default

# 测试并重载
nginx -t && systemctl reload nginx

# 13. 显示部署信息
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ 部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📊 服务状态查看：pm2 status"
echo "📝 查看日志：pm2 logs"
echo "🔍 监控面板：pm2 monit"
echo ""
echo "🌐 访问地址："
echo "   前端：http://$(curl -s ifconfig.me)"
echo "   后端 API: http://$(curl -s ifconfig.me)/api"
echo ""
echo "⚠️  重要提示："
echo "   1. 请在阿里云控制台开放端口：80, 443, 22"
echo "   2. 建议配置域名和 HTTPS 证书"
echo "   3. 修改 .env 中的 JWT_SECRET 为自定义密钥"
echo ""
echo "📖 详细文档：/var/www/selfmedia-app/阿里云部署指南.md"
echo ""
