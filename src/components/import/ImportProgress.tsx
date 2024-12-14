import React from 'react';
import { ImportProgress } from '../../types/spotify';

interface ImportProgressBarProps {
  progress: ImportProgress;
}

export function ImportProgressBar({ progress }: ImportProgressBarProps) {
  const percentage = (progress.current / progress.total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{progress.status}</span>
        <span>{progress.current} / {progress.total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}