const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

export async function searchYouTubeVideo(query: string): Promise<string | null> {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `${YOUTUBE_API_URL}?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&type=video`
    );

    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      return `https://www.youtube.com/watch?v=${videoId}`;
    }

    return null;
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return null;
  }
}