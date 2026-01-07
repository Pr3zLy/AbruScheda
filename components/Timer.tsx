
import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Pause, Play } from 'lucide-react';

interface TimerProps {
  accent: string; // e.g., 'text-orange-600'
}

const Timer: React.FC<TimerProps> = ({ accent }) => {
  const [seconds, setSeconds] = useState(60);
  const [baseTime, setBaseTime] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Derive hex/color code from accent class for reliable styling
  const getColorHex = (accentClass: string) => {
    if (accentClass.includes('orange')) return '#ea580c';
    if (accentClass.includes('blue')) return '#2563eb';
    if (accentClass.includes('purple')) return '#9333ea';
    if (accentClass.includes('emerald')) return '#059669';
    return '#64748b';
  };

  const themeColor = getColorHex(accent);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const playBeep = () => {
    try {
      initAudio();
      const ctx = audioContextRef.current!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn("Audio notification failed", e);
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      if (isActive) {
        playBeep();
      }
      setIsActive(false);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    initAudio();
    if (seconds === 0) {
      setSeconds(baseTime);
      setIsActive(true);
    } else {
      setIsActive(!isActive);
    }
  };
  
  const reset = (e: React.MouseEvent, val = baseTime) => {
    e.stopPropagation();
    initAudio();
    setSeconds(val);
    setIsActive(false);
  };

  const changeBase = (e: React.MouseEvent, val: number) => {
    e.stopPropagation();
    initAudio();
    setBaseTime(val);
    setSeconds(val);
    setIsActive(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <p className="text-4xl font-mono font-black text-slate-800 dark:text-slate-100 leading-none tracking-tighter">
            {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={(e) => reset(e)} 
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button 
            onClick={(e) => toggle(e)} 
            style={{ backgroundColor: themeColor }}
            className="p-2.5 rounded-xl text-white shadow-lg transition-all active:scale-95 hover:brightness-110"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      <div className="flex gap-1.5 mt-1">
        {[60, 90, 120].map((t) => (
          <button 
            key={t}
            onClick={(e) => changeBase(e, t)}
            style={{ 
              borderColor: baseTime === t ? themeColor : 'transparent',
              backgroundColor: baseTime === t ? `${themeColor}1a` : 'transparent',
              color: baseTime === t ? themeColor : undefined
            }}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all border ${
              baseTime === t 
                ? '' 
                : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {t}s
          </button>
        ))}
      </div>
    </div>
  );
};

export default Timer;
