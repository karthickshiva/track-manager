import React from 'react';
import { Track } from '../types/track';
import { Edit2, Trash2, Music4 } from 'lucide-react';

interface TrackListItemProps {
  track: Track;
  onEdit: (track: Track) => void;
  onDelete: (id: string) => void;
}

export default function TrackListItem({ track, onEdit, onDelete }: TrackListItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-4">
      <div className="flex items-center p-4">
        <div className="flex-shrink-0 w-16 h-16 mr-4">
          {track.albumArt ? (
            <img
              src={track.albumArt}
              alt={`${track.title} by ${track.artist}`}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
              <Music4 className="text-gray-400" size={24} />
            </div>
          )}
        </div>
        
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 truncate">{track.title}</h3>
              <p className="text-gray-600 truncate">{track.artist}</p>
            </div>
            <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
              <button
                onClick={() => onEdit(track)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Edit track"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDelete(track.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Delete track"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Key: {track.key}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Time: {track.timeSignature}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {track.tempo} BPM
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {track.genre}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}