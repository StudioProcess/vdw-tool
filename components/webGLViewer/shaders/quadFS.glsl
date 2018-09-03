// https://www.shadertoy.com/view/4sjGRD

uniform float time;

varying vec2 vUV;

void main() {
  vec4 color = vec4(
    vUV,
    0.5 + 0.5 * sin(time),
    1.0
  );

  gl_FragColor = color;
}