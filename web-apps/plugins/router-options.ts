export default async ({ app, store }) => {
  app.router.afterEach((to, from) => {
    console.log('After Each Route: ', to);
    if (to.path === '/threejs/') {
      store.commit('threejs/indexpage', true);
    }
    else {
      store.commit('threejs/indexpage', false);
    }
  });
};
