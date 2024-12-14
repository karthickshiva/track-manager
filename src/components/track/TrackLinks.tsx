import React from 'react';
import { Youtube, Music } from 'lucide-react';

interface TrackLinksProps {
  spotifyUrl: string;
  youtubeUrl?: string;
}

export function TrackLinks({ spotifyUrl, youtubeUrl }: TrackLinksProps) {
  return (
    <div className="flex gap-2 mt-2">
      <a
        href={spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
      >
        <Music size={16} />
        <span>Spotify</span>
      </a>
      {youtubeUrl && (
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
        >
          <Youtube size={16} />
          <span>YouTube</span>
        </a>
      )}
    </div>
  );
}