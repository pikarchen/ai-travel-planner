# AI 旅行规划师 (AI Travel Planner)

基于 AI 的智能旅行规划 Web 应用，支持语音输入、AI 生成行程、地图可视化、费用管理等功能。

## 🚀 项目地址

GitHub Repository: `https://github.com/你的用户名/ai-travel-planner`  
（请替换为你的实际 GitHub 仓库地址）

## ✨ 核心功能

1. **智能行程规划**：用户通过语音或文字输入旅行需求（目的地、日期、预算、偏好等），AI 自动生成个性化旅行路线
2. **费用预算与管理**：AI 进行预算分析，支持语音记账和费用统计
3. **地图可视化**：集成高德地图，自动标注行程地点，可视化路线
4. **用户管理与云端同步**：Firebase 认证和 Firestore 存储，多设备同步

## 🛠️ 技术栈

- **前端**：React 18 + TypeScript + Vite + Tailwind CSS
- **后端**：Node.js + Express + TypeScript
- **数据库/认证**：Firebase Authentication + Firestore
- **地图服务**：高德地图 Web JS API
- **语音识别**：科大讯飞 IAT WebSocket API
- **AI 大模型**：DeepSeek API（支持 OpenAI、智谱 AI 等）
- **部署**：Docker + 阿里云容器镜像服务

## 📦 快速开始

### 方式一：本地开发

1. **克隆仓库**
```bash
git clone https://github.com/你的用户名/ai-travel-planner.git
cd ai-travel-planner
```

2. **安装依赖**
```bash
npm install
npm install -w client
npm install -w server
```

3. **配置环境变量**
   - 复制 `client/.env.example` 到 `client/.env`，填入你的配置
   - 复制 `server/.env.example` 到 `server/.env`，填入你的 API keys

4. **启动开发服务器**
   - 终端1：`npm run dev:server` （后端：http://localhost:8787）
   - 终端2：`npm run dev` （前端：http://localhost:5173）

### 方式二：Docker 运行

#### 使用预构建镜像（推荐）

```bash
# 拉取镜像（请替换为你的阿里云镜像地址）
docker pull registry.cn-hangzhou.aliyuncs.com/你的命名空间/ai-travel-planner:latest

# 运行容器
docker run -d \
  -p 8787:8787 \
  --name ai-travel-planner \
  --env-file ./server/.env \
  registry.cn-hangzhou.aliyuncs.com/你的命名空间/ai-travel-planner:latest
```

#### 本地构建 Docker 镜像

```bash
# 构建镜像
docker build -t ai-travel-planner:latest .

# 运行容器
docker run -d \
  -p 8787:8787 \
  --name ai-travel-planner \
  --env-file ./server/.env \
  ai-travel-planner:latest
```

### 方式三：Docker Compose（推荐用于本地测试）

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 🔑 API Key 配置

### 必需的 API Keys

#### 1. 大语言模型 API（至少配置一个）

**推荐使用 DeepSeek（性价比高，国内可用）：**
```
DEEPSEEK_API_KEY=sk-893615dceced4e4889c5bcd51b5e3bd4
DEEPSEEK_MODEL=deepseek-chat
```

**或其他选项：**
- OpenAI: `OPENAI_API_KEY` 和 `OPENAI_MODEL=gpt-4o-mini`
- 智谱 AI: `ZHIPU_API_KEY` 和 `ZHIPU_MODEL=glm-4-air`

#### 2. 科大讯飞语音识别（可选）

```
XF_APPID=208f7732
XF_API_KEY=ff2b3d7b534a2a0ba935257d5da2ba84
XF_API_SECRET=YzU0M2JiM2JkMjhiYTk3ZmQxNjRiZjNh
```

**注意**：以上 API Keys 均为测试用，有效期 3 个月（至 2025 年 2 月），仅供助教批改作业使用。生产环境请自行申请。

#### 3. Firebase 配置（可选，用于登录和数据存储）

在 `client/.env` 中配置：
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### 4. 高德地图（可选）

在 `client/.env` 中配置：
```
VITE_AMAP_JS_KEY=your_amap_key
VITE_AMAP_SECURITY_CODE=your_amap_security_code
```

## 📝 环境变量说明

### 后端环境变量 (`server/.env`)

