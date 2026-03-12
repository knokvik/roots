"use client";
import React, { useState } from 'react';

type RepairTask = {
  task_id: string;
  root_cause: string;
  repair_description: string;
  estimated_cost_inr: number;
  env_harm_prevented_score: number;
  days_unresolved: number;
  affected_population: number;
  complaint_type: string;
};

const dummyTasks: RepairTask[] = [
  {
    task_id: "T-001",
    root_cause: "Surface Drainage Blockage",
    repair_description: "Deploy hydro-jetting to clear storm drains.",
    estimated_cost_inr: 25000,
    env_harm_prevented_score: 4839,
    days_unresolved: 14,
    affected_population: 1500,
    complaint_type: "waterlogging"
  },
  {
    task_id: "T-002",
    root_cause: "Subsurface Drainage Failure",
    repair_description: "Excavate and replace underground drainage segment.",
    estimated_cost_inr: 150000,
    env_harm_prevented_score: 8200,
    days_unresolved: 5,
    affected_population: 3000,
    complaint_type: "pothole"
  },
  {
    task_id: "T-003",
    root_cause: "Solid Waste Overflow",
    repair_description: "Emergency waste clearing, fumigation.",
    estimated_cost_inr: 15000,
    env_harm_prevented_score: 1200,
    days_unresolved: 3,
    affected_population: 800,
    complaint_type: "garbage"
  }
];

export default function OfficerConsole() {
  const [tasks] = useState<RepairTask[]>(dummyTasks);
  const totalBudget = 500000;

  const handleDispatch = (taskId: string) => {
    console.log(`Dispatched repair team for task: ${taskId}`);
    alert(`Dispatched repair team for task: ${taskId}`);
  };

  const hasDengueRisk = tasks.some(
    t => t.days_unresolved > 7 && t.complaint_type === "waterlogging"
  );

  return (
    <div className="flex flex-col gap-6">

      {/* Dengue Warning Banner */}
      {hasDengueRisk && (
        <div className="bg-red-900/30 border-l-4 border-red-500 p-4 rounded text-red-200">
          <p className="font-bold flex items-center">
            <span className="text-xl mr-2">⚠️</span>
            CRITICAL HEALTH RISK DETECTED
          </p>
          <p className="text-sm mt-1">Waterlogging tasks unresolved for &gt; 7 days. High probability of Dengue outbreak.</p>
        </div>
      )}

      {/* Budget Summary */}
      <div className="bg-[#0A1118] border border-[#00E5A0]/30 p-4 rounded flex justify-between items-center">
        <div>
          <p className="text-slate-400 text-sm">Ward 78 Allocation</p>
          <p className="text-2xl font-bold text-[#00E5A0]">Remaining Budget: ₹{(totalBudget - tasks.reduce((acc, t) => acc + t.estimated_cost_inr, 0)).toLocaleString()} / ₹{totalBudget.toLocaleString()}</p>
        </div>
      </div>

      {/* Task List */}
      <div>
        <h3 className="text-xl font-bold mb-4 border-b border-slate-800 pb-2">Top Priority Repairs (ROI Optimized)</h3>
        <div className="grid gap-4">
          {tasks.map((task, idx) => (
            <div key={task.task_id} className="bg-[#0A1118] border border-slate-800 rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-600 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded font-bold">#{idx + 1}</span>
                  <h4 className="text-lg font-bold text-white">{task.root_cause}</h4>
                  <span className="text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded">
                    {task.days_unresolved} Days Unresolved
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-3">{task.repair_description}</p>
                <div className="flex flex-wrap gap-4 text-sm font-space">
                  <span className="text-slate-300">Cost: <span className="text-white">₹{task.estimated_cost_inr.toLocaleString()}</span></span>
                  <span className="text-slate-300">Env Harm Prevented: <span className="text-[#00E5A0]">{task.env_harm_prevented_score}</span></span>
                </div>
              </div>
              <button
                onClick={() => handleDispatch(task.task_id)}
                className="bg-[#00E5A0] text-[#050A0E] hover:bg-[#00c98c] px-6 py-2 rounded font-bold transition-colors w-full md:w-auto"
              >
                Dispatch Team
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
