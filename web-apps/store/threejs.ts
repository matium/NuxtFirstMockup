import { Module, VuexModule, Mutation } from "vuex-module-decorators";

@Module({
  name: 'threejs',
  stateFactory: true,
  namespaced: true
})
export default class Threejs extends VuexModule {
  isIndex: boolean = false;

  @Mutation
  indexpage(value: boolean) {
    this.isIndex = value;
  }
}
