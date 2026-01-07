
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
    zones: [
      {
        name: "Zona Panche",
        exercises: [
          { name: "Panca Piana Bilanciere", sets: "3 x 6-8", type: "chest", notes: "Esercizio base, massima forza" },
          { name: "Croci con Manubri (Piana)", sets: "3 x 12", type: "chest", notes: "Usa la stessa panca di prima" }
        ]
      },
      {
        name: "Zona Macchine",
        exercises: [
          { name: "Chest Press Inclinata", sets: "4 x 8-10", type: "chest", notes: "Ti sposti ai macchinari" },
          { name: "Pec Deck (Butterfly)", sets: "3 x 12", type: "chest", notes: "Isolamento finale petto" },
          { name: "Dips (Parallele)", sets: "3 x Max", type: "chest", notes: "Ultimo sforzo di spinta" }
        ]
      },
      {
        name: "Zona Spalle & Tricipiti",
        exercises: [
          { name: "Alzate Laterali Manubri", sets: "3 x 15", type: "shoulders", notes: "Focus deltoide laterale" },
          { name: "French Press + Extension", sets: "3 x 10+10", type: "arms", notes: "Superset con manubri su panca" }
        ]
      }
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
    zones: [
      {
        name: "Zona Alto Cavo",
        exercises: [
          { name: "Lat Machine Presa Larga", sets: "4 x 8-10", type: "back", notes: "Focus gran dorsale" },
          { name: "Pullover al Cavo Alto", sets: "3 x 15", type: "back", notes: "Stessa stazione, cambia impugnatura (corda)" }
        ]
      },
      {
        name: "Zona Row",
        exercises: [
          { name: "Pulley Basso (Stretto)", sets: "4 x 10", type: "back", notes: "Stazione di vogata" },
          { name: "Rematore Unilaterale Machine", sets: "3 x 10 per lato", type: "back", notes: "Focus spessore schiena" }
        ]
      },
      {
        name: "Bassa Schiena & Bicipiti",
        exercises: [
          { name: "Iperextensions", sets: "4 x 12-15", type: "back", notes: "Fondamentale per la tua carenza" },
          { name: "Bicep Curl Machine", sets: "4 x 10-12", type: "arms", notes: "Alla tua macchina preferita" },
          { name: "Hammer Curl Manubri", sets: "3 x 10", type: "arms", notes: "Falli anche seduto vicino alla macchina" }
        ]
      }
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
    zones: [
      {
        name: "Zona Macchine",
        exercises: [
          { name: "Chest Press Orizzontale", sets: "3 x 10", type: "chest", notes: "Inizia col petto (punto debole)" },
          { name: "Lat Machine Inversa", sets: "4 x 10", type: "back", notes: "Alterna spinta e tirata" }
        ]
      },
      {
        name: "Zona Panche & Macchine",
        exercises: [
          { name: "Panca Inclinata Manubri", sets: "3 x 10-12", type: "chest", notes: "Zona panche" },
          { name: "Vertical Row", sets: "3 x 10", type: "back", notes: "Zona macchine" }
        ]
      },
      {
        name: "Stazione Cavi (Multi-task)",
        exercises: [
          { name: "Face Pull ai Cavi", sets: "3 x 15", type: "shoulders", notes: "Posteriore spalle" },
          { name: "Bicep Curl Machine", sets: "3 x 10 + Rest-Pause", type: "arms", notes: "15\" pausa tra i micro-set finali" },
          { name: "Pushdown Tricipiti", sets: "3 x 12", type: "arms", notes: "Cavo alto - Stesso gancio per dopo" },
          { name: "Curl Bicipiti", sets: "3 x 12", type: "arms", notes: "Sposta il gancio in basso e chiudi" }
        ]
      }
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
    zones: [
      {
        name: "Zona Potenza",
        exercises: [
          { name: "Squat al Macchinario", sets: "4 x 8-10", type: "legs", notes: "Hack squat o Smith Machine, massima profondità" },
          { name: "Leg Press 45°", sets: "3 x 12", type: "legs", notes: "Piedi medi, focus spinta di tallone" }
        ]
      },
      {
        name: "Zona Isolamento",
        exercises: [
          { name: "Leg Extension", sets: "4 x 15", type: "legs", notes: "Contrazione di 1 secondo in alto" },
          { name: "Leg Curl (Seduto/Sdraiato)", sets: "4 x 12", type: "legs", notes: "Focus femorali, controlla il ritorno" }
        ]
      },
      {
        name: "Zona Polpacci",
        exercises: [
          { name: "Polpacci al Macchinario", sets: "4 x 20", type: "legs", notes: "Massimo stretching nella fase bassa" }
        ]
      }
    ]
  }
];
