precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec2 extrude;
attribute vec3 data;

varying vec2 vUV;

void main() {
  vUV = 0.5 + extrude * 0.5;

  vec3 transformed = vec3(extrude, 0.0);
  transformed.xy *= data.z;
  transformed.xy += data.xy;

  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  mvPosition = projectionMatrix * mvPosition;

  gl_Position = mvPosition;
}