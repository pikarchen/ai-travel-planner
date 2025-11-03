import { useEffect, useState } from 'react'
import { addExpense, subscribeExpensesByTrip } from '../lib/firestore'
import { useAuth } from './AuthProvider'

export default function ExpenseSection({ tripId }: { tripId: string }) {
  const { user } = useAuth()
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('餐饮')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    const unsub = subscribeExpensesByTrip(user.uid, tripId, (rows) => setItems(rows))
    return () => { try { unsub() } catch {} }
  }, [user, tripId])

  async function handleAdd() {
    if (!user) return
    const n = Number(amount)
    if (!Number.isFinite(n) || n <= 0) return alert('请输入有效金额')
    setLoading(true)
    try {
      await addExpense({ uid: user.uid, tripId, amount: n, category, note })
      setAmount('')
      setNote('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-3 border-t pt-3">
      <div className="flex gap-2 items-center flex-wrap">
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="金额" className="border rounded px-2 py-1 w-24" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded px-2 py-1">
          <option>餐饮</option>
          <option>交通</option>
          <option>门票</option>
          <option>住宿</option>
          <option>购物</option>
          <option>其他</option>
        </select>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="备注" className="border rounded px-2 py-1 flex-1 min-w-[160px]" />
        <button onClick={handleAdd} disabled={loading} className="px-3 py-1 border rounded">
          {loading ? '保存中...' : '记一笔'}
        </button>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((e) => (
          <li key={e.id} className="text-sm text-gray-700 flex items-center justify-between">
            <span>{e.createdAt?.toDate?.().toLocaleString?.() || ''}</span>
            <span className="ml-2">{e.category}</span>
            <span className="ml-2">¥{e.amount}</span>
            <span className="ml-2 text-gray-500">{e.note}</span>
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-gray-500">暂无费用</li>}
      </ul>
    </div>
  )
}








