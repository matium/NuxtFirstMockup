import createPersistedState from "vuex-persistedstate";

export default ({store}) => {
  createPersistedState({
    key: 'nuxt-first-mockup',
    paths: ['auth.token'],
    storage: window.localStorage
  })(store);
}

