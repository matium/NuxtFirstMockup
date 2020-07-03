<template>
<v-layout>
  <v-main class="threejs-index-page" id="ThreejsIndex">
    <v-container>
      <div class="title-header d-flex justify-center pt-5" ref="titleHeader">
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
          nuxt
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
import { Component, Vue } from "vue-property-decorator";
import { gsap } from "gsap";

@Component({
  layout: 'ThreejsLayout',
  transition: {
    name: 'test',
    css: false,
    mode: 'out-in',
    beforeEnter(el: HTMLElement) {
      console.log('Before Enter');
      el.style.transform = 'translateY(200px)';
      el.style.opacity = '0';
    },
    enter(el: HTMLElement, done: Function): void {
      console.log('Enter');
      gsap.to(el, {
        y: '0',
        opacity: 1,
        ease: 'expo.out',
        duration: 0.5,
        onComplete: () => {
          done();
        }
      });
    },
    afterEnter(el: HTMLElement): void {
      console.log('AfterEnter');
      el.style.transform = 'translateY(0)';
      el.style.opacity = '1';
    },
    leave(el: HTMLElement, done: Function): void {
      console.log('leave');
      gsap.to(el, {
        y: '200px',
        opacity: 0,
        ease: 'expo.out',
        duration: 1,
        onComplete: () => {
          done();
        }
      });
    }
  }
})
export default class ThreejsIndex extends Vue {
  private isShown: boolean = false;

  private contentsList: any[] = [
    {
      title: 'First Three.js Sample',
      outline: 'はじめてのThree.jsアプリケーションサンプル<br />シーンの作成とシーンオブジェクトの作成と配置 ｜ Statsとdat.GUIの配置',
      to: 'basics/FirstThreejsSample'
    },
    {
      title: 'Create Basic Scene',
      outline: 'シーンの基本要素',
      to: 'basics/CreateBasicScene'
    },
    {
      title: 'Create Custom Geometry',
      outline: 'カスタマイズされたオリジナルジオメトリを作成',
      to: 'basics/CreateCustomGeometry'
    },
    {
      title: 'Mesh Properties',
      outline: 'Meshオブジェクトが持つプロパティを操作する',
      to: 'basics/MeshProperties'
    },
    {
      title: 'Moving Camera',
      outline: 'PerspectiveCameraをVelocity.jsを使ってアニメーション移動させる',
      to: 'basics/MovingCamera'
    },
  ];

  mounted (): void {
    this.$nextTick(() => {
      console.log('Mounted');
      this.isShown = true;
    });
  }
}
</script>

<style lang="scss">
.threejs-index-page {
  .title-header {
    width: 100%;
  }

  .contents-link-list {
    margin: 0 auto 0 auto;
  }
}
</style>
