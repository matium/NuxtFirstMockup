<template>
<v-layout>
  <v-main class="youtube-index-page" id="YoutubeIndex">
    <v-container>
      <div class="title-header d-flex justify-center pt-10" ref="titleHeader">
        <h1 class="site-title">YouTube Viewer</h1>
      </div>
    </v-container>
    <v-container class="video-link-list pb-10">
      <v-row
        align="start"
        justify="center"
      >
        <v-col
          cols="12"
          md="6"
          xl="4"
          v-for="(item, index) in playlist"
          class="px-1 py-2"
          :key="item.id"
        >
          <v-card
            class="video-link-card"
            elevation="1"
            width="100%"
            :key="item.id"
            :to="'/youtube/' + item.videoId"
            color="#212121"
            nuxt
            hover
          >
            <v-img
              :src="item.thumbnail.url"
              :alt="'Thumbnail:' + item.title"
              width="100%"
              aspect-ratio="2"
            />
            <v-card-title class="video-title">{{item.title}}</v-card-title>
            <v-card-subtitle class="video-created-time pl-7">{{item.publishedAt}}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { YouTubeVideoProps } from "~/interfaces/VideoProps";
import { APIKeys } from "~/credentials/api-keys";

@Component({
  layout: 'YoutubeLayout',
  async asyncData ({ app, params, error }) {
    // YouTubeのプレイリストを読み込む
    const methodUrl = 'https://www.googleapis.com/youtube/v3/playlistItems';
    const playlist_id = 'PLuFk1iO9RvJU6E1TDxHvvVrc_uHpVmklS';
    return app.$axios.get(methodUrl, {
      params: {
        part: 'snippet',
        playlistId: playlist_id,
        maxResults: 50,
        key: APIKeys.YOUTUBE_API_KEY
      }
    })
      .then((result) => {
        const responseItems: any[] = result.data.items;
        console.log(responseItems);
        if (responseItems.length > 0) {
          const list: YouTubeVideoProps[] = [];
          responseItems.forEach((item) => {
            const video: YouTubeVideoProps = {
              videoId: item.snippet.resourceId.videoId,
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails.high,
              publishedAt: item.snippet.publishedAt,
              description: item.snippet.description
            };
            list.push(video);
          });

          return { playlist: list };
        }
        else {
          error({ statusCode: 404, message: 'ページが見つかりません' });
        }
      })
      .catch((err) => {
        console.log(err);
        error({ statusCode: 500, message: 'ページデータを読み込めませんでした' });
      });
  },
  head: {
    titleTemplate: '',
    title: 'YouTube Research'
  }
})
export default class YoutubeIndex extends Vue {
  protected playlist: YouTubeVideoProps[] = [];
}
</script>

<style lang="scss" scoped>
.youtube-index-page {

  .title-header {
    .site-title {
      font-size: 2rem;
      font-weight: 300;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .video-link-list {
    .video-link-card {
      .video-title {
        font-size: 1rem;
      }
    }
  }
}
</style>
