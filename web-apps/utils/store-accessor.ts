import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Threejs from "~/store/threejs";

// eslint-disable-next-line import/no-mutable-exports
let threejsStore: Threejs;

/**
 * ストアを初期化する（型推論できるモジュールとして取得する）
 * @param store Vuex.Store
 */
function initializeStores(store: Store<any>): void {
  threejsStore = getModule(Threejs, store)
}

export { initializeStores, threejsStore }
