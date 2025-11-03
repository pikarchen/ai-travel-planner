import { useEffect, useMemo, useState } from 'react'
import { listExpensesByTrip } from '../lib/firestore'
import { useAuth } from './AuthProvider'

type Props = { tripId: string }

export default function ExpenseCharts({ tripId }: Props) {
  const { user } = useAuth()
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    listExpensesByTrip(user.uid, tripId).then(setItems)
  }, [user, tripId])

  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const e of items) {
      const k = e.category || '其他'
      map.set(k, (map.get(k) || 0) + (Number(e.amount) || 0))
    }
    const total = Array.from(map.values()).reduce((a, b) => a + b, 0)
    return { map, total }
  }, [items])

  return (
    <div className="mt-3 border-t pt-3">
      <div className="font-medium mb-2">费用统计</div>
      <div className="text-sm text-gray-700">合计：¥{byCategory.total.toFixed(2)}</div>
      <ul className="mt-2 space-y-1 text-sm">
        {Array.from(byCategory.map.entries()).map(([k, v]) => (
          <li key={k} className="flex items-center gap-2">
            <span className="w-24 text-gray-600">{k}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded">
              <div className="h-2 bg-blue-500 rounded" style={{ width: `${byCategory.total ? (v / byCategory.total) * 100 : 0}%` }} />
            </div>
            <span className="w-24 text-right">¥{v.toFixed(0)}</span>
          </li>
        ))}
        {byCategory.map.size === 0 && <li className="text-gray-500">暂无数据</li>}
      </ul>
    </div>
  )
}












