"use client"
import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useRouter } from 'next/navigation'

const iconSafe = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

const iconDanger = L.icon({
  ...iconSafe.options,
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
})

export default function HospitalMapClient({ hospitals }: { hospitals: any[] }) {
  const router = useRouter()

  const centerPosition: [number, number] = [23.8103, 90.4125]

  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-slate-800 z-0">
      <MapContainer center={centerPosition} zoom={7} scrollWheelZoom={false} className="w-full h-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hospitals.filter(h => h.location?.lat && h.location?.lng).map(h => {
          const isFull = h.availableBeds === 0 && h.availableIcuBeds === 0;
          return (
            <Marker key={h.id} position={[h.location.lat, h.location.lng]} icon={isFull ? iconDanger : iconSafe}>
              <Popup className="rounded-2xl">
                <div className="text-center w-full min-w-[200px]">
                  <h3 className="font-bold text-lg mb-1">{h.name}</h3>
                  <div className="flex gap-2 justify-center mb-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">{h.availableBeds} Gen</span>
                    <span className="bg-rose-100 text-rose-800 px-2 py-1 rounded text-xs font-bold">{h.availableIcuBeds} ICU</span>
                  </div>
                  <button onClick={() => router.push(`/hospital/${h.id}`)} className="text-white bg-indigo-600 hover:bg-indigo-700 w-full py-1.5 rounded-lg font-bold text-xs transition">
                    View facility
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
