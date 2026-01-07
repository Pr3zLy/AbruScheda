
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
          <path d="M4.5 10.5C4.5 9 6.5 8 9 8C10.5 8 11.5 8.5 12 9.5C12.5 8.5 13.5 8 15 8C17.5 8 19.5 9 19.5 10.5C19.5 15 15.5 17 12 17C8.5 17 4.5 15 4.5 10.5Z" />
          <path d="M12 9V17" />
          <path d="M4 8C4 6 6 4 9 4C10.5 4 11.5 5 12 6C12.5 5 13.5 4 15 4C18 4 20 6 20 8" />
          <path d="M7 11C7 11 8 12 9 12" />
          <path d="M17 11C17 11 16 12 15 12" />
        </svg>
      );
    case 'back':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <path d="M12 4C13.5 4 14.5 5 15 5.5V11L19.5 7.5L21 9C21 13 18 19 12 21C6 19 3 13 3 9L4.5 7.5L9 11V5.5C9.5 5 10.5 4 12 4Z" />
          <path d="M12 4V21" />
          <path d="M9 11L12 14L15 11" />
          <path d="M5.5 10C5.5 10 7 13 9 14" />
          <path d="M18.5 10C18.5 10 17 13 15 14" />
        </svg>
      );
    case 'shoulders':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <path d="M4 11C4 8 6 6 9 6H15C18 6 20 8 20 11C20 14.5 17.5 15 16 15L15 18H9L8 15C6.5 15 4 14.5 4 11Z" />
          <path d="M12 5V6" />
          <path d="M9 6C9 4.5 10.5 3 12 3C13.5 3 15 4.5 15 6" />
          <path d="M7 11C7 9.5 8 9 9 9" />
          <path d="M17 11C17 9.5 16 9 15 9" />
          <path d="M8 15L12 18L16 15" />
        </svg>
      );
    case 'biceps':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <path d="M6 16L9.5 12.5" />
          <path d="M9 12C9 12 8.5 9 11 8C13.5 7 15 9 15.5 11" />
          <circle cx="15.5" cy="11.5" r="2.5" />
          <path d="M17 9.5L19 7.5" />
          <path d="M13 13.5L11 16.5C10 18 8 18 6 16" />
          <path d="M12.5 11.5C12.5 11.5 12 14 15 14" />
        </svg>
      );
    case 'triceps':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <path d="M8 8C8 5 10 4 12 4C14 4 16 5 16 8V12C16 14.5 14.5 17 14 18L13 20H11L10 18C9.5 17 8 14.5 8 12V8Z" />
          <path d="M12 4V14" />
          <path d="M8 9C9 9 10 10 12 10C14 10 15 9 16 9" />
          <path d="M10 14L12 16L14 14" />
        </svg>
      );
    case 'legs':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <path d="M5 5L7 16C7 16 8 19 10 19H14C16 19 17 16 17 16L19 5" />
          <path d="M5 5H19" />
          <path d="M12 5V19" />
          <path d="M7 9C7 9 9 12 10 12" />
          <path d="M17 9C17 9 15 12 14 12" />
          <path d="M9 16L12 14L15 16" />
        </svg>
      );
    case 'calves':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <path d="M8 5L9 11C9 13 8 14 7 15L8 19H16L17 15C16 14 15 13 15 11L16 5" />
          <path d="M8 5H16" />
          <path d="M12 5V19" />
          <path d="M9 9C9 9 10 10 12 10C14 10 15 9 15 9" />
          <path d="M10 15L12 12L14 15" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3V21" />
          <path d="M3 12H21" />
        </svg>
      );
  }
};

export default TypeIcon;
