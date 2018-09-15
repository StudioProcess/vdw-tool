import {
  Component,
} from "react";
import Head from "next/head";
import Global from "./global";

import {
  MessageTypes,
  IMessagePackage,
  ILayoutGeneratorCongfig,
} from "../components/types";

export default class Controller extends Component<any, any> {

  private mainWindow: Window;

  private debugContainerRef: HTMLDivElement;

  private textInputRef: HTMLTextAreaElement;

  // private resizeWidthRef: HTMLInputElement;
  // private resizeHeightRef: HTMLInputElement;

  private seedInputRef: HTMLInputElement;

  private bgColorInputRef: HTMLInputElement;
  private fgColorInputRef: HTMLInputElement;

  private layoutGeneratorConfig: ILayoutGeneratorCongfig = {
    divisionStep: 8,
    cellDivide: 0.5,
    cellFill: 0.66,
    cellTwoDivisions: 0.5,
  };

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
          <div className="buttonContainer">
            <div
              className="button"
              onClick={() => {this.onSendMessage(MessageTypes.newLayout, this.seedInputRef.value); }}
            >new Layout</div>
            <input
              type="number"
              style={{width: "30%"}}
              ref={(ref) => {this.seedInputRef = ref; }}
            />
          </div>

          <div
            className="button"
            onClick={() => {this.onSendMessage(MessageTypes.makeNonStatic); }}
          >circles fall out</div>

          <textarea
            contentEditable
            cols="120"
            rows="4"
            ref={(ref) => {this.textInputRef = ref; }}
          />
          <div
            className="button"
            onClick={() => {
              if (this.textInputRef.value.length > 0) {
                this.onSendMessage(MessageTypes.newText, this.textInputRef.value);
                this.textInputRef.value = "";
              }
            }}
          >new text</div>

          <div
            className="button"
            onClick={() => {this.onSendMessage(MessageTypes.dropText); }}
          >drop text</div>

          <div
            className="button"
            onClick={() => {this.onSendMessage(MessageTypes.makeFullscreen); }}
          >fullscreen</div>

          {/* <div className="buttonContainer">
            <div
              className="button"
              onClick={() => {
                this.onSendMessage(
                  MessageTypes.resizeTo,
                  {
                    width: this.resizeWidthRef.value,
                    height: this.resizeHeightRef.value,
                  },
                );
              }}
            >resize</div>
            <input
              type="number"
              defaultValue="1920"
              ref={(ref) => {this.resizeWidthRef = ref; }}
            />
            <input
              type="number"
              defaultValue="1080"
              ref={(ref) => {this.resizeHeightRef = ref; }}
            />
          </div> */}

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

           <div className="labelContainer">
            <div className="labelInput">
              divisionStep
              <input
              type="number"
              min="0"
              max="26"
              step="1"
              defaultValue={this.layoutGeneratorConfig.divisionStep.toFixed(3)}
              onChange={(e) => {
                this.layoutGeneratorConfig.divisionStep = parseFloat(e.target.value);
                this.onSendMessage(MessageTypes.updateLayoutConfig, this.layoutGeneratorConfig);
              }}
            />
            </div>

            <div className="labelInput">
              cellDivide
              <input
              type="number"
              min="0.0"
              max="1.0"
              step="0.01"
              defaultValue={this.layoutGeneratorConfig.cellDivide.toFixed(3)}
              onChange={(e) => {
                this.layoutGeneratorConfig.cellDivide = parseFloat(e.target.value);
                this.onSendMessage(MessageTypes.updateLayoutConfig, this.layoutGeneratorConfig);
              }}
            />
            </div>

            <div className="labelInput">
              cellFill
              <input
              type="number"
              min="0.0"
              max="1.0"
              step="0.01"
              defaultValue={this.layoutGeneratorConfig.cellFill.toFixed(3)}
              onChange={(e) => {
                this.layoutGeneratorConfig.cellFill = parseFloat(e.target.value);
                this.onSendMessage(MessageTypes.updateLayoutConfig, this.layoutGeneratorConfig);
              }}
            />
            </div>

            <div className="labelInput">
              cellTwoDivisions
              <input
              type="number"
              min="0.0"
              max="1.0"
              step="0.01"
              defaultValue={this.layoutGeneratorConfig.cellTwoDivisions.toFixed(3)}
              onChange={(e) => {
                this.layoutGeneratorConfig.cellTwoDivisions = parseFloat(e.target.value);
                this.onSendMessage(MessageTypes.updateLayoutConfig, this.layoutGeneratorConfig);
              }}
            />
            </div>

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

          .buttonContainer, .labelContainer {
            display: flex;
            flex-direction: row;
            align-items: flex-start;

             margin-bottom: 10px;

            input {
              border: 0;
              margin: 0;
              padding: 0;
              width: 30px;
              height: 26px;
              background: 0;
              flex-shrink: 0;

              border: black 1px solid;
            }

            input:last-child {
              margin-left: 10px;

              padding: 3px 5px;
              box-sizing: border-box;
            }

            input:focus, input:focus{
            }

            .button {
              flex-grow: 1.0;
              margin-bottom: 0;
            }
          }

          .labelContainer {
            flex-direction: column;

            margin-top: 10px;

            input {
              width: 100px;
            }
          }

          .labelInput {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            width: 100%;

            margin-bottom: 10px;

            position: relative;

            user-select: none;

            input {
              position: absolute;
              right: 10px;
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
