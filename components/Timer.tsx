
import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Pause, Play } from 'lucide-react';
import { playNotificationSound, resumeAudio } from '../notificationSounds';

interface TimerProps {
  accent: string; // e.g., 'text-orange-600'
}

const Timer: React.FC<TimerProps> = ({ accent }) => {
  const savedBase = parseInt(localStorage.getItem('timer-base-time') || '90');
  
  // Read persisted timer state
  const getPersistedState = () => {
    const persistedSecondsStr = localStorage.getItem('timer-seconds');
    const persistedIsActiveStr = localStorage.getItem('timer-is-active');
    const persistedUpdatedAtStr = localStorage.getItem('timer-updated-at');
    let wasExpiredOffline = false;

    if (persistedSecondsStr !== null && persistedIsActiveStr !== null && persistedUpdatedAtStr !== null) {
      const persistedSeconds = parseInt(persistedSecondsStr);
      const persistedIsActive = persistedIsActiveStr === 'true';
      const persistedUpdatedAt = parseInt(persistedUpdatedAtStr);

      if (persistedIsActive) {
        const elapsed = Math.floor((Date.now() - persistedUpdatedAt) / 1000);
        const remaining = Math.max(0, persistedSeconds - elapsed);
        if (remaining === 0 && persistedSeconds > 0) {
          localStorage.setItem('timer-expired', '1');
          wasExpiredOffline = true;
          return {
            seconds: 0,
            isActive: false,
            wasExpiredOffline
          };
        }
        return {
          seconds: remaining,
          isActive: remaining > 0,
          wasExpiredOffline
        };
      } else {
        return {
          seconds: persistedSeconds,
          isActive: false,
          wasExpiredOffline
        };
      }
    }
    return {
      seconds: savedBase,
      isActive: false,
      wasExpiredOffline
    };
  };

  const initialState = getPersistedState();
  const wasExpired = localStorage.getItem('timer-expired') === '1' || initialState.wasExpiredOffline;

  const [seconds, setSeconds] = useState(initialState.seconds);
  const [baseTime, setBaseTime] = useState(savedBase);
  const [isActive, setIsActive] = useState(initialState.isActive);
  const [isEditing, setIsEditing] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const lastClickRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isActiveRef = useRef(isActive);
  const secondsRef = useRef(seconds);
  const baseTimeRef = useRef(baseTime);

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
    if (accentClass.includes('rose')) return '#e11d48';
    return '#64748b';
  };

  const themeColor = getColorHex(accent);

  const initAudio = () => {
    resumeAudio();
  };

  const playBeep = () => {
    const soundId = localStorage.getItem('abruscheda-notification-sound') || 'beep-classic';
    playNotificationSound(soundId);
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

  // Auto-restart timer on mount if timer was expired
  useEffect(() => {
    if (wasExpired) {
      localStorage.removeItem('timer-expired');
      setSeconds(baseTimeRef.current);
      setIsActive(true);
      sendNotification();
    }
  }, []);

  // Auto-restart on tab visible if timer expired while away
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && localStorage.getItem('timer-expired') === '1') {
        localStorage.removeItem('timer-expired');
        setSeconds(baseTimeRef.current);
        setIsActive(true);
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

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
  const SILENT_AUDIO = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA';

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    secondsRef.current = seconds;
  }, [seconds]);

  useEffect(() => {
    baseTimeRef.current = baseTime;
    localStorage.setItem('timer-base-time', baseTime.toString());
  }, [baseTime]);

  // Persist timer state to localStorage whenever seconds or isActive changes
  useEffect(() => {
    localStorage.setItem('timer-seconds', seconds.toString());
    localStorage.setItem('timer-is-active', isActive.toString());
    localStorage.setItem('timer-updated-at', Date.now().toString());
  }, [seconds, isActive]);

  const updateMediaSession = (sec: number, active: boolean) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${sec}s`,
        artist: 'Timer Recupero',
        artwork: [
          { src: '/icon.png', sizes: '96x96', type: 'image/png' },
          { src: '/icon.png', sizes: '128x128', type: 'image/png' },
        ]
      });
      navigator.mediaSession.playbackState = active ? 'playing' : 'paused';
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
          updateMediaSession(newVal, true);
          return newVal;
        });
      }
    };

    // Register Media Session action handlers once
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        initAudio();
        if (audioRef.current) {
          audioRef.current.play().catch((e) => {
            if (e.name !== 'NotSupportedError' && e.name !== 'NotAllowedError') {
              console.warn('Audio play from MediaSession failed', e);
            }
          });
        }
        if (secondsRef.current === 0) {
          setSeconds(baseTimeRef.current);
        }
        setIsActive(true);
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsActive(false);
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsActive(false);
        setSeconds(baseTimeRef.current);
      });
    }

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
        audioRef.current.play().catch((e) => {
          if (e.name !== 'NotSupportedError' && e.name !== 'NotAllowedError') {
            console.warn('Audio play failed', e);
          }
        });
      }
      updateMediaSession(seconds, true);
    } else {
      workerRef.current?.postMessage('stop');
      audioRef.current?.pause();
      releaseWakeLock(); // Release wake lock when timer stops

      if (seconds === 0 && isActive) {
        // Timer just finished
        localStorage.setItem('timer-expired', '1');
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
      } else if (seconds > 0) {
        // Manually paused
        updateMediaSession(seconds, false);
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

  const handleTimerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    const DOUBLE_CLICK_DELAY = 300;
    if (now - lastClickRef.current < DOUBLE_CLICK_DELAY) {
      setIsActive(false);
      setIsEditing(true);
      lastClickRef.current = 0;
    } else {
      lastClickRef.current = now;
    }
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
              id="timer-seconds-input"
              name="timer-seconds-input"
              ref={inputRef}
              type="number"
              defaultValue={seconds}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              className="w-36 bg-transparent text-[40px] font-mono font-black text-slate-800 dark:text-slate-100 leading-none tracking-tighter border-b-2 border-slate-300 focus:outline-none focus:border-slate-500"
            />
          ) : (
            <p
              onClick={handleTimerClick}
              className="text-[40px] font-mono font-black text-slate-800 dark:text-slate-100 leading-none tracking-tighter cursor-pointer select-none touch-manipulation"
            >
              {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => reset(e)}
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-[22px] h-[22px]" />
          </button>
          <button
            onClick={(e) => toggle(e)}
            style={{ backgroundColor: themeColor }}
            className="p-[18px] rounded-xl text-white shadow-lg transition-all active:scale-95 hover:brightness-110"
          >
            {isActive ? <Pause className="w-[31px] h-[31px]" /> : <Play className="w-[31px] h-[31px]" />}
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
            className={`flex-1 py-[7px] rounded-lg text-[11px] font-black transition-all border ${baseTime === t
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
