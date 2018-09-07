export enum MessageTypes {
  setup,

  data,

  newLayout,
  makeNonStatic,

  makeFullscreen,
}

export interface IMessagePackage {
  type: MessageTypes;
  data?: any;
}

export interface ILayoutItem {
  x: number;
  y: number;
  radius: number;
}
