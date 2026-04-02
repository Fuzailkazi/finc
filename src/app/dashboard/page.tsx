"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { 
  Wallet, 
  Search, 
  Trash2,
  Check,
  X,
  Sparkles,
  LogOut,
  ChevronRight,
  Activity,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

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
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'confirming'>('idle');
  const [pendingExpense, setPendingExpense] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<'all' | 'april' | 'march'>('all');
  const [error, setError] = useState<string | null>(null);
  
  // New states for Dual Mode & Insights
  const [isManual, setIsManual] = useState(false);
  const [insights, setInsights] = useState<{ insights: string[], tip: string } | null>(null);
  const [isAnalyzingInsights, setIsAnalyzingInsights] = useState(false);

  const fetchExpenses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError("Failed to load expenses.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
       const timer = setTimeout(() => setError(null), 5000);
       return () => clearTimeout(timer);
    }
  }, [error]);

  const filteredExpenses = useMemo(() => {
    if (activeFilter === 'all') return expenses;
    return expenses.filter(exp => {
      const month = exp.expense_date.split('-')[1];
      if (activeFilter === 'april') return month === '04';
      if (activeFilter === 'march') return month === '03';
      return true;
    });
  }, [expenses, activeFilter]);

  const groupedExpenses = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredExpenses.forEach(exp => {
      const date = exp.expense_date;
      if (!groups[date]) groups[date] = [];
      groups[date].push(exp);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredExpenses]);

  const stats = useMemo(() => {
    const total = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const categoryTotals: Record<string, number> = {};
    filteredExpenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + Number(exp.amount);
    });
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCategories[0]?.[0] || "None";
    
    return {
      total: `₹${total.toLocaleString()}`,
      topCategory: topCategory.charAt(0).toUpperCase() + topCategory.slice(1),
      breakdown: sortedCategories.slice(0, 5),
    };
  }, [filteredExpenses]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setInput("");
    setStatus('analyzing');
    setError(null);
    setIsManual(false); // Reset fallback state
    
    // Create a 5-second timeout promise
    let timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("AL_TIMEOUT")), 5000)
    );

    try {
      // Race the API call against the 5s timeout
      const parsePromise = fetch('/api/parse-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: trimmedInput }),
      }).then(res => res.json());

      const result = await Promise.race([parsePromise, timeoutPromise]) as any;
      
      if (result.success) {
        setPendingExpense({
          amount: result.data.amount || 0,
          category: result.data.category || 'other',
          description: result.data.description || trimmedInput,
          expense_date: result.data.date || new Date().toISOString().split('T')[0],
          raw_input: trimmedInput,
        });
        setIsManual(false);
      } else {
        // AI failed quietly, fallback to manual
        setPendingExpense({
          amount: '',
          category: 'other',
          description: trimmedInput,
          expense_date: new Date().toISOString().split('T')[0],
          raw_input: trimmedInput,
        });
        setIsManual(true);
      }
      setStatus('confirming');
    } catch (err: any) {
      console.warn("AI Processing Cutoff:", err.message);
      // Timeout or Fetch error: Switch to Manual mode silently
      setPendingExpense({
        amount: '',
        category: 'other',
        description: trimmedInput,
        expense_date: new Date().toISOString().split('T')[0],
        raw_input: trimmedInput,
      });
      setIsManual(true);
      setStatus('confirming');
    }
  };

  const analyzeSpending = async () => {
    if (expenses.length === 0) return;
    setIsAnalyzingInsights(true);
    try {
      const response = await fetch('/api/analyze-spending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expenses: expenses.slice(0, 50) }), // Send recent 50
      });
      const result = await response.json();
      if (result.success) {
        setInsights(result.data);
      }
    } catch (err) {
      console.error("Insights generation failed");
    } finally {
      setIsAnalyzingInsights(false);
    }
  };

  const handleConfirm = async () => {
    try {
      const { error } = await supabase
        .from('expenses')
        .insert([pendingExpense]);

      if (error) throw error;
      
      setStatus('idle');
      setPendingExpense(null);
      setIsEditing(false);
      fetchExpenses(); // Refetch after insert
    } catch (err: any) {
      setError(`Database Error: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    setRemovingIds(prev => new Set(prev).add(id));
    
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTimeout(() => {
         setExpenses(prev => prev.filter(e => e.id !== id));
         setRemovingIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
         });
      }, 400); 
    } catch (err: any) {
      setError(`Delete Failed: ${err.message}`);
      setRemovingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sunflower selection:bg-blue-100">
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
            <Wallet className="text-white w-4 h-4" />
          </div>
          <span className="font-unbounded font-black tracking-tight text-slate-800 uppercase text-sm">Expense Tracker</span>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </header>

      <main className="max-w-[700px] mx-auto px-4 py-12">
        {/* INPUT BAR */}
        <section className="mb-12">
          <form onSubmit={handleSubmit} className="relative">
            <div className={`p-4 bg-white rounded-3xl border ${error ? 'border-rose-200 shadow-rose-100' : 'border-slate-100 shadow-xl shadow-slate-200/50'} transition-all flex items-center gap-4`}>
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input 
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (error) setError(null);
                    }}
                    disabled={status !== 'idle'}
                    className="w-full pl-12 pr-4 py-4 text-[16px] font-medium bg-transparent focus:outline-none placeholder:text-slate-300"
                    placeholder="spent 500 on dinner with team..."
                  />
                </div>
                <button 
                  disabled={status !== 'idle' || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-300 text-white font-black uppercase text-[11px] tracking-[0.2em] px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                  {status === 'analyzing' ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit"}
                </button>
            </div>
            {error && (
              <div className="absolute top-full mt-4 left-0 right-0 bg-rose-600 text-white text-[12px] font-black px-6 py-4 rounded-2xl animate-fade-in flex items-center gap-3 shadow-xl z-[100]">
                 <div className="bg-white/20 p-1 rounded-lg">
                    <X className="w-4 h-4 cursor-pointer" onClick={() => setError(null)} />
                 </div>
                 <div className="flex-1">
                    <p className="uppercase tracking-widest text-[9px] opacity-70 mb-0.5">System Alert</p>
                    {error}
                 </div>
              </div>
            )}
          </form>
        </section>

        {/* AI CONFIRMATION CARD */}
        <div className={`transition-all duration-700 overflow-hidden ${status === 'idle' ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100 mb-12'}`}>
           {status === 'analyzing' && (
              <div className="bg-white border-2 border-dashed border-blue-100 rounded-3xl p-10 flex flex-col items-center justify-center text-center animate-pulse gap-4">
                 <Sparkles className="w-10 h-10 text-blue-600 animate-spin-slow" />
                 <div>
                    <h4 className="text-[15px] font-bold text-slate-800">Understanding your expense...</h4>
                    <p className="text-[12px] text-slate-400 font-medium">Analyzing patterns via Gemini 2.0 Flash</p>
                 </div>
              </div>
           )}

           {status === 'confirming' && pendingExpense && (
              <div className="bg-white border-2 border-blue-600 rounded-3xl p-8 shadow-2xl relative animate-fade-in-up">
                 <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 ${isManual ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'} rounded-full flex items-center justify-center`}>
                        {isManual ? <Search className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                      </div>
                      <h4 className={`text-[11px] font-black uppercase tracking-widest ${isManual ? 'text-amber-600' : 'text-blue-600'}`}>
                        {isManual ? "Manual Form" : "✨ AI Assisted"}
                      </h4>
                    </div>
                    {isManual && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">AI was slow/failed</p>}
                 </div>

                 <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="col-span-1">
                       <label className="text-[9px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest">Amount (₹)</label>
                       <input 
                         className="w-full px-5 py-4 bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white transition-all rounded-2xl text-[18px] font-unbounded font-black text-slate-800" 
                         value={pendingExpense.amount} 
                         placeholder="0"
                         onChange={(e) => setPendingExpense({...pendingExpense, amount: e.target.value})} 
                         type="number" 
                       />
                    </div>
                    <div className="col-span-1">
                       <label className="text-[9px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest">Category</label>
                       <select 
                         className="w-full px-5 py-[18px] bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white transition-all rounded-2xl text-[14px] font-black uppercase tracking-tight appearance-none" 
                         value={pendingExpense.category} 
                         onChange={(e) => setPendingExpense({...pendingExpense, category: e.target.value})}
                       >
                          {Object.keys(categoryConfig).map(cat => (
                            <option key={cat} value={cat}>{categoryConfig[cat].emoji} {cat.toUpperCase()}</option>
                          ))}
                       </select>
                    </div>
                    <div className="col-span-2">
                       <label className="text-[9px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest">Description</label>
                       <input 
                         className="w-full px-5 py-4 bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white transition-all rounded-2xl text-[14px] font-bold text-slate-600" 
                         value={pendingExpense.description} 
                         onChange={(e) => setPendingExpense({...pendingExpense, description: e.target.value})} 
                         placeholder="What was this for?"
                       />
                    </div>
                    <div className="col-span-2">
                       <label className="text-[9px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest">Date</label>
                       <input 
                         type="date"
                         className="w-full px-5 py-4 bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white transition-all rounded-2xl text-[14px] font-black" 
                         value={pendingExpense.expense_date} 
                         onChange={(e) => setPendingExpense({...pendingExpense, expense_date: e.target.value})} 
                       />
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    <button 
                      onClick={handleConfirm} 
                      disabled={!pendingExpense.amount || !pendingExpense.category}
                      className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-300 text-white font-black uppercase text-[11px] tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                       <Check className="w-4 h-4" /> Save Expense
                    </button>
                    <button 
                      onClick={() => { setStatus('idle'); setPendingExpense(null); }} 
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black uppercase text-[11px] tracking-widest py-5 rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                       Cancel
                    </button>
                 </div>
              </div>
           )}
        </div>

        {/* STAT CARDS */}
        <section className="grid grid-cols-2 gap-4 mb-10">
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                 <p className="text-[9px] font-black uppercase text-slate-400 mb-1">This Month</p>
                 <h3 className="text-2xl font-unbounded font-black text-blue-600 tracking-tighter">
                   {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.total}
                 </h3>
              </div>
              <div className="mt-4 flex gap-1.5">
                 {stats.breakdown.map(([cat]) => (
                   <div key={cat} className={`w-2 h-2 rounded-full ${categoryConfig[cat]?.dot || 'bg-slate-200'}`} title={cat} />
                 ))}
              </div>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Top Category</p>
              <div className="flex items-center gap-3">
                 {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-200" />
                 ) : (
                    <>
                      <span className="text-2xl">{categoryConfig[stats.topCategory.toLowerCase()]?.emoji || '📌'}</span>
                      <h3 className="text-xl font-unbounded font-black text-slate-800 tracking-tighter uppercase">{stats.topCategory}</h3>
                    </>
                 )}
              </div>
           </div>
        </section>

        {/* EXPENSE LIST */}
        <section>
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" /> My Activity
             </h2>
             <div className="flex bg-slate-100 p-1 rounded-xl">
                 {['all', 'april', 'march'].map((f) => (
                   <button
                     key={f}
                     onClick={() => setActiveFilter(f as any)}
                     className={`px-4 py-2 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all ${
                       activeFilter === f 
                       ? "bg-white text-blue-600 shadow-sm" 
                       : "text-slate-400 hover:text-slate-600"
                     }`}
                   >
                     {f === 'all' ? 'All' : f}
                   </button>
                 ))}
             </div>
          </div>

          <div className="space-y-10">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center py-20 text-slate-200">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                  <p className="text-[11px] font-black uppercase tracking-widest">Connecting to Supabase...</p>
               </div>
            ) : groupedExpenses.length > 0 ? (
              groupedExpenses.map(([date, dateExpenses]) => (
                <div key={date}>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-blue-600 pl-3 mb-6">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>
                  <div className="space-y-4">
                    {dateExpenses.map((item) => {
                      const isRemoving = removingIds.has(item.id);
                      const cfg = categoryConfig[item.category] || categoryConfig.other;
                      return (
                        <div key={item.id} className={`group bg-white p-5 rounded-2xl border border-slate-50 transition-all duration-300 flex items-center gap-4 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 ${isRemoving ? 'opacity-0 scale-95 translate-y-2' : ''}`}>
                          <div className={`w-12 h-12 ${cfg.bg} rounded-xl flex items-center justify-center text-xl`}>
                            {cfg.emoji}
                          </div>
                          <div className="flex-1">
                            <p className="text-[14px] font-bold text-slate-800 leading-tight">{item.description}</p>
                            <p className="text-[10px] text-slate-300 font-medium italic mt-0.5">"{item.raw_input}"</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[15px] font-unbounded font-black text-slate-900">₹{Number(item.amount).toLocaleString()}</p>
                            <button 
                               onClick={() => handleDelete(item.id)}
                               className="text-slate-200 hover:text-rose-500 p-1.5 transition-colors opacity-0 group-hover:opacity-100 mt-1"
                            >
                               <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center animate-fade-in bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                  <div className="text-5xl mb-6 grayscale opacity-40">📝</div>
                  <h5 className="text-[13px] font-black tracking-widest text-slate-400 uppercase mb-2">No data recorded</h5>
                  <p className="text-[12px] text-slate-300 font-medium max-w-[200px]">Submit an expense above to get started.</p>
                </div>
            )}
          </div>
        </section>

        {/* AI INSIGHTS SECTION */}
        <section className="mt-20 border-t border-slate-100 pt-12 mb-20">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-[15px] font-unbounded font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                  <Sparkles className="w-5 h-5 text-blue-600" /> AI Insights
                </h2>
                <p className="text-[11px] text-slate-400 font-medium mt-1">Deep analysis of your spending patterns</p>
              </div>
              <button 
                onClick={analyzeSpending}
                disabled={isAnalyzingInsights || expenses.length === 0}
                className="bg-white border border-slate-200 hover:border-blue-300 text-blue-600 font-black uppercase text-[10px] tracking-widest px-6 py-3 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                {isAnalyzingInsights ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Analyze Trends"}
              </button>
           </div>

           {insights ? (
              <div className="bg-[#2563EB] rounded-[32px] p-8 text-white shadow-2xl shadow-blue-900/20 animate-fade-in-up relative overflow-hidden">
                 {/* Decorative background element */}
                 <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                 
                 <div className="relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Top Observations</p>
                          <ul className="space-y-4">
                             {insights.insights.map((insight, idx) => (
                               <li key={idx} className="flex gap-4 items-start">
                                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black shrink-0">{idx + 1}</span>
                                  <p className="text-[14px] font-bold leading-relaxed">{insight}</p>
                               </li>
                             ))}
                          </ul>
                       </div>
                       
                       <div className="bg-white/10 rounded-[28px] p-6 border border-white/10 flex flex-col justify-between h-full">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-4">Golden Saving Tip</p>
                            <p className="text-[20px] font-unbounded font-black leading-tight tracking-tight">
                              {insights.tip}
                            </p>
                          </div>
                          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                             <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Powered by Gemini</span>
                             <div className="w-8 h-8 bg-white text-blue-600 rounded-lg flex items-center justify-center font-black">AI</div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           ) : (
             <div className="bg-slate-50 rounded-[32px] p-12 text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 text-[13px] font-black uppercase tracking-widest">No analysis available</p>
                <p className="text-slate-300 text-[12px] font-medium mt-2">Click the button above to discover patterns.</p>
             </div>
           )}
        </section>
      </main>

      <style jsx global>{`
        .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
