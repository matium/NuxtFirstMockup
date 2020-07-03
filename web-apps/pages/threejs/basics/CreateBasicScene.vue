<template>
<v-main
  class="three-js-contents create-basic-scene"
  id="CreateBasicScene"
  ref="ThreeJsContents"
>
  <div id="threejs-output"></div>
  <div id="stats-output"></div>
  <client-only>
    <dat-gui
      closeText="Close controls"
      openText="Open controls"
      closePosition="bottom"
      ref="datGui"
    >
      <dat-number v-model="controls.rotationSpeed" :min="0" :max="0.5" :step="0.01" label="RotationSpeed" />
      <dat-button @click="addCube" label="Add Cube" />
      <dat-button @click="removeCube" label="Remove Cube" />
      <dat-button @click="outputObjects" label="Output Objects" />
      <dat-number v-model="controls.numberOfObjects" label="Number Of Objects"/>
      <dat-boolean v-model="controls.fog" @change="toggleFog" label="Fog" />
      <dat-boolean v-model="controls.overrideMaterial" @change="toggleOverrideMaterial" label="OverrideMaterial" />
    </dat-gui>
  </client-only>
</v-main>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";
import Stats from "three/examples/jsm/libs/stats.module";
import BasicThreeJsView from "~/components/threejs/BasicThreeJsView.vue";

@Component
export default class CreateBasicScene extends BasicThreeJsView {
  private plane: THREE.Mesh;
  private planeWidth: number;
  private planeHeight: number;

  protected scene: THREE.Scene;


  // Override Controls
  protected step: number = 0;
  // Override Mixin
  protected controls: any = {
    rotationSpeed: 0.1,
    numberOfObjects: 0,
    fog: false,
    overrideMaterial: false
  };

  constructor() {
    super();
    console.log('Child Constructor');
  }

  protected createMesh (): void {
    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.plane.receiveShadow = true;
    this.plane.rotation.x = -0.5 * Math.PI;
    this.plane.position.x = 0;
    this.plane.position.y = 0;
    this.plane.position.z = 0;
    this.scene.add(this.plane);

    // 後でランダム作成したCubeの位置を決める際に使用する
    this.planeWidth = planeGeometry.parameters.width;
    this.planeHeight = planeGeometry.parameters.height;
  }


  protected setLights (): void {
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    this.scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-20, 30, -5);
    spotLight.castShadow = true;
    this.scene.add(spotLight);
  }


  protected updateAction (): void {
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj != this.plane) {
        obj.rotation.x += this.controls.rotationSpeed;
        obj.rotation.y += this.controls.rotationSpeed;
        obj.rotation.z += this.controls.rotationSpeed;
      }
    });
  }


  private removeCube (): void {
    const allChildren = this.scene.children;
    const lastObject = allChildren[allChildren.length - 1];
    if (lastObject instanceof THREE.Mesh) {
      this.scene.remove(lastObject);
      this.controls.numberOfObjects = this.scene.children.length;
    }
  }


  private addCube (): void {
    const cubeSize = Math.ceil((Math.random() * 5));
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.name = 'cube-' + this.scene.children.length;
    // position the cube randomly in the scene
    cube.position.x = -30 + Math.round((Math.random() * this.planeWidth));
    cube.position.y = Math.round((Math.random() * 8));
    cube.position.z = -20 + Math.round((Math.random() * this.planeHeight));
    // add the cube to the scene
    this.scene.add(cube);
    this.controls.numberOfObjects = this.scene.children.length;
  }


  private outputObjects (): void {
    console.log(this.scene.children);
  }

  private toggleFog (): void {
    if (this.controls.fog) {
      this.scene.fog = new THREE.Fog(0xffffff, 0.01, 100);
    }
    else {
      this.scene.fog = null;
    }
  }

  private toggleOverrideMaterial (): void {
    if (this.controls.overrideMaterial) {
      this.scene.overrideMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
      });
    }
    else {
      this.scene.overrideMaterial = null;
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
