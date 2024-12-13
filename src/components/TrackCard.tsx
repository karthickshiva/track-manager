import React from 'react';
import { Track } from '../types/track';
import { Edit2, Trash2 } from 'lucide-react';

interface TrackCardProps {
  track: Track;
  onEdit: (track: Track) => void;
  onDelete: (id: string) => void;
}

export default function TrackCard({ track, onEdit, onDelete }: TrackCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-square w-full">
        <div className="relative w-full h-full overflow-hidden rounded-t-lg">
          <img
            src={track.albumArt}
            alt={`${track.title} by ${track.artist}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{track.title}</h3>
        <p className="text-gray-600 truncate">{track.artist}</p>

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            Key: {track.key}
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            Time: {track.timeSignature}
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            Genre: {track.genre}
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            {track.tempo} BPM
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => onEdit(track)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(track.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}