import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Threejs from "~/store/threejs";
import Auth from "~/store/auth";
import YouTube from "~/store/youtube";

// eslint-disable-next-line import/no-mutable-exports
let threejsStore: Threejs;
let authStore: Auth;
let youtubeStore: YouTube;

/**
 * ストアを初期化する（型推論できるモジュールとして取得する）
 * @param store Vuex.Store
 */
function initializeStores(store: Store<any>): void {
  threejsStore = getModule(Threejs, store);
  authStore = getModule(Auth, store);
  youtubeStore = getModule(YouTube, store);
}

export { initializeStores, threejsStore, authStore, youtubeStore }
