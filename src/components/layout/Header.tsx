import React from 'react';
import { Plus, Music } from 'lucide-react';

interface HeaderProps {
  onAddTrack: () => void;
}

export function Header({ onAddTrack }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <Music className="text-indigo-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-900">Track Manager</h1>
      </div>
      <button
        onClick={onAddTrack}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        <Plus size={20} />
        Add Track
      </button>
    </div>
  );
}