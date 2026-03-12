import React from 'react';

export default function MetricsBar() {
  const metrics = [
    { label: "Clusters Found Today", value: "3", alert: false },
    { label: "Root Causes Identified", value: "2", alert: false },
    { label: "Daily Env Cost", value: "₹12,400", alert: false },
    { label: "Dengue Risk Level", value: "HIGH", alert: true },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {metrics.map((m, idx) => (
        <div
          key={idx}
          className={`bg-[#0A1118] border rounded-lg p-5 flex flex-col justify-center shadow-lg
            ${m.alert ? 'border-red-500' : 'border-[#00E5A0]'}
          `}
        >
          <p className="text-sm text-slate-400 mb-1">{m.label}</p>
          <p className={`text-2xl font-bold ${m.alert ? 'text-red-500' : 'text-slate-100'}`}>
            {m.value}
          </p>
        </div>
      ))}
    </div>
  );
}
