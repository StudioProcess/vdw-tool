import {
  Group,
  Mesh,

  Object3D,
  RawShaderMaterial,
  BufferAttribute,
} from "three";

import GetCircleGeometry from "./getCircleGeometry";

import vertexShader from "./shaders/quadVS.glsl";
import fragmentShader from "./shaders/quadFS.glsl";

export default class StatueHandler {
  private container: Group;
  private mesh: Object3D;
  private material: RawShaderMaterial;

  public setup(
    parent: Object3D,
    uniforms: Uniforms) {

    this.material = new RawShaderMaterial({
      vertexShader,
      fragmentShader,
      // wireframe: true,
      uniforms,
      defines: {},
    });

    this.container = new Group();
    parent.add(this.container);

    this.mesh = new Mesh(
      GetCircleGeometry(
        60,
        1.0,
        100,
      ),
      this.material,
    );
    this.mesh.frustumCulled = false;
    this.container.add(this.mesh);

    this.mesh.geometry.attributes.data.dynamic = true;
  }

  public getDataBuffer = (): BufferAttribute => {
    return this.mesh.geometry.attributes.data;
  }

  public update(
    time: number,
    delta: number,
  ) {
    for (let i = 0, l = this.mesh.geometry.attributes.data.array.length; i < l; i += 3) {
      this.mesh.geometry.attributes.data.array[i + 1] = Math.sin(i * 0.2 + time * 0.5);
      this.mesh.geometry.attributes.data.array[i + 2] = 0.1 + 0.1 * Math.abs(Math.sin(i * 0.2 + time * 0.5));
    }
    this.mesh.geometry.attributes.data.needsUpdate = true;
  }
}
