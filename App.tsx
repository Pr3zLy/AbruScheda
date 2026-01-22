
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
  Construction,
  Upload,
  Download,
  Copy,
  RotateCcw,
  X,
  FileJson,
  Sparkles,
  Bot
} from 'lucide-react';
import WORKOUT_DATA_SEMPLIFICATO from './workout_data.json';
import { WorkoutDay } from './types';

// Funzione per convertire la struttura semplificata in struttura completa
const convertiStrutturaSemplificata = (data: any[]): WorkoutDay[] => {
  return data.map((scheda, index) => {
    // Raggruppa esercizi per tipo per creare zone automaticamente
    const gruppiPerTipo: Record<string, any[]> = {};

    scheda.esercizi.forEach((es: any) => {
      if (!gruppiPerTipo[es.tipo]) {
        gruppiPerTipo[es.tipo] = [];
      }
      gruppiPerTipo[es.tipo].push({
        name: es.nome,
        sets: es.serie,
        type: es.tipo,
        notes: es.note
      });
    });

    // Mappa dei tipi a nomi di zone più chiari
    const nomiZona: Record<string, string> = {
      chest: "Zona Petto",
      back: "Zona Schiena",
      shoulders: "Zona Spalle",
      legs: "Zona Gambe",
      triceps: "Zona Tricipiti",
      biceps: "Zona Bicipiti",
      calves: "Zona Polpacci"
    };

    const zones = Object.entries(gruppiPerTipo).map(([tipo, exercises]) => ({
      name: nomiZona[tipo] || `Zona ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`,
      exercises: exercises
    }));

    // Determina tema e colori basati sul titolo
    const titoloLower = scheda.title.toLowerCase();
    let theme, accent, bgLight, bgDark;

    if (titoloLower.includes('push')) {
      theme = "from-orange-500 to-red-600";
      accent = "text-orange-600";
      bgLight = "bg-orange-50";
      bgDark = "dark:bg-orange-950/20";
    } else if (titoloLower.includes('pull')) {
      theme = "from-blue-500 to-indigo-600";
      accent = "text-blue-600";
      bgLight = "bg-blue-50";
      bgDark = "dark:bg-blue-950/20";
    } else if (titoloLower.includes('upper') || titoloLower.includes('mix')) {
      theme = "from-purple-500 to-pink-600";
      accent = "text-purple-600";
      bgLight = "bg-purple-50";
      bgDark = "dark:bg-purple-950/20";
    } else if (titoloLower.includes('leg')) {
      theme = "from-emerald-500 to-teal-600";
      accent = "text-emerald-600";
      bgLight = "bg-emerald-50";
      bgDark = "dark:bg-emerald-950/20";
    } else {
      // Default colors
      theme = "from-slate-500 to-slate-600";
      accent = "text-slate-600";
      bgLight = "bg-slate-50";
      bgDark = "dark:bg-slate-950/20";
    }

    return {
      id: index + 1,
      title: scheda.title,
      subtitle: scheda.subtitle,
      theme: theme,
      accent: accent,
      bgLight: bgLight,
      bgDark: bgDark,
      zones: zones
    };
  });
};

