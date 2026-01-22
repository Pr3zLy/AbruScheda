
export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'legs' | 'calves' | 'forearms';

export interface Exercise {
  name: string;
  sets: string;
  type: MuscleGroup;
  notes: string;
}

export interface GymZone {
  name: string;
  exercises: Exercise[];
}

export interface WorkoutDay {
  id: number;
  title: string;
  subtitle: string;
  theme: string;
  accent: string;
  bgLight: string;
  bgDark: string;
  zones: GymZone[];
}
