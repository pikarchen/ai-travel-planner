# PowerShell 脚本：构建并导出 Docker 镜像

Write-Host "=== AI 旅行规划师 - Docker 镜像构建与导出 ===" -ForegroundColor Green
Write-Host ""

# 步骤 1: 构建镜像
Write-Host "步骤 1: 构建 Docker 镜像..." -ForegroundColor Yellow
docker build -t ai-travel-planner:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host "镜像构建失败！" -ForegroundColor Red
    exit 1
}

Write-Host "镜像构建成功！" -ForegroundColor Green
Write-Host ""

# 步骤 2: 导出镜像
Write-Host "步骤 2: 导出镜像为 tar 文件..." -ForegroundColor Yellow
$outputFile = "ai-travel-planner-latest.tar"

if (Test-Path $outputFile) {
    Write-Host "警告: $outputFile 已存在，将被覆盖" -ForegroundColor Yellow
    Remove-Item $outputFile
}

docker save -o $outputFile ai-travel-planner:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "镜像导出失败！" -ForegroundColor Red
    exit 1
}

# 获取文件大小
$fileSize = (Get-Item $outputFile).Length / 1MB
Write-Host "镜像导出成功！" -ForegroundColor Green
Write-Host "文件: $outputFile" -ForegroundColor Cyan
Write-Host "大小: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
Write-Host ""

# 步骤 3: 提示下一步
Write-Host "=== 下一步操作 ===" -ForegroundColor Green
Write-Host "1. 将 $outputFile 上传到 GitHub Releases" -ForegroundColor Yellow
Write-Host "2. 访问: https://github.com/pikarchen/ai-travel-planner/releases" -ForegroundColor Yellow
Write-Host "3. 创建新 Release 并上传文件" -ForegroundColor Yellow
Write-Host ""

