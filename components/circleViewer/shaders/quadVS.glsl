precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float fadeIn;

attribute vec2 extrude;
attribute vec2 circlePosition;
attribute float circleSize;
attribute float circleRandom;

varying vec2 vUV;

@import ./include/random;

void main() {
  vec2 noisePos = vec2(
    circleRandom + circleSize * 0.2,
    circleSize
  );
  float fadeValue = random(noisePos) * 0.6;

  noisePos = vec2(
    circleSize,
    circleRandom - circleSize * 0.5
  );
  float fadeDuration = 0.2 + random(noisePos) * 0.4;

  float scaleValue = smoothstep(
    fadeValue,
    fadeValue + fadeDuration,
    fadeIn
  );

  vUV = 0.5 + extrude * 0.5 * scaleValue;

  vec3 transformed = vec3(extrude, 0.0);
  transformed.xy *= circleSize * scaleValue;
  transformed.xy += circlePosition;

  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  mvPosition = projectionMatrix * mvPosition;

  gl_Position = mvPosition;
}