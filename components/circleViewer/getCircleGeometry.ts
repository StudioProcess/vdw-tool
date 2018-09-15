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
  const circlePositions = [];
  const circleSizes = [];
  const circleRandoms = [];
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
    circlePositions.push(
      (i / (count - 1)) * 2.0 - 1.0,
      0.0,
    );
    circleSizes.push(0.3);
    circleRandoms.push(
      (Math.random() - 0.5) * 2.0 * 1000.0,
    );
  }

  const geometry = new InstancedBufferGeometry();
  geometry.addAttribute("extrude", new BufferAttribute(new Float32Array(vertices), 2));
  geometry.addAttribute("circlePosition", new InstancedBufferAttribute(new Float32Array(circlePositions), 2));
  geometry.addAttribute("circleSize", new InstancedBufferAttribute(new Float32Array(circleSizes), 1));
  geometry.addAttribute("circleRandom", new InstancedBufferAttribute(new Float32Array(circleRandoms), 1));

  geometry.setIndex(new BufferAttribute(new Uint16Array(indices), 1));

  return geometry;
}
