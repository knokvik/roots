"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format } from 'date-fns';

type Alert = {
  cluster_id: string;
  root_cause: string;
  confidence: number;
  formed_at: string;
};

export default function CityCommand() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [healthScore, setHealthScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clustersRes, healthRes] = await Promise.all([
          axios.get('/api/clusters?ward_id=ward78'),
          axios.get('/api/ward-health?ward_id=ward78')
        ]);
        setAlerts(clustersRes.data?.slice(0, 3) || []);
        setHealthScore(healthRes.data?.health_score || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const budgetData = [
    { name: 'Allocated', value: 500000, fill: '#3b82f6' },
    { name: 'Harm Prevented', value: 142390, fill: '#00E5A0' } // Scaled score for chart parity
  ];

  // 12 weeks for 90 days
  const forecast = Array.from({length: 12}, (_, i) => {
    const week = i + 1;
    let risk = "low";
    if ([3,7,11].includes(week)) risk = "high";
    else if ([5,9].includes(week)) risk = "medium";
    return { week, risk };
  });

  const getRiskColor = (risk: string) => {
    if (risk === 'high') return 'bg-red-500';
    if (risk === 'medium') return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">

      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Health Index */}
        <div className="bg-[#0A1118] border border-slate-800 rounded-lg p-6 flex flex-col justify-center items-center text-center">
          <p className="text-slate-400 mb-2">Infrastructure Health Index</p>
          <div className="flex items-baseline gap-1">
             <p className="text-6xl font-bold text-white font-space tracking-tighter">
               {Math.round(healthScore * 100)}
             </p>
             <p className="text-2xl text-slate-500 font-bold">/100</p>
          </div>
          <p className="text-xs text-[#00E5A0] mt-4">Ward 78 — Updated just now</p>
        </div>

        {/* Daily Briefing */}
        <div className="bg-[#0A1118] border border-[#00E5A0]/20 rounded-lg p-6 lg:col-span-2">
          <h3 className="font-bold mb-3 flex items-center gap-2 text-[#00E5A0]">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
             Today's Briefing
          </h3>
          <p className="text-slate-300 leading-relaxed text-sm">
            Analysis of recent civic inputs indicates a <span className="text-red-400 font-bold">Severe Dengue Risk</span> developing due to unresolved waterlogging clusters in Sadar Bazaar.
            The ROI Optimizer recommends immediately deploying hydro-jetting units to clear surface blockages,
            which will utilize only 5% of the allocated budget while mitigating ₹1.4L in compounding environmental damage.
          </p>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Forecast Calendar */}
        <div className="bg-[#0A1118] border border-slate-800 rounded-lg p-6">
          <h3 className="font-bold mb-4 text-slate-300">90-Day Failure Forecast</h3>
          <div className="grid grid-cols-4 gap-2">
            {forecast.map(f => (
              <div key={f.week} className="bg-slate-900 border border-slate-800 rounded p-3 flex flex-col items-center">
                 <span className="text-xs text-slate-500 mb-2">Week {f.week}</span>
                 <div className={`w-full h-2 rounded-full ${getRiskColor(f.risk)}`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget vs Outcome Chart */}
        <div className="bg-[#0A1118] border border-slate-800 rounded-lg p-6 h-[300px] flex flex-col">
          <h3 className="font-bold mb-4 text-slate-300">Budget vs Outcome</h3>
          <div className="flex-1">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={budgetData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                 <XAxis type="number" stroke="#94a3b8" tickFormatter={(val) => `₹${val/1000}k`} />
                 <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                 <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'INR']}
                 />
                 <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                   {budgetData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.fill} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row - Alerts */}
      <div className="bg-[#0A1118] border border-slate-800 rounded-lg p-6">
        <h3 className="font-bold mb-4 text-slate-300">Active Causal Alerts</h3>
        {loading ? (
           <div className="animate-pulse space-y-3">
             {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-800 rounded"></div>)}
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {alerts.map(a => (
               <div key={a.cluster_id} className="border border-slate-700 bg-slate-900/50 rounded p-4">
                 <div className="flex justify-between items-start mb-2">
                   <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded font-mono">{a.cluster_id}</span>
                   <span className="text-xs font-bold text-[#00E5A0]">{(a.confidence * 100).toFixed(0)}% Match</span>
                 </div>
                 <h4 className="font-bold text-white mb-1">{a.root_cause}</h4>
                 <p className="text-xs text-slate-500">Formed: {format(new Date(a.formed_at), "PP")}</p>
               </div>
             ))}
             {alerts.length === 0 && <p className="text-slate-500">No active alerts.</p>}
           </div>
        )}
      </div>

    </div>
  );
}
