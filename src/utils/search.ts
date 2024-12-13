import { Track } from '../types/track';

export const searchTracks = (tracks: Track[], query: string): Track[] => {
  if (!query.trim()) return tracks;

  const searchTerms = query.toLowerCase().trim().split(/\s+/);

  return tracks.filter(track => {
    const searchableFields = [
      track.title,
      track.artist,
      track.genre,
      track.key,
      track.timeSignature,
      track.tempo.toString()
    ];

    const trackText = searchableFields.join(' ').toLowerCase();

    return searchTerms.every(term => trackText.includes(term));
  });
};