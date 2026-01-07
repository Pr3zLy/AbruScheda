
import React from 'react';
import { MuscleGroup } from '../types';

interface TypeIconProps {
  type: MuscleGroup;
  isDone: boolean;
}

const TypeIcon: React.FC<TypeIconProps> = ({ type, isDone }) => {
  const colorClass = isDone ? 'text-slate-400' : {
    chest: 'text-rose-500',
    back: 'text-emerald-500',
    shoulders: 'text-amber-500',
    biceps: 'text-sky-500',
    triceps: 'text-violet-500',
    legs: 'text-teal-500',
    calves: 'text-teal-600',
    core: 'text-indigo-500'
  }[type] || 'text-slate-500';

  const svgClass = `w-6 h-6 ${colorClass} transition-colors duration-300`;

  switch (type) {
    case 'chest':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <path d="M4 7h16" />
          <path d="M4 17h16" />
          <path d="M7 7c0 7 5 10 5 10s5-3 5-10" />
          <path d="M12 7v10" />
          <path d="M9 11h6" />
        </svg>
      );
    case 'back':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <path d="M12 3l-5 5v12a2 2 0 002 2h6a2 2 0 002-2V8l-5-5z" />
          <path d="M12 3v13" />
          <path d="M7 12l5-2 5 2" />
          <path d="M7 16l5-2 5 2" />
        </svg>
      );
    case 'shoulders':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <path d="M12 4a3 3 0 100-6 3 3 0 000 6z" />
          <path d="M6 8l6-4 6 4" />
          <path d="M6 8v8" />
          <path d="M18 8v8" />
          <path d="M6 12h12" />
        </svg>
      );
    case 'biceps':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <path d="M6 19l2-2" />
          <path d="M18 19l-2-2" />
          <path d="M12 21a9 9 0 0 0 9-9 9 9 0 0 0-4-7.5l-1 .6a3 3 0 0 0-4.6 2.5 3 3 0 0 0-1.6 3.9" />
          <path d="M8 12a4 4 0 0 1 4-4" />
        </svg>
      );
    case 'triceps':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <path d="M12 4v10" />
          <path d="M8 8l4 4 4-4" />
          <path d="M8 14h8" />
          <path d="M12 14v6" />
        </svg>
      );
    case 'legs':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <path d="M9 5l1 14h4l1-14" />
          <path d="M12 2v20" />
          <path d="M5 8l4 2" />
          <path d="M19 8l-4 2" />
        </svg>
      );
    case 'calves':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <path d="M12 2v10" />
          <path d="M8 12l4 10 4-10" />
          <path d="M8 12h8" />
          <path d="M12 22h.01" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};

export default TypeIcon;
