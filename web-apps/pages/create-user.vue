<template>
<v-layout>
  <v-main class="create-user-page" id="CreateUserPage">
    <div class="title-header d-flex justify-center pt-5">
      <h1 class="page-title title-1">Create User</h1>
    </div>
    <v-container class="create-user-form-container d-flex justify-center mt-10">
      <v-card
        v-show="isForm"
        class="create-user-form-card px-8 pt-4 pb-8"
        width="500px"
      >
        <v-card-title class="form-title justify-center">ユーザー情報を入力</v-card-title>
        <v-form ref="form" v-model="valid">
          <v-text-field
            class="mb-4"
            v-model="username"
            :rules="[validUsername]"
            label="ユーザー名を入力"
            hint="※必須　半角英数字、アンダーバー、ハイフン、8文字以上"
            counter
            persistent-hint
            required
          ></v-text-field>
          <v-text-field
            class="mb-4"
            v-model="email"
            :rules="[validEmail]"
            label="メールアドレス"
            hint="※必須"
            persistent-hint
            require
          ></v-text-field>
          <v-text-field
            class="mb-4"
            v-model="password"
            label="パスワードを入力"
            :rules="[validPassword]"
            :append-icon="isShownPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="isShownPassword ? 'text' : 'password'"
            hint="※必須　半角英数字+半角記号 8文字以上"
            persistent-hint
            counter
            required
            @click:append="isShownPassword = !isShownPassword"
          ></v-text-field>
          <v-text-field
            class="mb-4"
            v-model="checkedPassword"
            label="パスワードを確認"
            :rules="[validCheckedPassword]"
            :append-icon="isShownPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="isShownPassword ? 'text' : 'password'"
            counter
            required
            @click:append="isShownPassword = !isShownPassword"
          ></v-text-field>
          <nav class="submit-nav d-flex justify-center">
            <v-btn
              class="login-btn mx-md-3"
              width="210px"
              height="58px"
              :disabled="!valid"
              @click="onSubmitForm"
            >
              ユーザーを作成
            </v-btn>
          </nav>
        </v-form>
      </v-card>

      <v-card
        v-if="isSuccess"
        class="create-user-success px-8 pt-4 pb-8"
        width="500px"
        color="blue darken-4"
      >
        <v-card-title class="form-title justify-center mb-4">ユーザーの登録が成功しました</v-card-title>
        <v-card-subtitle
          class="mb-0 pb-0 subtitle-2"
        >UID</v-card-subtitle>
        <v-card-text
          class="mb-0 pb-0 body-1"
        >{{ createdUserData.uid }}</v-card-text>
        <v-card-subtitle
          class="mb-0 pb-0 subtitle-2"
        >UserName</v-card-subtitle>
        <v-card-text
          class="mb-0 pb-0 body-1"
        >{{ createdUserData.username }}</v-card-text>
      </v-card>

      <v-card
      ></v-card>

      <v-card
        v-if="isFailure"
        class="create-user-failure px-8 pt-4 pb-8"
        width="500px"
        color="blue-grey darken-2"
      >
        <v-card-title class="form-title justify-center mb-4">{{errorTitle}}</v-card-title>
        <v-card-text>{{errorMessage}}</v-card-text>
      </v-card>

    </v-container>
  </v-main>
</v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { helpers, required, email, minLength, sameAs } from "vuelidate/lib/validators";
import {User} from "~/interfaces/User";

const usernameValidation = helpers.regex('usernameValidation', /^[a-zA-Z0-9_-]+$/);

const passwordValidation = helpers.regex('passwordValidation', /^[a-zA-Z0-9!#$%&()*+,.:;=?@\[\]^_{}-]+$/);

@Component({
  head: {
    title: 'Create User'
  },
  validations: {
    username: {
      required,
      minLength: minLength(8),
      usernameValidation
    },
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(8),
      passwordValidation
    },
    checkedPassword: {
      required,
      sameAsPassword: sameAs('password')
    }
  }
})
export default class CreateUser extends Vue {
  private username: string = '';
  private email: string = '';
  private password: string = '';
  private checkedPassword: string = '';
  private isShownPassword = false;
  // バリデーションチェック
  private valid: boolean = false;

  // コンポーネントの表示・非表示
  private isForm: boolean = true;
  private isSuccess: boolean = false;
  private isFailure: boolean = false;

  // createdUserData
  private createdUserData: User = {
    uid: 'u00000',
    username: ''
  };

  // Error Message
  private errorTitle: string = 'ユーザー登録時エラー';
  private errorMessage: string = 'ユーザーの登録に失敗しました。しばらく待ってから再度お試しください。';


  private onSubmitForm (ev: MouseEvent): void {
    // 登録データの作成
    const userData: User = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    // ここで送信する
    this.$store.dispatch('auth/createUser', userData)
      .then((result: any) => {
        console.log('Success Create User: ', result);
        this.createdUserData.uid = result.user.uid;
        this.createdUserData.username = result.user.username;
        this.isForm = false;
        this.isSuccess = true;
      })
      .catch((errorResponse: any) => {
        console.log('Create User Error: ', errorResponse);
        this.isForm = false;
        this.isFailure = true;
      });
  }

  private validUsername (value): any {
    if (this.$v.username.$invalid) {
      return '※必須 半角英数字、アンダーバー、ハイフン 8文字以上';
    }
    else {
      return true;
    }　　　　　　　　　　
  }

  private validEmail (value): any {
    if (this.$v.email.$invalid) {
      return '※メールアドレスを入力してください';
    }
    else {
      return true;
    }
  }

  private validPassword (value): any {
    if (this.$v.password.$invalid) {
      return '※必須　半角英数字+半角記号 8文字以上';
    }
    else {
      return true;
    }
  }

  private validCheckedPassword (value): any {
    if (this.$v.checkedPassword.$invalid) {
      return '※上で入力したパスワードと異なります';
    }
    else {
      return true;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
