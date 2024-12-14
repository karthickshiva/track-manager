import { db } from '../config/firebase';
import { 
  collection, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  orderBy,
  setDoc
} from 'firebase/firestore';
import { Track, TrackFormData } from '../types/track';
import { fetchSpotifyTrack } from '../utils/spotify';
import { youtubeService } from './youtubeService';

const COLLECTION_NAME = 'tracks';

export const trackService = {
  async getTracks(): Promise<Track[]> {
    const tracksQuery = query(
      collection(db, COLLECTION_NAME),
      orderBy('addedAt', 'desc')
    );
    
    const snapshot = await getDocs(tracksQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Track));
  },

  async addTrack(formData: TrackFormData): Promise<Track> {
    const spotifyData = await fetchSpotifyTrack(formData.spotifyUrl);
    if (!spotifyData) {
      throw new Error('Invalid Spotify URL');
    }
  
    // Only search for YouTube URL if not manually provided
    const youtubeUrl = formData.youtubeUrl || await youtubeService.findMatchingVideo({
      title: spotifyData.title,
      artist: spotifyData.artist
    });
  
    const newTrack: Track = {
      ...spotifyData,
      ...formData,
      youtubeUrl,
      addedAt: new Date().toISOString(),
    };
  
    const docRef = doc(db, COLLECTION_NAME, spotifyData.id);
    await setDoc(docRef, newTrack);
  
    return newTrack;
  },

  async updateTrack(id: string, formData: TrackFormData): Promise<Track> {
    const spotifyData = await fetchSpotifyTrack(formData.spotifyUrl);
    if (!spotifyData) {
      throw new Error('Invalid Spotify URL');
    }

    // Only search for YouTube URL if not manually provided
    const youtubeUrl = formData.youtubeUrl || await youtubeService.findMatchingVideo({
      title: spotifyData.title,
      artist: spotifyData.artist
    });

    const updatedTrack: Omit<Track, 'id'> = {
      ...spotifyData,
      key: formData.key,
      timeSignature: formData.timeSignature,
      genre: formData.genre,
      tempo: formData.tempo,
      youtubeUrl,
      addedAt: new Date().toISOString()
    };

    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updatedTrack);
    
    return { ...updatedTrack, id };
  },

  async deleteTrack(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
};