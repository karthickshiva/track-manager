export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  spotifyUrl: string;
}

export interface Track extends SpotifyTrack {
  key: string;
  timeSignature: string;
  genre: string;
  tempo: number;
  addedAt: string;
}

export type TrackFormData = Omit<Track, 'id' | 'addedAt' | 'title' | 'artist' | 'albumArt'> & {
  spotifyUrl: string;
};