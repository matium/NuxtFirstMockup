<template>

</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  layout: 'YoutubeLayout',
  head: {
  }
})
export default class YouTubeVideo extends Vue {

  mounted (): void {
    console.log('YouTube VideoPage Mounted');
  }
}
</script>

<style lang="scss" scoped>

</style>
