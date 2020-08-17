import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { User } from "~/interfaces/User";
import { $axios } from "~/utils/api";
import { cacheAdapterEnhancer } from "axios-extensions";
import firebase from "~/plugins/firebase";
import APIPaths from "~/utils/APIPaths";

let storageData: any;
if (process.client) {
  // ローカルストレージにトークンがあるかどうかをチェック
  storageData = JSON.parse(localStorage.getItem('nuxt-first-mockup'));
  if (storageData) {
    console.log('Storage: ', storageData);
    $axios.defaults.headers['x-access-token'] = storageData.auth.token;
  }
  else {
    console.log('Storage is None');
  }
}

@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true
})
export default class Auth extends VuexModule {
  isSignedIn: boolean = false;
  isFirstUserCheck: boolean = false;
  user: User = null;
  token: string = storageData ? storageData.auth.token : null;

  @Mutation
  setSignInUser ({userData, token}) {
    this.isSignedIn = true;
    this.user = userData;
    this.token = token;
    $axios.defaults.headers['x-access-token'] = token;
  }

  @Mutation
  clearSignInUser () {
    this.isSignedIn = false;
    this.user = null;
    this.isFirstUserCheck = false;
  }

  @Mutation
  doFirstUserCheck () {
    this.isFirstUserCheck = true;
  }


  @Action({ rawError: true })
  createUser (payload: { username: string, email: string, password: string}) {
    console.log('Create User =================> ');
    console.log('UserName: ' + payload.username);
    console.log('Email: ' + payload.email);
    console.log('Password: ' + payload.password);

    return new Promise((resolve, reject) => {
      const api_url = APIPaths.API_SITE_URL + APIPaths.CREATE_USER;
      $axios.setHeader('Cache-Control', 'no-cache');
      $axios.setHeader('Access-Control-Allow-Headers', 'x-access-token');
      $axios.post(api_url, {
        username: payload.username,
        email: payload.email,
        password: payload.password
      })
        .then((response: any) => {
          const data = response.data;
          resolve(data);
        })
        .catch((error: any) => {
          console.log(error.response);
          reject(error.response.data);
        });
    });
  }


  @Action({ rawError: true })
  signIn (payload: {email: string, password: string}) {
    console.log('Try SignIn ===');
    console.log('Email: ' + payload.email);
    console.log('Password: ' + payload.password);

    return new Promise((resolve, reject) => {
      const api_url = APIPaths.API_SITE_URL + APIPaths.SIGN_IN_USER;
      $axios.setHeader('Cache-Control', 'no-cache');
      $axios.setHeader('Access-Control-Allow-Headers', 'x-access-token');
      $axios.post(api_url, {
        email: payload.email,
        password: payload.password
      })
        .then((response: any) => {
          const data: any = response.data;
          const token: string = data.token;
          const signInUser: User = {
            uid: data.userInfo.uid,
            username: data.userInfo.username,
            thumbnail: data.userInfo.photoUrl
          };
          this.setSignInUser({
            userData: signInUser,
            token: token
          });
          resolve(signInUser);
        })
        .catch((error: any) => {
          console.log(error.response);
          reject(error.response.data);
        });
    });
  }

  @Action({ rawError: true })
  signOut () {
    return new Promise((resolve, reject) => {
      // Authオブジェクトにサインアウトをコール
      firebase.auth().signOut()
        .then((result) => {
          // ログイン情報をクリアにする
          this.clearSignInUser();
          resolve(0);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  @Action({ rawError: true })
  checkSignedIn (): Promise<any> {
    return new Promise((resolve, reject) => {
      // ToDo ログインチェックを認証トークンを用いたものに変更する

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // まだ初回のログインチェックを実施していなかった場合
          if (!this.isFirstUserCheck) {
            this.doFirstUserCheck();
          }

          const uid: string = user.uid;
          const user_email: string = user.email;

          // ここでユーザーの基本情報を取得する
          const db = firebase.firestore();
          const usersRef = db.collection('/nuxt-samples/first-mockup/users');
          usersRef.where('uid', '==', uid).get()
            .then((snapshot) => {
              if (snapshot.empty) {
                reject('User is not exist');
                return;
              }

              let username: string = '';
              let user_thumbnail: string = '';
              snapshot.forEach((result) => {
                const resultData = result.data();
                username = resultData.username;
                user_thumbnail = resultData.thumbnail;
              });

              const userData: User = {
                uid: uid,
                email: user_email,
                username: username,
                thumbnail: user_thumbnail
              };

              this.setSignInUser({
                userData: userData,
                token: ''
              });
              resolve(userData);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
        }
        else {
          // ユーザー情報が返ってこなかった場合はエラーをrejectする
          const err = new Error('login_failed');
          // まだ初回のログインチェックを実施していなかった場合
          if (!this.isFirstUserCheck) {
            this.doFirstUserCheck();
          }
          reject(err);
        }
      })
    });
  }
}
