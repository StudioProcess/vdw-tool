import {
  Group,
  PlaneBufferGeometry,
  Mesh,

  Object3D,
  ShaderMaterial,
} from "three";

import vertexShader from "./shaders/quadVS.glsl";
import fragmentShader from "./shaders/quadFS.glsl";

export default class StatueHandler {
  private container: Group;
  private mesh: Object3D;
  private material: ShaderMaterial;

  public setup(
    parent: Object3D,
    uniforms: Uniforms) {

    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      // wireframe: true,
      uniforms,
      defines: {},
    });

    this.container = new Group();
    parent.add(this.container);

    this.mesh = new Mesh(
      new PlaneBufferGeometry(1.0, 1.0, 1, 1),
      this.material,
    );
    this.container.add(this.mesh);
  }

  public onDrag(dragDelta: MousePosition): void {
    this.mesh.rotation.x += dragDelta.y;
    this.mesh.rotation.y += dragDelta.x;
  }

  public update(delta: number): void {
    this.mesh.rotation.x -= delta * 0.2;
    this.mesh.rotation.y += delta * 0.2;
  }
}
