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
    uniforms: Uniforms,
    maxNumCircles: number,
  ) {

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
        maxNumCircles,
      ),
      this.material,
    );
    this.mesh.frustumCulled = false;
    this.container.add(this.mesh);

    this.mesh.geometry.attributes.circlePosition.dynamic = true;
  }

  public getPositionBuffer = (): BufferAttribute => {
    return this.mesh.geometry.attributes.circlePosition;
  }

  public getSizesBuffer = (): BufferAttribute => {
    return this.mesh.geometry.attributes.circleSize;
  }
}
