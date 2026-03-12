"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from 'axios';
import { format } from 'date-fns';

import MetricsBar from "./components/MetricsBar";
import OfficerConsole from "./components/OfficerConsole";
import DecayChart from "./components/DecayChart";
import CitizenView from "./components/CitizenView";
import EnvironmentalLedger from "./components/EnvironmentalLedger";
import CityCommand from "./components/CityCommand";

const MapView = dynamic(() => import("./components/MapView"), {
  ssr: false,
  loading: () => <p className="text-center p-10 text-slate-500 animate-pulse bg-slate-900 rounded-lg h-[400px]">Loading Map...</p>
});

export default function Home() {
  const [activeTab, setActiveTab] = useState("Officer Console");
  const [status, setStatus] = useState<"live" | "demo" | "connecting">("connecting");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isMounted, setIsMounted] = useState(false);

  const tabs = [
    "Citizen View",
    "Officer Console",
    "Environmental Ledger",
    "City Command"
  ];

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axios.get('/api/status');
        setStatus(res.data.status);
      } catch (e) {
        setStatus("demo");
      }
      setLastUpdated(new Date());
    };

    setIsMounted(true);
    checkStatus();
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      checkStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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
            <div className="flex items-center justify-end gap-2 mb-1">
              {status === "live" ? (
                <span className="flex items-center gap-1 text-[#00E5A0] text-xs font-bold border border-[#00E5A0]/30 bg-[#00E5A0]/10 px-2 py-1 rounded-full">
                  <span className="w-2 h-2 bg-[#00E5A0] rounded-full animate-pulse"></span> Live
                </span>
              ) : status === "demo" ? (
                <span className="flex items-center gap-1 text-yellow-500 text-xs font-bold border border-yellow-500/30 bg-yellow-500/10 px-2 py-1 rounded-full">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span> Demo Mode
                </span>
              ) : (
                <span className="text-xs text-slate-500">Connecting...</span>
              )}
            </div>
            <p className="text-[#00E5A0] font-bold">Ward 78 - Sadar Bazaar</p>
            <p className="text-slate-500 text-xs">Updated: {isMounted ? format(lastUpdated, "HH:mm:ss") : ""}</p>
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
        <div>
          {activeTab === "Citizen View" && (
            <div className="animate-in fade-in duration-500">
              <CitizenView />
            </div>
          )}

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

          {activeTab === "Environmental Ledger" && (
            <div className="animate-in fade-in duration-500">
              <EnvironmentalLedger />
            </div>
          )}

          {activeTab === "City Command" && (
            <div className="animate-in fade-in duration-500">
              <CityCommand />
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
