<template>
<v-app-bar
  app
  class="app-header-threejs"
  id="AppHeaderThreejs"
  absolute
>
  <v-toolbar-items class="app-header-left align-center">
    <v-btn
      icon
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-toolbar-title class="app-bar-site-title">
      <nuxt-link v-if="!isIndex" to="/threejs/" class="site-title-link">Three.js Research</nuxt-link>
      <div v-if="isIndex">Three.js Research</div>
    </v-toolbar-title>
  </v-toolbar-items>

  <v-spacer></v-spacer>

  <div v-if="user" class="app-user-unit d-flex justify-end align-center" id="AppUserUnit">
    <v-avatar
      class="mr-2"
      :size="32"
    >
      <img :src="user.thumbnail" alt="User Thumbnail" />
    </v-avatar>
    <p class="avatar-user-name mb-0">{{user.username}}</p>
  </div>
</v-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { User } from "~/interfaces/User";

@Component
export default class AppHeaderThreejs extends Vue {

  @Prop({ default: false, type: Boolean }) readonly isIndex: boolean;

  get user (): User {
    return this.$store.state.auth.user;
  }
}
</script>

<style lang="scss" scoped>
.app-header-threejs {
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
