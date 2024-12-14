export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  spotifyUrl: string;
}

export interface Track extends SpotifyTrack {
  key: string;
  timeSignature: string;
  genre: string;
  tempo: number;
  addedAt: string;
  youtubeUrl?: string;
}

export type TrackFormData = Omit<Track, 'id' | 'addedAt' | 'title' | 'artist' | 'album' | 'albumArt'> & {
  spotifyUrl: string;
  youtubeUrl?: string;
};