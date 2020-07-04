<template>
<v-layout>
  <v-main class="signin-page" id="SigninPage">
    <v-container>
      <div class="title-header d-flex justify-center pt-5">
        <h1 class="page-title title-1">Sign In</h1>
      </div>
      <v-container class="signin-form-container d-flex justify-center mt-10">
        <v-card
          class="signin-form-card px-8 pt-4 pb-8"
          width="400px"
        >
          <v-card-title class="form-title justify-center">サインインしてください</v-card-title>
          <v-form ref="form">
            <v-text-field
              v-model="email"
              label="E-mail Address"
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
            ></v-text-field>
            <nav class="submit-nav d-flex justify-center mt-2 pt-2">
              <v-btn
                class="submit-btn"
                width="220px"
                large
                @click="onSubmit"
              >Submit</v-btn>
            </nav>
          </v-form>
        </v-card>
      </v-container>
    </v-container>
  </v-main>
</v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Signin extends Vue {
  private email: string = '';
  private password: string = '';

  private onSubmit (ev: MouseEvent): void {
    console.log('Submit ===');
    console.log('Email: ' + this.email);
    console.log('Password: ' + this.password);
  }
}
</script>

<style lang="scss" scoped>
.signin-form-card {
}
</style>
