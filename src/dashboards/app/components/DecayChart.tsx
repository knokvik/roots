"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

const data = [
  { day: 1, cost: 45000 },
  { day: 7, cost: 73000, label: "Dengue Risk: Medium" },
  { day: 14, cost: 120000, label: "Dengue Risk: Critical" },
  { day: 21, cost: 195000 },
  { day: 30, cost: 340000 },
];

export default function DecayChart() {
  return (
    <div className="bg-[#0A1118] border border-slate-800 rounded-lg p-6 h-[400px]">
      <h3 className="text-[#00E5A0] font-bold mb-4">Environmental Decay Cost Model (Waterlogging)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="day"
            stroke="#94a3b8"
            tickFormatter={(val) => `Day ${val}`}
          />
          <YAxis
            stroke="#94a3b8"
            tickFormatter={(val) => `₹${val / 1000}k`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Cost Liability']}
            labelFormatter={(label) => `Day ${label}`}
          />
          <Line
            type="monotone"
            dataKey="cost"
            stroke="#00E5A0"
            strokeWidth={3}
            dot={{ r: 4, fill: '#00E5A0' }}
            activeDot={{ r: 8 }}
          />
          <ReferenceDot x={7} y={73000} r={6} fill="#fbbf24" stroke="none" />
          <ReferenceDot x={14} y={120000} r={6} fill="#ef4444" stroke="none" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
