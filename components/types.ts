export enum MessageTypes {
  setup,

  data,

  newLayout,
  makeNonStatic,

  newText,
  dropText,

  closeBounds,

  makeFullscreen,

  changeBGColor,
  changeFGColor,

  changeGrainDensity,
  changeGrainScale,
  changeGrainAngle,

  changeGravityCircles,
  changeGravityText,

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
  showPartial: boolean;
}

export interface IGravityConfig {
  x: number;
  y: number;
  scale: number;
}
