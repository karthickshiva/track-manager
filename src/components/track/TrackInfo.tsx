import React from 'react';

interface TrackInfoProps {
  title: string;
  artist: string;
  album: string;
}

export function TrackInfo({ title, artist, album }: TrackInfoProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
      <p className="text-gray-600 truncate">{artist}</p>
      <p className="text-gray-500 text-sm truncate">{album}</p>
    </div>
  );
}