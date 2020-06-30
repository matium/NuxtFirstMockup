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
    <v-toolbar-title class="app-bar-site-title">Three.js Research</v-toolbar-title>
  </v-app-bar>
  <div class="view-contents-wrapper">
    <nuxt />
  </div>
</v-app>
</template>

<script>
export default {
}
</script>

<style lang="scss">
  .app-bar-site-title {
    font-weight: 200;
    font-size: 1rem;
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
