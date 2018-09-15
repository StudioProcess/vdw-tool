export enum MessageTypes {
  setup,

  data,

  newLayout,
  makeNonStatic,

  newText,
  dropText,

  makeFullscreen,

  changeBGColor,
  changeFGColor,

  updateLayoutConfig,
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

export interface ILayoutGeneratorCongfig {
  divisionStep: number;
  cellDivide: number;
  cellFill: number;
  cellTwoDivisions: number;
}
