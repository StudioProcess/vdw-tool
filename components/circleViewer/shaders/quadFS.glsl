precision highp float;
#extension GL_OES_standard_derivatives : enable

const vec3 colorBg = vec3(
  0.92156862745,
  0.34509803921,
  0.18431372549
);

const vec3 colorFront = vec3(
  0.96078431372,
  0.67450980392,
  0.59215686274
);

const int lookupSize = 64;
const float errorCarry = 0.3;

uniform float time;
uniform vec4 screenParams;

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
    value - 0.8,
    snoise(vUV * aawidth)
  );

  gl_FragColor.rgb = mix(
    colorBg,
    colorFront,
    value
  );
}