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
      <dat-button @click="moveCamera(0)" label="camera0" />
      <dat-button @click="moveCamera(1)" label="camera1" />
      <dat-button @click="moveCamera(2)" label="camera2" />
      <dat-button @click="moveCamera(3)" label="camera3" />
    </dat-gui>
  </client-only>
</v-main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as THREE from "three";
import BasicThreeJsView from "~/components/threejs/BasicThreeJsView.vue";
import { CameraPositionProps } from "~/interfaces/CameraPositionProps";
import { gsap } from 'gsap';

@Component
export default class MovingCamera extends BasicThreeJsView {
  protected camera: THREE.PerspectiveCamera;
  private plane: THREE.Mesh;
  private cube: THREE.Mesh;

  protected scene: THREE.Scene;

  private cameraPositions: CameraPositionProps[] = [
    {
      x: -30,
      y: 40,
      z: 30,
      lookAt: new THREE.Vector3(0, 0, 0)
    },
    {
      x: 60,
      y: 20,
      z: 80,
      lookAt: new THREE.Vector3(10, 10, 10)
    },
    {
      x: 20,
      y: 60,
      z: -20,
      lookAt: new THREE.Vector3(10, 10, 10)
    },
    {
      x: -30,
      y: 120,
      z: -50,
      lookAt: new THREE.Vector3(0, 0, 0)
    }
  ];

  protected controls: any = {
    cameraPos: <CameraPositionProps> {
      x: this.cameraPositions[0].x,
      y: this.cameraPositions[0].y,
      z: this.cameraPositions[0].z,
      lookAt: new THREE.Vector3(this.cameraPositions[0].lookAt.x, this.cameraPositions[0].lookAt.y, this.cameraPositions[0].lookAt.z)
    }
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

  protected setCameraPosition(): void {
    this.camera.position.x = this.controls.cameraPos.x;
    this.camera.position.y = this.controls.cameraPos.y;
    this.camera.position.z = this.controls.cameraPos.z;
    this.camera.lookAt(this.controls.cameraPos.lookAt);
  }

  protected updateAction(): void {
    this.camera.position.x = this.controls.cameraPos.x;
    this.camera.position.y = this.controls.cameraPos.y;
    this.camera.position.z = this.controls.cameraPos.z;
    this.camera.lookAt(new THREE.Vector3(this.controls.cameraPos.lookAt.x, this.controls.cameraPos.lookAt.y, this.controls.cameraPos.lookAt.z));
  }

  protected moveCamera (positionNo: number): void {
    const targetCameraPos = this.cameraPositions[positionNo];

    gsap.to(this.controls.cameraPos, {
      duration: 1,
      ease: 'power3.out',
      x: targetCameraPos.x,
      y: targetCameraPos.y,
      z: targetCameraPos.z
    });
    gsap.to(this.controls.cameraPos.lookAt, {
      duration: 1,
      ease: 'power3.out',
      x: targetCameraPos.lookAt.x,
      y: targetCameraPos.lookAt.y,
      z: targetCameraPos.lookAt.z
    });
  }
}
</script>

<style lang="scss" scoped>

</style>
