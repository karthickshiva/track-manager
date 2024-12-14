import { SpotifyTrack } from '../../types/track';

const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_ENDPOINT = 'https://api.spotify.com/v1';

export async function getSpotifyAccessToken(): Promise<string> {
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

export async function fetchSpotifyAlbumTracks(albumId: string, accessToken: string): Promise<SpotifyTrack[]> {
  const response = await fetch(`${SPOTIFY_API_ENDPOINT}/albums/${albumId}/tracks`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch album tracks');
  }

  const data = await response.json();
  return data.items;
}

export async function fetchSpotifyArtistTopTracks(artistId: string, accessToken: string): Promise<SpotifyTrack[]> {
  const response = await fetch(`${SPOTIFY_API_ENDPOINT}/artists/${artistId}/top-tracks?market=US`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch artist tracks');
  }

  const data = await response.json();
  return data.tracks;
}