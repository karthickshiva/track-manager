import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { SpotifyImportOptions, ImportProgress } from '../types/spotify';
import { Track } from '../types/track';
import { youtubeService } from './youtubeService';

const COLLECTION_NAME = 'tracks';

export const spotifyImportService = {
  async importFromSpotify(
    options: SpotifyImportOptions,
    onProgress: (progress: ImportProgress) => void
  ): Promise<void> {
    const tracks = await this.fetchTracks(options, onProgress);
    await this.saveTracks(tracks, onProgress);
  },

  private async fetchTracks(
    options: SpotifyImportOptions,
    onProgress: (progress: ImportProgress) => void
  ): Promise<Track[]> {
    const accessToken = await this.getSpotifyAccessToken();
    const tracks: Track[] = [];

    if (options.type === 'album') {
      const albumId = this.extractSpotifyId(options.url);
      const albumTracks = await this.fetchAlbumTracks(albumId, accessToken);
      
      onProgress({ total: albumTracks.length, current: 0, status: 'Fetching track details...' });
      
      for (let i = 0; i < albumTracks.length; i++) {
        const track = await this.processTrack(albumTracks[i], accessToken);
        tracks.push(track);
        onProgress({ 
          total: albumTracks.length, 
          current: i + 1, 
          status: `Processing track ${i + 1} of ${albumTracks.length}...` 
        });
      }
    } else {
      const artistId = this.extractSpotifyId(options.url);
      const artistTracks = await this.fetchArtistTopTracks(artistId, accessToken);
      
      onProgress({ total: artistTracks.length, current: 0, status: 'Fetching track details...' });
      
      for (let i = 0; i < artistTracks.length; i++) {
        const track = await this.processTrack(artistTracks[i], accessToken);
        tracks.push(track);
        onProgress({ 
          total: artistTracks.length, 
          current: i + 1, 
          status: `Processing track ${i + 1} of ${artistTracks.length}...` 
        });
      }
    }

    return tracks;
  },

  private async saveTracks(
    tracks: Track[],
    onProgress: (progress: ImportProgress) => void
  ): Promise<void> {
    const batches = [];
    const batchSize = 500; // Firestore batch limit

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
  },

  private async processTrack(spotifyTrack: any, accessToken: string): Promise<Track> {
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
};