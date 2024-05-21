import fetch from 'node-fetch';

interface ThumbnailResponse {
  thumbnailUrl: string;
}

export const getPlaylistThumbnail = async (playListUrl: string): Promise<string> => {
  try {
    const response = await fetch(`https://api.example.com/thumbnail?url=${encodeURIComponent(playListUrl)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch thumbnail');
    }

    const data = (await response.json()) as ThumbnailResponse; // 타입 캐스팅
    return data.thumbnailUrl;
  } catch (error) {
    console.error('Error fetching playlist thumbnail:', error);
    throw error;
  }
};