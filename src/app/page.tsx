"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Wallet, 
  Sparkles, 
  Shield, 
  Zap,
  LayoutDashboard,
  CheckCircle2,
  Lock,
  Search,
  PieChart,
  Target
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#111827] font-sunflower selection:bg-[#2563EB]/10 selection:text-[#2563EB]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-lg border-b border-slate-100 px-6 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer transition-transform active:scale-95">
            <div className="w-8 h-8 bg-[#2563EB] rounded-[8px] flex items-center justify-center rotate-3 transition-transform group-hover:rotate-0">
              <Wallet className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-unbounded font-black tracking-tighter text-slate-800 uppercase">FINAI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[13px] font-bold text-slate-500">
            <Link href="#features" className="hover:text-[#2563EB] transition-colors">How it works</Link>
            <Link href="#security" className="hover:text-[#2563EB] transition-colors">My Security</Link>
            <Link href="/dashboard" className="px-5 py-2.5 bg-[#2563EB] text-white rounded-[10px] font-black uppercase tracking-widest text-[11px] shadow-lg shadow-blue-500/20 hover:bg-[#1D4ED8] transition-all hover:scale-105 active:scale-95">
              Launch My Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-transparent">
        <div className="max-w-[1000px] mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-8 animate-fade-in-up">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest">Neural Personal Ledger</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-unbounded font-black tracking-tighter text-slate-900 mb-8 leading-[1.1]">
            Own Your Money <br/>
            With <span className="text-[#2563EB]">Neural Insight</span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-500 max-w-[600px] mx-auto mb-12 font-medium leading-relaxed">
            The private, individual finance hub that understands your natural language. Log, track, and save in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/dashboard" className="w-full sm:w-auto px-10 py-5 bg-[#2563EB] text-white rounded-[14px] font-black uppercase tracking-[0.1em] text-[13px] flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/30 hover:bg-[#1D4ED8] transition-all hover:-translate-y-1 active:translate-y-0">
              Start My Ledger <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 bg-white text-slate-800 border border-slate-200 rounded-[14px] font-black uppercase tracking-[0.1em] text-[13px] hover:bg-slate-50 transition-all">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Product Mockup Preview */}
        <div className="max-w-[1100px] mx-auto mt-24 relative px-4">
           <div className="bg-white rounded-[24px] border border-slate-200 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] p-3 relative group">
              <div className="absolute inset-0 bg-[#2563EB]/5 rounded-[24px] blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-slate-50 rounded-[18px] border border-slate-100 overflow-hidden">
                 <div className="h-10 bg-white border-b border-slate-200 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                       <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="mx-auto bg-slate-100 rounded-[6px] px-3 py-1 text-[9px] font-bold text-slate-400 flex items-center gap-2">
                       <Lock className="w-2.5 h-2.5" /> my-finai-ledger.local
                    </div>
                 </div>
                 <div className="p-8 space-y-6 opacity-60 grayscale-[0.5] contrast-[0.9]">
                    <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                       <div className="flex flex-col gap-1">
                          <div className="h-2 w-20 bg-slate-200 rounded-full"></div>
                          <div className="h-4 w-32 bg-slate-300 rounded-full"></div>
                       </div>
                       <div className="h-10 w-40 bg-blue-100 rounded-[10px]"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                       <div className="h-24 bg-white border border-slate-200 rounded-[16px]"></div>
                       <div className="h-24 bg-white border border-slate-200 rounded-[16px]"></div>
                       <div className="h-24 bg-white border border-slate-200 rounded-[16px]"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y border-slate-50">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Personal Security Assured</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 grayscale opacity-40">
             <div className="flex items-center gap-3">
               <Shield className="w-5 h-5" /> <span className="text-[14px] font-black uppercase tracking-tight">End-to-End Private</span>
             </div>
             <div className="flex items-center gap-3">
               <Lock className="w-5 h-5" /> <span className="text-[14px] font-black uppercase tracking-tight">AES-256 Storage</span>
             </div>
             <div className="flex items-center gap-3">
               <Zap className="w-5 h-5" /> <span className="text-[14px] font-black uppercase tracking-tight">Instant Sync</span>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-24">
             <h2 className="text-3xl md:text-5xl font-unbounded font-black tracking-tighter text-slate-900 mb-6">Built for Individual Clarity</h2>
             <p className="text-slate-500 font-medium max-w-[500px] mx-auto">Why struggle with spreadsheets when you can just type what you spent?</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Search, 
                title: "Neural Parsing", 
                desc: "Talk to your bank like a friend. Just type '500 for grocery' and we handle the rest." 
              },
              { 
                icon: PieChart, 
                title: "Personal Insights", 
                desc: "Get deep visibility into your spending trends without manual categorization." 
              },
              { 
                icon: Target, 
                title: "Saving Goals", 
                desc: "Set and track smart goals. Our AI helps you find ways to save faster." 
              },
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

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-[1000px] mx-auto bg-[#2563EB] rounded-[32px] p-12 md:p-20 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 blur-[100px] rounded-full"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full"></div>
           
           <h2 className="text-4xl md:text-6xl font-unbounded font-black tracking-tighter text-white mb-8 relative z-10 leading-[1.2]">
             Start Your Journey <br/> To Financial Freedom
           </h2>
           <p className="text-blue-100 text-lg mb-12 relative z-10 font-medium">No organizations. No teams. Just you and your progress.</p>
           
           <Link href="/dashboard" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#2563EB] rounded-[14px] font-black uppercase tracking-widest text-[13px] hover:bg-blue-50 transition-all hover:scale-105 shadow-xl relative z-10">
             Launch My Ledger Now
           </Link>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-slate-100">
         <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2.5 grayscale opacity-60">
              <div className="w-6 h-6 bg-slate-800 rounded-[6px] flex items-center justify-center">
                <Wallet className="text-white w-4 h-4" />
              </div>
              <span className="text-[12px] font-unbounded font-black tracking-tighter text-slate-800 uppercase">FINAI</span>
            </div>
            <p className="text-[11px] font-bold text-slate-400">© 2026 FinAI Ledger. Built for personal privacy.</p>
            <div className="flex items-center gap-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <Link href="#" className="hover:text-slate-800">Privacy</Link>
              <Link href="#" className="hover:text-slate-800">Twitter</Link>
            </div>
         </div>
      </footer>
    </div>
  );
}
