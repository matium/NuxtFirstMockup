<template>
<v-app
  light
>
  <app-header-youtube
    :is-index="indexpage"
  ></app-header-youtube>
  <div class="view-contents-wrapper">
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

  created (): void {
    this.$vuetify.theme.dark = false;
  }
}
</script>

<style lang="scss" scoped>
.view-contents-wrapper {
  background-color: #fff;
}
</style>
