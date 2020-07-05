import * as firebase from "firebase";

/**
 * Firebaseの初期設定
 */
const firebaseConfig = {
  apiKey: "AIzaSyCD9Truvx2u0cBD29QNQuLc4V13_EXPQZM",
  authDomain: "matium.firebaseapp.com",
  databaseURL: "https://matium.firebaseio.com",
  projectId: "matium",
  storageBucket: "matium.appspot.com",
  messagingSenderId: "529603301831",
  appId: "1:529603301831:web:7c488fadce4e88f14d09e2"
};
// Firebaseをイニシャライズする
if (!firebase.apps.length) {
  console.log('Firebase Initialize');
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
