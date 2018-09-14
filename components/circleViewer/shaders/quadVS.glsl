precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float fadeIn;

attribute vec2 extrude;
attribute vec3 data;

varying vec2 vUV;

@import ./include/random;

void main() {
  vec2 noisePos = data.xy;
  noisePos.x -= data.z * 0.5;
  noisePos.y += data.z * 0.75;
  float fadeValue = random(noisePos) * 0.6;

  noisePos = data.yx;
  noisePos.x -= data.z * 0.55;
  noisePos.y += data.z * 0.2;
  float fadeDuration = 0.2 + random(noisePos) * 0.4;

  float scaleValue = smoothstep(
    fadeValue,
    fadeValue + fadeDuration,
    fadeIn
  );

  vUV = 0.5 + extrude * 0.5 * scaleValue;

  vec3 transformed = vec3(extrude, 0.0);
  transformed.xy *= data.z * scaleValue;
  transformed.xy += data.xy;

  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  mvPosition = projectionMatrix * mvPosition;

  gl_Position = mvPosition;
}