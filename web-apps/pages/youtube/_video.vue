<template>
<v-layout>
  <v-main class="youtube-video-page" id="YoutubeVideoPage">
    <v-container class="youtube-video-contents">
      <client-only>
        <div v-if="isVideoDataLoaded" class="video-player-frame">
          <div class="player-box">
            <youtube
              :video-id="videoId"
              :player-vars="playerVars"
              width="100%"
              height="100%"
              ref="youtube"
            ></youtube>
          </div>
        </div>
      </client-only>
      <v-card
        class="video-info-card mt-10 pa-6"
        width="100%"
        min-height="150px"
      >
        <v-card-title class="video-title mb-2">{{videoTitle}}</v-card-title>
        <v-card-subtitle class="video-sub-info">
          {{videoCreatedBy}}<br />
          <span class="label mr-2">公開日</span>{{videoPublishedAt}}
          <span class="label ml-6 mr-2">再生数</span>{{videoViewCount}}回
        </v-card-subtitle>
        <v-card-text v-html="videoDescription"></v-card-text>
      </v-card>
    </v-container>
  </v-main>
</v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import moment from "moment";
import { APIKeys } from "~/credentials/api-keys";
import axios from "~/.nuxt/axios";

@Component({
  layout: 'YoutubeLayout',
  async asyncData ({ app, params, error }) {
    // APIのコール先メソッド
    const methodUrl = 'https://www.googleapis.com/youtube/v3/videos';
    // videoIdを取得する
    const videoId = params.video;
    // API_KEYを取得する
    const apiKey = APIKeys.YOUTUBE_API_KEY;
    // returnでプロミスを返す形に変更しないとページに反映されない
    return app.$axios.get(methodUrl, {
      params: {
        part: 'id,snippet,statistics',
        id: videoId,
        key: apiKey
      }
    })
      .then((result) => {
        if (result.data.items.length === 1) {
          const videoData = result.data.items[0];
          const publishedDate = moment();
          const pageData = {
            videoId: videoData.id,
            videoTitle: videoData.snippet.title,
            videoDescription: videoData.snippet.description,
            videoPublishedAt: videoData.snippet.publishedAt,
            videoCreatedBy: videoData.snippet.channelTitle,
            videoViewCount: videoData.statistics.viewCount
          };

          // console.log(pageData);
          return pageData;
        }
        else {
          error({ statusCode: 404, message: 'ページが見つかりません' });
        }
      })
      .catch((err) => {
        error({ statusCode: 500, message: 'ページデータを読み込めません' });
      });
  },
  head: {
  }
})
export default class YouTubeVideo extends Vue {
  private videoId: string;
  private videoTitle: string;
  private videoDescription: string;
  private videoPublishedAt: string;
  private videoCreatedBy: string;
  private videoViewCount: string;
  private isVideoDataLoaded = false;

  private playerVars: any = {
    autoplay: 0,
    rel: 0
  };

  get player (): any {
    const yt: any = this.$refs.youtube;
    return yt;
  }

  mounted (): void {
    console.log('YouTube VideoPage Mounted');
    this.$nextTick(() => {
      this.isVideoDataLoaded = true;
      /*
      this.getVideoData()
        .then((result) => {
          console.log(result);

          this.videoId = result.id;
          this.videoTitle = result.snippet.title;
          this.videoDescription = result.snippet.description;
          const publishedDate = moment(result.snippet.publishedAt);
          this.videoPublishedAt = publishedDate.format('YYYY-MM-DD');
          this.videoCreatedBy = result.snippet.channelTitle;
          this.videoViewCount = result.statistics.viewCount;
          this.isVideoDataLoaded = true;
        })
        .catch((err) => {
          console.log(err);
        });
       */
    })
  }

  private async getVideoData (): Promise<any> {
    // APIのコール先メソッド
    const methodUrl = 'https://www.googleapis.com/youtube/v3/videos';
    // videoIdを取得する
    const videoId = this.$route.params.video;
    // API_KEYを取得する
    const apiKey = APIKeys.YOUTUBE_API_KEY;

    try {
      const resultData: any = await this.$axios.get(methodUrl, {
        params: {
          part: 'id,snippet,statistics',
          id: videoId,
          key: apiKey
        }
      });

      if (resultData.data.items.length === 1) {
        const videoData = resultData.data.items[0];
        return Promise.resolve(videoData);
      }
      else {
        const err: Error = new Error('Search Result is Multiple');
        err.name = 'incompatible_search_result';
        return Promise.reject(err);
      }
    }
    catch (err) {
      return Promise.reject(err);
    }
  }
}
</script>

<style lang="scss" scoped>
.youtube-video-page {
  .title-header {
    .site-title {
      font-size: 1.5rem;
      font-weight: 300;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .youtube-video-contents {
    padding-top: 50px;
    padding-bottom: 100px;

    .video-player-frame {
      position: relative;
      width: 100%;
      padding-top: 56.25%;
      height: 0 !important;

      .player-box {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        iframe {
          position: relative;
        }
      }
    }
  }
}
</style>
