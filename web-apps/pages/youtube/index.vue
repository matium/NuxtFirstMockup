<template>
<v-layout>
  <v-main class="youtube-index-page" id="YoutubeIndex">
    <v-container>
      <div class="title-header d-flex justify-center pt-5" ref="titleHeader">
       <h1 class="site-title title-1">YouTube Viewer</h1>
      </div>
    </v-container>
  </v-main>
</v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  layout: 'YoutubeLayout',
  head: {
    titleTemplate: '',
    title: 'YouTube Research'
  }
})
export default class YoutubeIndexx extends Vue {

}
</script>

<style lang="scss" scoped>

</style>
