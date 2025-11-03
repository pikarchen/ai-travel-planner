import { chooseFromPool } from '../lib/images'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <section className="card overflow-hidden">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop"
            alt="旅行风景"
            loading="lazy"
            className="h-56 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">你的 AI 旅行搭子</h1>
            <p className="text-white/90 max-w-2xl">用一句话描述你的目的地、天数与偏好，AI 即刻生成个性化行程、预算与地图打点。</p>
            <div className="mt-4 flex gap-3">
              <a href="/plan" className="btn-primary">开始规划</a>
              <a href="/trips" className="btn-outline text-white border-white/70 hover:bg-white/10">查看我的行程</a>
            </div>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          '/images/fallback1.jpg',
          '/images/fallback2.jpg',
          '/images/fallback3.jpg',
          '/images/fallback4.jpg',
          '/images/fallback5.jpg',
          '/images/fallback6.jpg',
        ].map((src, i) => (
          <figure key={i} className="overflow-hidden rounded-lg border border-gray-100">
            <img
              src={src}
              loading="lazy"
              alt="目的地"
              className="aspect-video w-full object-cover transition-transform hover:scale-105"
              onError={(e)=>{(e.currentTarget as HTMLImageElement).src=chooseFromPool('gallery-'+i,1200,675)}}
            />
          </figure>
        ))}
      </section>
    </div>
  )
}


