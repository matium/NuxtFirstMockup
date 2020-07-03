<template>
<v-app dark>
  <v-app-bar
    app
    absolute
  >
    <v-btn
      icon
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-toolbar-title class="app-bar-site-title">
      <nuxt-link v-if="!indexpage" to="/threejs/" class="site-title-link">Three.js Research</nuxt-link>
      <div v-if="indexpage">Three.js Research</div>
    </v-toolbar-title>
  </v-app-bar>
  <div class="view-contents-wrapper">
    <nuxt />
  </div>
</v-app>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component({
  fetch(ctx) {
    console.log('Fetch: ', ctx);
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
.app-bar-site-title {
  font-weight: 200;
  font-size: 1rem;

  .site-title-link {
    color: rgba(255, 255, 255, 1.0);
    text-decoration: none;

    &:hover {
      color: rgba(255, 255, 255, 0.5);
    }
  }
}

.view-contents-wrapper {
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
