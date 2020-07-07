export interface YouTubeVideoProps {
  videoId: string;
  title: string;
  thumbnail: VideoThumbnail;
  publishedAt?: string;
  description?: string;
}

export interface VideoThumbnail {
  url: string;
  width?: number;
  height?: number;
}
