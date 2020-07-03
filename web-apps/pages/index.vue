<template>
  <v-layout>
    <v-main class="index-page" id="IndexPage">
      <v-container>
        <div class="title-header d-flex justify-center pt-5">
          <h1 class="site-title title-1">Nuxt.js Mockup Site</h1>
        </div>
        <div class="contents-link-list d-flex justify-center mt-5">
          <v-card
            class="link-card"
            width="33%"
            to="threejs/"
            nuxt
            hover
          >
            <v-card-title>Three.js Research</v-card-title>
            <v-card-subtitle>Three.jsの学習と研究</v-card-subtitle>
          </v-card>
        </div>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component({})
export default class Index extends Vue {
}
</script>

<style lang="scss">
.index-page {
  .title-header {
    width: 100%;
  }

  .contents-link-list {
    margin: 0 auto 0 auto;


  }
}
</style>
