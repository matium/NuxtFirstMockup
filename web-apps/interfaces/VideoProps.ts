export interface YouTubeVideoProps {
  videoId: string;
  title: string;
  thumbnail: VideoThumbnail;
}

export interface VideoThumbnail {
  url: string;
  width?: number;
  height?: number;
}
