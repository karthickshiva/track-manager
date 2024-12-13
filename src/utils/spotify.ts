const SPOTIFY_URL_REGEX = /^(?:https:\/\/open\.spotify\.com\/track\/|spotify:track:)([a-zA-Z0-9]+)(?:\?.*)?$/;

export const extractSpotifyId = (url: string): string | null => {
  const match = url.match(SPOTIFY_URL_REGEX);
  return match ? match[1] : null;
};

// Mock Spotify data fetching (replace with actual Spotify API calls later)
export const fetchSpotifyTrack = async (url: string): Promise<SpotifyTrack | null> => {
  const trackId = extractSpotifyId(url);
  if (!trackId) return null;

  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock data - this would be replaced with actual Spotify API response
  return {
    id: trackId,
    title: "Sample Track",
    artist: "Sample Artist",
    albumArt: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=400",
    spotifyUrl: url
  };
};