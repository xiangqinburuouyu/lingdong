#!/bin/bash

# GitHub Actions + EAS 一键配置脚本
# 使用方法：bash 一键配置.sh

set -e

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置
WORKSPACE="/home/admin/openclaw/workspace/temp/自媒体 APP/mobile-app"
GITHUB_USER="xiangqinburuouyu"
REPO_NAME="lingdong"

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════╗"
echo "║   GitHub Actions + EAS 构建配置工具               ║"
echo "╚════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

cd "$WORKSPACE"

# 检查文件
echo -e "${YELLOW}📋 检查配置文件...${NC}"
if [ -f ".github/workflows/build.yml" ]; then
    echo -e "${GREEN}✅ build.yml 已存在${NC}"
else
    echo -e "${RED}❌ build.yml 不存在${NC}"
    exit 1
fi

if [ -f ".github/workflows/build-advanced.yml" ]; then
    echo -e "${GREEN}✅ build-advanced.yml 已存在${NC}"
else
    echo -e "${RED}❌ build-advanced.yml 不存在${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ 所有配置文件已就绪！${NC}"
echo ""

# 显示配置步骤
echo -e "${YELLOW}════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}请按以下步骤完成配置：${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}步骤 1: 获取 GitHub Token${NC}"
echo "访问：https://github.com/settings/tokens"
echo "- 点击 'Generate new token (classic)'"
echo "- 勾选：repo, workflow"
echo "- 生成并复制 token"
echo ""

echo -e "${BLUE}步骤 2: 上传工作流文件${NC}"
echo "方式 A - 使用脚本（需要 token）："
echo "  export GITHUB_TOKEN=ghp_xxx"
echo "  bash upload-to-github.sh"
echo ""
echo "方式 B - 手动上传（推荐）："
echo "  1. 访问 https://github.com/xiangqinburuouyu/lingdong"
echo "  2. Add file → Create new file"
echo "  3. 创建 .github/workflows/build.yml"
echo "  4. 复制下方内容并提交"
echo ""

echo -e "${BLUE}步骤 3: 配置 GitHub Secrets${NC}"
echo "1. 访问 https://github.com/xiangqinburuouyu/lingdong/settings/secrets/actions"
echo "2. New repository secret"
echo "3. Name: EXPO_TOKEN"
echo "4. Value: 你的 Expo token（从 https://expo.dev/settings/access-tokens 获取）"
echo ""

echo -e "${BLUE}步骤 4: 触发构建${NC}"
echo "访问：https://github.com/xiangqinburuouyu/lingdong/actions"
echo "- 选择 'Build Android APK'"
echo "- Run workflow → Run workflow"
echo ""

echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}配置文件位置：${NC}"
echo "  - $WORKSPACE/.github/workflows/build.yml"
echo "  - $WORKSPACE/.github/workflows/build-advanced.yml"
echo "  - $WORKSPACE/快速配置指南.md"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}💡 提示：${NC}"
echo "详细配置指南请查看：快速配置指南.md"
echo ""

echo -e "${GREEN}✅ 配置工具执行完成！${NC}"
echo ""
