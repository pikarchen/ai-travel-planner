# PowerShell 版本的 Docker 镜像构建和推送脚本

# 配置（请根据实际情况修改）
$REGISTRY = "registry.cn-hangzhou.aliyuncs.com"
$NAMESPACE = "your-namespace"  # 请替换为你的命名空间
$IMAGE_NAME = "ai-travel-planner"
$VERSION = if ($args[0]) { $args[0] } else { "latest" }

$FULL_IMAGE_NAME = "${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${VERSION}"

Write-Host "开始构建镜像: $FULL_IMAGE_NAME" -ForegroundColor Green

# 构建镜像
docker build -t $FULL_IMAGE_NAME .

if ($LASTEXITCODE -eq 0) {
    Write-Host "镜像构建成功！" -ForegroundColor Green
    Write-Host "镜像名称: $FULL_IMAGE_NAME" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "要推送镜像到阿里云，请运行：" -ForegroundColor Yellow
    Write-Host "docker login $REGISTRY"
    Write-Host "docker push $FULL_IMAGE_NAME"
} else {
    Write-Host "镜像构建失败！" -ForegroundColor Red
    exit 1
}

