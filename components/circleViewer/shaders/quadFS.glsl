#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform vec3 colorBg;
uniform vec3 colorFront;

uniform float time;
uniform vec4 screenParams;

uniform float grainDesity;

varying vec2 vUV;

@import ./include/noiseShared;
@import ./include/noise2D;

@import ./include/random;

void main() {
  float value = vUV.y;

  #ifdef GL_OES_standard_derivatives
    float aawidth = (1.0 / length(vec2(dFdx(value), dFdy(value)))) * 0.3;
  #else
    float aawidth = 90.0;
  #endif 

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