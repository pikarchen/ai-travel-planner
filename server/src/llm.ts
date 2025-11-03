type Provider = 'openai' | 'deepseek' | 'zhipu' | 'none'

function detectProvider(): Provider {
  if (process.env.OPENAI_API_KEY) return 'openai'
  if (process.env.DEEPSEEK_API_KEY) return 'deepseek'
  if (process.env.ZHIPU_API_KEY) return 'zhipu'
  return 'none'
}

export async function generateItineraryJSON(userPrompt: string) {
  const provider = detectProvider()
  if (provider === 'none') return null

  const system = `你是旅行规划助手。根据用户需求，输出结构化 JSON（不要多余文本）。
字段：{
  "destination": string,
  "days": number,
  "budgetEstimate": number,
  "currency": "CNY",
  "preferences": string[],
  "plan": [{ "date"?: string, "city"?: string, "items": [{
    "time"?: string,
    "type": "sight" | "food" | "hotel" | "transfer" | "other",
    "title": string,
    "address"?: string,
    "notes"?: string,
    "costEstimate"?: number
  }]}]
}`

  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: userPrompt },
  ]

  let url = ''
  let headers: Record<string, string> = { 'Content-Type': 'application/json' }
  let body: any

  if (provider === 'openai') {
    url = 'https://api.openai.com/v1/chat/completions'
    headers['Authorization'] = `Bearer ${process.env.OPENAI_API_KEY}`
    body = {
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      temperature: 0.4,
      response_format: { type: 'json_object' },
    }
  } else if (provider === 'deepseek') {
    url = 'https://api.deepseek.com/chat/completions'
    headers['Authorization'] = `Bearer ${process.env.DEEPSEEK_API_KEY}`
    body = { model: process.env.DEEPSEEK_MODEL || 'deepseek-chat', messages, temperature: 0.4 }
  } else if (provider === 'zhipu') {
    url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
    headers['Authorization'] = `Bearer ${process.env.ZHIPU_API_KEY}`
    body = { model: process.env.ZHIPU_MODEL || 'glm-4-air', messages, temperature: 0.4 }
  }

  const resp = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
  if (!resp.ok) throw new Error(`LLM HTTP ${resp.status}`)
  const data: any = await resp.json()

  // 各家接口返回字段不同，统一提取文本
  const content = data?.choices?.[0]?.message?.content || data?.data || data?.output_text || ''
  if (!content || typeof content !== 'string') throw new Error('LLM 无内容返回')

  // 尝试解析 JSON
  try {
    const json = JSON.parse(content)
    return json
  } catch {
    // 优先解析 ```json 代码块
    const fenced = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    if (fenced && fenced[1]) {
      const cleaned = fenced[1]
      try { return JSON.parse(cleaned) } catch {}
    }
    // 退而求其次：提取最大花括号包裹内容
    const m = content.match(/\{[\s\S]*\}/)
    if (m) {
      let text = m[0]
      // 去掉常见的尾随逗号
      text = text.replace(/,\s*([}\]])/g, '$1')
      // 为未加引号的键补全引号
      text = text.replace(/([,{\s])([A-Za-z_][\w]*)\s*:/g, '$1"$2":')
      // 将单引号字符串转换为双引号（粗略处理）
      text = text.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"')
      // 统一双引号中的换行与引号转义
      text = text.replace(/"([^"\\]*)(\r?\n)+([^"\\]*)"/g, (s) => s.replace(/\r?\n/g, ' '))
      return JSON.parse(text)
    }
    throw new Error('LLM 返回非 JSON，解析失败')
  }
}


