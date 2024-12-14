import { SpotifyTrack } from "../types/track";

const SPOTIFY_URL_REGEX = /^(?:https:\/\/open\.spotify\.com\/track\/|spotify:track:)([a-zA-Z0-9]+)(?:\?.*)?$/;
const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_ENDPOINT = 'https://api.spotify.com/v1';

export const extractSpotifyId = (url: string): string | null => {
  const match = url.match(SPOTIFY_URL_REGEX);
  return match ? match[1] : null;
};

async function getSpotifyAccessToken(): Promise<string> {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Spotify credentials');
  }

  const base64Credentials = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${base64Credentials}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

export const fetchSpotifyTrack = async (url: string): Promise<SpotifyTrack | null> => {
  const trackId = extractSpotifyId(url);
  if (!trackId) return null;

  try {
    const accessToken = await getSpotifyAccessToken();
    const response = await fetch(`${SPOTIFY_API_ENDPOINT}/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch track: ${response.statusText}`);
    }

    const track = await response.json();
    
    return {
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      albumArt: track.album.images[0]?.url,
      spotifyUrl: url,
    };
  } catch (error) {
    console.error('Error fetching Spotify track:', error);
    return null;
  }
};

export const getSpotifyEmbedUrl = (spotifyUrl: string): string => {
  const trackId = spotifyUrl.split("/track/")[1]?.split("?")[0];
  return `https://open.spotify.com/embed/track/${trackId}`;
};