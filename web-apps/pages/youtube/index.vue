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
import {YouTubeVideoProps} from "~/interfaces/VideoProps";

@Component({
  layout: 'YoutubeLayout',
  head: {
    titleTemplate: '',
    title: 'YouTube Research'
  }
})
export default class YoutubeIndex extends Vue {
  protected playlist: YouTubeVideoProps[] = [];

  mounted (): void {
    // ToDo asyncDataでの反映に切り替える
    this.$nextTick(() => {
      this.$store.dispatch('youtube/getYouTubePlaylist')
        .then((result) => {
          this.playlist = result;
        })
        .catch((error) => {
          console.log('Failure Load Playlist: ', error);
        });
    });
  }
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
