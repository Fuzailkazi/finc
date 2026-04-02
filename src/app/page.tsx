"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowRight, 
  Wallet, 
  Sparkles, 
  Shield, 
  Zap,
  Lock,
  Search,
  PieChart,
  Target,
  Loader2,
  ChevronRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setError("Check your email for confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans selection:bg-[#2563EB]/10 selection:text-[#2563EB]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-lg border-b border-slate-100 px-6 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer transition-transform active:scale-95">
            <div className="w-8 h-8 bg-[#2563EB] rounded-[8px] flex items-center justify-center rotate-3 transition-transform group-hover:rotate-0">
              <Wallet className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tighter text-slate-800 uppercase">FINAI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[13px] font-bold text-slate-500">
            <Link href="#features" className="hover:text-[#2563EB] transition-colors">How it works</Link>
            <button 
              onClick={() => {
                const el = document.getElementById("auth-card");
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-[#2563EB] text-white rounded-[10px] font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-blue-500/20 hover:bg-[#1D4ED8] transition-all hover:scale-105 active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-transparent">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">Neural Personal Ledger</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-slate-900 mb-8 leading-[1.1]">
              Own Your Money <br/>
              With <span className="text-[#2563EB]">Neural Insight</span>
            </h1>
            
            <p className="text-base text-slate-500 max-w-[500px] mb-12 font-medium leading-relaxed">
              The private, individual finance hub that understands your natural language. Log, track, and save in seconds.
            </p>

            <div className="flex items-center gap-8 grayscale opacity-40">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5" /> <span className="text-[12px] font-bold uppercase tracking-tight">Private</span>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5" /> <span className="text-[12px] font-bold uppercase tracking-tight">Encrypted</span>
              </div>
            </div>
          </div>

          <div id="auth-card" className="relative group">
            <div className="absolute inset-0 bg-[#2563EB]/10 rounded-[32px] blur-3xl -z-10 animate-pulse"></div>
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] p-8 md:p-10">
              <div className="flex bg-slate-50 p-1 rounded-2xl mb-8">
                <button 
                  onClick={() => { setMode('login'); setError(null); }}
                  className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                >
                  Login
                </button>
                <button 
                  onClick={() => { setMode('signup'); setError(null); }}
                  className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all ${mode === 'signup' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleAuth} className="space-y-5">
                <div>
                  <label className="text-[9px] font-bold uppercase text-slate-400 mb-2 block tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white transition-all rounded-2xl text-[14px] font-bold" 
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-slate-400 mb-2 block tracking-widest">Password</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white transition-all rounded-2xl text-[14px] font-bold" 
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <div className={`p-4 rounded-2xl text-[11px] font-bold ${error.includes('confirmation') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {error}
                  </div>
                )}

                <button 
                  disabled={loading}
                  className="w-full py-5 bg-[#2563EB] text-white rounded-[18px] font-bold uppercase tracking-[0.2em] text-[12px] shadow-xl shadow-blue-500/30 hover:bg-[#1D4ED8] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'login' ? 'Enter Ledger' : 'Create Account'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y border-slate-50">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-8">Personal Security Assured</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 grayscale opacity-40">
             <div className="flex items-center gap-3">
               <Shield className="w-5 h-5" /> <span className="text-[14px] font-bold uppercase tracking-tight">End-to-End Private</span>
             </div>
             <div className="flex items-center gap-3">
               <Lock className="w-5 h-5" /> <span className="text-[14px] font-bold uppercase tracking-tight">AES-256 Storage</span>
             </div>
             <div className="flex items-center gap-3">
               <Zap className="w-5 h-5" /> <span className="text-[14px] font-bold uppercase tracking-tight">Instant Sync</span>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-24">
             <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-slate-900 mb-6">Built for Individual Clarity</h2>
             <p className="text-slate-500 font-medium max-w-[500px] mx-auto">Why struggle with spreadsheets when you can just type what you spent?</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "Neural Parsing", desc: "Talk to your bank like a friend. Just type '500 for grocery' and we handle the rest." },
              { icon: PieChart, title: "Personal Insights", desc: "Get deep visibility into your spending trends without manual categorization." },
              { icon: Target, title: "Saving Goals", desc: "Set and track smart goals. Our AI helps you find ways to save faster." },
            ].map((feature, i) => (
              <div key={i} className="p-10 bg-slate-50 rounded-[24px] border border-slate-100 hover:border-[#2563EB]/20 transition-all group">
                <div className="w-14 h-14 bg-white rounded-[16px] shadow-sm flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform">
                  <feature.icon className="w-7 h-7 text-[#2563EB]" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-slate-100">
         <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2.5 grayscale opacity-60">
              <div className="w-6 h-6 bg-slate-800 rounded-[6px] flex items-center justify-center">
                <Wallet className="text-white w-4 h-4" />
              </div>
              <span className="text-[12px] font-bold tracking-tighter text-slate-800 uppercase">FINAI</span>
            </div>
            <p className="text-[11px] font-bold text-slate-400">© 2026 FinAI Ledger. Built for personal privacy.</p>
            <div className="flex items-center gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <Link href="#" className="hover:text-slate-800">Privacy</Link>
              <Link href="#" className="hover:text-slate-800">Twitter</Link>
            </div>
         </div>
      </footer>
    </div>
  );
}
