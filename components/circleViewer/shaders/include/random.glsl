float random(float position) {
  return fract(sin(position) * 100000.0);
}

float random(vec2 position) {
  return fract(sin(dot(position, vec2(12.9898,78.233))) * 43758.5453123);
}