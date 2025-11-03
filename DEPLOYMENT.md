# 部署指南

## Docker 镜像地址

**阿里云镜像仓库地址**（请替换为你的实际地址）：
```
registry.cn-hangzhou.aliyuncs.com/你的命名空间/ai-travel-planner:latest
```

## 快速运行

### 1. 拉取镜像

```bash
docker pull registry.cn-hangzhou.aliyuncs.com/你的命名空间/ai-travel-planner:latest
```

### 2. 准备环境变量文件

创建 `server.env` 文件：

```bash
PORT=8787
DEEPSEEK_API_KEY=sk-893615dceced4e4889c5bcd51b5e3bd4
DEEPSEEK_MODEL=deepseek-chat
XF_APPID=208f7732
XF_API_KEY=ff2b3d7b534a2a0ba935257d5da2ba84
XF_API_SECRET=YzU0M2JiM2JkMjhiYTk3ZmQxNjRiZjNh
```

### 3. 运行容器

```bash
docker run -d \
  --name ai-travel-planner \
  -p 8787:8787 \
  --env-file ./server.env \
  registry.cn-hangzhou.aliyuncs.com/你的命名空间/ai-travel-planner:latest
```

### 4. 访问应用

前端已打包在镜像中，通过反向代理或直接访问：
- 后端 API: http://localhost:8787
- 如需独立前端，需要额外部署前端静态文件

## 使用 Docker Compose

```bash
# 启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

## 生产环境部署建议

1. **使用 Nginx 反向代理**：前端静态文件 + 后端 API
2. **配置 HTTPS**：使用 Let's Encrypt 或云服务商证书
3. **使用环境变量管理密钥**：不要将密钥写入配置文件
4. **配置日志收集**：使用 Docker 日志驱动或日志服务
5. **配置监控和告警**：监控容器健康状态


