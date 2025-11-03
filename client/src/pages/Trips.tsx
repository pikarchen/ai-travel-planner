import { useEffect, useState } from 'react'
import { useAuth } from '../components/AuthProvider'
import { listTrips, TripDoc, deleteTrip } from '../lib/firestore'
import ExpenseSection from '../components/ExpenseSection'
import ExpenseCharts from '../components/ExpenseCharts'
import ItineraryView from '../components/ItineraryView'
import { Itinerary } from '../types/itinerary'

function tryParseItinerary(text: string): Itinerary | null {
  try {
    const obj = JSON.parse(text)
    if (obj && obj.destination && Array.isArray(obj.plan)) return obj as Itinerary
    return null
  } catch {
    return null
  }
}

export default function Trips() {
  const { user } = useAuth()
  const [items, setItems] = useState<(TripDoc & { id: string })[]>([])
  const [loading, setLoading] = useState(false)
  const [openRawId, setOpenRawId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    listTrips(user.uid).then((res) => setItems(res)).finally(() => setLoading(false))
  }, [user])

  const handleDelete = async (tripId: string) => {
    if (!user) return
    if (!confirm('确定要删除这个行程吗？这将同时删除相关的所有费用记录。')) return
    
    setDeletingId(tripId)
    try {
      await deleteTrip(user.uid, tripId)
      // 从本地状态中移除已删除的行程
      setItems(prev => prev.filter(item => item.id !== tripId))
    } catch (error) {
      console.error('删除行程失败:', error)
      alert('删除失败，请重试')
    } finally {
      setDeletingId(null)
    }
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="section-title mb-2">我的行程</h2>
        <p className="text-gray-600">请先登录。</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <h2 className="section-title">我的行程</h2>
      {loading ? (
        <p className="text-gray-600">加载中...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-600">暂无数据</p>
      ) : (
        <ul className="space-y-3">
          {items.map((t) => {
            const parsed = tryParseItinerary(t.result)
            const isOpen = openRawId === t.id
            return (
              <li key={t.id} className="card p-4">
                <div className="text-xs text-gray-500 mb-2 flex items-center justify-between">
                  <span>{t.createdAt?.toDate?.().toLocaleString?.() || ''}</span>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800" onClick={() => setOpenRawId(isOpen ? null : t.id)}>
                      {isOpen ? '收起原文' : '查看原文'}
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800 disabled:text-gray-400" 
                      onClick={() => handleDelete(t.id)}
                      disabled={deletingId === t.id}
                    >
                      {deletingId === t.id ? '删除中...' : '删除'}
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-700 mb-2 break-words">
                  <span className="font-medium">需求：</span>
                  <span>{t.prompt.length > 80 ? `${t.prompt.slice(0, 80)}…` : t.prompt}</span>
                </div>
                {parsed ? (
                  <ItineraryView data={parsed} />
                ) : (
                  <div className="text-xs text-gray-500">（该记录为文本格式，未能结构化解析）</div>
                )}
                {isOpen && (
                  <pre className="mt-3 whitespace-pre-wrap bg-gray-50 border p-2 rounded text-xs">{t.result}</pre>
                )}
                <ExpenseSection tripId={t.id} />
                <ExpenseCharts tripId={t.id} />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}


