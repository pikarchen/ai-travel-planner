import { useEffect, useRef } from 'react'
import { loadAMap } from '../lib/amapLoader'
import { geocode, geocodeSmartWithTimeout } from '../lib/amapTools'
import { Itinerary } from '../types/itinerary'

export default function ItineraryMap({ data }: { data: Itinerary }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let map: any
    let cancelled = false
    ;(async () => {
      try {
        console.log('[Map] effect start', { dest: data.destination, days: data.plan?.length })
        const AMap = await loadAMap()
        if (cancelled || !ref.current) return

        // 先清空容器，避免旧地图残留
        if (ref.current) {
          ref.current.innerHTML = ''
        }

        map = new (AMap as any).Map(ref.current, { zoom: 11, viewMode: '2D', mapStyle: 'amap://styles/normal' })
        console.log('[Map] map created')

        geocode(data.destination).then((c) => {
          if (!cancelled && c) {
            console.log('[Map] center resolved', c)
            map.setCenter([c.lng, c.lat])
            try {
              const m = new (AMap as any).Marker({ position: [c.lng, c.lat], title: data.destination })
              map.add(m)
            } catch {}
          }
        }).catch((e) => console.warn('[Map] center geocode failed', e))

        const markers: any[] = []
        let firstPosition: [number, number] | null = null
        const city = data.plan?.[0]?.city || data.destination
        const infoWin = new (AMap as any).InfoWindow({ offset: new (AMap as any).Pixel(0, -28) })

        const flatItems = data.plan.flatMap((d) => d.items.map((it) => ({ ...it, _city: d.city || city })))
        const MAX_ITEMS = 10
        const items = flatItems.slice(0, MAX_ITEMS)
        console.log('[Map] items to geocode', items.length)

        async function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)) }

        for (let i = 0; i < items.length; i++) {
          const it = items[i]
          const title = it.title as string
          try {
            let pos: [number, number] | null = null
            if (it.geo) {
              pos = [it.geo.lng, it.geo.lat]
            } else {
              const loc = await geocodeSmartWithTimeout(title, it._city, 3500)
              if (loc) pos = [loc.lng, loc.lat]
            }
            if (pos) {
              const marker = new (AMap as any).Marker({ position: pos, title })
              marker.on('click', () => {
                infoWin.setContent(`<div style=\"min-width:160px\"><b>${title}</b>${it.address ? `<div>${it.address}</div>` : ''}</div>`)
                infoWin.open(map, marker.getPosition())
              })
              markers.push(marker)
              console.log('[Map] point ok', i + 1, '/', items.length, title)
              if (!firstPosition) firstPosition = pos
              if (firstPosition && markers.length === 1) map.setCenter(firstPosition)
            } else {
              console.warn('[Map] geocode empty', i + 1, '/', items.length, title)
            }
          } catch (e) {
            console.warn('[Map] geocode failed for', i + 1, '/', items.length, title, e)
          }
          await sleep(500)
        }

        if (!cancelled) {
          if (markers.length) {
            map.add(markers)
            map.setFitView(markers)
            console.log(`[Map] markers added: ${markers.length}/${items.length}`)
          } else {
            console.warn('[Map] no markers resolved')
          }
        }
      } catch (e) {
        console.error('[Map] unhandled error', e)
      }
    })()

    return () => {
      cancelled = true
      // 清理地图上的所有标注，避免下次渲染时残留
      if (map) {
        try {
          map.clearMap()
        } catch {}
      }
      map = null
    }
  }, [JSON.stringify(data)])

  return <div ref={ref} className="w-full h-80 rounded border bg-white" />
}



