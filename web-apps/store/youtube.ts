import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { $axios } from "~/utils/api";
import { YouTubeVideoProps } from "~/interfaces/VideoProps";

@Module({
  name: 'youtube',
  stateFactory: true,
  namespaced: true
})
export default class YouTube extends VuexModule {
  isIndex: boolean = false;
  videoList: YouTubeVideoProps[] = null;

  @Mutation
  indexpage (value: boolean) {
    this.isIndex = value;
  }

  @Mutation
  setVideoList (list: YouTubeVideoProps[]) {
    this.videoList = list;
  }

  @Action
  async getYouTubePlaylist (): Promise<any> {
    try {
      const methodUrl = 'https://www.googleapis.com/youtube/v3/playlistItems';
      const playlist_id = 'PLuFk1iO9RvJU6E1TDxHvvVrc_uHpVmklS';
      const api_key = 'AIzaSyCw8pjE27Qx2DvuuE81GBtUlkovsrkgUFw';
      const ytData: any = await $axios.get(methodUrl, {
        params: {
          part: 'snippet',
          playlistId: playlist_id,
          maxResults: 50,
          key: api_key
        }
      });

      const responseVideoItems: any[] = ytData.data.items;

      if (responseVideoItems.length > 0) {
        const videoDataList: YouTubeVideoProps[] = [];
        responseVideoItems.forEach((item, index) => {
          const video: YouTubeVideoProps = {
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high
          };
          videoDataList.push(video);
        });

        this.setVideoList(videoDataList);
        return Promise.resolve(videoDataList);
      }
      else {
        const err: Error = new Error('Data not existed.');
        return Promise.reject(err);
      }
    }
    catch (e) {
      return Promise.reject(e);
    }
  }
}
