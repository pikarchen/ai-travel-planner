import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const hasEnv = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_APP_ID
)

let app: ReturnType<typeof initializeApp> | undefined
if (hasEnv) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  }
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
}

export const firebaseReady = hasEnv

export const auth = app ? getAuth(app) : null as any
export const db = app ? getFirestore(app) : null as any

export function assertFirebaseReady() {
  if (!firebaseReady || !app) {
    throw new Error('Firebase 未初始化：请填写 client/.env 并重启前端')
  }
}


