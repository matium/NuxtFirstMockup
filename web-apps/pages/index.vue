<template>
  <v-layout>
    <v-main class="index-page" id="IndexPage">
      <v-container>
        <div class="title-header d-flex justify-center pt-5">
          <h1 class="site-title title-1">Three.js Research</h1>
        </div>
        <v-list
          class="contents-link-list mt-10"
          three-line
          width="90%"
          max-width="800px"
        >
          <v-list-item
            v-for="(item, index) in contentsList"
            :key="item.id"
            class="pl-6"
            :to="item.to"
          >
            <v-list-item-content>
              <v-list-item-title class="title">{{index+1}}. {{item.title}}</v-list-item-title>
              <v-list-item-subtitle class="subtitle-2" v-html="item.outline"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component({})
export default class Index extends Vue {
  private contentsList: any[] = [
    {
      title: 'First Three.js Sample',
      outline: 'はじめてのThree.jsアプリケーションサンプル<br />シーンの作成とシーンオブジェクトの作成と配置 ｜ Statsとdat.GUIの配置',
      to: 'threejs/FirstThreejsSample'
    },
    {
      title: 'Create Basic Scene',
      outline: 'シーンの基本要素',
      to: 'threejs/basics/CreateBasicScene'
    },
  ]
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
