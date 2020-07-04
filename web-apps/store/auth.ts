import { Module, VuexModule, Mutation } from "vuex-module-decorators";
import { User } from "~/interfaces/User";

@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true
})
export default class Auth extends VuexModule {
  isSignIn: boolean = true;
  user: User = {
    uid: 'u10001',
    username: 'Keita Watanabe',
    thumbnail: 'https://pbs.twimg.com/profile_images/251232997/avatar_reasonably_small.jpg'
  };
}
