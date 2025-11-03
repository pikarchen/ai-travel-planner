// 动态加载高德地图 JS SDK
export async function loadAMap(): Promise<typeof window.AMap> {
  if ((window as any).AMap) {
    return (window as any).AMap
  }
  const key = import.meta.env.VITE_AMAP_JS_KEY
  if (!key) throw new Error('缺少 VITE_AMAP_JS_KEY')
  const sec = (import.meta as any).env.VITE_AMAP_SECURITY_CODE as string | undefined
  if (sec) {
    ;(window as any)._AMapSecurityConfig = { securityJsCode: sec }
  }
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${key}`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('AMap SDK 加载失败'))
    document.head.appendChild(script)
  })
  return (window as any).AMap
}



