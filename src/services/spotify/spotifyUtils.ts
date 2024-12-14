const SPOTIFY_URL_REGEX = {
  track: /^(?:https:\/\/open\.spotify\.com\/track\/|spotify:track:)([a-zA-Z0-9]+)(?:\?.*)?$/,
  album: /^(?:https:\/\/open\.spotify\.com\/album\/|spotify:album:)([a-zA-Z0-9]+)(?:\?.*)?$/,
  artist: /^(?:https:\/\/open\.spotify\.com\/artist\/|spotify:artist:)([a-zA-Z0-9]+)(?:\?.*)?$/
};

export function extractSpotifyId(url: string, type: 'track' | 'album' | 'artist'): string {
  const match = url.match(SPOTIFY_URL_REGEX[type]);
  if (!match) {
    throw new Error(`Invalid Spotify ${type} URL`);
  }
  return match[1];
}

export function getSpotifyEmbedUrl(spotifyUrl: string): string {
  const trackId = extractSpotifyId(spotifyUrl, 'track');
  return `https://open.spotify.com/embed/track/${trackId}`;
}