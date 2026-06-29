import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Skull, Volume2, VolumeX, RotateCw } from 'lucide-react';

const BASE_IMAGE_ASSETS = [
  '/assets/images/blue.png',
  '/assets/images/feet.png',
  '/assets/images/feet2.png',
  '/assets/images/waifu.png'
];

interface BrainrotGameProps {
  onClose: () => void;
}

const AUDIO_FILES = [
  '/assets/brainrot/vine-boom.mp3',
  '/assets/brainrot/bruh.mp3',
  '/assets/brainrot/fahhh.mp3',
  '/assets/brainrot/what-the-sigma.mp3',
  '/assets/brainrot/metal-pipe.mp3'
];

export const BrainrotGame: React.FC<BrainrotGameProps> = ({ onClose }) => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [activeMole, setActiveMole] = useState<number | null>(4); // Parte al centro (4)
  const [hasStarted, setHasStarted] = useState(false); // Il gioco inizia fermo ad attendere il tocco
  const [wrongMoles, setWrongMoles] = useState<number[]>(() => Array(9).fill(0));
  const [speed, setSpeed] = useState(1000);
  const [gameOver, setGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('brainrot-muted') === 'true');
  const [volume, setVolume] = useState(() => {
    const v = localStorage.getItem('brainrot-volume');
    return v ? parseFloat(v) : 0.5;
  });
  const [is18Plus, setIs18Plus] = useState(false);
  const [is18PlusPending, setIs18PlusPending] = useState(false);
  const pending18PlusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const last18PlusClickTimeRef = useRef<number>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(() => {
    const idx = localStorage.getItem('brainrot-image-index');
    return idx ? parseInt(idx, 10) : 0;
  });
  const [customImage, setCustomImage] = useState(() => localStorage.getItem('brainrot-custom-image') || '');
  const [showResetButton, setShowResetButton] = useState(false);
  const [imageZoom, setImageZoom] = useState(() => {
    const z = localStorage.getItem('brainrot-image-zoom');
    return z ? parseFloat(z) : 1.0;
  });

  const IMAGE_ASSETS = [...BASE_IMAGE_ASSETS];
  if (customImage.trim()) {
    IMAGE_ASSETS.push(customImage.trim());
  }

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastMoleRef = useRef<number | null>(null);
  const lastMoveTimeRef = useRef<number>(0);
  const lastInputTimeRef = useRef<number>(0);

  useEffect(() => {
    localStorage.setItem('brainrot-muted', String(isMuted));
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem('brainrot-volume', String(volume));
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('brainrot-image-index', String(currentImageIndex));
  }, [currentImageIndex]);

  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => {
        setShowResetButton(true);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setShowResetButton(false);
    }
  }, [gameOver]);

  useEffect(() => {
    localStorage.setItem('brainrot-image-zoom', String(imageZoom));
  }, [imageZoom]);

  const playRandomSound = () => {
    if (isMuted || volume === 0) return;

    // Interrompi l'audio precedente se attivo
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    const randomAudio = AUDIO_FILES[Math.floor(Math.random() * AUDIO_FILES.length)];
    const audio = new Audio(randomAudio);
    audio.volume = volume;
    currentAudioRef.current = audio;
    audio.play().catch(e => console.error("Audio play failed:", e));
  };

  // Ferma l'audio e ripulisce i timer all'uscita/smontaggio del componente
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      if (pending18PlusTimeoutRef.current) {
        clearTimeout(pending18PlusTimeoutRef.current);
      }
    };
  }, []);

  const moveMole = useCallback(() => {
    setActiveMole((prev) => {
      let next;
      do {
        next = Math.floor(Math.random() * 9);
      } while (next === prev);

      lastMoleRef.current = prev;
      lastMoveTimeRef.current = Date.now();

      return next;
    });
  }, []);

  useEffect(() => {
    if (gameOver || !hasStarted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      moveMole();
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [speed, gameOver, hasStarted, moveMole]);

  const handleHit = (index: number) => {
    if (gameOver) return;

    // Previeni doppi tap/click simultanei (es. touchstart + mousedown simulati dall'emulatore)
    const now = Date.now();
    if (now - lastInputTimeRef.current < 100) {
      return;
    }
    lastInputTimeRef.current = now;

    if (!hasStarted) {
      // Se il gioco non è iniziato, controlla se ha colpito il centro (4)
      if (index === activeMole) {
        setHasStarted(true);
        // Sposta subito la talpa e avvia i tick
        moveMole();
      }
      return; // Ignora gli errori prima dello start e non incrementa punteggi/streak
    }

    const timeSinceLastMove = Date.now() - lastMoveTimeRef.current;
    const isCorrectHit = index === activeMole;
    // Tolleranza di 200ms se l'utente clicca dove la talpa era appena presente
    const isCompensatedHit = index === lastMoleRef.current && timeSinceLastMove < 200;

    if (!isCorrectHit && !isCompensatedHit) {
      // Click errato
      setWrongMoles(prev => {
        const next = [...prev];
        next[index]++;
        return next;
      });
      setMistakes(m => {
        const newMistakes = m + 1;
        if (newMistakes >= 3) {
          setGameOver(true);
        }
        return newMistakes;
      });
      setStreak(0);
      
      // Resetta l'evidenziazione dell'errore dopo 350ms
      setTimeout(() => {
        setWrongMoles(prev => {
          const next = [...prev];
          next[index] = Math.max(0, next[index] - 1);
          return next;
        });
      }, 350);
      return;
    }

    // Colpo corretto
    setScore(s => s + 1);
    setStreak(prev => {
      const newStreak = prev + 1;
      if (newStreak >= 3) {
        playRandomSound();
      }
      return newStreak;
    });
    
    // Incrementa velocità
    setSpeed(prev => {
      const newSpeed = prev * 0.85; // 15% più veloce a ogni colpo
      return Math.max(newSpeed, 100); // Stabilità tecnica minima a 100ms
    });
    
    // Resetta timer per evitare movimenti doppi
    if (timerRef.current) clearInterval(timerRef.current);
    moveMole();
    timerRef.current = setInterval(() => {
      moveMole();
    }, speed * 0.85);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4 bg-black/25 backdrop-blur-[1px] overflow-y-auto">
      <div className="bg-slate-900 w-full sm:max-w-md rounded-[2.5rem] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border-2 border-purple-500/50 flex-shrink-0 my-4">
        
        {/* Header */}
        <div className="h-[72px] px-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-purple-900/50 rounded-xl flex-shrink-0">
              <Skull className="w-6 h-6 text-purple-400 animate-pulse" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
                BRAINROT
              </h3>
              <p className="text-[10px] text-purple-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">Schiaccia la talpa...</p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Cicla Immagini della cartella (ruota immagini) */}
            {is18Plus && IMAGE_ASSETS.length > 1 && (
              <button
                onClick={() => setCurrentImageIndex(prev => (prev + 1) % IMAGE_ASSETS.length)}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors animate-in fade-in zoom-in duration-200"
                title="Prossima immagine"
              >
                <RotateCw className="w-6 h-6 text-purple-400" />
              </button>
            )}

            {/* Modalità 18+ */}
            <button
              onClick={() => {
                if (is18Plus) {
                  // Per nascondere basta un click normale
                  setIs18Plus(false);
                  setIs18PlusPending(false);
                } else {
                  const now = Date.now();
                  if (now - last18PlusClickTimeRef.current < 600) {
                    // Secondo click veloce -> Attiva!
                    setIs18Plus(true);
                    setIs18PlusPending(false);
                    if (pending18PlusTimeoutRef.current) {
                      clearTimeout(pending18PlusTimeoutRef.current);
                    }
                  } else {
                    // Primo click -> Diventa "mezzo arancione" (stato pending)
                    setIs18PlusPending(true);
                    last18PlusClickTimeRef.current = now;
                    
                    if (pending18PlusTimeoutRef.current) {
                      clearTimeout(pending18PlusTimeoutRef.current);
                    }
                    pending18PlusTimeoutRef.current = setTimeout(() => {
                      setIs18PlusPending(false);
                    }, 600);
                  }
                }
              }}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors"
              title={is18Plus ? "Disattiva modalità 18+" : "Attiva modalità 18+ (Richiede doppio click)"}
            >
              <svg 
                viewBox="0 0 24 24" 
                className={`w-6 h-6 transition-all ${
                  is18Plus 
                    ? 'text-red-500 scale-105 filter drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]' 
                    : is18PlusPending
                      ? 'text-orange-500 scale-102 filter drop-shadow-[0_0_5px_rgba(249,115,22,0.65)]'
                      : 'text-slate-500 hover:text-slate-400'
                }`} 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <text 
                  x="12" 
                  y="15.5" 
                  fontSize="10" 
                  fontFamily="sans-serif" 
                  fontWeight="900" 
                  textAnchor="middle" 
                  fill="currentColor" 
                  stroke="none"
                >
                  18
                </text>
              </svg>
            </button>

            {/* Volume Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors"
              title={isMuted ? "Attiva audio" : "Disattiva audio"}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-red-400" />
              ) : (
                <Volume2 className="w-6 h-6 text-green-400" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Game Area */}
        <div className="px-0 py-6 flex flex-col items-center justify-center space-y-6">
          <div className="flex justify-around w-full items-center px-4">
            <div className="text-center">
              <div className="text-3xl font-black text-white drop-shadow-lg">{score}</div>
              <div className="text-[10px] text-purple-400 uppercase tracking-widest font-bold mt-1">Score</div>
            </div>
            
            <div className="text-center relative">
              <div className={`text-4xl font-black transition-all ${streak > 3 ? 'text-orange-500 scale-110 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)] animate-pulse' : 'text-slate-400'}`}>
                {streak} {streak > 3 && '🔥'}
              </div>
              <div className="text-[10px] text-purple-400 uppercase tracking-widest font-bold mt-1">Streak</div>
            </div>

            <div className="text-center">
              <div className="flex gap-1 justify-center">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <span key={idx} className="text-xl transition-all duration-300">
                    {idx < 3 - mistakes ? '❤️' : '🖤'}
                  </span>
                ))}
              </div>
              <div className="text-[10px] text-purple-400 uppercase tracking-widest font-bold mt-1">Vite</div>
            </div>
          </div>

          {gameOver ? (
            <div className="text-center animate-in zoom-in duration-500">
              <h2 className="text-3xl font-black text-red-500 mb-2 uppercase">
                Hai Perso!
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Hai commesso 3 errori.
              </p>
               <button 
                onClick={() => {
                  if (!showResetButton) return;
                  setScore(0);
                  setStreak(0);
                  setMistakes(0);
                  setWrongMoles(Array(9).fill(0));
                  setSpeed(1000);
                  setGameOver(false);
                  setHasStarted(false);
                  setActiveMole(4);
                }}
                disabled={!showResetButton}
                className={`px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-full uppercase tracking-widest transition-all duration-300 shadow-lg shadow-purple-500/30 ${
                  !showResetButton ? 'opacity-50 cursor-not-allowed scale-95' : 'opacity-100 scale-100'
                }`}
              >
                Riprova
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 w-full aspect-square max-w-[420px] px-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <button
                  key={i}
                  onMouseDown={() => handleHit(i)} // Use onMouseDown for faster response than onClick
                  onTouchStart={(e) => { e.preventDefault(); handleHit(i); }} // For mobile touch speed
                  onDragStart={(e) => e.preventDefault()}
                  className={`relative w-full h-full aspect-square rounded-2xl border-4 transition-all duration-75 flex items-center justify-center ${
                    activeMole === i 
                      ? 'bg-purple-600 border-purple-400 scale-95 shadow-[0_0_20px_rgba(168,85,247,0.6)] overflow-visible z-20' 
                      : wrongMoles[i] > 0
                        ? 'bg-red-950/80 border-red-500 scale-95 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse overflow-hidden z-0'
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-700/50 overflow-hidden z-0'
                  }`}
                >
                   {activeMole === i && (
                    is18Plus && IMAGE_ASSETS.length > 0 ? (
                      <div className="absolute inset-0 flex items-end justify-center animate-bounce pointer-events-none select-none">
                        <img 
                          src={IMAGE_ASSETS[currentImageIndex % IMAGE_ASSETS.length]} 
                          alt="brainrot asset" 
                          className="w-[115%] h-[125%] object-contain pointer-events-none select-none"
                          style={{ transform: `translateY(15%) scale(${imageZoom})` }}
                          draggable="false"
                        />
                      </div>
                    ) : (
                      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full p-2 animate-bounce pointer-events-none select-none">
                        {/* Body */}
                        <ellipse cx="50" cy="70" rx="35" ry="25" fill="#7c2d12" />
                        {/* Head */}
                        <circle cx="50" cy="45" r="22" fill="#7c2d12" />
                        {/* Snout */}
                        <ellipse cx="50" cy="50" rx="10" ry="7" fill="#ffedd5" />
                        {/* Nose */}
                        <circle cx="50" cy="48" r="4" fill="#ec4899" />
                        {/* Eyes */}
                        <circle cx="42" cy="40" r="3" fill="#000" />
                        <circle cx="58" cy="40" r="3" fill="#000" />
                        {/* Eye Highlights */}
                        <circle cx="41" cy="39" r="1" fill="#fff" />
                        <circle cx="57" cy="39" r="1" fill="#fff" />
                        {/* Whiskers */}
                        <line x1="32" y1="50" x2="18" y2="48" stroke="#ffedd5" strokeWidth="2" />
                        <line x1="32" y1="53" x2="18" y2="53" stroke="#ffedd5" strokeWidth="2" />
                        <line x1="68" y1="50" x2="82" y2="48" stroke="#ffedd5" strokeWidth="2" />
                        <line x1="68" y1="53" x2="82" y2="53" stroke="#ffedd5" strokeWidth="2" />
                      </svg>
                    )
                  )}
                  {wrongMoles[i] > 0 && (
                    <X className="absolute w-12 h-12 text-red-500 animate-in zoom-in duration-75 pointer-events-none select-none" />
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col items-center gap-1 w-full max-w-[200px] mt-4">
            <div className="flex items-center justify-between w-full gap-2">
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-slate-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-purple-400" />
              )}
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={isMuted ? 0 : volume} 
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (val > 0) {
                    setIsMuted(false);
                  } else {
                    setIsMuted(true);
                  }
                }}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="flex-1 accent-purple-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer touch-none"
              />
              <span className="text-[10px] font-mono text-slate-400 w-8 text-right">
                {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 text-center mt-2">
              Velocità attuale: {speed.toFixed(0)}ms
            </div>
          </div>

          {is18Plus && (
            <div className="w-full max-w-[200px] mt-2 flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="URL immagine esterna..."
                  value={customImage}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomImage(val);
                    localStorage.setItem('brainrot-custom-image', val);
                    if (val.trim()) {
                      // Imposta l'indice sull'immagine personalizzata
                      setCurrentImageIndex(BASE_IMAGE_ASSETS.length);
                    }
                  }}
                  className="w-full pl-2 pr-6 py-1.5 bg-slate-800/80 border border-slate-700 focus:border-purple-500 rounded-xl text-[10px] text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
                />
                {customImage && (
                  <button
                    onClick={() => {
                      setCustomImage('');
                      localStorage.removeItem('brainrot-custom-image');
                    }}
                    className="absolute right-1.5 text-slate-500 hover:text-slate-300 p-0.5 rounded-full"
                    title="Cancella"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Slider per regolare lo Zoom */}
              <div className="flex items-center justify-between w-full gap-2 mt-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider w-8">Zoom</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={imageZoom}
                  onChange={(e) => setImageZoom(parseFloat(e.target.value))}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  className="flex-1 accent-purple-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer touch-none"
                />
                <span className="text-[9px] font-mono text-slate-400 w-8 text-right">
                  {Math.round(imageZoom * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
