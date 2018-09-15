export function lerp(a: number, b: number, t: number): number {
  return a + ((b - a) * t);
}

export function inverseLerpUnclamped(
  a: number,
  b: number,
  value: number
): number {
  return (value - a) / (b - a);
}

export function inverseLerpClamped(
  a: number,
  b: number,
  value: number
): number {
  return clamp(0.0, 1.0, (value - a) / (b - a));
}

export function clamp(min: number, max: number, value: number): number {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  }
  return value;
}

export function randomRange(
  min: number,
  max: number,
) {
  return min + ((max - min) * Math.random());
}
