<template>
<v-app-bar
  app
  class="app-header-threejs"
  id="AppHeaderThreejs"
  absolute
>
  <v-toolbar-items class="app-header-left">
    <v-toolbar-title class="app-bar-site-title">
      <nuxt-link to="/threejs/" class="site-title-link">Three.js Research</nuxt-link>
    </v-toolbar-title>
  </v-toolbar-items>
</v-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";

@Component
export default class AppHeaderThreejs extends Vue {
  @Prop({ default: false, type: Boolean }) readonly isIndex: boolean;


}
</script>

<style lang="scss" scoped>

</style>
