import { fallbackPool } from './fallbackConfig'

// Build a location image url using Unsplash Source (no API key required)
// Example: https://source.unsplash.com/featured/?tokyo,city,travel
export function placeImageUrl(name: string, width = 1600, height = 900) {
  const q = encodeURIComponent(`${name}, city, travel`)
  return `https://source.unsplash.com/${width}x${height}/?${q}`
}

export function fallbackImageUrl(name: string, width = 1600, height = 900) {
  const seed = encodeURIComponent(name || 'travel')
  return `https://picsum.photos/seed/${seed}/${width}/${height}`
}

export function chooseFromPool(name: string, width: number, height: number) {
  if (fallbackPool && fallbackPool.length > 0) {
    const idx = Math.floor(Math.random() * fallbackPool.length)
    const base = fallbackPool[idx]
    return base
  }
  return fallbackImageUrl(name, width, height)
}

// 获取目的地封面图片
export function getDestinationImageUrl(destination: string, width: number = 1200, height: number = 400): string {
  if (!destination) return `https://picsum.photos/${width}/${height}?random=1`
  // Use Unsplash Source for dynamic, high-quality images
  // Fallback to Picsum if Unsplash fails or for generic images
  return `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(
    destination
  )},travel,city,landscape`
}

// 获取条目缩略图
export function getItemThumbnailUrl(keyword: string, width: number = 100, height: number = 100): string {
  if (!keyword) return `https://picsum.photos/${width}/${height}?random=${Math.random()}`
  // Attempt to get a relevant image from Unsplash, with Picsum as fallback
  return `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(
    keyword
  )},travel,food,landmark,hotel`
}

// Helper to handle image loading errors and provide a fallback
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl: string) {
  const img = event.currentTarget;
  if (img.src !== fallbackUrl) {
    img.src = fallbackUrl;
  }
}


