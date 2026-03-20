"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const hospitalIcon = new L.Icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: "hue-rotate-180" // Make it reddish/different
});

interface MapProps {
  hospitals: any[];
  ambulances: any[];
  requests: any[];
}

export default function MapComponent({ hospitals, ambulances, requests }: MapProps) {

  const center: [number, number] = [23.77, 90.40];

  return (
    <MapContainer
      center={center}
      zoom={12}
      className="w-full h-full rounded-2xl z-0"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {}
      {hospitals.map((hosp) => (
        <Marker key={`hosp-${hosp.id}`} position={[hosp.location.lat, hosp.location.lng]} icon={hospitalIcon}>
          <Popup>
            <div className="text-sm">
              <span className="font-bold flex items-center mb-1">{hosp.name}</span>
              General Beds: {hosp.availableBeds} / {hosp.totalBeds}<br />
              ICU Beds: {hosp.availableIcuBeds} / {hosp.icuBeds}
            </div>
          </Popup>
        </Marker>
      ))}

      {}
      {ambulances.map((amb) => {
        if (!amb.current_lat || !amb.current_lng) return null;
        return (
          <Marker key={`amb-${amb.id}`} position={[amb.current_lat, amb.current_lng]}>
            <Popup>
              <div className="text-sm">
                <span className="font-bold flex items-center mb-1 text-blue-600">🚑 {amb.vehicle_number}</span>
                Driver: {amb.driver_name}<br />
                Status: {amb.status.toUpperCase()}
              </div>
            </Popup>
          </Marker>
        );
      })}

      {}
      {requests.filter(r => r.status === 'pending' || r.status === 'dispatched').map((req) => (
        <Circle
          key={`req-${req.id}`}
          center={[req.patient_lat, req.patient_lng]}
          pathOptions={{ color: req.priority === 'critical' || req.priority === 'high' ? 'red' : 'orange', fillColor: req.priority === 'critical' ? 'red' : 'orange' }}
          radius={500}
        >
          <Popup>
            <div className="text-sm">
              <span className="font-bold text-red-600">Request: {req.priority.toUpperCase()}</span><br />
              Status: {req.status}<br />
              ICU Required: {req.required_icu ? 'Yes' : 'No'}
            </div>
          </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
}
