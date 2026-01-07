
import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  CheckCircle2, 
  Flame, 
  Zap, 
  MapPin, 
  Trophy, 
  Sun, 
  Moon,
  Construction
} from 'lucide-react';
import { WORKOUT_DATA } from './constants';
import TypeIcon from './components/TypeIcon';
import Timer from './components/Timer';
import GeminiCoach from './components/GeminiCoach';

const CircularProgress = ({ progress, accentClass }: { progress: number, accentClass: string }) => {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-slate-100 dark:text-slate-800"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className={`transition-all duration-1000 ease-out ${accentClass}`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-[12px] font-black ${accentClass}`}>{progress}%</span>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });
  const [isMounted, setIsMounted] = useState(false);

  // Sync theme with document class for Tailwind 'class' strategy
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    setIsMounted(true);
    const savedProgress = localStorage.getItem('workout_progress');
    if (savedProgress) {
      try {
        setCompletedExercises(JSON.parse(savedProgress));
      } catch (e) {
        console.error("Failed to load progress");
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('workout_progress', JSON.stringify(completedExercises));
    }
  }, [completedExercises, isMounted]);

  const activeDay = WORKOUT_DATA[activeDayIdx];

  const toggleExercise = (dayId: number, exerciseName: string) => {
    const key = `${dayId}-${exerciseName}`;
    setCompletedExercises(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getProgress = () => {
    const totalExercises = activeDay.zones.reduce((acc, zone) => acc + zone.exercises.length, 0);
    const completedCount = activeDay.zones.reduce((acc, zone) => {
      return acc + zone.exercises.filter(ex => completedExercises[`${activeDay.id}-${ex.name}`]).length;
    }, 0);
    return totalExercises === 0 ? 0 : Math.round((completedCount / totalExercises) * 100);
  };

  const progress = getProgress();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] font-sans text-slate-900 dark:text-slate-100 pb-40 transition-colors duration-300 antialiased">
      
      {/* Header */}
      <header className={`relative pt-12 pb-24 px-6 bg-gradient-to-br ${activeDay.theme} text-white transition-all duration-500 overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-20 -mt-20 rounded-full" />
        <div className="max-w-md mx-auto relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-white/80 font-medium uppercase tracking-widest text-[10px] mb-1">Sessione {activeDay.id}</p>
              <h1 className="text-4xl font-black italic tracking-tight uppercase leading-none">{activeDay.title}</h1>
              <p className="text-white/90 mt-2 text-sm font-medium">{activeDay.subtitle}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl hover:bg-white/30 transition-colors active:scale-90"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
              </button>
              <div className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl">
                <Dumbbell className="w-5 h-5 text-white float-anim" />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar py-2">
            {WORKOUT_DATA.map((day, idx) => (
              <button
                key={day.id}
                onClick={() => setActiveDayIdx(idx)}
                className={`px-6 py-3 rounded-full text-xs font-black whitespace-nowrap transition-all uppercase tracking-tighter ${
                  activeDayIdx === idx 
                    ? 'bg-white text-slate-900 shadow-xl scale-105' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {day.title}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto -mt-16 px-4 relative z-20 space-y-6">
        
        {/* CONSOLIDATED STICKY DASHBOARD (Circular Progress + Enlarged Timer) */}
        <div className="sticky top-4 z-40 bg-white/95 dark:bg-slate-900/98 backdrop-blur-2xl p-5 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
          <div className="flex items-center gap-6">
            {/* Left side: Circular Progress */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <CircularProgress 
                progress={progress} 
                accentClass={activeDay.accent} 
              />
              <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Goal</span>
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-16 bg-slate-100 dark:bg-slate-800" />

            {/* Right side: Enlarged Timer */}
            <div className="flex-1">
              <Timer accent={activeDay.accent} />
            </div>
          </div>
        </div>

        {/* Exercises Section */}
        <div className="space-y-12 pb-10">
          {activeDay.zones.map((zone, zIdx) => (
            <section key={zIdx} className="space-y-4">
              <div className="flex items-center gap-2 px-1 border-l-2 ml-1" style={{ borderColor: 'currentColor', color: 'inherit' }}>
                <MapPin className={`w-3.5 h-3.5 ${activeDay.accent}`} />
                <h3 className="font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] text-[10px]">{zone.name}</h3>
              </div>
              
              <div className="space-y-3">
                {zone.exercises.map((ex, eIdx) => {
                  const isDone = completedExercises[`${activeDay.id}-${ex.name}`];
                  return (
                    <div 
                      key={eIdx}
                      onClick={() => toggleExercise(activeDay.id, ex.name)}
                      className={`group relative p-4 rounded-[2rem] transition-all duration-300 cursor-pointer border ${
                        isDone 
                          ? 'bg-slate-100 dark:bg-slate-900/30 border-transparent opacity-50 scale-[0.98]' 
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:border-slate-200 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 p-3 rounded-2xl transition-all ${isDone ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:scale-110'}`}>
                          {isDone ? <CheckCircle2 className="w-5 h-5" /> : <TypeIcon type={ex.type} isDone={isDone} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className={`font-bold transition-all ${isDone ? 'line-through text-slate-500 dark:text-slate-600' : 'text-slate-800 dark:text-slate-100 text-lg leading-tight pr-2'}`}>
                              {ex.name}
                            </h4>
                            {!isDone && <GeminiCoach exerciseName={ex.name} notes={ex.notes} />}
                          </div>
                          
                          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2">
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tight ${isDone ? 'bg-slate-200 dark:bg-slate-800 text-slate-500' : `${activeDay.bgLight} ${activeDay.bgDark} ${activeDay.accent}`}`}>
                              {ex.sets}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-tight">
                              {ex.notes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {progress === 100 && (
          <div className="bg-green-600 text-white p-8 rounded-[3rem] shadow-2xl shadow-green-600/20 text-center animate-in fade-in zoom-in duration-700 mb-24">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black italic uppercase mb-2">Workout Completo!</h3>
            <p className="text-sm font-medium opacity-90">Bravo! Nutriti bene e riposa per crescere.</p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setCompletedExercises({});
              }}
              className="mt-6 px-6 py-2 bg-white text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors"
            >
              Reset Sessione
            </button>
          </div>
        )}
      </main>

      {/* Unified Bottom Nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-md p-2 bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl rounded-full border border-slate-200 dark:border-slate-800 shadow-2xl z-50 transition-colors">
        <div className="flex justify-around items-center">
          {WORKOUT_DATA.map((day, idx) => (
            <button 
              key={day.id}
              className={`flex flex-col items-center gap-1 py-3 px-4 rounded-full transition-all flex-1 ${activeDayIdx === idx ? `${day.accent.replace('text', 'bg')} text-white scale-105 shadow-lg` : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`} 
              onClick={() => setActiveDayIdx(idx)}
            >
              {idx === 0 && <Flame className="w-5 h-5" />}
              {idx === 1 && <Zap className="w-5 h-5" />}
              {idx === 2 && <Dumbbell className="w-5 h-5" />}
              {idx === 3 && <Construction className="w-5 h-5" />}
              <span className="text-[7px] font-black tracking-widest uppercase">{day.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default App;
