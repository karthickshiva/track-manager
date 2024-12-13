import { useState, useMemo } from 'react';
import { Track } from '../types/track';
import { searchTracks } from '../utils/search';

export const useSearch = (tracks: Track[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTracks = useMemo(() => {
    return searchTracks(tracks, searchQuery);
  }, [tracks, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredTracks
  };
};