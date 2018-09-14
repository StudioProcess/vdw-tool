import {
  Component,
} from "react";
import Head from "next/head";
import Global from "./global";

import {
  MessageTypes,
  IMessagePackage,
} from "../components/types";

export default class Controller extends Component<any, any> {

  private mainWindow: Window;

  private debugContainerRef: HTMLDivElement;

  private bgColorInputRef: HTMLInputElement;
  private fgColorInputRef: HTMLInputElement;

  public componentDidMount() {
    window.addEventListener("message", this.onReceiveMessage);

    this.mainWindow = window.opener;
  }

  public componentWillUnmount() {
    window.removeEventListener("message", this.onReceiveMessage);
  }

  private onSendMessage = (type: MessageTypes, data?: any) => {
    this.mainWindow.postMessage(
      {
        type,
        data,
      },
      "*",
    );
  }

  private onReceiveMessage = (event) => {

    const messagePackage = event.data as IMessagePackage;

    this.debugContainerRef.textContent = JSON.stringify(messagePackage.data);

    // if (messagePackage.type === MessageTypes.data) {
    //   console.log("data", messagePackage.data);
    // }
  }
  public render() {
    return (
      <div>
        <Head>
          <title>Controller</title>
        </Head>

        <div className="container">
          <div
            className="button"
            onClick={() => {this.onSendMessage(MessageTypes.newLayout); }}
          >new Layout</div>

          <div
            className="button"
            onClick={() => {this.onSendMessage(MessageTypes.makeNonStatic); }}
          >circles fall out</div>

          <div
            className="button"
            onClick={() => {this.onSendMessage(MessageTypes.makeFullscreen); }}
          >fullscreen</div>

          <div className="buttonContainer">
            <div
              className="button"
              onClick={() => {this.onSendMessage(MessageTypes.changeBGColor, this.bgColorInputRef.value); }}
            >change bg color</div>
            <input
              type="color"
              defaultValue="#eb582f"
              ref={(ref) => {this.bgColorInputRef = ref; }}
            />
          </div>

          <div className="buttonContainer">
            <div
              className="button"
              onClick={() => {this.onSendMessage(MessageTypes.changeFGColor, this.fgColorInputRef.value); }}
            >change fg color</div>
            <input
              type="color"
              defaultValue="#f5ac97"
              ref={(ref) => {this.fgColorInputRef = ref; }}
            />
          </div>

          <div ref={(ref) => {this.debugContainerRef = ref; }}/>
        </div>

        <style global jsx>{`
          body {
            background: white;
            font-family: monospace, sans-serif;
          }
        `}</style>

        <style jsx>{`
          .container {
            margin: 0 auto;
            margin-top: 10px;

            display: flex;
            flex-direction: column;

            color: #333;
          }

          .buttonContainer {
            display: flex;
            flex-direction: row;
            align-items: flex-start;

             margin-bottom: 10px;

            input {
              border: 0;
              border-radius: 20px;
              margin: 0;
              padding: 0;
              width: 30px;
              height: 100%;
              background: 0;
              flex-shrink: 0;
            }

            input:last-child {
              margin-left: 10px;
            }

            input:focus, input:focus{
              outline: none;
            }

            .button {
              flex-grow: 1.0;
              margin-bottom: 0;
            }
          }

          .button {
            background: black;
            color: white;
            padding: 5px 10px;

            margin-bottom: 10px;

            white-space: nowrap;

            user-select: none;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }
}
