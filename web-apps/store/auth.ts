import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { User } from "~/interfaces/User";
import { $axios } from "~/utils/api";
import firebase from "~/plugins/firebase";


@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true
})
export default class Auth extends VuexModule {
  isSignedIn: boolean = false;
  isFirstUserCheck: boolean = false;
  user: User = null;

  @Mutation
  setSignInUser (userData: User) {
    this.isSignedIn = true;
    this.user = userData;
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
  signIn (payload: {email: string, password: string}) {
    console.log('Try SignIn ===');
    console.log('Email: ' + payload.email);
    console.log('Password: ' + payload.password);

    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then((result) => {
          console.log('OK Signed In.');
          this.checkSignedIn()
            .then((result) => {
              resolve(result);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + ':' + errorMessage);
          reject(error);
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

              this.setSignInUser(userData);
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
