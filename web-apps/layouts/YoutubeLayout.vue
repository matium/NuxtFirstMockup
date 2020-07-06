<template>
<v-app>
  <app-header-youtube
    :is-index="indexpage"
  ></app-header-youtube>
  <div class="youtube-view-contents-wrapper">
    <nuxt />
  </div>
</v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppHeaderYoutube from "~/components/youtube/AppHeaderYoutube.vue";

@Component({
  components: {
    AppHeaderYoutube
  },
  head: {
    titleTemplate: '%s | YouTube Viewer'
  }
})
export default class YoutubeLayout extends Vue {
  get indexpage (): boolean {
    return this.$store.state.youtube.isIndex;
  }
}
</script>

<style lang="scss" scoped>
.youtube-view-contents-wrapper {
  position: relative;
  width: 100%;
}
</style>
