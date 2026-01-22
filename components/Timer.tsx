
import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Pause, Play } from 'lucide-react';

interface TimerProps {
  accent: string; // e.g., 'text-orange-600'
}

const Timer: React.FC<TimerProps> = ({ accent }) => {
  const [seconds, setSeconds] = useState(60);
  const [baseTime, setBaseTime] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Wake Lock API to prevent Xiaomi/Android from killing background process
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        console.log('Wake Lock acquired');
      }
    } catch (e) {
      console.warn('Wake Lock request failed', e);
    }
  };

  const releaseWakeLock = async () => {
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log('Wake Lock released');
      }
    } catch (e) {
      console.warn('Wake Lock release failed', e);
    }
  };

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

  // Request notification permission on mount
  useEffect(() => {
    try {
      if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission().catch(e => console.warn("Notification permission error", e));
      }
    } catch (e) {
      console.warn("Notification API not supported", e);
    }
  }, []);

  const playBeep = () => {
    try {
      initAudio();
      if (!audioContextRef.current) return;
      const ctx = audioContextRef.current;

      const playTone = (startTime: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, startTime);
        osc.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.5, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6);

        osc.start(startTime);
        osc.stop(startTime + 0.6);
      };

      const now = ctx.currentTime;
      playTone(now);
      playTone(now + 0.8);

    } catch (e) {
      console.warn("Audio notification failed", e);
    }
  };

  const sendNotification = () => {
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        const n = new Notification("Recupero Terminato! 🔔", {
          body: "È ora di tornare ad allenarsi!",
          icon: "/icon.png"
        });
        // Close notification automatically after 5 seconds
        setTimeout(() => n.close(), 5000);
      }
    } catch (e) {
      console.warn("Notification failed creation", e);
    }
  };

  // Silent MP3 to keep audio session alive and allow lockscreen updates
  const SILENT_AUDIO = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA';

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const updateMediaSession = (sec: number) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${sec}s`,
        artist: 'Timer Recupero',
        artwork: [
          { src: '/icon.png', sizes: '96x96', type: 'image/png' },
          { src: '/icon.png', sizes: '128x128', type: 'image/png' },
        ]
      });
      navigator.mediaSession.playbackState = 'playing';

      // Setting action handlers is often required for the notification to be visible on mobile
      navigator.mediaSession.setActionHandler('play', () => { /* no-op or resume */ });
      navigator.mediaSession.setActionHandler('pause', () => { /* no-op or pause */ });
      navigator.mediaSession.setActionHandler('stop', () => { /* no-op */ });
    }
  };

  const clearMediaSession = () => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'none';
      try {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('stop', null);
      } catch (e) { /* ignore */ }
    }
  };

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create a simple worker blob code
    const workerCode = `
      let intervalId = null;
      self.onmessage = function(e) {
        if (e.data === 'start') {
          if (intervalId) clearInterval(intervalId);
          intervalId = setInterval(() => {
            self.postMessage('tick');
          }, 1000);
        } else if (e.data === 'stop') {
          if (intervalId) clearInterval(intervalId);
          intervalId = null;
        }
      };
    `;

    const blob = new Blob([workerCode], { type: "application/javascript" });
    workerRef.current = new Worker(URL.createObjectURL(blob));

    workerRef.current.onmessage = (e) => {
      if (e.data === 'tick') {
        setSeconds((prev) => {
          const newVal = prev <= 1 ? 0 : prev - 1;
          updateMediaSession(newVal);
          return newVal;
        });
      }
    };

    return () => {
      workerRef.current?.terminate();
      clearMediaSession(); // Cleanup media session on unmount
    };
  }, []);

  useEffect(() => {
    if (isActive && seconds > 0) {
      workerRef.current?.postMessage('start');
      requestWakeLock(); // Keep screen/process alive on Xiaomi
      if (audioRef.current) {
        audioRef.current.volume = 0.01; // Very quiet but not silent (prevents optimization)
        audioRef.current.play().catch((e) => console.warn('Audio play failed', e));
      }
      updateMediaSession(seconds);
    } else {
      workerRef.current?.postMessage('stop');
      audioRef.current?.pause();
      releaseWakeLock(); // Release wake lock when timer stops

      if (seconds === 0 && isActive) {
        // Timer just finished
        playBeep();
        sendNotification();
        setIsActive(false);
        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: "Tempo scaduto!",
            artist: "Timer Recupero"
          });
          navigator.mediaSession.playbackState = 'paused';
        }
      } else if (seconds === 0 && !isActive) {
        // Just ensures logic is consistent
      }
    }
  }, [isActive, seconds]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

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

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActive(false);
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    if (inputRef.current) {
      const val = parseInt(inputRef.current.value);
      if (!isNaN(val) && val > 0) {
        setSeconds(val);
        setBaseTime(val);
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = parseInt(e.currentTarget.value);
      if (!isNaN(val) && val > 0) {
        setSeconds(val);
        setBaseTime(val);
      }
      setIsEditing(false);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <audio ref={audioRef} src={SILENT_AUDIO} loop className="hidden" />
      <div className="flex items-center gap-4">
        <div className="flex-1">
          {isEditing ? (
            <input
              ref={inputRef}
              type="number"
              defaultValue={seconds}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              className="w-32 bg-transparent text-4xl font-mono font-black text-slate-800 dark:text-slate-100 leading-none tracking-tighter border-b-2 border-slate-300 focus:outline-none focus:border-slate-500"
            />
          ) : (
            <p
              onDoubleClick={handleDoubleClick}
              className="text-4xl font-mono font-black text-slate-800 dark:text-slate-100 leading-none tracking-tighter cursor-pointer select-none"
            >
              {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
            </p>
          )}
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
            className="p-4 rounded-xl text-white shadow-lg transition-all active:scale-95 hover:brightness-110"
          >
            {isActive ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
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
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all border ${baseTime === t
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