| 变量名 | 说明 | 是否必需 |
|--------|------|---------|
| `PORT` | 服务器端口，默认 8787 | 否 |
| `DEEPSEEK_API_KEY` | DeepSeek API Key | 是（推荐） |
| `OPENAI_API_KEY` | OpenAI API Key | 否 |
| `ZHIPU_API_KEY` | 智谱 AI API Key | 否 |
| `XF_APPID` | 讯飞 APPID | 否 |
| `XF_API_KEY` | 讯飞 API Key | 否 |
| `XF_API_SECRET` | 讯飞 API Secret | 否 |

### 前端环境变量 (`client/.env`)

| 变量名 | 说明 | 是否必需 |
|--------|------|---------|
| `VITE_FIREBASE_*` | Firebase 配置（6个字段） | 否 |
| `VITE_AMAP_JS_KEY` | 高德地图 JS Key | 否 |
| `VITE_AMAP_SECURITY_CODE` | 高德地图安全密钥 | 否 |

## 🏗️ 项目结构

```
ai-travel-planner/
├── client/                 # 前端应用
│   ├── src/
│   │   ├── components/     # React 组件
│   │   ├── pages/         # 页面
│   │   ├── lib/           # 工具库（Firebase、地图等）
│   │   └── types/         # TypeScript 类型定义
│   ├── public/            # 静态资源
│   └── package.json
├── server/                # 后端服务
│   ├── src/
│   │   ├── index.ts       # Express 服务器入口
│   │   ├── llm.ts         # 大模型调用
│   │   └── ...
│   └── package.json
├── .github/workflows/     # GitHub Actions 配置
├── Dockerfile             # Docker 构建文件
├── docker-compose.yml     # Docker Compose 配置
└── README.md
```

## 🚢 部署说明

### GitHub Actions 自动构建

项目配置了 GitHub Actions 工作流，当推送标签（如 `v1.0.0`）时会自动构建并推送 Docker 镜像到阿里云容器镜像服务。

#### 配置 GitHub Secrets

在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加：

- `ALIYUN_REGISTRY_USERNAME`: 阿里云容器镜像服务用户名
- `ALIYUN_REGISTRY_PASSWORD`: 阿里云容器镜像服务密码
- `ALIYUN_REGISTRY_NAMESPACE`: 镜像仓库命名空间

#### 触发构建

```bash
git tag v1.0.0
git push origin v1.0.0
```

构建完成后，镜像地址：
```
registry.cn-hangzhou.aliyuncs.com/你的命名空间/ai-travel-planner:latest
```

## 📱 使用说明

1. **生成行程**：
   - 在"行程规划"页面输入或语音输入需求（如："我想去日本，5天，预算1万元，喜欢美食和动漫，带孩子"）
   - 点击"生成行程"，AI 会生成结构化行程

2. **查看地图**：
   - 生成行程后，地图会自动标注各个地点
   - 点击标注可查看详情

3. **保存和管理**：
   - 登录后可以保存行程到"我的行程"
   - 可以为每个行程记录费用
   - 可以删除不需要的行程

4. **费用管理**：
   - 在"我的行程"中为每个行程记录费用
   - 支持分类统计和可视化图表

## ⚠️ 注意事项

1. **API Key 安全**：
   - ⚠️ **严禁将 API Key 提交到公开代码仓库**
   - 使用 `.env` 文件存储，并确保 `.gitignore` 已正确配置
   - 生产环境使用环境变量或密钥管理服务

2. **Firebase 安全规则**：
   - 生产环境需要配置严格的 Firestore 安全规则
   - 开发时可以使用测试模式，但务必在生产前修改

3. **高德地图配额**：
   - 免费版有 QPS 限制，如遇限流请控制请求频率或升级服务

4. **Docker 镜像大小**：
   - 当前镜像约 200-300MB，如需优化可考虑多阶段构建优化

## 🔍 故障排查

### 前端无法连接后端
- 检查后端是否运行在 `http://localhost:8787`
- 检查 `client/vite.config.ts` 中的代理配置

### API 调用失败
- 检查 `server/.env` 中的 API keys 是否正确
- 查看后端日志确认错误信息
- 检查 API 配额是否用完

### 地图不显示
- 检查 `client/.env` 中的高德地图配置
- 确认高德控制台的 Referer 白名单包含 `http://localhost:5173`

## 📄 许可证

本项目为课程作业项目，仅供学习交流使用。

## 👥 贡献

欢迎提交 Issue 和 Pull Request。

---

**最后更新**：2025年1月
