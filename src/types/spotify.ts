export interface SpotifyImportOptions {
  type: 'album' | 'artist';
  url: string;
}

export interface ImportProgress {
  total: number;
  current: number;
  status: string;
}