# 作业提交检查清单

## ✅ 必做项

### 1. GitHub 仓库
- [ ] 创建 GitHub 仓库
- [ ] 将所有代码推送到 GitHub（确保 `.env` 文件已添加到 `.gitignore`）
- [ ] 保留详细的提交记录（多次提交，显示开发过程）
- [ ] 在 README.md 中更新 GitHub 仓库地址

### 2. API Keys 配置
- [ ] 确认所有 API keys 已从代码中移除
- [ ] 在 README.md 中提供 API keys（如果使用非阿里云百炼平台）
- [ ] 确保提供的 API keys 3 个月内有效
- [ ] 验证 `.env.example` 文件已创建且不包含真实密钥

### 3. Docker 镜像
- [ ] 配置 GitHub Actions 自动构建（已在 `.github/workflows/docker-build.yml`）
- [ ] 在阿里云容器镜像服务创建命名空间
- [ ] 配置 GitHub Secrets（ALIYUN_REGISTRY_USERNAME, ALIYUN_REGISTRY_PASSWORD, ALIYUN_REGISTRY_NAMESPACE）
- [ ] 推送标签触发构建（如：`git tag v1.0.0 && git push origin v1.0.0`）
- [ ] 验证镜像构建成功
- [ ] 在 README.md 中更新镜像地址

### 4. 文档
- [ ] README.md 包含完整的项目说明
- [ ] README.md 包含快速开始指南
- [ ] README.md 包含 Docker 运行说明
- [ ] README.md 包含 API keys 配置说明（如适用）
- [ ] DEPLOYMENT.md 包含部署详细说明（已创建）

### 5. PDF 文件
- [ ] 创建 PDF 文件，包含：
  - GitHub 仓库地址
  - README.md 完整内容
  - 镜像仓库地址
  - 运行说明

## 📋 提交前检查

### 代码检查
- [ ] 运行 `npm run build` 确保构建成功
- [ ] 测试 Docker 镜像本地构建：`docker build -t ai-travel-planner .`
- [ ] 测试 Docker 运行：`docker run -p 8787:8787 --env-file ./server/.env ai-travel-planner`
- [ ] 确认没有硬编码的 API keys
- [ ] 确认 `.gitignore` 包含 `.env` 文件

### 功能检查
- [ ] 前端可以正常访问
- [ ] 后端 API 可以正常调用
- [ ] 大模型接口可以正常生成行程
- [ ] 语音识别功能正常（如配置）
- [ ] 地图功能正常（如配置）
- [ ] Firebase 登录正常（如配置）

## 📦 提交文件清单

最终提交的 PDF 文件应包含：

1. **封面**
   - 项目名称：AI 旅行规划师
   - 学生姓名/学号
   - 提交日期

2. **GitHub 仓库信息**
   - 仓库地址：`https://github.com/你的用户名/ai-travel-planner`
   - 提交记录截图或说明

3. **Docker 镜像信息**
   - 镜像地址：`registry.cn-hangzhou.aliyuncs.com/你的命名空间/ai-travel-planner:latest`
   - 拉取命令

4. **README 文档**
   - 完整的 README.md 内容

5. **API Keys（如适用）**
   - 如果使用的不是阿里云百炼平台的 key，需提供测试用的 keys
   - 确保 3 个月内有效

6. **运行说明**
   - 快速开始步骤
   - Docker 运行步骤

## 🚀 快速提交步骤

1. **准备代码**
   ```bash
   # 确保所有更改已提交
   git add .
   git commit -m "准备提交：完善文档和 Docker 配置"
   ```

2. **推送到 GitHub**
   ```bash
   git remote add origin https://github.com/你的用户名/ai-travel-planner.git
   git push -u origin main
   ```

3. **配置 GitHub Actions**
   - 在 GitHub 仓库 Settings → Secrets 中添加阿里云凭证

4. **构建 Docker 镜像**
   ```bash
   # 方式1：通过 GitHub Actions（推荐）
   git tag v1.0.0
   git push origin v1.0.0
   
   # 方式2：本地构建后推送
   docker build -t registry.cn-hangzhou.aliyuncs.com/命名空间/ai-travel-planner:latest .
   docker push registry.cn-hangzhou.aliyuncs.com/命名空间/ai-travel-planner:latest
   ```

5. **生成 PDF**
   - 将 README.md 导出为 PDF
   - 或使用 Markdown to PDF 工具
   - 包含上述所有必需信息

