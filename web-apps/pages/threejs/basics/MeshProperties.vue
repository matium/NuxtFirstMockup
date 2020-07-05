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
      <dat-folder label="scale">
        <dat-number v-model="controls.scaleX" :min="0" :max="5" :step="0.1" label="scaleX" />
        <dat-number v-model="controls.scaleY" :min="0" :max="5" :step="0.1" label="scaleY" />
        <dat-number v-model="controls.scaleZ" :min="0" :max="5" :step="0.1" label="scaleZ" />
      </dat-folder>
      <dat-folder label="position">
        <dat-number v-model="controls.positionX" :min="-10" :max="10" :step="0.1" label="positionX" />
        <dat-number v-model="controls.positionY" :min="-4" :max="20" :step="0.1" label="positionY" />
        <dat-number v-model="controls.positionZ" :min="-10" :max="10" :step="0.1" label="positionZ" />
      </dat-folder>
      <dat-folder label="rotation">
        <dat-number v-model="controls.rotationX" :min="-4" :max="4" :step="0.1" label="rotationX" />
        <dat-number v-model="controls.rotationY" :min="-4" :max="4" :step="0.1" label="rotationY" />
        <dat-number v-model="controls.rotationZ" :min="-4" :max="4" :step="0.1" label="rotationZ" />
      </dat-folder>
      <dat-folder label="translate">
        <dat-number v-model="controls.translateX" :min="-10" :max="10" :step="0.1" label="translateX" />
        <dat-number v-model="controls.translateY" :min="-10" :max="10" :step="0.1" label="translateY" />
        <dat-number v-model="controls.translateZ" :min="-10" :max="10" :step="0.1" label="translateZ" />
        <dat-button @click="translateCube" label="translate" />
      </dat-folder>
      <dat-boolean v-model="controls.visible" label="visible"></dat-boolean>
    </dat-gui>
  </client-only>
</v-main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as THREE from "three";
import BasicThreeJsView from "~/components/threejs/BasicThreeJsView.vue";

@Component({
  head: {
    title: 'Mesh Properties'
  }
})
export default class MeshProperties extends BasicThreeJsView {
  private plane: THREE.Mesh;
  private cube: THREE.Mesh;

  protected scene: THREE.Scene;

  protected step: number = 0;
  protected controls: any = {
    visible: true,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    positionX: 0,
    positionY: 4,
    positionZ: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    translateX: 0,
    translateY: 0,
    translateZ: 0,
  }

  protected createMesh(): void {
    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.plane.receiveShadow = true;
    this.plane.rotation.x = -0.5 * Math.PI;
    this.plane.position.x = 0;
    this.plane.position.y = 0;
    this.plane.position.z = 0;
    this.scene.add(this.plane);

    const cubeGeometry = new THREE.BoxGeometry(5, 8, 3);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x44ff44 });
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.cube.position.y = 4;
    this.cube.castShadow = true;
    this.scene.add(this.cube);
  }

  protected setLights(): void {
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    this.scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-20, 30, 10);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    this.scene.add(spotLight);
  }

  protected updateAction(): void {
    this.cube.visible = this.controls.visible;
    this.cube.scale.set(this.controls.scaleX, this.controls.scaleY, this.controls.scaleZ);
    this.cube.position.set(this.controls.positionX, this.controls.positionY, this.controls.positionZ);
    this.cube.rotation.x = this.controls.rotationX;
    this.cube.rotation.y = this.controls.rotationY;
    this.cube.rotation.z = this.controls.rotationZ;
  }

  protected translateCube (): void {
    this.cube.translateX(this.controls.translateX);
    this.cube.translateY(this.controls.translateY);
    this.cube.translateZ(this.controls.translateZ);

    this.controls.positionX = this.cube.position.x;
    this.controls.positionY = this.cube.position.y;
    this.controls.positionZ = this.cube.position.z;
  }
}
</script>

<style lang="scss" scoped>

</style>
