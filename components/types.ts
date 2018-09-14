export enum MessageTypes {
  setup,

  data,

  newLayout,
  makeNonStatic,

  makeFullscreen,

  changeBGColor,
  changeFGColor,
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
