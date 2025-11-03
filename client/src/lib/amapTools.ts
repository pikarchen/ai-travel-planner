import { loadAMap } from './amapLoader'

export type LngLat = { lng: number; lat: number }

export async function geocode(place: string, city?: string): Promise<LngLat | null> {
  const AMap: any = await loadAMap()
  return new Promise((resolve) => {
    AMap.plugin('AMap.Geocoder', () => {
      const geocoder = new AMap.Geocoder({ city: city || undefined })
      geocoder.getLocation(place, (status: string, result: any) => {
        if (status === 'complete' && result.geocodes && result.geocodes.length > 0) {
          const loc = result.geocodes[0].location
          resolve({ lng: loc.lng, lat: loc.lat })
        } else {
          resolve(null)
        }
      })
    })
  })
}

export async function searchPlace(place: string, city?: string): Promise<LngLat | null> {
  const AMap: any = await loadAMap()
  return new Promise((resolve) => {
    AMap.plugin('AMap.PlaceSearch', () => {
      const ps = new AMap.PlaceSearch({ city: city || undefined, pageSize: 1 })
      ps.search(place, (status: string, result: any) => {
        if (status === 'complete' && result.poiList && result.poiList.pois && result.poiList.pois.length > 0) {
          const loc = result.poiList.pois[0].location
          resolve({ lng: loc.lng, lat: loc.lat })
        } else {
          resolve(null)
        }
      })
    })
  })
}

// 简单内存缓存，避免重复请求触发 QPS 限制
const cache = new Map<string, Promise<LngLat | null>>()

export function geocodeSmart(place: string, city?: string): Promise<LngLat | null> {
  const key = `${city || ''}::${place}`
  const hit = cache.get(key)
  if (hit) return hit
  const p = (async () => {
    const byGeo = await geocode(place, city)
    if (byGeo) return byGeo
    return await searchPlace(place, city)
  })()
  cache.set(key, p)
  return p
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return await Promise.race<T>([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)) as any,
  ])
}

export async function geocodeSmartWithTimeout(place: string, city?: string, timeoutMs = 3500) {
  try {
    return await withTimeout(geocodeSmart(place, city), timeoutMs)
  } catch {
    return null
  }
}



