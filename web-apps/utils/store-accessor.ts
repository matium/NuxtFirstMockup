import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Threejs from "~/store/threejs";
import Auth from "~/store/auth";

// eslint-disable-next-line import/no-mutable-exports
let threejsStore: Threejs;
let authStore: Auth;

/**
 * ストアを初期化する（型推論できるモジュールとして取得する）
 * @param store Vuex.Store
 */
function initializeStores(store: Store<any>): void {
  threejsStore = getModule(Threejs, store);
  authStore = getModule(Auth, store);
}

export { initializeStores, threejsStore, authStore }
