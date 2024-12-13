import { Track } from '../types/track';

export const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    albumArt: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=400',
    key: 'Bb',
    timeSignature: '4/4',
    genre: 'Rock',
    tempo: 72,
    addedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    albumArt: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=400',
    key: 'F#m',
    timeSignature: '4/4',
    genre: 'Pop',
    tempo: 117,
    addedAt: new Date().toISOString()
  }
];

export const timeSignatures = ['4/4', '3/4', '6/8', '2/4', '5/4'];
export const musicalKeys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m', 'Dm', 'Gm', 'Cm'];
export const genres = ['Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Classical', 'Electronic', 'Folk', 'Country', 'Blues'];