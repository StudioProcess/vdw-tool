import {
  Component,
} from "react";
import Head from "next/head";

import {
  MessageTypes,
  IMessagePackage,
  ILayoutGeneratorCongfig,
  IGravityConfig,
} from "../components/types";

export default class Controller extends Component<any, any> {

  private mainWindow: Window;

  private debugContainerRef: HTMLDivElement;

  private textInputRef: HTMLTextAreaElement;

  // private resizeWidthRef: HTMLInputElement;
  // private resizeHeightRef: HTMLInputElement;

  private seedInputRef: HTMLInputElement;

  // private bgColorInputRef: HTMLInputElement;
  // private fgColorInputRef: HTMLInputElement;

  private layoutGeneratorConfig: ILayoutGeneratorCongfig = {
    divisionStep: 8,
    cellDivide: 0.5,
    cellFill: 0.66,
    cellTwoDivisions: 0.5,
    showPartial: false,
  };

  private gravityConfig: IGravityConfig = {
    x: 0.0,
    y: 0.0,
    scale: 0.001,
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
          
          <h3>Layout</h3>
          
          <div className="buttonContainer">
            background color
            <input
              type="color"
              defaultValue="#eb582f"
              onChange={e => {
                  this.onSendMessage(MessageTypes.changeBGColor, e.target.value);
              }}
            />
          </div>
          <div className="buttonContainer">
            grain color
            <input
              type="color"
              defaultValue="#ffffff"
              onChange={e => {
                  this.onSendMessage(MessageTypes.changeFGColor, e.target.value);
              }}
            />
          </div>
          
          <div className="labelContainer">
            <div className="labelInput">
                grain density
                <input
                type="range"
                min="-8"
                max="-0.01"
                defaultValue="-0.8"
                step="0.01"
                onChange={(e) => {
                  this.onSendMessage(MessageTypes.changeGrainDensity, parseFloat(e.target.value));
                }}
              />
            </div>
            <div className="labelInput">
                grain scale
                <input
                type="range"
                min="0.01"
                max="3.0"
                defaultValue="1.0"
                step="0.01"
                onChange={(e) => {
                  this.onSendMessage(MessageTypes.changeGrainScale, parseFloat(e.target.value));
                }}
              />
            </div>
            <div className="labelInput">
                grain angle
                <input
                type="range"
                min={(-Math.PI).toString()}
                max={(Math.PI).toString()}
                defaultValue={(0.0).toString()}
                step="0.01"
                onChange={(e) => {
                  this.onSendMessage(MessageTypes.changeGrainAngle, e.target.value);
                }}
              />
            </div>
          </div>
          
          {/* <div>text color</div>
          <div>text size</div>
          <br/> */}
          
          <textarea
            contentEditable
            cols={120}
            rows={4}
            ref={(ref) => {this.textInputRef = ref; }}
            defaultValue={'A City\nFull of\nDesign'}
          />
          <div
            className="button"
            onClick={() => {
              if (this.textInputRef.value.length > 0) {
                this.onSendMessage(MessageTypes.newText, this.textInputRef.value);
                {/* this.textInputRef.value = ""; */}
              }
            }}
          >new text</div>
          
          
          
          <h3>Generator</h3>

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
            
            <div className="labelInput">
              showPartial
              <input type="checkbox"
              onChange={(e) => {
                this.layoutGeneratorConfig.showPartial = e.target.checked;
                this.onSendMessage(MessageTypes.updateLayoutConfig, this.layoutGeneratorConfig);
              }}
              />
            </div>
          </div>
          
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
          
          
          
          <h3>Physics</h3>
          
          <div className="labelContainer">
            <div className="labelInput">
                gravity direction
                <input
                type="range"
                min={(Math.PI * -1.0).toString()}
                max={(Math.PI).toString()}
                defaultValue={(0.0).toString()}
                step="0.01"
                onChange={(e) => {
                  const value = e.target.value;

                  this.gravityConfig.x = Math.sin(parseFloat(value));
                  this.gravityConfig.y = Math.cos(parseFloat(value));

                  this.onSendMessage(MessageTypes.changeGravity, this.gravityConfig);
                }}
              />
            </div>
            <div className="labelInput">
                gravity scale
                <input
                type="range"
                min="0.0"
                max="0.003"
                defaultValue={(0.001).toString()}
                step="0.0001"
                onChange={(e) => {
                  this.gravityConfig.scale = parseFloat(e.target.value);
                  this.onSendMessage(MessageTypes.changeGravity, this.gravityConfig);
                }}
              />
            </div>
          </div>

          <div
            className="button"
            onClick={() => {this.onSendMessage(MessageTypes.makeNonStatic); }}
          >drop circles</div>

          <div
            className="button"
            onClick={() => {this.onSendMessage(MessageTypes.dropText); }}
          >drop text</div>

          <div
            className="button"
            onClick={() => {this.onSendMessage(MessageTypes.closeBounds); }}
          >close worlds bounds</div>

          {/* <div
            className="button"
            onClick={() => {this.onSendMessage(MessageTypes.makeFullscreen); }}
          >fullscreen</div> */}

          <div ref={(ref) => {this.debugContainerRef = ref; }}/>
        </div>

        <style global jsx>{`
          body {
            background: white;
            font: 11px system-ui, sans-serif;
          }
        `}</style>

        <style jsx>{`
          .container {
            margin: 0 auto;
            margin-top: 10px;

            display: flex;
            flex-direction: column;

            color: #333;
            
            h3:first-child { margin-top:0; }
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
              height: 23px;
              background: 0;
              flex-shrink: 0;

              border: black 1px solid;
            }

            input:last-child {
              margin-left: 10px;
              padding: 0px 10px;
              box-sizing: border-box;
              &[type=color] { padding:0; }
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
