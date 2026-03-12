"use client";
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

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
  damp_wall: createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'),
  unclassified: createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png')
};

type MarkerData = {
  complaint_id: string;
  latitude: number;
  longitude: number;
  complaint_type: string;
  severity: number;
};

export default function MapView() {
  const [isMounted, setIsMounted] = useState(false);
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const fetchMarkers = async () => {
      try {
        const res = await axios.get('/api/complaints?ward_id=ward78');
        setMarkers(res.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMarkers();
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
        {markers.map((marker) => {
          const iconType = icons[marker.complaint_type as keyof typeof icons] || icons.unclassified;
          return (
            <Marker
              key={marker.complaint_id}
              position={[marker.latitude, marker.longitude]}
              icon={iconType}
            >
              <Popup className="text-slate-900">
                <div className="font-bold capitalize">{marker.complaint_type}</div>
                <div>Severity: {marker.severity}</div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
