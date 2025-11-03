import { useState } from 'react'
import XfVoiceInput from '../components/XfVoiceInput'
import { useAuth } from '../components/AuthProvider'
import { saveTrip } from '../lib/firestore'
import ItineraryView from '../components/ItineraryView'
import { Itinerary } from '../types/itinerary'

export default function Plan() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()

  async function handleGenerate() {
    setLoading(true)
    setItinerary(null)
    setResult('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const data = (await res.json()) as Itinerary
        setItinerary(data)
        setResult(JSON.stringify(data, null, 2))
      } else {
        const text = await res.text()
        setResult(text)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!user || !result) return
    setSaving(true)
    try {
      const id = await saveTrip({ uid: user.uid, prompt, result })
      alert(`已保存，ID: ${id}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="card p-5 space-y-3">
        <h2 className="section-title">智能行程规划</h2>
        <textarea
          className="w-full border rounded p-3 h-32"
          placeholder="例如：我想去日本，5天，预算1万元，喜欢美食和动漫，带孩子"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex gap-3 items-center">
          <button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="btn-primary disabled:opacity-50">
            {loading ? '生成中...' : '生成行程'}
          </button>
          <XfVoiceInput onResult={(t) => setPrompt(t)} />
          {user && result && (
            <button onClick={handleSave} disabled={saving} className="btn-outline">
              {saving ? '保存中...' : '保存行程'}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">正在生成，请稍候…</div>
      ) : itinerary ? (
        <div className="card p-5">
          <ItineraryView data={itinerary} />
        </div>
      ) : result ? (
        <pre className="card p-5 whitespace-pre-wrap">{result}</pre>
      ) : null}
    </div>
  )
}


