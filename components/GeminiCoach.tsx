
import React, { useState } from 'react';
import { Sparkles, Loader2, X } from 'lucide-react';
import { getWorkoutTip } from '../services/geminiService';

interface GeminiCoachProps {
  exerciseName: string;
  notes: string;
}

const GeminiCoach: React.FC<GeminiCoachProps> = ({ exerciseName, notes }) => {
  const [tip, setTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleGetTip = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    setShow(true);
    const result = await getWorkoutTip(exerciseName, notes);
    setTip(result);
    setLoading(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleGetTip}
        disabled={loading}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors text-[10px] font-bold uppercase tracking-tight"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
        Coach Tip
      </button>

      {show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-2xl max-w-xs w-full border border-violet-100 dark:border-violet-900/30 relative">
            <button 
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-violet-500" />
              <h3 className="font-black text-slate-800 dark:text-slate-100 uppercase text-xs tracking-widest">AI Expert Tip</h3>
            </div>
            
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{exerciseName}</p>
            
            {loading ? (
              <div className="flex flex-col items-center py-6 gap-3">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Consulting expert...</span>
              </div>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
                "{tip}"
              </p>
            )}
            
            <button 
              onClick={() => setShow(false)}
              className="w-full mt-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-colors shadow-lg shadow-violet-600/20"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiCoach;
