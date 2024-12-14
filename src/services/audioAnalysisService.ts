import Meyda from 'meyda';
import { Track } from '../types/track';

export interface AudioAnalysis {
  key: string;
  tempo: number;
  timeSignature: string;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function detectKey(chromaFeatures: number[]): string {
  // Find the most prominent note in the chroma features
  const maxIndex = chromaFeatures.indexOf(Math.max(...chromaFeatures));
  return NOTE_NAMES[maxIndex];
}

function detectTimeSignature(rms: number[]): string {
  // Analyze energy peaks to determine time signature
  const peaks = findPeaks(rms);
  const avgPeakDistance = calculateAveragePeakDistance(peaks);
  
  // Simple heuristic for time signature based on peak distances
  if (avgPeakDistance % 3 === 0) return '3/4';
  if (avgPeakDistance % 4 === 0) return '4/4';
  return '4/4'; // Default to 4/4 if unsure
}

function findPeaks(signal: number[]): number[] {
  const peaks: number[] = [];
  for (let i = 1; i < signal.length - 1; i++) {
    if (signal[i] > signal[i - 1] && signal[i] > signal[i + 1]) {
      peaks.push(i);
    }
  }
  return peaks;
}

function calculateAveragePeakDistance(peaks: number[]): number {
  if (peaks.length < 2) return 4; // Default to 4 if not enough peaks
  let totalDistance = 0;
  for (let i = 1; i < peaks.length; i++) {
    totalDistance += peaks[i] - peaks[i - 1];
  }
  return totalDistance / (peaks.length - 1);
}

export const audioAnalysisService = {
  async analyzeTrack(track: Track): Promise<AudioAnalysis> {
    if (!track.youtubeUrl) {
      throw new Error('No YouTube URL available for analysis');
    }

    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(audio);
      
      // Connect to audio context for analysis
      source.connect(audioContext.destination);

      // Initialize Meyda analyzer
      const analyzer = Meyda.createMeydaAnalyzer({
        audioContext: audioContext,
        source: source,
        bufferSize: 2048,
        featureExtractors: ['chroma', 'rms', 'energy', 'spectralCentroid'],
        callback: (features) => {
          if (!features) return;

          // Accumulate features for analysis
          const key = detectKey(features.chroma);
          const timeSignature = detectTimeSignature(features.rms);
          const tempo = Math.round(features.energy * 120 + 60); // Map energy to BPM range

          // Clean up
          analyzer.stop();
          audioContext.close();
          audio.pause();

          resolve({
            key,
            tempo: Math.min(Math.max(tempo, 60), 200), // Clamp between 60-200 BPM
            timeSignature
          });
        }
      });

      // Start analysis when audio starts playing
      audio.oncanplaythrough = () => {
        analyzer.start();
        audio.play();
      };

      // Handle errors
      audio.onerror = () => {
        analyzer.stop();
        audioContext.close();
        reject(new Error('Failed to load audio'));
      };

      // Set audio source
      audio.crossOrigin = 'anonymous';
      audio.src = track.youtubeUrl;
    });
  }
};