import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Calendar, Coffee, Ghost, Play, Search, History as HistoryIcon, Bookmark, Terminal, Moon, RefreshCw, Send, X, Clock, Languages } from "lucide-react";
import { RecommendationCard, MoodSelector, type Recommendation } from "./components/ReeliefContent.tsx";

export default function App() {
  const [mood, setMood] = useState("exhausted");
  const [exhaustion, setExhaustion] = useState(7);
  const [vibe, setVibe] = useState("");
  const [preference, setPreference] = useState("any");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Recommendation[]>([]);
  const [watchlist, setWatchlist] = useState<Recommendation[]>([]);
  const [history, setHistory] = useState<Recommendation[]>([]);
  const [view, setView] = useState<"home" | "results" | "watchlist" | "history">("home");
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);

  // Load persistence
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("reelief_watchlist");
    const savedHistory = localStorage.getItem("reelief_history");
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const saveWatchlist = (newList: Recommendation[]) => {
    setWatchlist(newList);
    localStorage.setItem("reelief_watchlist", JSON.stringify(newList));
  };

  const getRecommendations = async () => {
    setLoading(true);
    setView("results");
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          mood, 
          exhaustion, 
          routine: "student/professional", // Generalized for MVP
          preference,
          vibe 
        }),
      });
      const data = await res.json();
      if (data.recommendations) {
        setResults(data.recommendations);
        const newHistory = [...data.recommendations, ...history].slice(0, 20);
        setHistory(newHistory);
        localStorage.setItem("reelief_history", JSON.stringify(newHistory));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = (rec: Recommendation) => {
    const exists = watchlist.find(w => w.title === rec.title);
    if (exists) {
      saveWatchlist(watchlist.filter(w => w.title !== rec.title));
    } else {
      saveWatchlist([...watchlist, rec]);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-[#f1f1f1] font-sans selection:bg-brand-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/60 backdrop-blur-3xl border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-10 h-28 flex items-center justify-between">
          <div className="flex items-center gap-6 cursor-pointer group" onClick={() => setView("home")}>
            <div className="w-12 h-12 bg-brand-primary rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-brand-primary/20 group-hover:scale-110 transition-transform">
              <Sparkles className="text-black" size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-black tracking-tighter uppercase italic -mb-1">
                Reelief
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-30">Weekend Curation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-10 text-[11px] uppercase tracking-[0.2em] font-black">
            <button 
              onClick={() => setView("home")}
              className={`hover:text-brand-primary transition-all ${view === 'home' ? 'text-brand-primary border-b-2 border-brand-primary pb-1' : 'opacity-50 hover:opacity-100'}`}
            >
              Discover
            </button>
            <button 
              onClick={() => setView("watchlist")}
              className={`flex items-center gap-2 hover:text-brand-primary transition-all ${view === 'watchlist' ? 'text-brand-primary border-b-2 border-brand-primary pb-1' : 'opacity-50 hover:opacity-100'}`}
            >
              <Bookmark size={14} /> The Reserve {watchlist.length > 0 && <span className="bg-brand-primary text-black px-2 py-0.5 rounded-full text-[9px] font-black">{watchlist.length}</span>}
            </button>
            <button 
              onClick={() => setView("history")}
              className={`hover:text-brand-primary transition-all ${view === 'history' ? 'text-brand-primary border-b-2 border-brand-primary pb-1' : 'opacity-50 hover:opacity-100'}`}
            >
              Archive
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto min-h-screen pt-28 flex flex-col md:flex-row">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col md:flex-row overflow-hidden"
            >
              {/* Sidebar: Input Area */}
              <section className="w-full md:w-[500px] border-r border-white/[0.05] p-16 flex flex-col justify-between">
                <div className="space-y-16">
                  <div className="space-y-4">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-brand-primary mb-4 font-black">Weekend Calibration</p>
                    <h2 className="text-7xl font-sans font-black leading-[0.9] tracking-tighter text-white">
                      Curate your <span className="text-brand-primary italic">Recovery</span>.
                    </h2>
                  </div>

                  <div className="space-y-12">
                    <div className="space-y-6">
                      <label className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40">Exhaustion Impact</label>
                      <div className="relative pt-4">
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          value={exhaustion} 
                          onChange={(e) => setExhaustion(parseInt(e.target.value))}
                          className="w-full accent-brand-primary bg-white/5 h-2 rounded-full appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mt-4">
                          <span className="opacity-30">Fresh</span>
                          <span className={exhaustion > 7 ? "text-brand-primary shadow-glow" : "opacity-30"}>{exhaustion > 7 ? "Critically Tired" : "Burned Out"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40">Emotional Resonance</label>
                      <MoodSelector current={mood} onChange={setMood} />
                    </div>

                    <div className="space-y-6">
                      <label className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40">The Vibe Prompt</label>
                      <textarea 
                        placeholder="e.g. Brain-dead at uni, need high-stakes escapes..."
                        value={vibe}
                        onChange={(e) => setVibe(e.target.value)}
                        className="input-field w-full h-32 resize-none text-base leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-16 flex flex-col gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Watch Format</label>
                    <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
                      {['any', 'Movie', 'Series'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setPreference(f)}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            preference === f 
                              ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/20' 
                              : 'text-white/40 hover:text-white'
                          }`}
                        >
                          {f === 'any' ? 'Mixed' : f === 'Movie' ? 'Films' : 'Series'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={getRecommendations}
                    disabled={loading}
                    className="btn-primary py-6 text-sm flex items-center justify-center gap-3 overflow-hidden group"
                  >
                    {loading ? (
                       <>
                         <RefreshCw className="animate-spin" size={20} />
                         <span>Calibrating Agent...</span>
                       </>
                    ) : (
                      <>
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        <span>Launch Weekend Scan</span>
                      </>
                    )}
                  </button>
                </div>
              </section>

              {/* Home Hero Content */}
              <section className="flex-1 p-24 relative overflow-hidden bg-gradient-to-br from-bg-dark via-[#1a1a24] to-bg-dark flex flex-col justify-center items-center text-center">
                 <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/20 blur-[120px] rounded-full" />
                 </div>
                 
                 <div className="max-w-xl space-y-10 relative">
                    <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center mx-auto mb-10 rotate-12 group hover:rotate-0 transition-transform">
                       <Play className="text-brand-primary" size={32} fill="currentColor" />
                    </div>
                    <p className="text-[12px] uppercase tracking-[0.6em] font-black text-brand-primary">The Precision Archive</p>
                    <h2 className="text-5xl md:text-6xl font-serif font-black italic text-white leading-tight">
                      Where <span className="opacity-40">logic</span> meets <span className="text-brand-primary underline decoration-brand-primary/30 underline-offset-8">escapism</span>.
                    </h2>
                    <p className="text-xl text-white/50 leading-relaxed font-light tracking-tight px-10">
                      "A surgical curation layer for the modern creative and exhausted professional."
                    </p>
                    <div className="pt-10 flex gap-4 justify-center">
                       <span className="px-4 py-2 bg-white/5 rounded-full text-[10px] uppercase font-bold tracking-widest text-white/30 border border-white/5 italic">2023-2026 Layer</span>
                       <span className="px-4 py-2 bg-white/5 rounded-full text-[10px] uppercase font-bold tracking-widest text-white/30 border border-white/5 italic">Multi-Vibe Mapping</span>
                    </div>
                 </div>
              </section>
            </motion.div>
          )}

          {view === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 p-12 bg-gradient-to-br from-[#0d0d0d] to-[#151515] relative min-h-[calc(100vh-6rem)]"
            >
              <div className="mb-24">
                <p className="text-[12px] uppercase tracking-[0.5em] text-brand-primary mb-4 font-black">Agent Output</p>
                <div className="flex items-end justify-between border-b-2 border-white/5 pb-10">
                  <h2 className="text-7xl font-sans font-black italic tracking-tighter text-white uppercase">The {mood} <span className="opacity-40 italic font-serif lowercase tracking-normal">protocol</span></h2>
                  <button 
                    onClick={() => setView("home")}
                    className="px-8 py-3 bg-white/5 hover:bg-brand-primary hover:text-black rounded-full text-[10px] uppercase font-black tracking-widest transition-all border border-white/10"
                  >
                    Rediagnose Vibe
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="h-[60vh] flex flex-col items-center justify-center gap-10">
                   <div className="relative">
                      <div className="w-32 h-32 border-4 border-white/5 rounded-[3rem] animate-[spin_10s_linear_infinite]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Sparkles className="text-brand-primary animate-pulse" size={40} />
                      </div>
                   </div>
                   <div className="text-center space-y-3">
                      <p className="text-[12px] uppercase tracking-[1em] text-brand-primary font-black ml-4">Calibrating</p>
                      <p className="text-white/40 font-light italic text-lg">"Scanning the cinematic trend layer (2023 - 2026)..."</p>
                   </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                  {results.map((rec, i) => (
                    <RecommendationCard 
                      key={i} 
                      rec={rec} 
                      isSaved={!!watchlist.find(w => w.title === rec.title)}
                      onToggleSave={() => toggleWatchlist(rec)}
                      onShowDetails={(item) => setSelectedRec(item)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {(view === "watchlist" || view === "history") && (
            <motion.div
              key="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 p-12 bg-gradient-to-br from-[#0d0d0d] to-[#151515] min-h-[calc(100vh-6rem)]"
            >
              <div className="mb-24 flex items-end justify-between border-b-2 border-white/5 pb-10">
                 <div>
                    <p className="text-[12px] uppercase tracking-[0.5em] text-brand-primary mb-4 font-black">Personal Stash</p>
                    <h2 className="text-7xl font-sans font-black italic tracking-tighter text-white uppercase">{view === 'watchlist' ? 'The Reserve' : 'Archive'}</h2>
                 </div>
                 <button 
                    onClick={() => setView("home")}
                    className="px-8 py-3 bg-white/5 hover:bg-brand-primary hover:text-black rounded-full text-[10px] uppercase font-black tracking-widest transition-all border border-white/10"
                  >
                    Back to Laboratory
                  </button>
              </div>

              {(view === "watchlist" ? watchlist : history).length === 0 ? (
                <div className="border-2 border-dashed border-white/5 bg-white/[0.01] p-32 text-center rounded-[3rem]">
                  <Moon className="text-brand-primary opacity-20 mx-auto mb-8" size={64} strokeWidth={1} />
                  <p className="text-[12px] uppercase tracking-[0.5em] text-white/30 font-black">Your collection is currently empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                  {(view === "watchlist" ? watchlist : history).map((rec, i) => (
                    <RecommendationCard 
                      key={i} 
                      rec={rec} 
                      isSaved={!!watchlist.find(w => w.title === rec.title)}
                      onToggleSave={() => toggleWatchlist(rec)}
                      onShowDetails={(item) => setSelectedRec(item)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal for Details */}
        <AnimatePresence>
          {selectedRec && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedRec(null)}
                className="absolute inset-0 bg-bg-dark/95 backdrop-blur-3xl"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 40 }}
                className="relative w-full max-w-3xl bg-[#14141d] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[85vh] flex flex-col"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-brand-primary" />
                
                <button 
                  onClick={() => setSelectedRec(null)}
                  className="absolute top-8 right-8 p-2.5 bg-white/5 rounded-full text-white/40 hover:text-white transition-colors border border-white/10 z-10"
                >
                  <X size={20} />
                </button>

                <div className="p-12 md:p-16 overflow-y-auto custom-scrollbar flex-1">
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[9px] font-black uppercase tracking-[0.3em] rounded-full border border-brand-primary/20">
                          {selectedRec.vibe}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40">
                          {selectedRec.year} • {selectedRec.region} • {selectedRec.type}
                        </span>
                      </div>
                      <h2 className="text-5xl md:text-6xl font-serif font-black italic text-white leading-tight tracking-tighter">
                        {selectedRec.title}
                      </h2>
                    </div>

                    <div className="space-y-10">
                      <div className="space-y-4">
                        <p className="text-[10px] uppercase tracking-[0.5em] text-brand-primary font-black">The Narrative</p>
                        <p className="text-white/80 text-xl leading-relaxed font-light tracking-tight">
                          {selectedRec.overview || selectedRec.logic}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-white/5">
                        <div className="space-y-4">
                          <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-black">Technical Specs</p>
                          <ul className="space-y-2 text-xs font-bold text-white/60 tracking-wider">
                            <li className="flex items-center gap-3"><Clock size={14} className="text-brand-primary" /> {selectedRec.runtime} Duration</li>
                            <li className="flex items-center gap-3"><Languages size={14} className="text-brand-primary" /> {selectedRec.language} Presentation</li>
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-black">Calibration Logic</p>
                          <p className="text-sm italic text-white/50 leading-relaxed font-light">
                            "{selectedRec.logic}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-12 md:px-16 py-8 border-t border-white/5 bg-white/[0.02] flex flex-col sm:flex-row justify-between items-center gap-6">
                  <button 
                    onClick={() => {
                      toggleWatchlist(selectedRec);
                      setSelectedRec(null);
                    }}
                    className="btn-primary w-full sm:w-auto"
                  >
                    {watchlist.find(w => w.title === selectedRec.title) ? "De-list from Reserve" : "Calibrate into Reserve"}
                  </button>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black italic">
                    Reelief • Experimental Selection
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <footer className="h-32 border-t border-white/[0.05] px-16 flex items-center justify-between bg-bg-dark/80 backdrop-blur-xl">
        <div className="flex gap-10 items-center">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30">Weekend Cluster: Active</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold italic">Processing 2023-2026 Archive</p>
        </div>
        <div className="hidden md:block text-[11px] uppercase tracking-[0.5em] text-white/10 font-black italic">
          Your Weekend, Re-calibrated.
        </div>
      </footer>
    </div>
  );
}
