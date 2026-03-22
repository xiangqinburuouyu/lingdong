#!/bin/bash

# 自动上传工作流到 GitHub
# 使用方法：export GITHUB_TOKEN=xxx && bash auto-upload.sh

set -e

GITHUB_USER="xiangqinburuouyu"
REPO="lingdong"
BRANCH="main"

echo "🚀 开始上传 GitHub Actions 工作流..."
echo ""

# 检查工作流文件
WORKFLOW_DIR="/home/admin/openclaw/workspace/temp/自媒体 APP/mobile-app/.github/workflows"

if [ ! -d "$WORKFLOW_DIR" ]; then
    echo "❌ 错误：工作流目录不存在"
    exit 1
fi

# 上传每个工作流文件
for file in "$WORKFLOW_DIR"/*.yml; do
    filename=$(basename "$file")
    echo "📤 上传：$filename"
    
    # Base64 编码
    content=$(base64 -w 0 "$file")
    
    # GitHub API URL
    api_url="https://api.github.com/repos/${GITHUB_USER}/${REPO}/contents/.github/workflows/${filename}"
    
    # 调用 API
    response=$(curl -s -X PUT "$api_url" \
        -H "Authorization: token ${GITHUB_TOKEN}" \
        -H "Accept: application/vnd.github.v3+json" \
        -d "{
            \"message\": \"Add GitHub Actions workflow: ${filename}\",
            \"content\": \"${content}\",
            \"branch\": \"${BRANCH}\"
        }")
    
    # 检查结果
    if echo "$response" | grep -q '"sha"'; then
        echo "✅ 成功：$filename"
    else
        error=$(echo "$response" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
        echo "❌ 失败：$error"
        echo "请确保 GITHUB_TOKEN 有效且有 workflow 权限"
    fi
    
    echo ""
done

echo "✅ 上传完成！"
echo ""
echo "下一步："
echo "1. 访问 https://github.com/${GITHUB_USER}/${REPO}/settings/secrets/actions"
echo "2. 添加 Secret: EXPO_TOKEN"
echo "3. 访问 https://github.com/${GITHUB_USER}/${REPO}/actions 触发构建"
