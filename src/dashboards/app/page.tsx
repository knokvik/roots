"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase/client';

import MetricsBar from "./components/MetricsBar";
import OfficerConsole from "./components/OfficerConsole";
import DecayChart from "./components/DecayChart";
import CitizenView from "./components/CitizenView";
import EnvironmentalLedger from "./components/EnvironmentalLedger";
import CityCommand from "./components/CityCommand";

// Use LiveMap instead of MapView
const LiveMap = dynamic(() => import("./components/LiveMap"), {
  ssr: false,
  loading: () => <p className="text-center p-10 text-slate-500 animate-pulse bg-slate-900 rounded-lg h-[500px]">Loading Live Map...</p>
});

type UserProfile = {
  full_name: string;
  role: string;
} | null;

function DashboardContent() {
  const [activeTab, setActiveTab] = useState("Loading...");
  const [status, setStatus] = useState<"live" | "demo" | "connecting">("connecting");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isMounted, setIsMounted] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const allTabs = [
    "Citizen View",
    "Officer Console",
    "Environmental Ledger",
    "City Command"
  ];

  useEffect(() => {
    setIsMounted(true);

    // Auth & Profile Check
    const fetchUser = async () => {
      const isDemo = searchParams.get('demo');
      const demoRole = searchParams.get('role');

      if (isDemo && demoRole) {
        setProfile({
          full_name: `Demo User (${demoRole})`,
          role: demoRole
        });
        setLoadingProfile(false);
        setInitialTab('mcd_admin');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.from('user_profiles').select('*').eq('id', session.user.id).single();
        if (data) {
          setProfile(data as UserProfile);
          setInitialTab(data.role);
        } else {
          setProfile({ full_name: session.user.email || "Unknown", role: "ward_officer" });
          setInitialTab("ward_officer");
        }
      }
      setLoadingProfile(false);
    };

    fetchUser();

    // Heartbeat
    const checkStatus = async () => {
      try {
        const res = await axios.get('/api/status');
        setStatus(res.data.status);
      } catch (e) {
        setStatus("demo");
      }
      setLastUpdated(new Date());
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const setInitialTab = (role: string) => {
    if (role === 'citizen') setActiveTab('Citizen View');
    else if (role === 'ward_officer' || role === 'mcd_admin') setActiveTab('Officer Console');
    else if (role === 'researcher') setActiveTab('Environmental Ledger');
    else setActiveTab('Officer Console'); // fallback
  };

  const handleSignOut = async () => {
    if (searchParams.get('demo')) {
      router.push('/login');
      return;
    }
    await supabase.auth.signOut();
    router.refresh();
    router.push('/login');
  };

  // Determine allowed tabs based on role
  const allowedTabs = allTabs; /*
    if (!profile) return false;
    const r = profile.role;
    if (r === 'citizen') return tab === 'Citizen View';
    if (r === 'ward_officer') return tab === 'Officer Console';
    if (r === 'mcd_admin') return tab === 'Officer Console' || tab === 'City Command';
    if (r === 'researcher') return tab === 'Environmental Ledger';
    */

  const showMap = profile && ['ward_officer', 'mcd_admin', 'researcher'].includes(profile.role);

  return (
    <main className="min-h-screen bg-[#050A0E] text-slate-200 p-4 md:p-8 font-space">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">ROOTS <span className="text-[#00E5A0]">OS</span></h1>
            <p className="text-slate-500 text-sm">Responsive Optimization of Urban Infrastructure Through AI</p>
          </div>
          <div className="mt-4 md:mt-0 text-right flex flex-col items-end">
            <div className="flex items-center justify-end gap-3 mb-2">
              {profile && (
                <div className="bg-slate-900 border border-slate-700 px-3 py-1 rounded flex items-center gap-2">
                  <span className="text-sm font-bold">{profile.full_name}</span>
                  <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded capitalize">{profile.role.replace('_', ' ')}</span>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="text-xs text-slate-400 hover:text-white transition underline"
              >
                Sign Out
              </button>
            </div>

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
        {!loadingProfile && (
          <nav className="flex overflow-x-auto gap-2 mb-8 no-scrollbar border-b border-slate-800">
            {allowedTabs.map((tab) => (
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
        )}

        {/* Content Area */}
        {loadingProfile ? (
          <div className="py-20 text-center text-slate-500 animate-pulse">Authenticating session...</div>
        ) : (
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
                  <div className="flex flex-col gap-8">
                    {showMap && <LiveMap userRole={profile?.role} />}
                    <DecayChart />
                  </div>
                  <div className="flex flex-col h-full">
                    <OfficerConsole />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Environmental Ledger" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="flex flex-col gap-8">
                     {showMap && <LiveMap userRole={profile?.role} />}
                   </div>
                   <div className="flex flex-col">
                     <EnvironmentalLedger />
                   </div>
                </div>
              </div>
            )}

            {activeTab === "City Command" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <CityCommand />
                {showMap && <LiveMap userRole={profile?.role} />}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}


export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050A0E] text-slate-500 flex items-center justify-center">Loading Application...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
