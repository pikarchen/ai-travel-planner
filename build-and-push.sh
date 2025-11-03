#!/bin/bash
# Docker 镜像构建和推送脚本

# 配置（请根据实际情况修改）
REGISTRY="registry.cn-hangzhou.aliyuncs.com"
NAMESPACE="your-namespace"  # 请替换为你的命名空间
IMAGE_NAME="ai-travel-planner"
VERSION="${1:-latest}"

FULL_IMAGE_NAME="${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${VERSION}"

echo "开始构建镜像: ${FULL_IMAGE_NAME}"

# 构建镜像
docker build -t ${FULL_IMAGE_NAME} .

if [ $? -eq 0 ]; then
    echo "镜像构建成功！"
    echo "镜像名称: ${FULL_IMAGE_NAME}"
    echo ""
    echo "要推送镜像到阿里云，请运行："
    echo "docker login ${REGISTRY}"
    echo "docker push ${FULL_IMAGE_NAME}"
else
    echo "镜像构建失败！"
    exit 1
fi

