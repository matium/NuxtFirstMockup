<template>
<div v-if="user" class="app-user-unit">
  <v-menu
    class="app-user-menu"
    bottom
    left
  >
    <template v-slot:activator="{ on }">
      <div
        class="user-name-button d-flex justify-end align-center"
        v-on="on"
      >
        <v-avatar
          class="mr-2"
          :size="32"
        >
          <img :src="user.thumbnail" alt="User Thumbnail" />
        </v-avatar>
        <p class="avatar-user-name mb-0">{{user.username}}</p>
      </div>
    </template>

    <v-list
      :light="light"
    >
      <v-list-item
        @click="onClickSignOut"
      >
        <v-list-item-title>サインアウト</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User } from "~/interfaces/User";

@Component
export default class AppUserUnit extends Vue {
  @Prop({ default: false, type: Boolean }) readonly light;

  get user (): User {
    return this.$store.state.auth.user;
  }

  private onClickSignOut (ev: MouseEvent): void {
    this.$store.dispatch('auth/signOut')
    .then((result) => {
      this.$nuxt.$router.push('/');
    })
    .catch((error) => {
      console.log('Failure: Sign Out');
      console.log(error);
    });
  }
}
</script>

<style lang="scss">
.app-user-unit {
  .user-name-button {
    cursor: pointer;
  }
}
</style>
