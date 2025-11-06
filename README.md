# AI 旅行规划师 (AI Travel Planner)

基于 AI 的智能旅行规划 Web 应用，支持语音输入、AI 生成行程、地图可视化、费用管理等功能。

## 🚀 项目地址

GitHub Repository: `https://github.com/pikarchen/ai-travel-planner`

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

> 💡 **助教快速体验**：推荐使用"方式二：Docker 运行"中的"方式 2.1"，下载预构建镜像文件后直接运行，最快 2 分钟即可体验完整功能。

### 方式一：本地开发

1. **克隆仓库**
```bash
git clone https://github.com/pikarchen/ai-travel-planner.git
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

### 方式二：Docker 运行（推荐）

#### 方式 2.1：使用预构建镜像文件（⭐推荐，最简单）

**适用于**：想要快速体验项目，不想从源码构建。

**注意**：如果 GitHub Releases 中没有镜像文件，请使用方式 2.2 从源码构建。

1. **下载 Docker 镜像文件**
   - 访问 GitHub Releases：https://github.com/pikarchen/ai-travel-planner/releases
   - 找到最新的 Release（如 v1.0.0）
   - 下载 `ai-travel-planner-latest.tar` 文件（约 140MB）

2. **加载镜像**
   ```bash
   docker load -i ai-travel-planner-latest.tar
   ```

3. **创建环境变量文件** `server.env`：
   ```env
   PORT=8787
   NODE_ENV=production
   DEEPSEEK_API_KEY=sk-893615dceced4e4889c5bcd51b5e3bd4
   DEEPSEEK_MODEL=deepseek-chat
   XF_APPID=208f7732
   XF_API_KEY=ff2b3d7b534a2a0ba935257d5da2ba84
   XF_API_SECRET=YzU0M2JiM2JkMjhiYTk3ZmQxNjRiZjNh
   ```

4. **运行容器**
   ```bash
   docker run -d \
     -p 8787:8787 \
     --name ai-travel-planner \
     --env-file ./server.env \
     ai-travel-planner:latest
   ```

5. **访问应用**
   - 打开浏览器访问：http://localhost:8787
   - 如果一切正常，应该能看到应用首页

**完整命令示例（一行版本）：**
```bash
# 下载镜像后，在同一目录执行：
docker load -i ai-travel-planner-latest.tar && \
echo "PORT=8787
NODE_ENV=production
DEEPSEEK_API_KEY=sk-893615dceced4e4889c5bcd51b5e3bd4
DEEPSEEK_MODEL=deepseek-chat
XF_APPID=208f7732
XF_API_KEY=ff2b3d7b534a2a0ba935257d5da2ba84
XF_API_SECRET=YzU0M2JiM2JkMjhiYTk3ZmQxNjRiZjNh" > server.env && \
docker run -d -p 8787:8787 --name ai-travel-planner --env-file ./server.env ai-travel-planner:latest
```

#### 方式 2.2：从源码构建 Docker 镜像

```bash
# 1. 构建镜像
docker build -t ai-travel-planner:latest .

# 2. 创建环境变量文件 server.env（内容同上）
# 3. 运行容器
docker run -d \
  -p 8787:8787 \
  --name ai-travel-planner \
  --env-file ./server.env \
  ai-travel-planner:latest
```

#### 方式 2.3：使用 Docker Compose（推荐用于本地测试）

```bash
# 1. 创建 server.env 文件（内容同上）
# 2. 启动所有服务
docker-compose up -d

# 3. 查看日志
docker-compose logs -f

# 4. 停止服务
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

**⚠️ 重要提示**：Firebase 服务（包括 Authentication 和 Firestore）在中国大陆地区可能无法直接访问，需要配置代理/VPN 才能正常使用。如果无法访问 Firebase：
- 登录功能将不可用（会显示配置错误提示）
- 数据存储功能将不可用（无法保存行程和费用）
- 应用的其他功能（AI 生成行程、地图显示等）不受影响，可以正常使用

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

## 🚢 Docker 镜像构建与发布

### 构建 Docker 镜像

```bash
# 在项目根目录执行
docker build -t ai-travel-planner:latest .
```

### 导出镜像文件

```bash
# 导出为 tar 文件
docker save -o ai-travel-planner-latest.tar ai-travel-planner:latest
```

### 发布到 GitHub Releases

1. 访问 GitHub 仓库：https://github.com/pikarchen/ai-travel-planner
2. 点击 "Releases" → "Create a new release"
3. 填写版本号（如 `v1.0.0`）和发布说明
4. 上传 `ai-travel-planner-latest.tar` 文件
5. 点击 "Publish release"

### 使用导出的镜像

下载镜像文件后，使用以下命令加载：

```bash
docker load -i ai-travel-planner-latest.tar
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

2. **网络访问要求**：
   - **Firebase 服务**：在中国大陆地区访问 Firebase（Authentication、Firestore）可能需要代理/VPN。如果无法访问，登录和数据存储功能将不可用，但其他功能（AI 生成、地图显示）不受影响。
   - **高德地图**：国内可直接访问，无需代理。
   - **DeepSeek API**：国内可直接访问，无需代理。
   - **科大讯飞 API**：国内可直接访问，无需代理。

3. **Firebase 安全规则**：
   - 生产环境需要配置严格的 Firestore 安全规则
   - 开发时可以使用测试模式，但务必在生产前修改

4. **高德地图配额**：
   - 免费版有 QPS 限制，如遇限流请控制请求频率或升级服务

5. **Docker 镜像大小**：
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

### Firebase 无法连接（登录/数据存储失败）
- **可能原因**：网络无法访问 Firebase 服务（在中国大陆地区常见）
- **解决方案**：
  1. 配置代理/VPN 后重试
  2. 或者暂时跳过登录功能，直接使用 AI 生成和地图功能（这些功能不依赖 Firebase）
- **判断方法**：打开浏览器控制台，查看是否有 Firebase 相关的网络错误（如 `firebaseapp.com` 连接失败）

## 📄 许可证

本项目为课程作业项目，仅供学习交流使用。

## 👥 贡献

欢迎提交 Issue 和 Pull Request。

---

**最后更新**：2025年11月
