export const PhysicsLayers = {
  default: 1 << 0,
  noCollision: 1 << 1,
};

export const TextLayers = [
  PhysicsLayers.default | 1 << 6,
  PhysicsLayers.default | 1 << 7,
  PhysicsLayers.default | 1 << 8,
  PhysicsLayers.default | 1 << 9,
  PhysicsLayers.default | 1 << 10,
  PhysicsLayers.default | 1 << 11,
  PhysicsLayers.default | 1 << 12,
  PhysicsLayers.default | 1 << 13,
  PhysicsLayers.default | 1 << 14,
  PhysicsLayers.default | 1 << 15,
];
