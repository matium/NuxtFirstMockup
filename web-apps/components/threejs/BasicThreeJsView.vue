<template>
<v-main
  class="three-js-contents basic-threejs-view"
  id="BasicThreeJsView"
  ref="ThreeJsContents"
>
  <div id="threejs-output"></div>
  <div id="stats-output"></div>
</v-main>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";

@Component
export default class BasicThreeJsView extends Vue {
  public $contents: HTMLDivElement;

  protected renderer: THREE.WebGLRenderer;
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected stats: Stats;

  // Override Controls
  protected controls: any;


  constructor() {
    super();
    console.log('Parent Constructor');
  }

  mounted (): void {
    this.$nextTick(() => {
      const threejsContents: Vue = <Vue> this.$refs.ThreeJsContents;
      this.$contents = <HTMLDivElement> threejsContents.$el;
      if (process.client) {
        this.initStats();
        this.init();
        window.addEventListener('resize', this.onResize, false);
      }
    });
  }


  public init (): void {
    // シーンの作成
    this.createScene();
    // レンダラーの作成
    this.createRenderer();
    // カメラオブジェクトの作成と配置
    this.createCamera();
    this.setCameraPosition();
    // メッシュオブジェクトの作成と配置
    this.createMesh();
    // ライトを作成して配置
    this.setLights();
    // 基本初期メソッド以外のアクションを行う
    this.otherInitialSetting();
    // レンダラーによってレンダリングされたコンテンツをDOM配置する
    document.getElementById('threejs-output').appendChild(this.renderer.domElement);
    // リアルタイムレンダリングスタート
    this.renderScene();
  }


  /**
   * シーンの作成
   */
  protected createScene (): void {
    this.scene = new THREE.Scene();
  }


  /**
   * レンダラーの作成（Overrideも可）
   */
  protected createRenderer (): void {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(new THREE.Color(0xEEEEEE));
    this.renderer.setSize(this.$contents.clientWidth, this.$contents.clientHeight);
    this.renderer.shadowMap.enabled = true;
  }

  /**
   * Override Method： カメラオブジェクトの作成
   */
  protected createCamera (): void {
    this.camera = new THREE.PerspectiveCamera(45, this.$contents.clientWidth / this.$contents.clientHeight, 0.1, 1000);
    this.scene.add(this.camera);
  }

  protected setCameraPosition (): void {
    this.camera.position.x = -30;
    this.camera.position.y = 40;
    this.camera.position.z = 30;
    this.camera.lookAt(this.scene.position);
  }


  /**
   * Override Method: メッシュオブジェクトの作成
   */
  protected createMesh (): void {

  }


  /**
   * Override Method: ライティングのセット
   */
  protected setLights (): void {

  }


  /**
   * Override Method: その他のセッティング
   */
  protected otherInitialSetting (): void {

  }


  /**
   * レンダリングメソッド
   */
  protected renderScene (): void {
    this.stats.update();

    this.updateAction();

    requestAnimationFrame(this.renderScene);
    this.renderer.render(this.scene, this.camera);
  }


  /**
   * Override Methods: 描画更新時に毎回呼び出すアクション
   */
  protected updateAction (): void {
  }


  /**
   * リサイズメソッド
   */
  protected onResize (): void {
    this.camera.aspect = this.$contents.clientWidth / this.$contents.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.$contents.clientWidth, this.$contents.clientHeight);
  }


  //////////////////////// Status表示とパラメータコントローラー ///////////////////////
  protected initStats (): void {
    this.stats = Stats();
    this.stats.setMode(0);
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';
    document.getElementById('stats-output').appendChild(this.stats.domElement);
  }
}
</script>

<style lang="scss">
.three-js-contents {
  .vue-dat-gui {
    position: absolute;
  }
}
#stats-output {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
