import React from 'react';
import { Plus, Music, Album, Import } from 'lucide-react';

interface HeaderProps {
  onAddTrack: () => void;
  onImport: () => void;
}

export function Header({ onAddTrack, onImport }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <Music className="text-indigo-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-900">Track Manager</h1>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onImport}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 
            rounded-md hover:bg-indigo-200 transition-colors"
        >
          <Import size={20} />
          Import
        </button>
        <button
          onClick={onAddTrack}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white 
            rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Add Track
        </button>
      </div>
    </div>
  );
}