"use client";
import { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // To allow unauthenticated viewing for the demo if env is missing
  const [demoMode, setDemoMode] = useState(!process.env.NEXT_PUBLIC_SUPABASE_URL);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (demoMode) {
      // Fake login for UI demo without real Supabase connection
      router.push('/?demo=true&role=ward_officer');
      return;
    }

    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.refresh();
      router.push('/');
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    if (demoMode) {
      const demoRole = demoEmail.split('@')[0];
      router.push(`/?demo=true&role=${demoRole}`);
      return;
    }
    setEmail(demoEmail);
    setPassword('Roots@2026');
    // Automate submit
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: demoEmail, password: 'Roots@2026' });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.refresh();
      router.push('/');
    }
  };

  return (
    <div className="w-full max-w-md bg-[#0A1118] border border-slate-800 p-8 rounded-lg shadow-xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">ROOTS <span className="text-[#00E5A0]">OS</span></h1>
        <p className="text-slate-400 text-sm">Responsive Optimization of Urban Infrastructure</p>
      </div>

      {(error || searchParams.get('error')) && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded mb-6 text-sm">
          {error || searchParams.get('error')}
        </div>
      )}

      {demoMode && (
        <div className="bg-yellow-900/30 border border-yellow-500/50 text-yellow-400 p-3 rounded mb-6 text-sm text-center">
          <strong>Demo Mode Active</strong><br/>Supabase URL not detected. Clicking login will bypass auth.
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4 mb-8">
        <div>
          <label className="block text-slate-400 text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#050A0E] border border-slate-700 rounded p-2 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#050A0E] border border-slate-700 rounded p-2 text-white"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00E5A0] text-[#050A0E] font-bold py-3 rounded hover:bg-[#00c98c] transition-colors disabled:opacity-50 mt-4"
        >
          {loading ? "Authenticating..." : "Sign In"}
        </button>
      </form>

      <div className="border-t border-slate-800 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Competition Demo Logins</h3>
          <button
            onClick={() => handleDemoLogin('officer@roots.demo')}
            className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1 rounded text-white font-bold transition"
          >
            Try Demo →
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { role: 'Citizen', email: 'citizen@roots.demo' },
            { role: 'Ward Officer', email: 'officer@roots.demo' },
            { role: 'MCD Admin', email: 'admin@roots.demo' },
            { role: 'Researcher', email: 'researcher@roots.demo' }
          ].map((demo) => (
            <div key={demo.role} className="bg-slate-900 border border-slate-800 p-2 rounded text-xs">
              <p className="text-[#00E5A0] font-bold mb-1">{demo.role}</p>
              <p className="text-slate-300 select-all">{demo.email}</p>
              <p className="text-slate-500 select-all">Roots@2026</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#050A0E] font-space flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
