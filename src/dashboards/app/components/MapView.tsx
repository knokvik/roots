"use client";
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Next.js
const createIcon = (colorUrl: string) => {
  return new L.Icon({
    iconUrl: colorUrl,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const icons = {
  waterlogging: createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'),
  pothole: createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png'),
  garbage: createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png'),
};

const dummyMarkers = [
  { id: 1, lat: 28.6562, lng: 77.2140, type: 'waterlogging', severity: 0.9 },
  { id: 2, lat: 28.6575, lng: 77.2120, type: 'pothole', severity: 0.7 },
  { id: 3, lat: 28.6580, lng: 77.2160, type: 'garbage', severity: 0.8 },
];

export default function MapView() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[400px] bg-slate-900 rounded-lg animate-pulse flex items-center justify-center text-slate-500">Loading map...</div>;

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-slate-800 relative z-0">
      <MapContainer
        center={[28.6562, 77.2140]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {dummyMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={icons[marker.type as keyof typeof icons]}
          >
            <Popup className="text-slate-900">
              <div className="font-bold capitalize">{marker.type}</div>
              <div>Severity: {marker.severity}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
