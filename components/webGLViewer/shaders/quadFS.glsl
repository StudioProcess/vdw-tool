precision highp float;
// https://www.shadertoy.com/view/4sjGRD

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

  value = step(snoise(vUV * 90.0), value - 0.6);

  gl_FragColor.rgb = mix(
    colorBg,
    colorFront,
    value
  );
}