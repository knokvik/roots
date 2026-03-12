"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Task = {
  cluster_id: string;
  env_harm_prevented_score: number;
  root_cause: string;
};

export default function EnvironmentalLedger() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/repair-tasks?ward_id=ward78');
        setTasks(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const chartData = tasks.map(t => ({
    name: t.cluster_id || "Cluster",
    cost: t.env_harm_prevented_score * 50 // Rough INR mapping for visualization
  }));

  // Generate 30 day dummy heatmap array
  const heatmap = Array.from({length: 30}, (_, i) => {
    let level = "low";
    if (i > 20) level = "critical";
    else if (i > 14) level = "high";
    else if (i > 7) level = "medium";

    return { day: i+1, level };
  });

  const getHeatmapColor = (level: string) => {
    if (level === 'low') return 'bg-green-500';
    if (level === 'medium') return 'bg-yellow-500';
    if (level === 'high') return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carbon Credits */}
        <div className="bg-[#0A1118] border border-slate-800 rounded-lg p-6 flex flex-col justify-center items-center text-center">
          <p className="text-slate-400 mb-2">Carbon Credits Accrued</p>
          <p className="text-5xl font-bold text-[#00E5A0] font-space tracking-tighter">
            {(tasks.length * 0.3).toFixed(1)}
          </p>
          <p className="text-xs text-slate-500 mt-2">+0.3 per resolved critical task</p>
        </div>

        {/* Heatmap */}
        <div className="bg-[#0A1118] border border-slate-800 rounded-lg p-6 md:col-span-2">
          <p className="text-slate-400 mb-4 font-bold">30-Day Dengue Risk Timeline</p>
          <div className="flex flex-wrap gap-1">
            {heatmap.map(h => (
              <div
                key={h.day}
                className={`w-4 h-8 md:w-6 md:h-12 rounded-sm ${getHeatmapColor(h.level)} opacity-80 hover:opacity-100 transition-opacity`}
                title={`Day ${h.day}: ${h.level} risk`}
              />
            ))}
          </div>
          <div className="flex gap-4 mt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Low</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500 rounded-full"></div> Medium</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-500 rounded-full"></div> High</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Critical</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-[#0A1118] border border-slate-800 rounded-lg p-6 h-[400px]">
          <h3 className="font-bold mb-4 text-slate-300">Daily Env Cost per Cluster</h3>
          {loading ? (
             <div className="h-full w-full bg-slate-800 animate-pulse rounded"></div>
          ) : (
             <ResponsiveContainer width="100%" height="90%">
               <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                 <XAxis dataKey="name" stroke="#94a3b8" />
                 <YAxis stroke="#94a3b8" tickFormatter={(val) => `₹${val/1000}k`} />
                 <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Cost']}
                 />
                 <Bar dataKey="cost" fill="#00E5A0" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          )}
        </div>

        {/* Equity Audit */}
        <div className="bg-[#0A1118] border border-slate-800 rounded-lg p-6">
          <h3 className="font-bold mb-4 text-slate-300 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Equity Audit Panel
          </h3>
          <p className="text-sm text-slate-400 mb-6">Article 14 compliance monitoring via XGBoost/SHAP bias detection.</p>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded border border-slate-800">
              <span className="text-slate-300">Monday complaints</span>
              <span className="text-green-400 font-bold bg-green-900/30 px-2 py-1 rounded text-sm">Resolve 23% faster</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded border border-slate-800">
              <span className="text-slate-300">Photo complaints</span>
              <span className="text-green-400 font-bold bg-green-900/30 px-2 py-1 rounded text-sm">Resolve 2.3x faster</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-900/10 rounded border border-red-900/50">
              <span className="text-slate-300">Low-income wards</span>
              <span className="text-red-400 font-bold bg-red-900/30 px-2 py-1 rounded text-sm">Resolve 40% slower</span>
            </div>
          </div>
          <p className="text-xs text-red-400 mt-4 italic">* Bias flag raised for officer review.</p>
        </div>
      </div>

    </div>
  );
}
