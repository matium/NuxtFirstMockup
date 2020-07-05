<template>
<v-main
  class="three-js-contents first-threejs-sample"
  id="FirstThreejsSample"
  ref="ThreeJsContents"
>
  <div id="WebGL-output"></div>
  <div id="Stats-output"></div>
  <dat-gui
    closeText="Close controls"
    openText="Open controls"
    closePosition="bottom"
    ref="datGui"
  >
    <dat-number v-model="controls.rotationSpeed" :min="0" :max="0.5" :step="0.01" label="RotationSpeed"/>
    <dat-number v-model="controls.bouncingSpeed" :min="0" :max="0.5" :step="0.01" label="BouncingSpeed"/>
  </dat-gui>
</v-main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";

@Component({
  layout: 'ThreejsLayout',
  head: {
    title: 'First Three.js Sample'
  }
})
export default class FirstThreejsSample extends Vue {
  public $contents: HTMLDivElement;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private plane: THREE.Mesh;
  private cube: THREE.Mesh;
  private sphere: THREE.Mesh;

  private stats: Stats;
  private step: number = 0;
  private controls: any = {
    rotationSpeed: 0.02,
    bouncingSpeed: 0.03,
  };

  //////////////////////// Lifecycle Hooks ///////////////////////
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

  beforeDestroy (): void {
    console.log('Before Destroy');
    // this.gui.destroy();
  }

  //////////////////////// Methods ///////////////////////
  /**
   * Initialize Application
   */
  public init (): void {
    console.log('First Three.js Sample Init');
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.$contents.clientWidth / this.$contents.clientHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(new THREE.Color(0xEEEEEE));
    this.renderer.setSize(this.$contents.clientWidth, this.$contents.clientHeight);
    this.renderer.shadowMap.enabled = true;

    const planeGeometry = new THREE.PlaneGeometry(60, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    this.plane = plane;
    this.scene.add(this.plane);

    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    this.cube = cube;
    this.scene.add(this.cube);

    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    this.sphere = sphere;
    this.scene.add(this.sphere);

    this.camera.position.x = -30;
    this.camera.position.y = 40;
    this.camera.position.z = 30;
    this.camera.lookAt(this.scene.position);

    // add Ambient light
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    this.scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-20, 30, 5);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    this.scene.add(spotLight);

    if (process.client) {
      document.getElementById('WebGL-output').appendChild(this.renderer.domElement);
      this.renderScene();
    }
  }

  /**
   * 描画 / アニメーション
   */
  private renderScene (): void {
    this.stats.update();
    // rotate Cube
    this.cube.rotation.x += this.controls.rotationSpeed;
    this.cube.rotation.y += this.controls.rotationSpeed;
    this.cube.rotation.z += this.controls.rotationSpeed;

    // bounce Sphere up and down
    this.step += this.controls.bouncingSpeed;
    this.sphere.position.x = 20 + (10 * (Math.cos(this.step)));
    this.sphere.position.y = 2 + (30 * Math.abs(Math.sin(this.step)));

    // render using requestAnimationFrame
    requestAnimationFrame(this.renderScene);
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * リサイズメソッド
   */
  private onResize (): void {
    this.camera.aspect = this.$contents.clientWidth / this.$contents.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.$contents.clientWidth, this.$contents.clientHeight);
  }


  //////////////////////// パラメータコントローラー ///////////////////////
  private initStats (): void {
    this.stats = Stats();
    this.stats.setMode(0);
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';
    document.getElementById('Stats-output').appendChild(this.stats.domElement);
  }
}
</script>

<style lang="scss" scoped>
.three-js-contents {
  .vue-dat-gui {
    position: absolute;
  }
}
#Stats-output {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
