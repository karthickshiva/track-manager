import React from 'react';
import { AudioWaveform } from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface TrackAnalyzeButtonProps {
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function TrackAnalyzeButton({ onAnalyze, isAnalyzing }: TrackAnalyzeButtonProps) {
  return (
    <button
      onClick={onAnalyze}
      disabled={isAnalyzing}
      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors 
        disabled:opacity-50 disabled:cursor-not-allowed"
      title="Analyze audio"
    >
      {isAnalyzing ? (
        <LoadingSpinner size={18} className="text-indigo-600" />
      ) : (
        <AudioWaveform size={18} />
      )}
    </button>
  );
}