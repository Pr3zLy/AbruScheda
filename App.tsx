
import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  CheckCircle2,
  MapPin,
  Trophy,
  Sun,
  Moon,
  Upload,
  Download,
  Copy,
  RotateCcw,
  X,
  FileJson,
  Bot,
  Skull
} from 'lucide-react';
import SIMPLIFIED_WORKOUT_DATA from './workout_data.json';
import { WorkoutDay } from './types';
import { NOTIFICATION_SOUNDS, playNotificationSound } from './notificationSounds';

// Theme presets in the same order as default workout data (Orange, Blue, Purple, Emerald, Rose)
// followed by additional colors for extra sessions to prevent them from becoming gray.
const THEME_PRESETS = [
  {
    theme: "from-orange-500 to-red-600",
    accent: "text-orange-600",
    bgLight: "bg-orange-50",
    bgDark: "dark:bg-orange-950/20"
  },
  {
    theme: "from-blue-500 to-indigo-600",
    accent: "text-blue-600",
    bgLight: "bg-blue-50",
    bgDark: "dark:bg-blue-950/20"
  },
  {
    theme: "from-purple-500 to-pink-600",
    accent: "text-purple-600",
    bgLight: "bg-purple-50",
    bgDark: "dark:bg-purple-950/20"
  },
  {
    theme: "from-emerald-500 to-teal-600",
    accent: "text-emerald-600",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-950/20"
  },
  {
    theme: "from-rose-500 to-red-600",
    accent: "text-rose-600",
    bgLight: "bg-rose-50",
    bgDark: "dark:bg-rose-950/20"
  },
  {
    theme: "from-amber-500 to-amber-600",
    accent: "text-amber-600",
    bgLight: "bg-amber-50",
    bgDark: "dark:bg-amber-950/20"
  },
  {
    theme: "from-cyan-500 to-blue-600",
    accent: "text-cyan-600",
    bgLight: "bg-cyan-50",
    bgDark: "dark:bg-cyan-950/20"
  },
  {
    theme: "from-violet-500 to-fuchsia-600",
    accent: "text-violet-600",
    bgLight: "bg-violet-50",
    bgDark: "dark:bg-violet-950/20"
  },
  {
    theme: "from-lime-500 to-green-600",
    accent: "text-lime-600",
    bgLight: "bg-lime-50",
    bgDark: "dark:bg-lime-950/20"
  },
  {
    theme: "from-fuchsia-500 to-pink-600",
    accent: "text-fuchsia-600",
    bgLight: "bg-fuchsia-50",
    bgDark: "dark:bg-fuchsia-950/20"
  }
];

const convertSimplifiedStructure = (data: any[]): WorkoutDay[] => {
  return data.map((day, index) => {
    const exercises = day.esercizi.map((ex: any) => ({
      name: ex.nome,
      sets: ex.serie,
      type: ex.tipo,
      notes: ex.note || ''
    }));

    // Assign theme based on order of workout day
    const themePreset = THEME_PRESETS[index % THEME_PRESETS.length];

    return {
      id: index + 1,
      title: day.title,
      subtitle: day.subtitle,
      theme: themePreset.theme,
      accent: themePreset.accent,
      bgLight: themePreset.bgLight,
      bgDark: themePreset.bgDark,
      exercises: exercises
    };
  });
};

const WORKOUT_DATA = convertSimplifiedStructure(SIMPLIFIED_WORKOUT_DATA);
import TypeIcon from './components/TypeIcon';
import Timer from './components/Timer';
import { BrainrotGame } from './components/BrainrotGame';

