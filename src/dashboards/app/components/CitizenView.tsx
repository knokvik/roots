"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

type Complaint = {
  complaint_id: string;
  complaint_type: string;
  description: string;
  status: string;
  timestamp: string;
};

export default function CitizenView() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [healthScore, setHealthScore] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    complaint_type: "waterlogging",
    description: "",
    location: "",
    photo_url: "",
    language: "en"
  });

  const fetchData = async () => {
    try {
      const [complaintRes, healthRes] = await Promise.all([
        axios.get('/api/complaints?ward_id=ward78'),
        axios.get('/api/ward-health?ward_id=ward78')
      ]);
      setComplaints(complaintRes.data || []);
      setHealthScore(healthRes.data?.health_score || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        ward_id: "ward78",
        ward_name: "Sadar Bazaar",
        source_channel: "Web",
        latitude: 28.6562,
        longitude: 77.2140
      };
      const res = await axios.post('/api/complaints', payload);
      setSuccessMsg(`Complaint submitted! ID: ${res.data.complaint_id}`);
      setFormData({ ...formData, description: "", location: "", photo_url: "" });
      fetchData(); // refresh list
    } catch (e) {
      alert("Error submitting complaint");
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = (status: string) => {
    if (status === 'open') return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
    if (status === 'clustered') return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
    if (status === 'resolved') return 'bg-green-500/20 text-green-500 border-green-500/50';
    return 'bg-slate-500/20 text-slate-500 border-slate-500/50';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Form Column */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-[#0A1118] border border-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Report an Issue</h2>
          {successMsg && (
             <div className="mb-4 p-3 bg-green-900/30 text-green-400 border border-green-500/30 rounded">
               {successMsg}
             </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Issue Type</label>
                <select
                  className="w-full bg-[#050A0E] border border-slate-700 rounded p-2 text-white"
                  value={formData.complaint_type}
                  onChange={e => setFormData({...formData, complaint_type: e.target.value})}
                >
                  <option value="waterlogging">Waterlogging</option>
                  <option value="pothole">Pothole</option>
                  <option value="garbage">Garbage</option>
                  <option value="damp_wall">Damp Wall</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Language</label>
                <select
                  className="w-full bg-[#050A0E] border border-slate-700 rounded p-2 text-white"
                  value={formData.language}
                  onChange={e => setFormData({...formData, language: e.target.value})}
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Location</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 bg-[#050A0E] border border-slate-700 rounded p-2 text-white"
                  placeholder="Enter address..."
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  required
                />
                <button type="button" onClick={() => setFormData({...formData, location: "28.6562, 77.2140"})} className="bg-slate-800 px-4 py-2 rounded text-sm hover:bg-slate-700 transition-colors">
                  Use My Location
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Description</label>
              <textarea
                className="w-full bg-[#050A0E] border border-slate-700 rounded p-2 text-white h-24"
                placeholder="Describe the issue..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Photo URL (Optional)</label>
              <input
                type="text"
                className="w-full bg-[#050A0E] border border-slate-700 rounded p-2 text-white"
                placeholder="https://..."
                value={formData.photo_url}
                onChange={e => setFormData({...formData, photo_url: e.target.value})}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#00E5A0] text-[#050A0E] font-bold py-3 rounded hover:bg-[#00c98c] transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </div>

        {/* Recent Complaints */}
        <div>
          <h3 className="text-lg font-bold mb-4">My Recent Reports</h3>
          {loading ? (
             <div className="animate-pulse space-y-3">
               {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-800 rounded"></div>)}
             </div>
          ) : (
             <div className="space-y-3">
               {complaints.slice(0,5).map(c => (
                 <div key={c.complaint_id} className="bg-[#0A1118] border border-slate-800 p-4 rounded flex justify-between items-center">
                   <div>
                     <p className="font-bold capitalize">{c.complaint_type}</p>
                     <p className="text-xs text-slate-500">{format(new Date(c.timestamp), "PP p")}</p>
                   </div>
                   <span className={`text-xs px-2 py-1 rounded border capitalize ${statusColor(c.status)}`}>
                     {c.status}
                   </span>
                 </div>
               ))}
             </div>
          )}
        </div>
      </div>

      {/* Sidebar - Ward Health */}
      <div>
        <div className="bg-[#0A1118] border border-slate-800 rounded-lg p-6 flex flex-col items-center text-center">
          <h3 className="text-lg font-bold mb-6 text-slate-300">Ward 78 Health</h3>
          <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-[8px] border-slate-800">
             {/* Simple CSS-based circular progress visualization using borders isn't great, let's just do a big number in a circle for now to mimic it */}
             <div
               className="absolute inset-0 rounded-full border-[8px] border-[#00E5A0]"
               style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`, opacity: 0.8 }}
             ></div>
             <div className="z-10 flex flex-col items-center">
               <span className="text-5xl font-bold text-white">{Math.round(healthScore * 100)}<span className="text-2xl">%</span></span>
             </div>
          </div>
          <p className="mt-6 text-sm text-slate-400">
            Overall infrastructure health index based on resolved vs unresolved active clusters.
          </p>
        </div>
      </div>

    </div>
  );
}
