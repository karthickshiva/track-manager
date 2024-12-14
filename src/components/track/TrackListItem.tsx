import React from 'react';
import { Track } from '../../types/track';
import { TrackMetadata } from './TrackMetadata';
import { TrackActions } from './TrackActions';
import { TrackInfo } from './TrackInfo';
import { TrackArtwork } from './TrackArtwork';

interface TrackListItemProps {
  track: Track;
  onEdit: (track: Track) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
  isDeleting: boolean;
}

export function TrackListItem({ track, onEdit, onDelete, isEditing, isDeleting }: TrackListItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-4">
      <div className="flex items-center p-4">
        <TrackArtwork
          albumArt={track.albumArt}
          title={track.title}
          artist={track.artist}
        />
        
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between">
            <TrackInfo
              title={track.title}
              artist={track.artist}
              album={track.album}
            />
            <TrackActions
              onEdit={() => onEdit(track)}
              onDelete={() => onDelete(track.id)}
              isEditing={isEditing}
              isDeleting={isDeleting}
            />
          </div>
          
          <TrackMetadata
            genre={track.genre}
            musicalKey={track.key}
            timeSignature={track.timeSignature}
            tempo={track.tempo}
          />
        </div>
      </div>
    </div>
  );
}