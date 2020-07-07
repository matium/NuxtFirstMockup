<template>
<v-app>
  <app-header-threejs
    :is-index="indexpage"
  ></app-header-threejs>
  <div class="threejs-view-contents-wrapper">
    <nuxt />
  </div>
</v-app>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import AppHeaderThreejs from "~/components/threejs/AppHeaderThreejs.vue";

@Component({
  components: {
    AppHeaderThreejs
  },
  head: {
    titleTemplate: '%s | Three.js Research'
  }
})
export default class ThreejsLayout extends Vue {
  protected isIndex: boolean = false;

  get indexpage (): boolean {
    return this.$store.state.threejs.isIndex;
  }

  created (): void {
    console.log('Created Route: ', this.$route.path);
  }

  mounted (): void {
    console.log('Mounted Route: ', this.$route.path);
  }

  updated (): void {
    console.log('Updated Route: ');
  }

  beforeEach (to, from): void {
    console.log('Updated Route: ', this.$route.path);
  }
}
</script>

<style lang="scss">
.threejs-view-contents-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;

.three-js-contents {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
}
</style>
