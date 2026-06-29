
import { WorkoutDay } from './types';

export const WORKOUT_DATA: WorkoutDay[] = [
  {
    id: 1,
    title: "PUSH",
    subtitle: "Focus: Spinta & Ipertrofia",
    theme: "from-orange-500 to-red-600",
    accent: "text-orange-600",
    bgLight: "bg-orange-50",
    bgDark: "dark:bg-orange-950/20",
    exercises: [
      { name: "Weighted Push-ups", sets: "3 x 8-10", type: "chest", notes: "Keep core tight and elbows at 45 degrees" },
      { name: "Panca Piana Bilanciere", sets: "3 x 6-8", type: "chest", notes: "Esercizio base, massima forza" },
      { name: "Croci con Manubri (Piana)", sets: "3 x 12", type: "chest", notes: "Usa la stessa panca di prima" },
      { name: "Chest Press Inclinata", sets: "4 x 8-10", type: "chest", notes: "Ti sposti ai macchinari" },
      { name: "Pec Deck (Butterfly)", sets: "3 x 12", type: "chest", notes: "Isolamento finale petto" },
      { name: "Dips (Parallele)", sets: "3 x Max", type: "chest", notes: "Ultimo sforzo di spinta" }
    ]
  },
  {
    id: 2,
    title: "PULL",
    subtitle: "Focus: Tirata & Schiena Spessa",
    theme: "from-blue-500 to-indigo-600",
    accent: "text-blue-600",
    bgLight: "bg-blue-50",
    bgDark: "dark:bg-blue-950/20",
    exercises: [
      { name: "Weighted Push-ups", sets: "3 x 8-10", type: "chest", notes: "Keep core tight and elbows at 45 degrees" },
      { name: "Lat Machine Presa Larga", sets: "4 x 8-10", type: "back", notes: "Focus gran dorsale" },
      { name: "Pullover al Cavo Alto", sets: "3 x 15", type: "back", notes: "Stessa stazione, cambia impugnatura (corda)" },
      { name: "Pulley Basso (Stretto)", sets: "4 x 10", type: "back", notes: "Stazione di vogata" },
      { name: "Rematore Unilaterale Machine", sets: "3 x 10 per lato", type: "back", notes: "Focus spessore schiena" },
      { name: "Iperextensions", sets: "4 x 12-15", type: "back", notes: "Fondamentale per la tua carenza" },
      { name: "Avambracci", sets: "4 x 10", type: "forearms", notes: "Fles.-est. polsi su panca, picco contrazione e bruciore controllato" }
    ]
  },
  {
    id: 3,
    title: "UPPER FOCUS",
    subtitle: "Focus: Mix Carenze & Arm Killer",
    theme: "from-purple-500 to-pink-600",
    accent: "text-purple-600",
    bgLight: "bg-purple-50",
    bgDark: "dark:bg-purple-950/20",
    exercises: [
      { name: "Weighted Push-ups", sets: "3 x 8-10", type: "chest", notes: "Keep core tight and elbows at 45 degrees" },
      { name: "Chest Press Orizzontale", sets: "3 x 10", type: "chest", notes: "Adduci le scapole, mantieni il petto alto, spinta esplosiva e controlla il ritorno" },
      { name: "Lat Machine Inversa", sets: "4 x 10", type: "back", notes: "Presa supina stretta, porta la sbarra al petto basso contraendo il dorso" },
      { name: "Panca Inclinata Manubri", sets: "3 x 10-12", type: "chest", notes: "Panca a 30°, discesa controllata coi gomiti a 45°, spingi convergendoli in alto" },
      { name: "Vertical Row", sets: "3 x 10", type: "back", notes: "Petto saldo sul cuscino, scapole addotte, tira coi gomiti per massimo stimolo" },
      { name: "Face Pull", sets: "3 x 15", type: "shoulders", notes: "Tira la corda verso le orecchie separando le mani, focus deltoide posteriore" },
      { name: "Curl Bicipiti", sets: "3 x 12", type: "biceps", notes: "Cavo basso - Gomiti incollati ai fianchi, contrai forte al picco" },
      { name: "Pushdown Tricipiti", sets: "4 x 10", type: "triceps", notes: "Cavo alto - Gomiti fermi, spingi verso il basso e apri la corda alla fine" },
      { name: "Avambracci", sets: "4 x 10", type: "forearms", notes: "Fles.-est. polsi su panca, picco contrazione e bruciore controllato" }
    ]
  },
  {
    id: 4,
    title: "LEGS",
    subtitle: "Focus: Forza & Volume Gambe",
    theme: "from-emerald-500 to-teal-600",
    accent: "text-emerald-600",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-950/20",
    exercises: [
      { name: "Squat al Macchinario", sets: "4 x 8-10", type: "legs", notes: "Piedi posizionati per massima accosciata, scendi profondo, spingi con tutto il piede" },
      { name: "Leg Press 45°", sets: "3 x 12", type: "legs", notes: "Scendi controllando senza sollevare il bacino, spingi forte dal tallone" },
      { name: "Leg Extension", sets: "4 x 15", type: "legs", notes: "Schiena aderente allo schienale, tieni la contrazione di 1 sec nel punto massimo" },
      { name: "Leg Curl (Seduto/Sdraiato)", sets: "4 x 12", type: "legs", notes: "Movimento controllato, tieni il bacino fermo e strizza i femorali alla fine" },
      { name: "Polpacci al Macchinario", sets: "4 x 20", type: "calves", notes: "Pausa di 1 sec nel massimo allungamento in basso e in massima contrazione in alto" }
    ]
  },
  {
    id: 5,
    title: "ARM",
    subtitle: "Focus: Braccia & Ipertrofia",
    theme: "from-rose-500 to-red-600",
    accent: "text-rose-600",
    bgLight: "bg-rose-50",
    bgDark: "dark:bg-rose-950/20",
    exercises: [
      { name: "Weighted Push-ups", sets: "3 x 8-10", type: "chest", notes: "Keep core tight and elbows at 45 degrees" },
      { name: "French Press + Extension", sets: "3 x 10+10", type: "triceps", notes: "French: gomiti in alto, discesa dietro testa. Extension: sopra testa, ROM completo" },
      { name: "Pushdown Tricipiti", sets: "3 x 12", type: "triceps", notes: "Cavo alto - Gomiti fermi, spingi verso il basso e apri la corda alla fine" },
      { name: "Bicep Curl Machine", sets: "4 x 10-12", type: "biceps", notes: "ROM completo, gomiti fissi, contrazione picco 1 sec, lento in negativo" },
      { name: "Hammer Curl Manubri", sets: "3 x 10", type: "biceps", notes: "Presa neutra, gomito fisso, esecuzione lenta e controllata" },
      { name: "Alzate Laterali Manubri", sets: "3 x 15", type: "shoulders", notes: "Niente slancio, gomiti leggermente piegati, ROM completo ma controllato" },
      { name: "Avambracci", sets: "4 x 10", type: "forearms", notes: "Fles.-est. polsi su panca, picco contrazione e bruciore controllato" }
    ]
  }
];
