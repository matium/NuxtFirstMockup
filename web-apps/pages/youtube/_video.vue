<template>
<v-layout>
  <v-main class="youtube-video-page" id="YoutubeVideoPage">
    <v-container class="youtube-video-contents">
      <client-only>
        <div class="video-player-frame">
          <transition
            @before-enter="beforeEnterVideo"
            @enter="enterVideo"
          >
            <div v-show="isVideoDataLoaded" class="player-box">
              <youtube
                :video-id="videoId"
                :player-vars="playerVars"
                width="100%"
                height="100%"
                ref="youtube"
                @ready="onPlayerReady"
                @cued="onPlayerCued"
              ></youtube>
            </div>
          </transition>
        </div>
      </client-only>
      <v-card
        class="video-info-card mt-10 px-6 pb-6"
        width="100%"
        min-height="150px"
        loader-height="4"
        :loading="isLoading"
      >
        <v-card-title class="video-title pt-8 mb-2">{{videoTitle}}</v-card-title>
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
import gsap from "gsap";

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
  private isLoading = false;

  private playerVars: any = {
    autoplay: 0,
    rel: 0
  };

  get player (): any {

    const yt: any = this.$refs.youtube.player;
    return yt;
  }

  mounted (): void {
    this.$nextTick(() => {
      console.log(this.player);
      this.isLoading = true;
    });
  }

  beforeEnterVideo (el: HTMLElement): void {
    console.log('Before Enter Video: ', el);
    el.style.opacity = '0';
    el.style.transform = ('translateY(200px)');
  }

  enterVideo (el: HTMLElement, done: Function): void {
    console.log('Enter Video: ', el);
    gsap.to(el, {
      y: '0',
      opacity: 1,
      ease: 'expo.out',
      duration: 0.5,
      onComplete: () => {
        done();
      }
    });
  }

  private onPlayerReady (): void {
    console.log('onPlayerReady');
    this.isVideoDataLoaded = true;
    this.isLoading = false;
  }

  private onPlayerCued (): void {
    console.log('onPlayerCued');
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
