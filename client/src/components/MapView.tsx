import { useEffect, useRef } from 'react'
import { loadAMap } from '../lib/amapLoader'

type Props = {
  center?: [number, number] // [lng, lat]
  zoom?: number
}

export default function MapView({ center = [116.397428, 39.90923], zoom = 11 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let map: any
    let cancelled = false
    loadAMap().then((AMap) => {
      if (cancelled || !ref.current) return
      map = new AMap.Map(ref.current, {
        viewMode: '3D',
        zoom,
        center,
      })
    })
    return () => {
      cancelled = true
      // AMap JS SDK 无需显式销毁 DOM 容器
      if (map) {
        map = null
      }
    }
  }, [center[0], center[1], zoom])

  return <div ref={ref} className="w-full h-96 rounded border bg-white" />
}











