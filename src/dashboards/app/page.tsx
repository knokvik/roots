"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import MetricsBar from "./components/MetricsBar";
import OfficerConsole from "./components/OfficerConsole";
import DecayChart from "./components/DecayChart";

// Dynamically import MapView with ssr disabled for React-Leaflet
const MapView = dynamic(() => import("./components/MapView"), {
  ssr: false,
  loading: () => <p className="text-center p-10 text-slate-500">Loading Map...</p>
});

export default function Home() {
  const [activeTab, setActiveTab] = useState("Officer Console");

  const tabs = [
    "Citizen View",
    "Officer Console",
    "Environmental Ledger",
    "City Command"
  ];

  return (
    <main className="min-h-screen bg-[#050A0E] text-slate-200 p-4 md:p-8 font-space">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">ROOTS <span className="text-[#00E5A0]">OS</span></h1>
            <p className="text-slate-500 text-sm">Responsive Optimization of Urban Infrastructure Through AI</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-[#00E5A0] font-bold">Ward 78 - Sadar Bazaar</p>
            <p className="text-slate-500 text-sm">India Innovates 2026</p>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex overflow-x-auto gap-2 mb-8 no-scrollbar border-b border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 whitespace-nowrap font-bold text-sm transition-all border-b-2
                ${activeTab === tab
                  ? 'border-[#00E5A0] text-[#00E5A0]'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        {activeTab === "Officer Console" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <MetricsBar />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Map & Chart */}
              <div className="flex flex-col gap-8">
                <MapView />
                <DecayChart />
              </div>

              {/* Right Column - Console */}
              <div className="flex flex-col h-full">
                <OfficerConsole />
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== "Officer Console" && (
          <div className="py-20 text-center border border-dashed border-slate-800 rounded-lg text-slate-500 flex flex-col items-center justify-center">
            <span className="text-4xl mb-4 text-slate-700">🚧</span>
            <h2 className="text-xl font-bold mb-2">{activeTab}</h2>
            <p>This module is under development for ROOTS v3.0</p>
          </div>
        )}

      </div>
    </main>
  );
}
