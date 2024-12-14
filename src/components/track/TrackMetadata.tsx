import React from 'react';
import { Badge } from '../ui/Badge';

interface TrackMetadataProps {
  genre: string;
  musicalKey: string;  // renamed from 'key' to avoid React prop naming conflict
  timeSignature: string;
  tempo: number;
}

export function TrackMetadata({ genre, musicalKey, timeSignature, tempo }: TrackMetadataProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <Badge label="Key" value={musicalKey} />
      <Badge label="Time" value={timeSignature} />
      <Badge label="BPM" value={tempo} />
      <Badge label={genre} />
    </div>
  );
}