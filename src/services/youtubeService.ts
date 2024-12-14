import { searchYouTubeVideo } from '../utils/youtube';

export const youtubeService = {
  async findMatchingVideo(trackInfo: { title: string; artist: string }): Promise<string | null> {
    const searchQuery = `${trackInfo.artist} - ${trackInfo.title} official music audio`;
    return searchYouTubeVideo(searchQuery);
  }
};