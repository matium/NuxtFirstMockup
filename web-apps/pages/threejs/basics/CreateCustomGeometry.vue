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
      <dat-folder v-for="(item, index) in controlPoints" :key="item.id" :label="'Vertices' + (index + 1)">
        <dat-number v-model="item.x" :min="-10" :max="10" :step="1" label="x"/>
        <dat-number v-model="item.y" :min="-10" :max="10" :step="1" label="y"/>
        <dat-number v-model="item.z" :min="-10" :max="10" :step="1" label="z"/>
      </dat-folder>
    </dat-gui>
  </client-only>
</v-main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as THREE from "three";
import { SceneUtils } from "~/node_modules/three/examples/jsm/utils/SceneUtils";
import BasicThreeJsView from "~/components/threejs/BasicThreeJsView.vue";


@Component({
  head: {
    title: 'Create Custom Geometry'
  }
})
export default class CreateCustomGeometry extends BasicThreeJsView {
  private plane: THREE.Mesh;
  private customGeometryMesh: THREE.Group;

  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;

  private controlPoints: {x: number, y: number, z: number}[] = [
    {x: 3, y: 5, z: 3},
    {x: 3, y: 5, z: 0},
    {x: 3, y: 0, z: 3},
    {x: 3, y: 0, z: 0},
    {x: 0, y: 5, z: 0},
    {x: 0, y: 5, z: 3},
    {x: 0, y: 0, z: 0},
    {x: 0, y: 0, z: 3},
  ];
  private vertices: THREE.Vector3[];
  private faces: THREE.Face3[];

  protected setCameraPosition (): void {
    this.camera.position.x = -20;
    this.camera.position.y = 25;
    this.camera.position.z = 20;
    this.camera.lookAt(new THREE.Vector3(5, 0, 0));
  }

  protected setLights (): void {
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-20, 30, 5);
    spotLight.castShadow = true;
    this.scene.add(spotLight);
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

    this.createCustomGeometryMesh();
  }

  protected createCustomGeometryMesh (): void {
    this.vertices = [
      new THREE.Vector3(1, 3, 1),
      new THREE.Vector3(1, 3, -1),
      new THREE.Vector3(1, -1, 1),
      new THREE.Vector3(1, -1, -1),
      new THREE.Vector3(-1, 3, -1),
      new THREE.Vector3(-1, 3, 1),
      new THREE.Vector3(-1, -1, -1),
      new THREE.Vector3(-1, -1, 1),
    ];

    this.faces = [
      new THREE.Face3(0, 2, 1),
      new THREE.Face3(2, 3, 1),
      new THREE.Face3(4, 6, 5),
      new THREE.Face3(6, 7, 5),
      new THREE.Face3(4, 5, 1),
      new THREE.Face3(5, 0, 1),
      new THREE.Face3(7, 6, 2),
      new THREE.Face3(6, 3, 2),
      new THREE.Face3(5, 7, 0),
      new THREE.Face3(7, 2, 0),
      new THREE.Face3(1, 3, 4),
      new THREE.Face3(3, 6, 4),
    ];

    const geom = new THREE.Geometry();
    geom.vertices = this.vertices;
    geom.faces = this.faces;
    geom.computeFaceNormals();

    const materials = [
      new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0x44ff44, transparent: true }),
      new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
    ];

    this.customGeometryMesh = <THREE.Group> SceneUtils.createMultiMaterialObject(geom, materials);
    this.customGeometryMesh.children.forEach((e) => {
      e.castShadow = true;
    });
    this.scene.add(this.customGeometryMesh);
  }

  protected updateAction(): void {
    this.customGeometryMesh.children.forEach((e: THREE.Mesh) => {
      const customGeom: THREE.Geometry = <THREE.Geometry> e.geometry;
      for (let i = 0; i < 8; i++) {
        customGeom.vertices[i].set(this.controlPoints[i].x, this.controlPoints[i].y, this.controlPoints[i].z);
      }
      customGeom.verticesNeedUpdate = true;
      customGeom.computeFaceNormals();
    });
  }

  /**
   * カスタムジオメトリメッシュを複製する
   */
  private clone (): void {
    if (process.client) {
      const targetMesh: THREE.Mesh = <THREE.Mesh> this.customGeometryMesh.children[0];
      const cloneGeometry: THREE.Geometry = <THREE.Geometry> targetMesh.geometry.clone();
      const materials = [
        new THREE.MeshLambertMaterial(({ opacity: 0.6, color: 0xff44ff, transparent: true })),
        new THREE.MeshBasicMaterial(({ color: 0x000000, wireframe: true }))
      ];

      const mesh2 = SceneUtils.createMultiMaterialObject(cloneGeometry, materials);
      mesh2.children.forEach((e) => {
        e.castShadow = true;
      });

      mesh2.translateX(5);
      mesh2.translateZ(5);
      mesh2.name = 'clone';
      this.scene.remove(this.scene.getObjectByName('clone'));
      this.scene.add(mesh2);
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
