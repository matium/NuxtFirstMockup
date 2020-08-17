export default async ({ app, store }) => {
  app.router.beforeEach((to, from, next) => {
    console.log('Before Each Route: ', to);
    if (process.server) {
      console.log('SSR Before Each');
      next();
    }
    if (process.client) {
      console.log('CSR Before Each');
      if (!store.state.isSignedIn) {
        // ここでログインチェック
        console.log('==========>' + to.path);
        if (to.path === '/signin') {
          next();
        }
        else {
          next();
          store.dispatch('auth/checkSignedIn')
            .then((result) => {
              console.log('Signed In Check: ', result);
              next();
            })
            .catch((err) => {
              console.log(err);
              next('/signin');
            });
        }
      }
      else {
        if (to.path === '/signin') {
          next('/');
        }
        else {
          next();
        }
      }
    }
  });

  app.router.afterEach((to, from) => {
    console.log('After Each Route: ', to);
    // Three.jsサンプルのIndexページかどうかを判定
    if (to.name === 'threejs') {
      store.commit('threejs/indexpage', true);
    }
    else {
      store.commit('threejs/indexpage', false);
    }
    // YouTUbeサンプルのIndexページかどうかを判定する
    if (to.name === 'youtube') {
      store.commit('youtube/indexpage', true);
    }
    else {
      store.commit('youtube/indexpage', false);
    }
  });
};
