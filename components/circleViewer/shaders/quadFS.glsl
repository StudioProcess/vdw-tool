#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform vec3 colorBg;
uniform vec3 colorFront;

uniform float time;
uniform vec4 screenParams;

uniform float grainDesity;
uniform float grainScale;

varying vec2 vUV;
varying float vGrainValue;

@import ./include/noiseShared;
@import ./include/noise2D;

@import ./include/random;

void main() {
  float value = vGrainValue;

  #ifdef GL_OES_standard_derivatives
    float aawidth = (1.0 / length(vec2(dFdx(value), dFdy(value)))) * 0.3;
  #else
    float aawidth = 90.0;
  #endif

  aawidth *= grainScale;

  value = smoothstep(
    value,
    value + grainDesity,
    snoise(vUV * aawidth)
  );

  gl_FragColor.rgb = mix(
    colorBg,
    colorFront,
    value
  );
}