#!/bin/bash

# GitHub Actions 工作流上传脚本
# 使用 GitHub API 上传工作流文件

set -e

# 配置
GITHUB_USER="xiangqinburuouyu"
REPO_NAME="lingdong"
BRANCH="main"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}GitHub Actions 工作流上传脚本${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""

# 检查 GitHub token
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}❌ 错误：GITHUB_TOKEN 环境变量未设置${NC}"
    echo ""
    echo "请按照以下步骤获取 token："
    echo "1. 访问 https://github.com/settings/tokens"
    echo "2. 点击 'Generate new token (classic)'"
    echo "3. 勾选权限：repo, workflow"
    echo "4. 生成并复制 token"
    echo "5. 运行：export GITHUB_TOKEN=your_token_here"
    echo ""
    exit 1
fi

# 工作流文件列表
WORKFLOW_FILES=(
    ".github/workflows/build.yml"
    ".github/workflows/build-advanced.yml"
)

# 上传每个文件
for file in "${WORKFLOW_FILES[@]}"; do
    echo -e "${YELLOW}📤 上传：$file${NC}"
    
    # 读取文件内容并 base64 编码
    content=$(cat "$file" | base64 -w 0)
    
    # GitHub API 端点
    api_url="https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/${file}"
    
    # 创建 commit 消息
    commit_message="Add GitHub Actions workflow: $(basename $file)"
    
    # 调用 GitHub API
    response=$(curl -s -X PUT "$api_url" \
        -H "Authorization: token ${GITHUB_TOKEN}" \
        -H "Accept: application/vnd.github.v3+json" \
        -d "{
            \"message\": \"$commit_message\",
            \"content\": \"$content\",
            \"branch\": \"$BRANCH\"
        }")
    
    # 检查响应
    if echo "$response" | grep -q '"sha"'; then
        echo -e "${GREEN}✅ 成功：$file${NC}"
    else
        error_msg=$(echo "$response" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
        echo -e "${RED}❌ 失败：$error_msg${NC}"
    fi
    
    echo ""
done

echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}上传完成！${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""
echo "下一步："
echo "1. 访问 https://github.com/${GITHUB_USER}/${REPO_NAME}/settings/secrets/actions"
echo "2. 添加 Secret: EXPO_TOKEN"
echo "3. 访问 https://github.com/${GITHUB_USER}/${REPO_NAME}/actions 触发构建"
echo ""
