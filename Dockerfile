# 多阶段构建：先构建前端和后端，再创建运行时镜像
FROM node:18-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 设置生产环境变量（前端构建需要）
ENV NODE_ENV=production

# 构建前端和后端
RUN npm run build

# 运行时镜像
FROM node:18-alpine

WORKDIR /app

# 设置生产环境变量
ENV NODE_ENV=production

# 安装生产依赖
COPY package*.json ./
COPY server/package*.json ./server/
RUN npm ci --only=production -w server

# 复制构建产物
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/package.json ./server/

# 设置工作目录为 server
WORKDIR /app/server

# 暴露端口
EXPOSE 8787

# 启动服务
CMD ["node", "dist/index.js"]



