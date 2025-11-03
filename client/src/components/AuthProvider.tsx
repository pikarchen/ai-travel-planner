import { ReactNode, useEffect, useMemo, useState } from 'react'
import { auth, firebaseReady } from '../lib/firebase'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, User } from 'firebase/auth'

type Ctx = {
  user: User | null
  loading: boolean
  signIn: () => Promise<void>
  signOutApp: () => Promise<void>
}

export const AuthContext = (() => {
  return (null as unknown as React.Context<Ctx>)
})()

// 使用一个轻量的内部创建，避免单独文件引入 createContext
import React from 'react'
export const AuthCtx = React.createContext<Ctx>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOutApp: async () => {},
})

export function useAuth() {
  return React.useContext(AuthCtx)
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!firebaseReady || !auth) {
      setLoading(false)
      return
    }
    // 处理重定向登录结果（若发生过 signInWithRedirect）
    getRedirectResult(auth).finally(() => {
      // 即使没有结果，也继续监听会话变化
      const unsub = onAuthStateChanged(auth, (u) => {
        setUser(u)
        setLoading(false)
      })
      return () => unsub()
    })
  }, [])

  const value = useMemo<Ctx>(() => ({
    user,
    loading,
    async signIn() {
      if (!firebaseReady || !auth) {
        alert('未配置 Firebase，无法登录。请先填写 client/.env')
        return
      }
      try {
        const provider = new GoogleAuthProvider()
        await signInWithPopup(auth, provider)
      } catch (e: any) {
        const code = e?.code || ''
        const msg = e?.message || String(e)
        if (code.includes('popup-blocked') || msg.includes('popup blocked')) {
          // 弹窗被拦截，改用重定向方式
          const provider = new GoogleAuthProvider()
          await signInWithRedirect(auth, provider)
          return
        }
        if (msg.includes('popup')) {
          alert('登录弹窗被拦截或关闭，请允许弹窗并重试。')
        } else if (msg.includes('auth/operation-not-allowed')) {
          alert('Google 登录未启用，请在 Firebase 控制台启用 Google 登录方式。')
        } else if (msg.includes('auth/unauthorized-domain') || msg.includes('domain')) {
          alert('授权域名未配置，请在 Firebase 控制台的授权网域添加 localhost。')
        } else {
          alert(`登录失败：${msg}`)
        }
      }
    },
    async signOutApp() {
      if (!firebaseReady || !auth) return
      await signOut(auth)
    },
  }), [user, loading])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}


