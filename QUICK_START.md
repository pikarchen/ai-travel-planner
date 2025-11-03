# 快速开始指南

## 🐳 使用 Docker 运行（推荐）

### 前置条件
- 已安装 Docker 和 Docker Compose
- 已获取 Docker 镜像或可访问阿里云镜像仓库

### 步骤 1：拉取镜像

```bash
docker pull registry.cn-hangzhou.aliyuncs.com/你的命名空间/ai-travel-planner:latest
```

### 步骤 2：准备环境变量

创建 `server.env` 文件：

```env
PORT=8787
NODE_ENV=production

# 大语言模型 API（至少配置一个）
DEEPSEEK_API_KEY=sk-893615dceced4e4889c5bcd51b5e3bd4
DEEPSEEK_MODEL=deepseek-chat

# 讯飞语音识别（可选）
XF_APPID=208f7732
XF_API_KEY=ff2b3d7b534a2a0ba935257d5da2ba84
XF_API_SECRET=YzU0M2JiM2JkMjhiYTk3ZmQxNjRiZjNh
```

**注意**：以上 API Keys 为测试用，有效期至 2025 年 2 月。

### 步骤 3：运行容器

```bash
docker run -d \
  --name ai-travel-planner \
  -p 8787:8787 \
  --env-file ./server.env \
  registry.cn-hangzhou.aliyuncs.com/你的命名空间/ai-travel-planner:latest
```

### 步骤 4：访问应用

打开浏览器访问：http://localhost:8787

## 💻 本地开发运行

### 步骤 1：安装依赖

```bash
npm install
npm install -w client
npm install -w server
```

### 步骤 2：配置环境变量

```bash
# 复制示例文件
cp client/.env.example client/.env
cp server/.env.example server/.env

# 编辑并填入你的配置
# client/.env - Firebase 和地图配置（可选）
# server/.env - API keys（必需）
```

### 步骤 3：启动服务

**终端 1 - 后端：**
```bash
npm run dev:server
```

**终端 2 - 前端：**
```bash
npm run dev
```

### 步骤 4：访问应用

- 前端：http://localhost:5173
- 后端 API：http://localhost:8787

## 🔧 故障排查

### Docker 镜像无法拉取
- 检查网络连接
- 确认镜像地址正确
- 检查阿里云容器镜像服务权限

### API 调用失败
- 检查 `server.env` 中的 API keys 是否正确
- 查看容器日志：`docker logs ai-travel-planner`
- 确认 API keys 未过期

### 前端无法访问
- 确认容器正在运行：`docker ps`
- 检查端口映射：`docker port ai-travel-planner`
- 查看容器日志排查错误