const CircularProgress = ({ progress, accentClass }: { progress: number, accentClass: string }) => {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
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
  const EXAMPLE_JSON_STRUCTURE = `[
  {
    "title": "PUSH",
    "subtitle": "Descrizione allenamento...",
    "esercizi": [
      {
        "nome": "Esercizio 1",
        "serie": "4 x 6-8",
        "tipo": "chest|back|shoulders|legs|triceps|biceps|calves|forearms",
        "note": "Note esecuzione..."
      }
    ]
  },
  {
    "title": "PULL",
    "subtitle": "Descrizione allenamento...",
    "esercizi": [
      {
        "nome": "Esercizio 1",
        "serie": "3 x 10",
        "tipo": "legs",
        "note": "Note esecuzione..."
      }
    ]
  }
]`;

  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [workoutData, setWorkoutData] = useState<WorkoutDay[]>(() => {
    const savedData = localStorage.getItem('custom_workout_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0] && ('exercises' in parsed[0])) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse custom_workout_data", e);
      }
    }
    return WORKOUT_DATA;
  });
  const [showDataModal, setShowDataModal] = useState(false);
  const [showBrainrot, setShowBrainrot] = useState(false);
  const [selectedSound, setSelectedSound] = useState(() => {
    return localStorage.getItem('abruscheda-notification-sound') || 'beep-classic';
  });

  useEffect(() => {
    localStorage.setItem('custom_workout_data', JSON.stringify(workoutData));
  }, [workoutData]);

  useEffect(() => {
    localStorage.setItem('abruscheda-notification-sound', selectedSound);
  }, [selectedSound]);

  // Lock body and html scroll when modal is open
  useEffect(() => {
    const html = document.documentElement;
    if (showDataModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
      html.style.overflow = 'hidden';
      html.style.height = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
      html.style.overflow = 'unset';
      html.style.height = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
      html.style.overflow = 'unset';
      html.style.height = 'unset';
    };
  }, [showDataModal]);

  const activeDay = workoutData[activeDayIdx] || workoutData[0] || {
    id: 1,
    title: "Caricamento...",
    subtitle: "",
    theme: "from-orange-500 to-red-600",
    accent: "text-orange-600",
    bgLight: "bg-orange-50",
    bgDark: "dark:bg-orange-950/20",
    exercises: []
  };

  const validateWorkoutData = (data: any): data is WorkoutDay[] => {
    if (!Array.isArray(data)) throw new Error("Il file deve contenere un array di schede.");

    data.forEach((day, index) => {
      if (typeof day !== 'object' || day === null) throw new Error(`L'elemento ${index + 1} non è un oggetto valido.`);

      const requiredDayFields = ['id', 'title', 'subtitle', 'theme', 'accent', 'bgLight', 'bgDark', 'exercises'];
      requiredDayFields.forEach(field => {
        if (!(field in day)) throw new Error(`Scheda ${index + 1}: Manca il campo obbligatorio '${field}'.`);
      });

      if (!Array.isArray(day.exercises)) throw new Error(`Scheda ${index + 1}: 'exercises' deve essere un array.`);

      day.exercises.forEach((ex: any, eIndex: number) => {
        if (typeof ex !== 'object' || ex === null) throw new Error(`Scheda ${index + 1}, Esercizio ${eIndex + 1}: Non valido.`);
        const reqExFields = ['name', 'sets', 'type', 'notes'];
        reqExFields.forEach(f => {
          if (!(f in ex)) throw new Error(`Scheda ${index + 1}, Esercizio ${eIndex + 1}: Manca '${f}'.`);
        });
      });
    });

    return true;
  };

  const importData = (data: any) => {
    if (!Array.isArray(data)) throw new Error("Il file deve contenere un array di schede.");
    if (data.length === 0) throw new Error("Il file è vuoto.");

    // Detect if input is in the simplified structure format
    const isSimplified = 'esercizi' in data[0] && !('exercises' in data[0]);

    let finalData: WorkoutDay[];

    if (isSimplified) {
      try {
        finalData = convertSimplifiedStructure(data);
      } catch (e) {
        throw new Error("Errore durante la conversione del formato semplificato. Verifica la struttura.");
      }
    } else {
      // Validate complete format structure
      if (validateWorkoutData(data)) {
        finalData = data;
      } else {
        // Fallback case (validation handles throwing errors)
        throw new Error("Formato dati non valido.");
      }
    }

    setWorkoutData(finalData);
    setShowDataModal(false);
    setActiveDayIdx(0);
  };

  const handleImportClick = async (e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault();

    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        let parsedData;
        try {
          parsedData = JSON.parse(text.trim());
        } catch (err) {
          // Non è un JSON valido negli appunti, apri il file picker classico
          document.getElementById('import-data-file')?.click();
          return;
        }

        try {
          importData(parsedData);
          alert("Schede importate con successo dagli appunti!");
          return;
        } catch (error: any) {
          alert(`Rilevato JSON negli appunti ma non è valido per le schede:\n${error.message}\n\nApertura selezione file...`);
        }
      }
    } catch (err) {
      console.warn("Impossibile leggere la clipboard o permessi negati. Apertura selezione file...", err);
    }

    document.getElementById('import-data-file')?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value to allow selecting the same file again if needed
    e.target.value = '';

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonContent = event.target?.result as string;
        if (!jsonContent) throw new Error("Il file è vuoto.");

        let data;
        try {
          data = JSON.parse(jsonContent);
        } catch (e) {
          throw new Error("Errore di sintassi JSON. Verifica che il file sia formattato correttamente.");
        }

        importData(data);
        alert("Schede importate con successo!");

      } catch (error: any) {
        alert(`Errore nell'importazione:\n${error.message}`);
        console.error("Import Error:", error);
      }
    };
    reader.onerror = () => {
      alert("Errore durante la lettura del file.");
    };
    reader.readAsText(file);
  };

  const convertToSimplified = (data: WorkoutDay[]) => {
    return data.map(day => ({
      title: day.title,
      subtitle: day.subtitle,
      esercizi: day.exercises.map(ex => ({
        nome: ex.name,
        serie: ex.sets,
        tipo: ex.type,
        note: ex.notes
      }))
    }));
  };

  const handleDownload = () => {
    const simplifiedData = convertToSimplified(workoutData);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(simplifiedData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "abruscheda_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleCopy = () => {
    const simplifiedData = convertToSimplified(workoutData);
    navigator.clipboard.writeText(JSON.stringify(simplifiedData, null, 2));
    alert('JSON copiato negli appunti!');
  };

  const handleReset = () => {
    if (confirm('Sei sicuro di voler ripristinare le schede originali?')) {
      setWorkoutData(WORKOUT_DATA);
      setShowDataModal(false);
      setActiveDayIdx(0);
    }
  };

  const handleGenerateWithAI = (platform: 'gemini' | 'gpt' | 'grok') => {
    // Build the full prompt to encode in the external helper URLs
    const basePrompt = "Agisci come un Personal Trainer esperto. Memorizza questa struttura JSON per creare schede di allenamento personalizzate di alta qualità. Inizialmente, guida l'utente facendogli domande per comprendere il suo obiettivo specifico, livello ed esigenze, per poi creare la scheda più adatta. Nelle risposte successive, quando ti verrà chiesto di generare la scheda, rispondi ESCLUSIVAMENTE con un JSON valido che rispetti questo formato, ottimizzando volume, scelta degli esercizi e note tecniche in base all'obiettivo dell'utente. STRUTTURA DA MEMORIZZARE:";
    const fullPrompt = `${basePrompt}\n${EXAMPLE_JSON_STRUCTURE}`;
    const encodedPrompt = encodeURIComponent(fullPrompt);

    const urls = {
      gemini: `https://www.google.com/search?udm=50&q=${encodedPrompt}`,
      gpt: `https://chatgpt.com/?q=${encodedPrompt}`,
      grok: `https://grok.com/?q=${encodedPrompt}`
    };

    window.open(urls[platform], '_blank');
  };

  const downloadExampleJson = () => {
    const exampleData: WorkoutDay[] = [
      {
        id: 1,
        title: "TITOLO SCHEDE",
        subtitle: "Descrizione breve dell'allenamento",
        theme: "from-blue-500 to-purple-600",
        accent: "text-blue-500",
        bgLight: "bg-blue-50",
        bgDark: "bg-blue-900/20",
        exercises: [
          {
            name: "Panca Piana con Bilanciere",
            sets: "4 x 6-8",
            type: "chest",
            notes: "Focus su controllo eccentrico, 2-3 sec di discesa"
          },
          {
            name: "Chest Press Machine",
            sets: "3 x 10-12",
            type: "chest",
            notes: "Mantenere le scapole addotte, respirazione corretta"
          },
          {
            name: "Chest Fly (Pettorali)",
            sets: "3 x 12-15",
            type: "chest",
            notes: "ROM completo, stretch massimo in negativo"
          },
          {
            name: "Lateral Raises (Alzate Laterali)",
            sets: "4 x 12-15",
            type: "shoulders",
            notes: "No slancio, controllare la fase eccentrica"
          },
          {
            name: "Dips alle Parallele",
            sets: "3 x 8-10",
            type: "triceps",
            notes: "Inclinazione in avanti per enfasi petto, laterale per tricipiti"
          }
        ]
      }
    ];

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exampleData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "esempio_scheda.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const toggleExercise = (dayId: number, exerciseName: string) => {
    const key = `${dayId}-${exerciseName}`;
    setCompletedExercises(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const resetZoneExercises = (dayId: number, exercises: { name: string }[]) => {
    setCompletedExercises(prev => {
      const next = { ...prev };
      exercises.forEach(ex => {
        delete next[`${dayId}-${ex.name}`];
      });
      return next;
    });
  };

  const getProgress = () => {
    const exercisesList = activeDay?.exercises || [];
    const totalExercises = exercisesList.length;
    const completedCount = exercisesList.filter(ex => completedExercises[`${activeDay.id}-${ex.name}`]).length;
    return totalExercises === 0 ? 0 : Math.round((completedCount / totalExercises) * 100);
  };

  const progress = getProgress();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] font-sans text-slate-900 dark:text-slate-100 pb-40 transition-colors duration-300 antialiased">

      {/* Header */}
      <header className={`relative pt-12 pb-14 px-6 bg-gradient-to-br ${activeDay.theme} text-white transition-all duration-500 overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-20 -mt-20 rounded-full" />
        <div className="max-w-md mx-auto relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-white/80 font-medium uppercase tracking-widest text-[10px] mb-1">Sessione {activeDay.id}</p>
              <h1 className="text-4xl font-black italic tracking-tight uppercase leading-none">{activeDay.title}</h1>
              <p className="text-white/90 mt-2 text-sm font-medium truncate">{activeDay.subtitle}</p>
            </div>
            <div className="flex gap-2">
              <a
                href="https://github.com/Pr3zLy/AbruScheda"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl hover:bg-white/30 transition-colors active:scale-90"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl hover:bg-white/30 transition-colors active:scale-90"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
              </button>
              <button
                onClick={() => setShowDataModal(true)}
                className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl hover:bg-white/30 transition-colors active:scale-95"
              >
                <Dumbbell className="w-5 h-5 text-white float-anim" />
              </button>
            </div>
          </div>

          <div className={`grid gap-2 mb-2 py-2 sm:flex sm:flex-wrap sm:justify-center ${
            workoutData.length === 5 ? 'grid-cols-4' : 'grid-cols-2'
          }`}>
            {workoutData.map((day, idx) => {
              const isLength5 = workoutData.length === 5;
              const isLastOdd = workoutData.length % 2 !== 0;
              const isLastItem = idx === workoutData.length - 1;
              
              let gridColClass = '';
              if (isLength5) {
                if (idx === 2) {
                  gridColClass = 'col-span-2 col-start-2';
                } else {
                  gridColClass = 'col-span-2';
                }
              } else if (isLastOdd && isLastItem) {
                gridColClass = 'col-span-2';
              }

              return (
                <button
                  key={day.id}
                  onClick={() => setActiveDayIdx(idx)}
                  className={`px-4 py-3 rounded-full text-xs font-black sm:whitespace-nowrap transition-all uppercase tracking-tighter text-center flex items-center justify-center ${gridColClass} ${
                    activeDayIdx === idx
                      ? 'bg-white text-slate-900 shadow-xl scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  } sm:flex-1 sm:min-w-0`}
                >
                  {day.title}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto -mt-10 px-4 relative z-20 space-y-6">

        {/* CONSOLIDATED STICKY DASHBOARD (Circular Progress + Enlarged Timer) */}
        <div className="sticky top-4 z-40 bg-white/75 dark:bg-slate-900/70 backdrop-blur-xl p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/40 dark:border-slate-800/80 transition-all duration-300">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {/* Left side: Circular Progress */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <CircularProgress
                progress={progress}
                accentClass={activeDay.accent}
              />
              <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Obiettivo</span>
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-16 bg-slate-100 dark:bg-slate-800" />

            {/* Right side: Enlarged Timer */}
            <div className="shrink-0">
              <Timer accent={activeDay.accent} />
            </div>
          </div>
        </div>

        {/* Exercises Section */}
        <div className="space-y-4 pb-10">
          {(() => {
            const allExercises = activeDay?.exercises || [];
            const hasCompleted = allExercises.some(ex => ex && completedExercises[`${activeDay.id}-${ex.name}`]);

            return (
              <>
                {hasCompleted && (
                  <div className="flex justify-end px-1 mb-2">
                    <button
                      onClick={() => {
                        setCompletedExercises(prev => {
                          const next = { ...prev };
                          allExercises.forEach(ex => {
                            delete next[`${activeDay.id}-${ex.name}`];
                          });
                          return next;
                        });
                      }}
                      className="flex items-center gap-1 text-[10px] font-bold text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 transition-colors uppercase tracking-wider"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset Sessione
                    </button>
                  </div>
                )}
                {allExercises.map((ex, idx) => {
                  const isDone = completedExercises[`${activeDay.id}-${ex.name}`];

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleExercise(activeDay.id, ex.name)}
                      className={`group relative p-4 rounded-[2rem] transition-all duration-300 cursor-pointer border ${isDone
                        ? 'bg-slate-100 dark:bg-slate-900/30 border-transparent opacity-50 scale-[0.98]'
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:border-slate-200 dark:hover:border-slate-700'
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 p-3 rounded-2xl transition-all ${isDone ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:scale-110'}`}>
                          {isDone ? <CheckCircle2 className="w-5 h-5" /> : <TypeIcon type={ex.type} isDone={isDone} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className={`font-bold transition-all flex-1 ${isDone ? 'line-through text-slate-500 dark:text-slate-600' : 'text-slate-800 dark:text-slate-100 text-lg leading-tight'}`}>
                              {ex.name}
                            </h4>
                            <span className={`shrink-0 inline-flex items-center text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${isDone ? 'bg-slate-200 dark:bg-slate-800 text-slate-500' : `${activeDay.bgLight} ${activeDay.bgDark} ${activeDay.accent}`}`}>
                              {ex.sets}
                            </span>
                          </div>

                          <div className="mt-2 text-center">
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-snug line-clamp-2">
                              {ex.notes}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            );
          })()}
        </div>

        {progress === 100 && (
          <div className="bg-green-600 text-white p-8 rounded-[3rem] shadow-2xl shadow-green-600/20 text-center animate-in fade-in zoom-in duration-700 mb-24">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black italic uppercase mb-2">Allenamento Completato</h3>
            <p className="text-sm font-medium opacity-90">Ottimo lavoro! Ricorda che nutrizione e riposo sono fondamentali per la crescita.</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCompletedExercises({});
              }}
              className="mt-6 px-6 py-2 bg-white text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors"
            >
              Nuova Sessione
            </button>
          </div>
        )}
      </main>

      {/* Unified Bottom Nav */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md p-1.5 bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl rounded-full border border-slate-200 dark:border-slate-800 shadow-2xl z-50 transition-all duration-500 ${isScrolled ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="flex justify-between items-center gap-1">
          {workoutData.map((day, idx) => (
            <button
              key={day.id}
              className={`py-2.5 px-1 rounded-full transition-all duration-300 flex-1 text-center justify-center items-center flex ${activeDayIdx === idx ? `${day.accent.replace('text', 'bg')} text-white font-black shadow-md scale-105` : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
              onClick={() => setActiveDayIdx(idx)}
            >
              <span className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase">{day.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Management Modal */}
      {showDataModal && (
        <div 
          onClick={() => setShowDataModal(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 w-[95%] sm:w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col my-auto"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <FileJson className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold dark:text-white">Gestione Schede</h3>
                  <p className="text-xs text-slate-500 font-medium">Gestisci, salva e carica i tuoi piani di allenamento</p>
                </div>
              </div>
              <button
                onClick={() => setShowDataModal(false)}
                className="group p-2 bg-slate-100/80 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 hover:scale-110 active:scale-95 border border-slate-200/60 dark:border-slate-700/60 rounded-full transition-all duration-300 flex items-center justify-center shadow-sm"
                aria-label="Chiudi"
              >
                <X className="w-4 h-4 text-slate-500 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-200 transition-transform duration-300 group-hover:rotate-90" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  htmlFor="import-data-file"
                  onClick={handleImportClick}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
                >
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Importa Dati</span>
                  <span className="text-xs text-slate-400 mt-1">Sovrascrive i dati esistenti</span>
                </label>
                <input
                  id="import-data-file"
                  name="import-data-file"
                  type="file"
                  accept=".json,application/json,text/plain,*/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  onClick={handleDownload}
                  className="flex flex-col items-center justify-center p-6 border-2 border-slate-100 dark:border-slate-800 rounded-2xl hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all group"
                >
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Esporta Dati</span>
                  <span className="text-xs text-slate-400 mt-1">Salva una copia locale</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Crea la tua scheda 100% privata e gratis con AI</label>
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => handleGenerateWithAI('gemini')} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 hover:scale-[1.02] transition-transform group">
                    <img
                      src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/gemini-color.png"
                      alt="Gemini"
                      className="w-5 h-5 object-contain group-hover:scale-110 transition-transform"
                    />
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">Gemini</span>
                  </button>
                  <button onClick={() => handleGenerateWithAI('gpt')} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800 hover:scale-[1.02] transition-transform group">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/960px-ChatGPT_logo.svg.png"
                      alt="ChatGPT"
                      className="w-5 h-5 object-contain group-hover:scale-110 transition-transform"
                    />
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">ChatGPT</span>
                  </button>
                  <button onClick={() => handleGenerateWithAI('grok')} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:scale-[1.02] transition-transform group">
                    <img
                      src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/grok-icon.png"
                      alt="Grok"
                      className="w-5 h-5 object-contain group-hover:scale-110 transition-transform opacity-70 dark:opacity-100 dark:invert"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Grok</span>
                  </button>
                </div>
                <p className="text-[10px] text-center text-slate-400">Il prompt e la struttura sono inclusi nel link</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Anteprima Dati</label>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    Copia Dati
                  </button>
                </div>
                <div className="relative group">
                  <pre className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-[10px] leading-relaxed font-mono text-slate-600 dark:text-slate-400 overflow-x-auto border border-slate-200 dark:border-slate-800 shadow-inner">
                    {EXAMPLE_JSON_STRUCTURE}
                  </pre>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Suono Notifica Timer</label>
                <div className="grid grid-cols-2 gap-2">
                  {NOTIFICATION_SOUNDS.map((sound) => (
                    <button
                      key={sound.id}
                      onClick={() => {
                        setSelectedSound(sound.id);
                        playNotificationSound(sound.id);
                      }}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left ${
                        selectedSound === sound.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        selectedSound === sound.id ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                      }`} />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{sound.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <span className="text-lg">?</span> Come usare il Timer
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">1.</span>
                    <span><strong>Tap</strong> sul tempo per avviare/pausare il timer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">2.</span>
                    <span><strong>Double click</strong> sul tempo per inserire un tempo personalizzato</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">3.</span>
                    <span>Usa i pulsanti <strong>60s / 90s / 120s</strong> per selezionarepreset</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">4.</span>
                    <span>Il suono di notifica si sente allo scadere del tempo</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleReset}
                  className="w-full py-4 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-medium text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Ripristina Default
                </button>
                <button
                  onClick={() => { setShowDataModal(false); setShowBrainrot(true); }}
                  className="w-full py-4 flex items-center justify-center gap-2 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 rounded-xl transition-colors font-black uppercase tracking-widest text-sm mt-2"
                >
                  <Skull className="w-4 h-4 animate-pulse" />
                  /brainrot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Brainrot Game Modal */}
      {showBrainrot && (
        <BrainrotGame onClose={() => setShowBrainrot(false)} />
      )}

    </div>
  );
};

export default App;
