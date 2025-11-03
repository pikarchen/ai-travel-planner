import { Itinerary } from '../types/itinerary'
import ItineraryMap from './ItineraryMap'
import { getDestinationImageUrl, getItemThumbnailUrl, handleImageError } from '../lib/images'

export default function ItineraryView({ data }: { data: Itinerary }) {
  const showMap = Boolean(import.meta.env.VITE_AMAP_JS_KEY)
  const destinationImageUrl = getDestinationImageUrl(data.destination)

  return (
    <div className="space-y-4">
      {destinationImageUrl && (
        <div className="relative w-full h-56 md:h-64 rounded-lg overflow-hidden shadow-md">
          <img
            src={destinationImageUrl}
            alt={data.destination}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => handleImageError(e, `https://picsum.photos/1200/600?random=${Math.random()}`)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <h3 className="text-white text-2xl font-bold">{data.destination}</h3>
          </div>
        </div>
      )}
      <div className="p-3 rounded border bg-white">
        <div className="font-semibold">目的地：{data.destination}</div>
        <div className="text-sm text-gray-600">天数：{data.days}，预算约：{data.budgetEstimate ?? '-'} {data.currency ?? ''}</div>
      </div>
      {showMap && (
        <ItineraryMap data={data} />
      )}
      <div className="space-y-3">
        {data.plan.map((d, idx) => (
          <div key={idx} className="border rounded p-3 bg-white">
            <div className="font-medium mb-2">第 {idx + 1} 天 {d.city ? `· ${d.city}` : ''} {d.date ? `（${d.date}）` : ''}</div>
            <ul className="mt-1 space-y-2">
              {d.items.map((it, i) => {
                return (
                  <li key={i} className="text-sm flex gap-3 items-center">
                    {it.title && (
                      <img
                        src={getItemThumbnailUrl(it.title)}
                        alt={it.title}
                        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                        loading="lazy"
                        onError={(e) => handleImageError(e, `https://picsum.photos/100/100?random=${Math.random()}`)}
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-gray-500">[{it.type}]</span>
                        <span className="font-medium">{it.title}</span>
                        {it.address && <span className="text-gray-500">· {it.address}</span>}
                        {it.time && <span className="text-gray-500">· {it.time}</span>}
                        {typeof it.costEstimate === 'number' && <span className="text-gray-500">· 约 ¥{it.costEstimate}</span>}
                      </div>
                      {it.notes && <div className="text-gray-400">{it.notes}</div>}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}


