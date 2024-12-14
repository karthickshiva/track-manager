import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { SpotifyImportOptions, ImportProgress } from '../../types/spotify';
import { Track } from '../../types/track';
import { youtubeService } from '../youtubeService';
import { getSpotifyAccessToken, fetchSpotifyAlbumTracks, fetchSpotifyArtistTopTracks } from './spotifyApi';
import { extractSpotifyId } from './spotifyUtils';

const COLLECTION_NAME = 'tracks';

async function processTrack(spotifyTrack: any): Promise<Track> {
  const youtubeUrl = await youtubeService.findMatchingVideo({
    title: spotifyTrack.name,
    artist: spotifyTrack.artists[0].name
  });

  return {
    id: spotifyTrack.id,
    title: spotifyTrack.name,
    artist: spotifyTrack.artists[0].name,
    album: spotifyTrack.album.name,
    albumArt: spotifyTrack.album.images[0]?.url,
    spotifyUrl: `https://open.spotify.com/track/${spotifyTrack.id}`,
    youtubeUrl,
    key: 'Yet to identify',
    timeSignature: 'Yet to identify',
    genre: 'Yet to identify',
    tempo: 0,
    addedAt: new Date().toISOString()
  };
}

async function fetchTracks(
  options: SpotifyImportOptions,
  onProgress: (progress: ImportProgress) => void
): Promise<Track[]> {
  const accessToken = await getSpotifyAccessToken();
  const tracks: Track[] = [];

  if (options.type === 'album') {
    const albumId = extractSpotifyId(options.url, 'album');
    const albumTracks = await fetchSpotifyAlbumTracks(albumId, accessToken);
    
    onProgress({ total: albumTracks.length, current: 0, status: 'Fetching track details...' });
    
    for (let i = 0; i < albumTracks.length; i++) {
      const track = await processTrack(albumTracks[i]);
      tracks.push(track);
      onProgress({ 
        total: albumTracks.length, 
        current: i + 1, 
        status: `Processing track ${i + 1} of ${albumTracks.length}...` 
      });
    }
  } else {
    const artistId = extractSpotifyId(options.url, 'artist');
    const artistTracks = await fetchSpotifyArtistTopTracks(artistId, accessToken);
    
    onProgress({ total: artistTracks.length, current: 0, status: 'Fetching track details...' });
    
    for (let i = 0; i < artistTracks.length; i++) {
      const track = await processTrack(artistTracks[i]);
      tracks.push(track);
      onProgress({ 
        total: artistTracks.length, 
        current: i + 1, 
        status: `Processing track ${i + 1} of ${artistTracks.length}...` 
      });
    }
  }

  return tracks;
}

async function saveTracks(
  tracks: Track[],
  onProgress: (progress: ImportProgress) => void
): Promise<void> {
  const batches = [];
  const batchSize = 500;

  onProgress({ total: tracks.length, current: 0, status: 'Saving tracks...' });

  for (let i = 0; i < tracks.length; i += batchSize) {
    const batch = writeBatch(db);
    const batchTracks = tracks.slice(i, i + batchSize);

    batchTracks.forEach(track => {
      const docRef = doc(db, COLLECTION_NAME, track.id);
      batch.set(docRef, track);
    });

    batches.push(batch);
  }

  for (let i = 0; i < batches.length; i++) {
    await batches[i].commit();
    const completedTracks = Math.min((i + 1) * batchSize, tracks.length);
    onProgress({ 
      total: tracks.length, 
      current: completedTracks, 
      status: `Saved ${completedTracks} of ${tracks.length} tracks...` 
    });
  }
}

export const spotifyImportService = {
  async importFromSpotify(
    options: SpotifyImportOptions,
    onProgress: (progress: ImportProgress) => void
  ): Promise<void> {
    const tracks = await fetchTracks(options, onProgress);
    await saveTracks(tracks, onProgress);
  }
};