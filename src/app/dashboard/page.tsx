"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Wallet, 
  Search, 
  Bell, 
  Plus, 
  ArrowUpRight, 
  Trash2,
  Calendar,
  ChevronRight,
  TrendingDown,
  Activity,
  LogOut,
  Settings,
  Check,
  Edit2,
  X,
  Sparkles,
  Target,
  Banknote,
  PiggyBank,
  CreditCard
} from "lucide-react";

// Initial mock data
const initialExpenses = [
  { id: '1', amount: 500, category: 'food', description: 'Dinner with friends', expense_date: '2026-04-02', raw_input: 'spent 500 on dinner with friends' },
  { id: '2', amount: 300, category: 'transport', description: 'Uber to home', expense_date: '2026-04-02', raw_input: '300 on uber' },
  { id: '3', amount: 1200, category: 'shopping', description: 'New sneakers', expense_date: '2026-04-01', raw_input: 'bought sneakers for 1200' },
  { id: '4', amount: 150, category: 'food', description: 'Coffee at Starbucks', expense_date: '2026-04-01', raw_input: '150 on coffee' },
  { id: '5', amount: 2000, category: 'bills', description: 'Electricity Bill', expense_date: '2026-03-31', raw_input: 'electricity of 2000' },
];

const categoryConfig: Record<string, { emoji: string, bg: string, text: string, border: string, dot: string }> = {
  food: { emoji: "🍔", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-100", dot: "bg-orange-500" },
  transport: { emoji: "🚕", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100", dot: "bg-blue-500" },
  shopping: { emoji: "🛍️", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100", dot: "bg-purple-500" },
  entertainment: { emoji: "🎬", bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-100", dot: "bg-pink-500" },
  bills: { emoji: "📄", bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-400" },
  health: { emoji: "💊", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", dot: "bg-emerald-500" },
  education: { emoji: "📚", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-100", dot: "bg-indigo-500" },
  work: { emoji: "💼", bg: "bg-slate-100", text: "text-slate-800", border: "border-slate-200", dot: "bg-slate-600" },
  other: { emoji: "📌", bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-200", dot: "bg-slate-300" },
};

export default function Dashboard() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'confirming'>('idle');
  const [pendingExpense, setPendingExpense] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<'all' | 'april' | 'march'>('all');

  const filteredExpenses = useMemo(() => {
    if (activeFilter === 'all') return expenses;
    return expenses.filter(exp => {
      const month = exp.expense_date.split('-')[1];
      if (activeFilter === 'april') return month === '04';
      if (activeFilter === 'march') return month === '03';
      return true;
    });
  }, [expenses, activeFilter]);

  const stats = useMemo(() => {
    const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryTotals: Record<string, number> = {};
    filteredExpenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCategories[0]?.[0] || "None";
    
    return {
      total: `₹${total.toLocaleString()}`,
      topCategory: topCategory.charAt(0).toUpperCase() + topCategory.slice(1),
      transactions: filteredExpenses.length,
      breakdown: sortedCategories.slice(0, 4),
    };
  }, [filteredExpenses]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setStatus('analyzing');
    
    setTimeout(() => {
      setPendingExpense({
        id: Math.random().toString(36).substr(2, 9),
        amount: 500,
        category: 'food',
        description: 'Dinner with friends',
        expense_date: '2026-04-02',
        raw_input: input,
      });
      setStatus('confirming');
    }, 1500);
  };

  const handleConfirm = () => {
    setExpenses([pendingExpense, ...expenses]);
    setStatus('idle');
    setPendingExpense(null);
    setInput("");
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    setRemovingIds(prev => new Set(prev).add(id));
    setTimeout(() => {
      setExpenses(prev => prev.filter(e => e.id !== id));
      setRemovingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 400); // Animation duration
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-[#111827] font-sunflower overflow-hidden">
      {/* Sidebar - Personal Focus */}
      <aside className="w-[260px] hidden md:flex flex-col border-r border-[#E5E7EB] bg-white">
        <div className="px-6 pt-2 pb-6">
          <div className="flex items-center gap-3 mb-6 px-2 cursor-pointer transition-transform active:scale-95">
            <div className="w-8 h-8 bg-[#2563EB] rounded-[8px] flex items-center justify-center">
              <Wallet className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-unbounded font-black tracking-tighter text-slate-800 uppercase">FINAI</span>
          </div>

          <nav className="space-y-1 font-medium tracking-tight">
            {[
              { icon: LayoutDashboard, label: "My Overview", active: true },
              { icon: Activity, label: "Spend Timeline" },
              { icon: Target, label: "Saving Goals" },
              { icon: Banknote, label: "Subscription Tracker" },
              { icon: CreditCard, label: "My Accounts" },
              { icon: PiggyBank, label: "Budget Planner" },
              { icon: Settings, label: "Preferences" },
            ].map((item, i) => (
              <button 
                key={i} 
                className={`flex items-center w-full px-3 py-2.5 rounded-[10px] text-[13px] transition-all group ${
                  item.active 
                  ? "bg-slate-50 text-[#2563EB] font-bold" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <item.icon className="w-[18px] h-[18px] mr-3 opacity-40 group-hover:opacity-80" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Individual Profile */}
        <div className="mt-auto p-4 border-t border-[#E5E7EB]">
           <div className="p-3 bg-slate-50 rounded-[12px] border border-slate-100 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-black">FK</div>
                 <div className="min-w-0">
                    <p className="text-[12px] font-bold truncate">Fuzail Kazi</p>
                    <p className="text-[9px] text-[#2563EB] font-black uppercase tracking-widest">Personal Pro</p>
                 </div>
              </div>
           </div>
           <button className="flex items-center gap-2.5 w-full px-3 py-4 text-[12px] font-bold text-slate-400 hover:text-slate-800 transition-colors mt-2">
              <LogOut className="w-4 h-4 opacity-40" />
              Sign out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] px-8 py-2.5 flex items-center justify-between gap-8">
           <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#2563EB]/40">PERSONAL LEDGER</span>
              <h1 className="text-xl font-unbounded font-black tracking-tight text-slate-800">My Financial Hub</h1>
           </div>
           
           <form onSubmit={handleSubmit} className="flex items-center gap-4 flex-1 max-w-[500px] mx-10">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={status !== 'idle'}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-[#E5E7EB] rounded-[12px] text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-[#2563EB]/40 transition-all placeholder:text-slate-400"
                  placeholder="Quick add: 'spent 50 for coffee'..."
                />
              </div>
           </form>
           
           <div className="flex items-center gap-3">
             <button className="p-3 text-slate-400 hover:text-[#2563EB] transition-colors bg-white border border-slate-100 rounded-[12px] shadow-sm relative">
               <Bell className="w-[18px] h-[18px]" />
               <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white"></span>
             </button>
           </div>
        </div>

        <div className="px-8 pt-6 pb-8 lg:px-12 lg:pt-8 lg:pb-12 max-w-[1300px]">
          {/* Confirmation Flow */}
          <div className={`transition-all duration-500 overflow-hidden ${status === 'idle' ? 'max-h-0 opacity-0 mb-0' : 'max-h-[350px] opacity-100 mb-12'}`}>
             {status === 'analyzing' && (
                <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-8 shadow-xl animate-pulse flex items-center gap-6">
                   <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[#2563EB] animate-spin-slow" />
                   </div>
                   <div>
                      <h4 className="text-[14px] font-bold text-slate-800">Understanding your expense...</h4>
                      <p className="text-[12px] text-slate-400 font-medium">FinAI is parsing your natural language input.</p>
                   </div>
                </div>
             )}

             {status === 'confirming' && pendingExpense && (
                <div className="bg-white border-2 border-[#2563EB] rounded-[20px] p-8 shadow-2xl relative animate-fade-in-up">
                   <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                            <Check className="w-6 h-6" />
                         </div>
                         <div>
                            <h4 className="text-[15px] font-unbounded font-black tracking-tight text-slate-800 uppercase">Verification Required</h4>
                            <p className="text-[12px] text-slate-400 font-bold">Transaction Date: Today</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-[10px] text-[11px] font-black uppercase text-slate-600 transition-colors">
                            {isEditing ? "Cancel" : "Edit"}
                         </button>
                         <button onClick={handleConfirm} className="flex items-center gap-2 px-10 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[10px] text-[11px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                            Confirm
                         </button>
                      </div>
                   </div>

                   {isEditing ? (
                      <form className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-slate-50 rounded-[16px] border border-slate-100">
                         <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-[#2563EB]">Amount</label>
                            <input className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-[10px] text-[14px] font-bold outline-none ring-blue-500/20 focus:ring-4" value={pendingExpense.amount} onChange={(e) => setPendingExpense({...pendingExpense, amount: Number(e.target.value)})} type="number" />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-[#2563EB]">Category</label>
                            <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-[10px] text-[14px] font-bold outline-none ring-blue-500/20 focus:ring-4" value={pendingExpense.category} onChange={(e) => setPendingExpense({...pendingExpense, category: e.target.value})}>
                               {Object.keys(categoryConfig).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                         </div>
                         <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-[#2563EB]">What did you buy?</label>
                            <input className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-[10px] text-[14px] font-bold outline-none ring-blue-500/20 focus:ring-4" value={pendingExpense.description} onChange={(e) => setPendingExpense({...pendingExpense, description: e.target.value})} />
                         </div>
                      </form>
                   ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="p-5 bg-slate-50 rounded-[16px] border border-slate-100">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">My Spend</p>
                            <p className="text-2xl font-unbounded font-black text-[#2563EB]">₹{pendingExpense.amount.toLocaleString()}</p>
                         </div>
                         <div className="p-5 bg-slate-50 rounded-[16px] border border-slate-200/50">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Category Map</p>
                            <div className="flex items-center gap-3">
                               <span className="text-2xl">{categoryConfig[pendingExpense.category]?.emoji}</span>
                               <span className="text-[14px] font-black text-slate-800 uppercase tracking-tight">{pendingExpense.category}</span>
                            </div>
                         </div>
                         <div className="p-5 bg-slate-50 rounded-[16px] border border-slate-100">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">My Description</p>
                            <p className="text-[14px] font-bold text-slate-600 line-clamp-2 italic">"{pendingExpense.description}"</p>
                         </div>
                      </div>
                   )}
                </div>
             )}
          </div>

          {/* Personal Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: "My Spent this Month", value: stats.total, indicator: "+4% vs Last Mo", color: "text-[#2563EB]", showBreakdown: true },
              { label: "Most Frequency", value: stats.topCategory, indicator: "Current Peak", color: "text-[#F97316]" },
              { label: "My Transaction Ledger", value: stats.transactions, indicator: "Synced", color: "text-emerald-600" },
              { label: "Account Health", value: "Excellent", indicator: "Secure", color: "text-slate-800" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[20px] border border-[#E5E7EB] shadow-sm hover:border-[#2563EB]/40 transition-all flex flex-col justify-between group">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-2">{stat.label}</p>
                  <div className="flex items-baseline gap-3">
                    <h3 className={`text-2xl font-unbounded font-black tracking-tighter ${stat.color}`}>{stat.value}</h3>
                  </div>
                </div>
                
                {stat.showBreakdown ? (
                  <div className="mt-6 flex flex-wrap gap-2.5 pt-4 border-t border-slate-100">
                    {stats.breakdown.map(([cat, val]) => {
                      const cfg = categoryConfig[cat] || categoryConfig.other;
                      return (
                        <div key={cat} className="flex items-center gap-2" title={`${cat}: ₹${val.toLocaleString()}`}>
                          <div className={`w-2 h-2 rounded-full ${cfg.dot} shadow-sm`}></div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{cat.slice(0, 3)}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-6 flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-slate-50 rounded-full overflow-hidden">
                       <div className={`h-full ${i === 1 ? 'bg-[#F97316]' : i === 2 ? 'bg-emerald-500' : 'bg-slate-200'} w-[65%]`}></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* Activity Ledger */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <section className="xl:col-span-2 bg-white rounded-[20px] border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col h-full min-h-[600px]">
              <div className="px-8 py-6 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white">
                <div className="flex items-center gap-3">
                   <Activity className="w-5 h-5 text-[#2563EB]" />
                   <h4 className="text-[14px] font-unbounded font-black tracking-tight text-slate-800 uppercase">My Recent Expenses</h4>
                </div>
                
                {/* Month/Year Filter */}
                <div className="flex bg-slate-100 p-1 rounded-[10px] border border-slate-200 self-start sm:self-auto">
                   {[
                     { id: 'all', label: 'All Time' },
                     { id: 'april', label: 'April 2026' },
                     { id: 'march', label: 'March 2026' }
                   ].map((f) => (
                     <button
                        key={f.id}
                        onClick={() => setActiveFilter(f.id as any)}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-[8px] transition-all ${
                          activeFilter === f.id 
                          ? "bg-white text-[#2563EB] shadow-sm" 
                          : "text-slate-400 hover:text-slate-600"
                        }`}
                     >
                        {f.label}
                     </button>
                   ))}
                </div>
              </div>

              <div className="flex-1 overflow-x-auto relative">
                {filteredExpenses.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 sticky top-0 z-10">
                      <tr className="border-b border-[#E5E7EB]">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredExpenses.map((item) => {
                        const cfg = categoryConfig[item.category] || categoryConfig.other;
                        const isRemoving = removingIds.has(item.id);
                        return (
                          <tr key={item.id} className={`group hover:bg-slate-50/70 transition-all duration-300 ${isRemoving ? 'opacity-0 scale-95 -translate-y-4 pointer-events-none' : 'opacity-100'}`}>
                            <td className="px-8 py-6">
                               <p className="text-[14px] font-bold text-slate-800">{item.description}</p>
                               <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic opacity-60">Input: "{item.raw_input}"</p>
                            </td>
                            <td className="px-8 py-6">
                               <span className={`inline-flex items-center gap-2 px-3 py-1 pr-3.5 rounded-full text-[11px] font-black uppercase tracking-tighter border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                 <span className="text-[14px]">{cfg.emoji}</span>
                                 {item.category}
                               </span>
                            </td>
                            <td className="px-8 py-6 text-right font-unbounded">
                               <p className="text-[16px] font-black text-slate-900 tracking-tighter">₹{item.amount.toLocaleString()}</p>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <button 
                                 onClick={() => handleDelete(item.id)}
                                 className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                               >
                                 <Trash2 className="w-4 h-4" />
                               </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  /* Empty State */
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center animate-fade-in">
                    <div className="text-6xl mb-6 grayscale h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-inner">📝</div>
                    <h5 className="text-[15px] font-unbounded font-black tracking-tight text-slate-800 uppercase mb-2">No expenses yet</h5>
                    <p className="text-[13px] text-slate-400 font-medium max-w-[280px]">Start by typing one in the command bar above.</p>
                  </div>
                )}
              </div>
              
              {filteredExpenses.length > 0 && (
                <div className="px-8 py-6 bg-slate-50/30 border-t border-[#E5E7EB] text-center mt-auto">
                   <button className="text-[13px] font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors flex items-center gap-2 mx-auto uppercase tracking-widest">
                      Export Ledger Summary <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
              )}
            </section>

            {/* Side Logic */}
            <section className="space-y-8">
               <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-sm p-8">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-8">Personal Goals Progress</h4>
                  <div className="space-y-8">
                     {[
                       { label: "Emergency Fund", val: "₹1.4L / 2L", prog: 70, color: "bg-[#2563EB]" },
                       { label: "New Tech Setup", val: "₹45k / 1.2L", prog: 38, color: "bg-purple-500" },
                       { label: "Vacation Fund", val: "₹20k / 80k", prog: 25, color: "bg-emerald-500" },
                     ].map((m, i) => (
                       <div key={i} className="group cursor-default">
                          <div className="flex justify-between items-center mb-3">
                             <p className="text-[12px] font-bold text-slate-800 tracking-tight">{m.label}</p>
                             <p className="text-[11px] font-black text-[#2563EB] opacity-60 uppercase tracking-tighter">{m.val}</p>
                          </div>
                          <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                             <div className={`h-full ${m.color} transition-all duration-1000 shadow-lg`} style={{ width: `${m.prog || 0}%` }}></div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="p-8 bg-blue-50 rounded-[20px] border border-blue-100 shadow-lg shadow-blue-500/5">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                        <PiggyBank className="w-5 h-5" />
                     </div>
                     <div>
                        <h5 className="text-[12px] font-black uppercase tracking-widest text-[#2563EB]">Saving Insight</h5>
                     </div>
                  </div>
                  <p className="text-[13px] text-[#2563EB]/80 font-medium leading-relaxed">
                     You spent **32% more** on food this week compared to your average. Try setting a lunch budget for next week!
                  </p>
                  <button className="mt-6 w-full bg-[#2563EB] text-white font-black uppercase tracking-widest text-[11px] py-3 rounded-[12px] shadow-lg shadow-blue-500/20 hover:bg-[#1D4ED8] transition-all active:scale-95">
                     Create a Food Budget
                  </button>
               </div>
            </section>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
