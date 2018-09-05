import {
  InstancedBufferGeometry,
  BufferAttribute,
  InstancedBufferAttribute,
} from "three";

export default function getInstancedCircleGeometry(
  resolution: number,
  radius: number,
  count: number,
) {
  const vertices = [];
  const data = [];
  const indices = [];

  vertices.push(0.0, 0.0);

  let angle = 0.0;
  const angleStep = (Math.PI * 2.0) / resolution;

  for (let i = 0; i < resolution; i++) {
    vertices.push(
      Math.sin(angle) * radius,
      Math.cos(angle) * radius,
    );

    if (i > 0) {
      indices.push(i, 0, i + 1);
    }

    angle += angleStep;
  }

  indices.push(0, 1, resolution);

  for (let i = 0; i < count; i++) {
    data.push(
      (i / (count - 1)) * 2.0 - 1.0,
      0.0,
      0.3,
    );
  }

  const geometry = new InstancedBufferGeometry();
  geometry.addAttribute("extrude", new BufferAttribute(new Float32Array(vertices), 2));
  geometry.addAttribute("data", new InstancedBufferAttribute(new Float32Array(data), 3));

  geometry.setIndex(new BufferAttribute(new Uint16Array(indices), 1));

  return geometry;
}
