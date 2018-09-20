precision highp float;

const float PI = 3.1415926535897932384626433832795;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float fadeIn;

uniform float grainAngle;

attribute vec2 extrude;
attribute vec2 circlePosition;
attribute float circleSize;
attribute float circleRandom;

varying vec2 vUV;
varying float vGrainValue;

@import ./include/random;

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

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

  vUV = 0.5 + extrude * 0.5;

  vGrainValue = 0.5 + rotate(extrude, grainAngle + PI).y * 0.5 * scaleValue;

  vec3 transformed = vec3(extrude, 0.0);
  transformed.xy *= circleSize * scaleValue;
  transformed.xy += circlePosition;

  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  mvPosition = projectionMatrix * mvPosition;

  gl_Position = mvPosition;
}