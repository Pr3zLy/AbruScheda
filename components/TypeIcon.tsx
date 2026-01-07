
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
    arms: 'text-sky-500',
    legs: 'text-teal-500',
    core: 'text-indigo-500'
  }[type] || 'text-slate-500';

  const svgClass = `w-6 h-6 ${colorClass} transition-colors duration-300`;

  // Custom SVGs representing muscle groups
  switch (type) {
    case 'chest':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <path d="M12 20c-4.5 0-8-3.5-8-6 0-1 1-3.5 3-4.5.5-.2 1.5-.5 3-1l2-2.5 2 2.5c1.5.5 2.5.8 3 1 2 1 3 3.5 3 4.5 0 2.5-3.5 6-8 6z" />
          <path d="M12 7v13" />
          <path d="M7 11.5c1.5 1 3 1.5 5 1.5s3.5-.5 5-1.5" />
        </svg>
      );
    case 'back':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <path d="M12 4v16M4 7c3 1 5 4 8 4s5-3 8-4M4 14c3 1 5 4 8 4s5-3 8-4M8 4l2 3M16 4l-2 3" />
          <path d="M12 4L8 10h8l-4-6z" fill="currentColor" fillOpacity="0.1" />
        </svg>
      );
    case 'shoulders':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <circle cx="12" cy="7" r="3" />
          <path d="M5 10c1 0 2 1 3 3v4M19 10c-1 0-2 1-3 3v4M8 13c1 1 2 1.5 4 1.5s3-.5 4-1.5" />
          <rect x="10" y="17" width="4" height="4" rx="1" />
        </svg>
      );
    case 'arms':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <path d="M15 15c-1.5-1-4-1.5-6-1-1.5.5-3 2-3.5 4M6 18c-1-1.5-1.5-4 0-6 1-1.5 3-2.5 5-2.5.5 0 1.5.2 2 .5l2-2" />
          <path d="M15 12c1.5-.5 3.5-2 3.5-4s-1-4-3-4-4 2-4 4c0 1 .5 2 1.5 3" />
          <path d="M11 8c-1-1-3-1-4 0" />
        </svg>
      );
    case 'legs':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <path d="M7 4l2 9h6l2-9" />
          <path d="M9 13v7M15 13v7" />
          <path d="M7 20h4M13 20h4" />
          <path d="M12 4c-1.5 0-3 1-3 3s1.5 3 3 3 3-1 3-3-1.5-3-3-3z" />
        </svg>
      );
    case 'core':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <rect x="8" y="4" width="8" height="16" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h8M12 4v16" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
  }
};

export default TypeIcon;
