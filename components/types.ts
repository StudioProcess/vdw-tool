export enum MessageTypes {
  setup,
  data,
}

export interface IMessagePackage {
  type: MessageTypes;
  data: any;
}
