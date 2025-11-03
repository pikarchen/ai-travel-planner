import { useRef, useState } from 'react'

type Props = { onResult: (text: string) => void }

// 将 Float32 PCM 转为 16k 采样率的 Int16 原始 PCM，并 base64 编码
function resampleTo16k(float32Data: Float32Array, srcRate: number): Int16Array {
  const targetRate = 16000
  const ratio = srcRate / targetRate
  const newLen = Math.round(float32Data.length / ratio)
  const result = new Int16Array(newLen)
  let pos = 0
  for (let i = 0; i < newLen; i++) {
    const idx = i * ratio
    const idx0 = Math.floor(idx)
    const idx1 = Math.min(idx0 + 1, float32Data.length - 1)
    const frac = idx - idx0
    const sample = float32Data[idx0] * (1 - frac) + float32Data[idx1] * frac
    let s = Math.max(-1, Math.min(1, sample))
    result[pos++] = s < 0 ? s * 0x8000 : s * 0x7fff
  }
  return result
}

function int16ToBase64(int16: Int16Array): string {
  const buf = new Uint8Array(int16.buffer)
  let binary = ''
  for (let i = 0; i < buf.byteLength; i++) binary += String.fromCharCode(buf[i])
  return btoa(binary)
}

export default function XfVoiceInput({ onResult }: Props) {
  const [busy, setBusy] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const frameCountRef = useRef<number>(0)
  const segMapRef = useRef<Map<number, string>>(new Map())

  async function start() {
    if (busy) return
    setBusy(true)
    segMapRef.current = new Map()
    frameCountRef.current = 0
    try {
      const r = await fetch('/api/xf/iat-url')
      const { url, appId } = await r.json()
      console.log('[xf] ws url acquired', { url, appId })
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const ws = new WebSocket(url)
      wsRef.current = ws

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      ctxRef.current = audioCtx
      console.log('[xf] AudioContext', { sampleRate: audioCtx.sampleRate })
      const source = audioCtx.createMediaStreamSource(stream)
      sourceRef.current = source
      const processor = audioCtx.createScriptProcessor(2048, 1, 1)
      processorRef.current = processor

      let firstFrameSent = false
      const MAX_FRAMES = 120

      ws.onopen = () => {
        console.log('[xf] ws open')
        source.connect(processor)
        processor.connect(audioCtx.destination)
        processor.onaudioprocess = (ev) => {
          if (ws.readyState !== WebSocket.OPEN) return
          const input = ev.inputBuffer.getChannelData(0)
          const pcm16 = resampleTo16k(input, audioCtx.sampleRate)
          const audio = int16ToBase64(pcm16)
          const frame: any = {
            data: { status: firstFrameSent ? 1 : 0, format: 'audio/L16;rate=16000', encoding: 'raw', audio },
          }
          if (!firstFrameSent) {
            frame.common = { app_id: appId }
            frame.business = { language: 'zh_cn', domain: 'iat', accent: 'mandarin', dwa: 'wpgs', vad_eos: 5000 }
          }
          frameCountRef.current += 1
          if (frameCountRef.current % 10 === 0 || !firstFrameSent) {
            console.log('[xf] send frame', { idx: frameCountRef.current, first: !firstFrameSent, len: audio.length })
          }
          ws.send(JSON.stringify(frame))
          firstFrameSent = true
          if (frameCountRef.current >= MAX_FRAMES) {
            try { ws.send(JSON.stringify({ data: { status: 2 } })) } catch {}
          }
        }
      }

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data)
          if (msg.code !== 0) {
            console.warn('[xf] msg code!=0', msg)
            return
          }
          const result = msg?.data?.result
          if (result) {
            const sn: number = result.sn
            const pgs: string | undefined = result.pgs
            const rg: [number, number] | undefined = result.rg
            const text: string = (result.ws || []).map((w: any) => (w.cw || []).map((c: any) => c.w).join('')).join('')
            // wpgs 增量：pgs==='rpl' 表示替换 rg 区间
            if (pgs === 'rpl' && Array.isArray(rg)) {
              for (let i = rg[0]; i <= rg[1]; i++) segMapRef.current.delete(i)
            }
            if (typeof sn === 'number') segMapRef.current.set(sn, text)
            // 重建全文
            const ordered = Array.from(segMapRef.current.keys()).sort((a, b) => a - b)
            let full = ''
            for (const k of ordered) full += segMapRef.current.get(k) || ''
            console.log('[xf] assembled', full)
            onResult(full)
          }
          if (msg.data?.status === 2) {
            console.log('[xf] ws end by server')
            stop()
          }
        } catch (err) {
          console.warn('[xf] onmessage parse error', err)
        }
      }

      ws.onerror = (ev: any) => { console.error('[xf] ws error', ev); stop() }
      ws.onclose = (ev: any) => { console.log('[xf] ws close', ev?.code, ev?.reason); stop() }
    } catch (e) {
      console.warn('xf start failed', e)
      stop()
    }
  }

  function stop() {
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ data: { status: 2 } }))
      }
    } catch {}
    try { processorRef.current?.disconnect() } catch {}
    try { sourceRef.current?.disconnect() } catch {}
    try { ctxRef.current?.close() } catch {}
    wsRef.current && wsRef.current.close()
    wsRef.current = null
    ctxRef.current = null
    sourceRef.current = null
    processorRef.current = null
    setBusy(false)
  }

  return (
    <button onClick={busy ? stop : start} className={`px-3 py-2 border rounded ${busy ? 'bg-red-50 border-red-300' : ''}`}>
      {busy ? '停止语音' : '语音输入'}
    </button>
  )
}


