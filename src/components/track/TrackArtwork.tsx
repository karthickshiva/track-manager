import React from 'react';
import { Music4 } from 'lucide-react';

interface TrackArtworkProps {
  albumArt?: string;
  title: string;
  artist: string;
}

export function TrackArtwork({ albumArt, title, artist }: TrackArtworkProps) {
  return (
    <div className="flex-shrink-0 w-16 h-16 mr-4">
      {albumArt ? (
        <img
          src={albumArt}
          alt={`${title} by ${artist}`}
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
          <Music4 className="text-gray-400" size={24} />
        </div>
      )}
    </div>
  );
}