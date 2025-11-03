import { db } from '../lib/firebase'
import { addDoc, collection, getDocs, onSnapshot, orderBy, query, serverTimestamp, where, deleteDoc, doc } from 'firebase/firestore'

export type TripDoc = {
  uid: string
  prompt: string
  result: string
  createdAt?: any
}

export async function saveTrip(params: { uid: string; prompt: string; result: string }) {
  if (!db) throw new Error('Firebase 未配置，无法保存行程')
  const tripsCol = collection(db, 'trips')
  const ref = await addDoc(tripsCol, {
    uid: params.uid,
    prompt: params.prompt,
    result: params.result,
    createdAt: serverTimestamp(),
  } as TripDoc)
  return ref.id
}

export async function listTrips(uid: string) {
  if (!db) throw new Error('Firebase 未配置，无法读取行程')
  const tripsCol = collection(db, 'trips')
  try {
    const q1 = query(tripsCol, where('uid', '==', uid), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q1)
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as TripDoc) }))
  } catch (e) {
    console.warn('[Trips] 使用降级查询（缺少复合索引 createdAt+uid）', e)
    const q2 = query(tripsCol, where('uid', '==', uid))
    const snap = await getDocs(q2)
    const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as TripDoc) }))
    return rows.sort((a: any, b: any) => {
      const ta = a.createdAt?.seconds || 0
      const tb = b.createdAt?.seconds || 0
      return tb - ta
    })
  }
}

export type ExpenseDoc = {
  uid: string
  tripId: string
  amount: number
  category: string
  note?: string
  createdAt?: any
}

export async function addExpense(params: { uid: string; tripId: string; amount: number; category: string; note?: string }) {
  if (!db) throw new Error('Firebase 未配置，无法记账')
  const colRef = collection(db, 'expenses')
  await addDoc(colRef, {
    uid: params.uid,
    tripId: params.tripId,
    amount: params.amount,
    category: params.category,
    note: params.note || '',
    createdAt: serverTimestamp(),
  } as ExpenseDoc)
}

export async function listExpensesByTrip(uid: string, tripId: string) {
  if (!db) throw new Error('Firebase 未配置，无法读取账单')
  const colRef = collection(db, 'expenses')
  try {
    const q1 = query(colRef, where('uid', '==', uid), where('tripId', '==', tripId), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q1)
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as ExpenseDoc) }))
  } catch (e) {
    console.warn('[Expenses] 使用降级查询（缺少复合索引 createdAt+filters）', e)
    const q2 = query(colRef, where('uid', '==', uid), where('tripId', '==', tripId))
    const snap = await getDocs(q2)
    const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as ExpenseDoc) }))
    return rows.sort((a: any, b: any) => {
      const ta = a.createdAt?.seconds || 0
      const tb = b.createdAt?.seconds || 0
      return tb - ta
    })
  }
}

export function subscribeExpensesByTrip(uid: string, tripId: string, onChange: (rows: (ExpenseDoc & { id: string })[]) => void) {
  if (!db) throw new Error('Firebase 未配置，无法订阅账单')
  const colRef = collection(db, 'expenses')
  let unsub: () => void
  try {
    const q1 = query(colRef, where('uid', '==', uid), where('tripId', '==', tripId), orderBy('createdAt', 'desc'))
    unsub = onSnapshot(q1, (snap) => {
      onChange(snap.docs.map((d) => ({ id: d.id, ...(d.data() as ExpenseDoc) })))
    })
  } catch (e) {
    console.warn('[Expenses] 订阅降级（缺少复合索引 createdAt+filters）', e)
    const q2 = query(colRef, where('uid', '==', uid), where('tripId', '==', tripId))
    unsub = onSnapshot(q2, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as ExpenseDoc) }))
      onChange(rows.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)))
    })
  }
  return unsub
}

// 删除行程及其相关费用
export async function deleteTrip(uid: string, tripId: string) {
  if (!db) throw new Error('Firebase 未配置，无法删除行程')
  
  // 先删除该行程的所有费用记录
  const expensesCol = collection(db, 'expenses')
  const expensesQuery = query(expensesCol, where('uid', '==', uid), where('tripId', '==', tripId))
  const expensesSnap = await getDocs(expensesQuery)
  
  // 批量删除费用记录
  const deleteExpensePromises = expensesSnap.docs.map(expenseDoc => 
    deleteDoc(doc(db, 'expenses', expenseDoc.id))
  )
  await Promise.all(deleteExpensePromises)
  
  // 删除行程记录
  await deleteDoc(doc(db, 'trips', tripId))
}


