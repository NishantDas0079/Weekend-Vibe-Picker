import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Calendar, Coffee, Ghost, Play, Clock, Languages, Heart, Trash2, History as HistoryIcon, Smile, Sofa, Zap } from "lucide-react";

export interface Recommendation {
  title: string;
  year: number;
  type: string;
  region: string;
  vibe: string;
  logic: string;
  runtime: string;
  language: string;
  overview: string;
}

interface CardProps {
  rec: Recommendation;
  isSaved: boolean;
  onToggleSave: () => void;
  onShowDetails: (rec: Recommendation) => void;
  key?: any;
}

export function RecommendationCard({ rec, isSaved, onToggleSave, onShowDetails }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="glass group relative flex flex-col justify-between p-10 transition-all hover:bg-white/[0.06] hover:border-white/20 h-full rounded-[2.5rem] card-glow"
    >
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <span className="inline-flex items-center px-4 py-1.5 bg-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border border-brand-primary/30">
            {rec.vibe}
          </span>
          <div className="flex items-center gap-4">
             <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">{rec.year} • {rec.region}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave();
              }}
              className={`p-3 rounded-full transition-all border ${isSaved ? 'bg-brand-primary border-brand-primary text-black' : 'bg-white/5 border-white/10 text-white/30 hover:text-white hover:bg-white/10'}`}
            >
              <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black leading-[1.1] text-white group-hover:text-brand-primary transition-colors italic tracking-tightest">
            {rec.title}
          </h3>
          
          <p className="text-white/80 text-lg leading-relaxed line-clamp-3 font-light tracking-tight">
            {rec.logic}
          </p>
        </div>
      </div>

      <div className="pt-10 border-t border-white/5 mt-10 flex flex-col gap-8">
        <div className="bg-white/[0.04] p-8 rounded-[2rem] border border-white/[0.05] relative overflow-hidden group/analysis">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/analysis:opacity-20 transition-opacity">
              <Sparkles size={40} />
           </div>
           <p className="text-[10px] uppercase tracking-[0.3em] text-brand-primary mb-4 font-black">AI Curation Logic</p>
           <p className="text-sm italic text-white/70 leading-relaxed font-light">
             "Precision selected as a {rec.runtime} {rec.type.toLowerCase()} reset. Delivered in {rec.language} for an immersive recovery."
           </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
             <span className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] uppercase tracking-widest font-bold text-white/30 border border-white/5">
                {rec.type}
             </span>
          </div>
          <button 
            onClick={() => onShowDetails(rec)}
            className="px-8 py-3.5 bg-white/5 hover:bg-brand-primary hover:text-black rounded-full text-[11px] uppercase tracking-[0.2em] font-black text-white transition-all flex items-center gap-3 border border-white/10 group-hover:border-brand-primary"
          >
            Details <Play size={12} fill="currentColor" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function MoodSelector({ current, onChange }: { current: string, onChange: (val: string) => void }) {
  const moods = [
    { id: 'exhausted', label: 'Burned Out' },
    { id: 'stressed', label: 'Tense' },
    { id: 'calm', label: 'Mellow' },
    { id: 'bored', label: 'Restless' },
    { id: 'happy', label: 'Euphoric' },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {moods.map((mood) => {
        const isActive = current === mood.id;
        return (
          <button
            key={mood.id}
            onClick={() => onChange(mood.id)}
            className={`px-6 py-4 rounded-[1.25rem] border-2 text-[11px] font-black tracking-[0.15em] uppercase transition-all duration-300 ${
              isActive 
                ? 'bg-brand-primary border-brand-primary text-black shadow-2xl shadow-brand-primary/30 -translate-y-1' 
                : 'bg-white/[0.04] border-white/5 text-white/50 hover:border-white/20 hover:text-white'
            }`}
          >
            {mood.label}
          </button>
        );
      })}
    </div>
  );
}
