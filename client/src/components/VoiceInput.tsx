import { useEffect, useRef, useState } from 'react'

type Props = {
  onResult: (text: string) => void
}

export default function VoiceInput({ onResult }: Props) {
  const [supported, setSupported] = useState(false)
  const [recording, setRecording] = useState(false)
  const recognitionRef = useRef<any>(null)
  const latestTextRef = useRef<string>('')
  const wantRef = useRef<boolean>(false)

  useEffect(() => {
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (SR && (window.isSecureContext || location.hostname === 'localhost')) {
      setSupported(true)
      const rec = new SR()
      rec.lang = 'zh-CN' in (Intl as any)?.Locale ? 'zh-CN' : (navigator.language || 'zh-CN')
      rec.interimResults = true
      rec.continuous = true
      rec.maxAlternatives = 1
      rec.onstart = () => { setRecording(true); console.log('[voice] start') }
      rec.onspeechstart = () => console.log('[voice] speech start')
      rec.onresult = (e: any) => {
        let interim = ''
        let finalText = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i]
          if (res?.isFinal) finalText += res[0]?.transcript || ''
          else interim += res[0]?.transcript || ''
        }
        if (finalText) {
          latestTextRef.current = (latestTextRef.current + finalText).trim()
          console.log('[voice] final:', latestTextRef.current)
          onResult(latestTextRef.current)
        } else if (interim) {
          console.log('[voice] interim:', interim)
          onResult((latestTextRef.current + interim).trim())
        } else {
          console.log('[voice] empty result chunk')
        }
      }
      rec.onnomatch = () => console.warn('[voice] no match')
      rec.onerror = (e: any) => {
        setRecording(false)
        const msg = e?.error || 'unknown'
        if (msg === 'not-allowed') alert('未获得麦克风权限，请在浏览器地址栏允许麦克风')
        else if (msg === 'no-speech') console.warn('[voice] no-speech')
        else if (msg === 'audio-capture') alert('未检测到麦克风设备')
        else console.warn('[voice] error:', e)
      }
      rec.onend = () => {
        console.log('[voice] end')
        setRecording(false)
        if (wantRef.current) {
          // Edge 上有时会意外结束；若用户仍在录制，自动重启
          try { rec.start() } catch {}
        }
      }
      recognitionRef.current = rec
    }
  }, [onResult])

  async function ensureMic() {
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true })
      }
    } catch (e) {
      console.warn('[voice] getUserMedia failed', e)
    }
  }

  async function toggle() {
    if (!supported) return
    const rec = recognitionRef.current
    if (!rec) return
    if (recording) {
      wantRef.current = false
      rec.stop()
    } else {
      try {
        await ensureMic()
        latestTextRef.current = ''
        wantRef.current = true
        rec.start()
      } catch (e) {
        console.warn('speech start error:', e)
      }
    }
  }

  if (!supported) {
    return <button className="px-3 py-2 border rounded opacity-60" disabled>浏览器不支持语音识别</button>
  }

  return (
    <button onClick={toggle} className={`px-3 py-2 border rounded ${recording ? 'bg-red-50 border-red-300' : ''}`}>
      {recording ? '停止语音' : '语音输入'}
    </button>
  )
}