const WORKOUT_DATA = convertiStrutturaSemplificata(WORKOUT_DATA_SEMPLIFICATO);
import TypeIcon from './components/TypeIcon';
import Timer from './components/Timer';

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
    "title": "GIORNO 1",
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
    "title": "GIORNO 2",
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

  const [workoutData, setWorkoutData] = useState<WorkoutDay[]>(WORKOUT_DATA);
  const [showDataModal, setShowDataModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('custom_workout_data', JSON.stringify(workoutData));
  }, [workoutData]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showDataModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDataModal]);

  const activeDay = workoutData[activeDayIdx] || workoutData[0];

  const validateWorkoutData = (data: any): data is WorkoutDay[] => {
    if (!Array.isArray(data)) throw new Error("Il file deve contenere un array di schede.");

    data.forEach((day, index) => {
      if (typeof day !== 'object' || day === null) throw new Error(`L'elemento ${index + 1} non è un oggetto valido.`);

      const requiredDayFields = ['id', 'title', 'subtitle', 'theme', 'accent', 'bgLight', 'bgDark', 'zones'];
      requiredDayFields.forEach(field => {
        if (!(field in day)) throw new Error(`Scheda ${index + 1}: Manca il campo obbligatorio '${field}'.`);
      });

      if (!Array.isArray(day.zones)) throw new Error(`Scheda ${index + 1}: 'zones' deve essere un array.`);

      day.zones.forEach((zone: any, zIndex: number) => {
        if (typeof zone !== 'object' || zone === null) throw new Error(`Scheda ${index + 1}, Zona ${zIndex + 1}: Non valido.`);
        if (!('name' in zone)) throw new Error(`Scheda ${index + 1}, Zona ${zIndex + 1}: Manca il nome.`);
        if (!Array.isArray(zone.exercises)) throw new Error(`Scheda ${index + 1}, Zona ${zIndex + 1}: 'exercises' deve essere un array.`);

        zone.exercises.forEach((ex: any, eIndex: number) => {
          if (typeof ex !== 'object' || ex === null) throw new Error(`Scheda ${index + 1}, Zona ${zIndex + 1}, Esercizio ${eIndex + 1}: Non valido.`);
          const reqExFields = ['name', 'sets', 'type', 'notes'];
          reqExFields.forEach(f => {
            if (!(f in ex)) throw new Error(`Scheda ${index + 1}, Zona ${zIndex + 1}, Esercizio ${eIndex + 1}: Manca '${f}'.`);
          });
        });
      });
    });

    return true;
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

        if (!Array.isArray(data)) throw new Error("Il file deve contenere un array di schede.");
        if (data.length === 0) throw new Error("Il file è vuoto.");

        // Rileva se è il formato semplificato (quello generato dall'AI)
        const isSimplified = 'esercizi' in data[0] && !('zones' in data[0]);

        let finalData: WorkoutDay[];

        if (isSimplified) {
          try {
            finalData = convertiStrutturaSemplificata(data);
          } catch (e) {
            throw new Error("Errore durante la conversione del formato semplificato. Verifica la struttura.");
          }
        } else {
          // Valida il formato completo
          if (validateWorkoutData(data)) {
            finalData = data;
          } else {
            // Questo punto non dovrebbe essere raggiunto perché validateWorkoutData lancia eccezioni
            throw new Error("Formato dati non valido.");
          }
        }

        setWorkoutData(finalData);
        setShowDataModal(false);
        setActiveDayIdx(0);
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
      esercizi: day.zones.flatMap(zone =>
        zone.exercises.map(ex => ({
          nome: ex.name,
          serie: ex.sets,
          tipo: ex.type,
          note: ex.notes
        }))
      )
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
    // Costruiamo il prompt completo da inserire nel link
    const basePrompt = "Agisci come un Personal Trainer esperto. Memorizza questa struttura JSON per creare schede di allenamento di alta qualità. Nelle prossime risposte, quando ti chiederò di creare una scheda, rispondi ESCLUSIVAMENTE con un JSON valido che rispetti questo formato, ottimizzando volume, scelta degli esercizi e note tecniche per l'ipertrofia. STRUTTURA DA MEMORIZZARE:";
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
        zones: [
          {
            name: "Zona Esempio (Panche/Banchina)",
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
              }
            ]
          },
          {
            name: "Zona Spalle & Tricipiti",
            exercises: [
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
              <button
                onClick={() => setShowDataModal(true)}
                className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl hover:bg-white/30 transition-colors active:scale-95"
              >
                <Dumbbell className="w-5 h-5 text-white float-anim" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-2 py-2">
            {workoutData.map((day, idx) => (
              <button
                key={day.id}
                onClick={() => setActiveDayIdx(idx)}
                className={`flex-1 min-w-[45%] sm:min-w-0 px-4 py-3 rounded-full text-xs font-black whitespace-nowrap transition-all uppercase tracking-tighter ${activeDayIdx === idx
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
        <div className="sticky top-4 z-40 bg-white/95 dark:bg-slate-900 backdrop-blur-2xl p-5 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
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
          {activeDay.zones.flatMap(zone => zone.exercises).map((ex, idx) => {
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
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md p-1 bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl rounded-full border border-slate-200 dark:border-slate-800 shadow-2xl z-50 transition-all duration-500 ${isScrolled ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="flex justify-around items-center">
          {workoutData.map((day, idx) => (
            <button
              key={day.id}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-full transition-all flex-1 ${activeDayIdx === idx ? `${day.accent.replace('text', 'bg')} text-white scale-105 shadow-lg` : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
              onClick={() => setActiveDayIdx(idx)}
            >
              {idx === 0 && <Flame className="w-4 h-4" />}
              {idx === 1 && <Zap className="w-4 h-4" />}
              {idx === 2 && <Dumbbell className="w-4 h-4" />}
              {idx === 3 && <Construction className="w-4 h-4" />}
              <span className="text-[7px] font-black tracking-widest uppercase">{day.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Management Modal */}
      {showDataModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
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
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Importa Dati</span>
                  <span className="text-xs text-slate-400 mt-1">Sovrascrive i dati esistenti</span>
                  <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                </label>

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
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Crea SCHEDA con AI 100% GRATIS</label>
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

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleReset}
                  className="w-full py-4 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-medium text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Ripristina Default
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
