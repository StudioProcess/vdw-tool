varying vec2 vUV;

void main() {
  vUV = uv;

  vec3 transformed = vec3( position );
  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  mvPosition = projectionMatrix * mvPosition;

  gl_Position = mvPosition;
}