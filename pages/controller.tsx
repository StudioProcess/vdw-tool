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
  private growTimeRef: HTMLInputElement;
  private shrinkTimeRef: HTMLInputElement;

  // private bgColorInputRef: HTMLInputElement;
  // private fgColorInputRef: HTMLInputElement;

  private layoutGeneratorConfig: ILayoutGeneratorCongfig = {
    divisionStep: 6,
    cellDivide: 0.4,
    cellFill: 0.7,
    cellTwoDivisions: 0.5,
    showPartial: false,
  };

  private gravityConfigCircles: IGravityConfig = {
    x: 0.0,
    y: 0.0,
    scale: 0.001,
  };
  private gravityConfigText: IGravityConfig = {
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
          
          
          <h3>General</h3>

          <div className="buttonContainer">
            background color
            <input
              type="color"
              defaultValue="#eb582f"
              onChange={(e) => {
                  this.onSendMessage(MessageTypes.changeBGColor, e.target.value);
              }}
            />
          </div>
          
          <div className="buttonContainer">
            circles color
            <input
              type="color"
              defaultValue="#ffffff"
              onChange={(e) => {
                  this.onSendMessage(MessageTypes.changeFGColor, e.target.value);
              }}
            />
          </div>

          <div className="buttonContainer">
            text stroke color
            <input
              type="color"
              defaultValue="#000000"
              onChange={(e) => {
                  this.onSendMessage(MessageTypes.updateTextStrokeColor, e.target.value);
              }}
            />
          </div>
          <div className="buttonContainer">
            text fill color
            <input
              type="color"
              defaultValue="#000000"
              onChange={(e) => {
                  this.onSendMessage(MessageTypes.updateTextFillColor, e.target.value);
              }}
            />
          </div>
          <div className="buttonContainer">
            text fill color
            <input
              type="checkbox"
              onChange={(e) => {
                  this.onSendMessage(MessageTypes.updateTextShowFill, e.target.checked);
              }}
            />
          </div>

          <div className="labelContainer">
            <div className="labelInput">
                logo
                <input
                type="checkbox"
                defaultChecked
                onChange={(e) => {
                  this.onSendMessage(MessageTypes.toggleLogoVisibility, e.target.checked);
                }}
              />
            </div>
            <div className="labelInput">
                lines
                <input
                  type="checkbox"
                  defaultChecked
                  onChange={(e) => {
                    this.onSendMessage(MessageTypes.toggleLinesVisibility, e.target.checked);
                  }}
                />
              </div>
            </div>
          
          
          <h3>Generator</h3>

           <div className="labelContainer">
            <div className="labelInput">
              divisionStep
              <input
              type="number"
              min="0"
              max="26"
              step="1"
              defaultValue={this.layoutGeneratorConfig.divisionStep.toFixed(0)}
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
              defaultValue={this.layoutGeneratorConfig.cellDivide.toFixed(2)}
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
              defaultValue={this.layoutGeneratorConfig.cellFill.toFixed(2)}
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
              defaultValue={this.layoutGeneratorConfig.cellTwoDivisions.toFixed(2)}
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
          
          <div className="labelContainer">
            <div className="labelInput">
              growTime
              <input
              type="number"
              min="0.0"
              step="0.5"
              defaultValue="1.0"
              ref={(ref) => {this.growTimeRef = ref; }}
              />
            </div>
            <div className="labelInput">
              shrinkTime
              <input
              type="number"
              min="0.0"
              step="0.5"
              defaultValue="1.0"
              ref={(ref) => {this.shrinkTimeRef = ref; }}
              />
            </div>
          </div>
          
          <div className="buttonContainer">
            <div
              className="button"
              onClick={() => {this.onSendMessage(MessageTypes.newLayout, 
                {seed: this.seedInputRef.value, growTime: this.growTimeRef.value}); 
              }}
            >new circles</div>
            <input
              type="number"
              style={{width: "30%"}}
              ref={(ref) => {this.seedInputRef = ref; }}
            />
          </div>
          <div className="buttonContainer">
            <div
              className="button"
              onClick={() => {this.onSendMessage(MessageTypes.removeCircles, this.shrinkTimeRef.value); }}
            >shrink circles</div>
          </div>
          
          
          <h3>Circles</h3>
          
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
          

          <h3>Circle Physics</h3>

          <div className="labelContainer">
            <div className="labelInput">
                friction
                <input
                type="range"
                min="0.0"
                max="1.0"
                defaultValue="0.1"
                step="0.01"
                onChange={(e) => {
                  this.onSendMessage(MessageTypes.changeFrictionCircles, e.target.value);
                }}
              />
            </div>
            <div className="labelInput">
                restitution
                <input
                type="range"
                min="0.0"
                max="1.0"
                defaultValue="0.0"
                step="0.01"
                onChange={(e) => {
                  this.onSendMessage(MessageTypes.changeRestitutionCircles, e.target.value);
                }}
              />
            </div>
            <div className="labelInput">
                bottom
                <input
                type="checkbox"
                defaultChecked
                onChange={(e) => {
                  this.onSendMessage(MessageTypes.setBottomCircles, e.target.checked);
                }}
              />
            </div>
          </div>

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

                  this.gravityConfigCircles.x = Math.sin(parseFloat(value));
                  this.gravityConfigCircles.y = Math.cos(parseFloat(value));

                  this.onSendMessage(MessageTypes.changeGravityCircles, this.gravityConfigCircles);
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
                  this.gravityConfigCircles.scale = parseFloat(e.target.value);
                  this.onSendMessage(MessageTypes.changeGravityCircles, this.gravityConfigCircles);
                }}
              />
            </div>
          </div>

          <div
            className="button"
            onClick={() => {this.onSendMessage(MessageTypes.makeNonStatic); }}
          >drop circles</div>

          {/* <div
            className="button"
            onClick={() => {this.onSendMessage(MessageTypes.closeBounds); }}
          >close worlds bounds</div> */}
          
          
          <h3>Text</h3>
          
          
          <textarea
            contentEditable
            cols={120}
            rows={4}
            ref={(ref) => {this.textInputRef = ref; }}
            defaultValue={"A City\nFull of\nDesign"}
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

          <div className="labelInput">
                size
                <input
                type="number"
                defaultValue="80"
                onChange={(e) => {
                  if (Number.isInteger(parseInt(e.target.value, 10))) {
                    this.onSendMessage(MessageTypes.updateTextSize, e.target.value);
                  }
                }}
              />
            </div>
          
          
          <h3>Text Physics</h3>

          <div className="labelContainer">
            <div className="labelInput">
                friction
                <input
                type="range"
                min="0.0"
                max="1.0"
                defaultValue="0.1"
                step="0.01"
                onChange={(e) => {
                  this.onSendMessage(MessageTypes.changeFrictionText, e.target.value);
                }}
              />
            </div>
            <div className="labelInput">
                restitution
                <input
                type="range"
                min="0.0"
                max="1.0"
                defaultValue="0.0"
                step="0.01"
                onChange={(e) => {
                  this.onSendMessage(MessageTypes.changeRestitutionText, e.target.value);
                }}
              />
            </div>
            <div className="labelInput">
                bottom
                <input
                type="checkbox"
                defaultChecked
                onChange={(e) => {
                  this.onSendMessage(MessageTypes.setBottomText, e.target.checked);
                }}
              />
            </div>
          </div>
          
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

                  this.gravityConfigText.x = Math.sin(parseFloat(value));
                  this.gravityConfigText.y = Math.cos(parseFloat(value));

                  this.onSendMessage(MessageTypes.changeGravityText, this.gravityConfigText);
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
                  this.gravityConfigText.scale = parseFloat(e.target.value);
                  this.onSendMessage(MessageTypes.changeGravityText, this.gravityConfigText);
                }}
              />
            </div>
          </div>

          <div
            className="button"
            onClick={() => {this.onSendMessage(MessageTypes.dropText); }}
          >drop text</div>

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
