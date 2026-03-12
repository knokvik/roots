"use client";
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { createClient } from '@/lib/supabase/client';
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

// Colors mapping matching the prompt
const icons = {
  waterlogging: createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'), // #00BFFF approx
  pothole: createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png'),
  garbage: createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png'),
  damp_wall: createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'),
  mosquito: createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png'), // AA00FF approx
  unclassified: createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png')
};

const clusterColors: Record<string, string> = {
  "Subsurface Drainage Failure": "#EF4444", // red
  "Surface Drainage Blockage": "#F97316", // orange
  "Solid Waste Overflow": "#A855F7", // purple
  "default": "#3B82F6" // blue
};

type Complaint = {
  complaint_id: string;
  latitude: number;
  longitude: number;
  complaint_type: string;
  severity: number;
  source_channel: string;
  status: string;
  days_unresolved?: number;
};

type Cluster = {
  cluster_id: string;
  centroid_lat: number;
  centroid_lon: number;
  root_cause: string;
  confidence: number;
  complaint_count?: number;
};

export default function LiveMap({ userRole }: { userRole?: string }) {
  const [isMounted, setIsMounted] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);

    // Initial Fetch
    const fetchData = async () => {
      try {
        const [compRes, clusRes] = await Promise.all([
          axios.get('/api/complaints?ward_id=ward78'),
          axios.get('/api/clusters?ward_id=ward78')
        ]);
        setComplaints(compRes.data || []);

        // Only keep clusters that have coordinates
        const validClusters = (clusRes.data || []).filter(
          (c: any) => c.centroid_lat && c.centroid_lon
        );
        setClusters(validClusters);
      } catch (e) {
        console.error("Error fetching map data", e);
      }
    };
    fetchData();

    // Supabase Realtime Subscription
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const channel = supabase.channel('map-live')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, (payload) => {
          if (payload.eventType === 'INSERT') {
            setComplaints(prev => [payload.new as Complaint, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setComplaints(prev => prev.map(c => c.complaint_id === payload.new.complaint_id ? (payload.new as Complaint) : c));
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'clusters' }, (payload) => {
          if (payload.eventType === 'INSERT' && payload.new.centroid_lat) {
            setClusters(prev => [...prev, payload.new as Cluster]);
          } else if (payload.eventType === 'UPDATE' && payload.new.centroid_lat) {
            setClusters(prev => prev.map(c => c.cluster_id === payload.new.cluster_id ? (payload.new as Cluster) : c));
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  if (!isMounted) return <div className="h-[500px] bg-slate-900 rounded-lg animate-pulse flex items-center justify-center text-slate-500">Loading live map...</div>;

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden border border-slate-800 relative z-0">

      {/* Live HUD */}
      <div className="absolute top-4 left-4 z-[400] bg-[#0A1118]/90 backdrop-blur border border-slate-700 p-3 rounded shadow-lg flex flex-col gap-1 pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-white font-bold tracking-wider text-sm">LIVE</span>
        </div>
        <p className="text-xs text-slate-300 font-mono">
          {clusters.length} clusters · {complaints.length} complaints
        </p>
        <p className="text-xs text-[#00E5A0] font-bold">Ward 78</p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[400] bg-[#0A1118]/90 backdrop-blur border border-slate-700 p-3 rounded shadow-lg pointer-events-auto text-xs flex flex-col gap-2">
        <p className="text-slate-400 font-bold mb-1 border-b border-slate-800 pb-1">Legend</p>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#00BFFF] rounded-full"></div> Waterlogging</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#FF6B35] rounded-full"></div> Pothole</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#FFD700] rounded-full"></div> Garbage</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#FF4444] rounded-full"></div> Damp Wall</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#AA00FF] rounded-full"></div> Mosquito</div>
      </div>

      {/* Officer GPS Button */}
      {userRole === 'ward_officer' && (
        <button
          onClick={() => alert("Officer location tracked: 28.6565, 77.2145")}
          className="absolute bottom-4 left-4 z-[400] bg-[#00E5A0] text-[#0A1118] font-bold px-4 py-2 rounded shadow-lg hover:bg-[#00c98c] transition-colors pointer-events-auto flex items-center gap-2 text-sm"
        >
          <span>📍</span> My Location
        </button>
      )}

      <MapContainer
        center={[28.6562, 77.2140]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Draw Cluster Circles */}
        {clusters.map((cluster) => (
          <Circle
            key={cluster.cluster_id}
            center={[cluster.centroid_lat, cluster.centroid_lon]}
            radius={400}
            pathOptions={{
              color: clusterColors[cluster.root_cause] || clusterColors["default"],
              fillColor: clusterColors[cluster.root_cause] || clusterColors["default"],
              fillOpacity: 0.2,
              weight: 2
            }}
          >
            <Popup className="text-slate-900 min-w-[200px]">
              <div className="font-bold text-sm mb-1">{cluster.root_cause}</div>
              <div className="text-xs space-y-1">
                <p>Confidence: {(cluster.confidence * 100).toFixed(0)}%</p>
                <p>Status: Active Cluster</p>
                <button className="mt-2 w-full bg-slate-900 text-white py-1 rounded">View Details</button>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Draw Complaint Pins */}
        {complaints.map((marker) => {
          const iconType = icons[marker.complaint_type as keyof typeof icons] || icons.unclassified;
          return (
            <Marker
              key={marker.complaint_id}
              position={[marker.latitude, marker.longitude]}
              icon={iconType}
            >
              <Popup className="text-slate-900">
                <div className="font-bold capitalize mb-1">{marker.complaint_type}</div>
                <div className="text-xs space-y-1">
                  <p>Severity: {marker.severity}</p>
                  <p>Channel: {marker.source_channel}</p>
                  <p>Status: <span className="uppercase font-bold">{marker.status}</span></p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
