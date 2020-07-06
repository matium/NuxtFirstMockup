<template>
<v-app-bar
  app
  class="app-header-youtube"
  id="AppHeaderYoutube"
  absolute
  dark
>
  <v-toolbar-items class="app-header-left align-center">
    <v-btn
      icon
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-toolbar-title class="app-bar-site-title">
      <nuxt-link v-if="!isIndex" to="/youtube/" class="site-title-link">YouTube Viewer</nuxt-link>
      <div v-if="isIndex">YouTube Viewer</div>
    </v-toolbar-title>
  </v-toolbar-items>

  <v-spacer></v-spacer>

  <app-user-unit></app-user-unit>
</v-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AppUserUnit from "~/components/atoms/AppUserUnit.vue";

@Component({
  components: {
    AppUserUnit
  }
})
export default class AppHeaderYoutube extends Vue {
  @Prop({ default: false, type: Boolean }) readonly isIndex;
}
</script>

<style lang="scss" scoped>
.app-header-youtube {
  .app-bar-site-title {
    font-weight: 300;
    font-size: 1.25rem;

    .site-title-link {
      color: rgba(255, 255, 255, 1.0);
      text-decoration: none;

      &:hover {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }

  .app-user-unit {
    .avatar-user-name {
      font-size: 0.9rem;
      font-weight: 300;
    }
  }
}
</style>
