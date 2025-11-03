import 'dotenv/config'
import express, { Request, Response } from 'express'
import cors from 'cors'
import { generateItineraryJSON } from './llm.js'
import crypto from 'crypto'
import url from 'url'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// 生产环境提供前端静态文件
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.resolve(__dirname, '../client/dist')
  app.use(express.static(clientDist))
}

app.use(cors())
app.use(express.json())

// API 路由
app.post('/api/generate', async (req: Request, res: Response) => {
  const prompt: string = (req.body?.prompt ?? '').toString()
  try {
    const json = await generateItineraryJSON(prompt)
    if (json) {
      return res.json(json)
    }
  } catch (e: any) {
    console.error('LLM 调用失败：', e?.message || e)
  }
  // 无密钥或调用失败时，返回 mock
  const fallback = {
    destination: '日本东京',
    days: 5,
    budgetEstimate: 10000,
    currency: 'CNY',
    preferences: ['美食', '动漫', '亲子'],
    plan: [
      { city: '东京', items: [
        { type: 'transfer', title: '抵达成田机场', time: '上午' },
        { type: 'sight', title: '浅草寺', address: '台东区', costEstimate: 0 },
        { type: 'food', title: '银座寿司', notes: '预约排队' },
      ]},
    ],
    _debugPromptEcho: prompt,
  }
  res.json(fallback)
})

// 讯飞 IAT Websocket 签名生成，返回可直连的 wss URL（前端不暴露密钥）
app.get('/api/xf/iat-url', (req: Request, res: Response) => {
  const appId = process.env.XF_APPID
  const apiKey = process.env.XF_API_KEY
  const apiSecret = process.env.XF_API_SECRET
  if (!appId || !apiKey || !apiSecret) return res.status(500).json({ error: 'XF keys missing' })

  const host = 'iat-api.xfyun.cn'
  const path = '/v2/iat'
  const date = new Date().toUTCString()
  const signatureOrigin = `host: ${host}\n` + `date: ${date}\n` + `GET ${path} HTTP/1.1`
  const signatureSha = crypto.createHmac('sha256', apiSecret).update(signatureOrigin).digest('base64')
  const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureSha}"`
  const authorization = Buffer.from(authorizationOrigin).toString('base64')
  const query = new url.URLSearchParams({ authorization, date, host })
  const wsUrl = `wss://${host}${path}?${query.toString()}`
  res.json({ url: wsUrl, appId })
})

// 生产环境：所有非 API 路由返回前端应用
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req: Request, res: Response) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'))
    }
  })
}

const port = process.env.PORT ? Number(process.env.PORT) : 8787
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
  if (process.env.NODE_ENV === 'production') {
    console.log('Serving frontend from /client/dist')
  }
})
