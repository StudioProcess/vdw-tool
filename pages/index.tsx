import {
  Component,
} from "react";
import Head from "next/head";

import Global from "./global";

import {
  MessageTypes,
  IMessagePackage,
} from "../components/types";

import CirclesViewer from "../components/circleViewer/circleViewer";
import TextViewer from "../components/textViewer/textViewer";

import Logo from "../components/logo";
import DividerLines from "../components/dividerLines";

export default class Index extends Component<any, any> {

  private controllerWindow: Window;
  private circlesViewerRef: CirclesViewer;
  private textViewerRef: TextViewer;

  private logoRef: Logo;
  private linesRef: DividerLines;

  private fullscreenButtonRef: HTMLDivElement;

  public componentDidMount() {
    this.openControllerWindow();

    window.addEventListener("message", this.onReceiveMessage);

    window.addEventListener("keydown", (e) => {
      if (e.key === "h") { // h
        this.openControllerWindow();
      } else if (e.key === "f") { // f
        this.toggleFullscreen();
      }
    });
  }

  public componentWillUnmount() {
    window.removeEventListener("message", this.onReceiveMessage);
    this.controllerWindow.close();
  }

  private openControllerWindow = () => {
    this.controllerWindow = window.open(
      "/controller",
      "controller",
      "titlebar=0,close=0,menubar=0,location=0,status=0,width=300,height=825,left=0,top=0,dependent=1,resizable=1,scrollbars=1",
    );
  }
  
  private toggleFullscreen() {
    if (document.webkitFullscreenEnabled) { // Chrome, Opera, Safari
      if (!document.webkitFullscreenElement) {
        document.querySelector("body").webkitRequestFullscreen();
      } else { document.webkitExitFullscreen(); }
    // @ts-ignore
    } else if (document.mozFullScreenEnabled) { // Firefox
    // @ts-ignore
      if (!document.mozFullScreenElement) {
      // @ts-ignore
        document.querySelector("body").mozRequestFullScreen();
      } else { 
        // @ts-ignore
        document.mozCancelFullScreen(); 
      }
    } else if (document.fullscreenEnabled) { // Standard, Edge
      if (!document.fullscreenElement) {
        document.querySelector("body").requestFullscreen();
      } else { document.exitFullscreen(); }
    }
  }

  // @ts-ignore
  private onSendMessage = (message: IMessagePackage) => {
    this.controllerWindow.postMessage(message, "*");
  }

  private onReceiveMessage = (event) => {

    const messagePackage = event.data as IMessagePackage;

    if (messagePackage.type === MessageTypes.data) {
      console.log("data", messagePackage.data);
    }

    switch (messagePackage.type) {
      case MessageTypes.newLayout:
        this.circlesViewerRef.newRandomLayout(messagePackage.data.seed, messagePackage.data.growTime);
        break;
        
      case MessageTypes.removeCircles:
        this.circlesViewerRef.removeCircles(messagePackage.data);
        break;

      case MessageTypes.makeNonStatic:
        this.circlesViewerRef.makeCirclesNonStatic();
        break;

      case MessageTypes.changeGrainDensity:
        this.circlesViewerRef.changeGrainDesity(messagePackage.data);
        break;

      case MessageTypes.changeGrainScale:
        this.circlesViewerRef.changeGrainScale(messagePackage.data);
        break;

      case MessageTypes.changeGrainAngle:
        this.circlesViewerRef.changeGrainAngle(messagePackage.data);
        break;

      case MessageTypes.newText:
        this.textViewerRef.newText(messagePackage.data);
        break;

      case MessageTypes.dropText:
        this.textViewerRef.dropText();
        break;

      case MessageTypes.closeBounds:
        this.circlesViewerRef.closeWorldBounds();
        this.textViewerRef.closeWorldBounds();
        break;

      case MessageTypes.makeFullscreen:
        this.fullscreenButtonRef.style.display = "flex";
        break;

      case MessageTypes.changeBGColor:
        // document.body.style.backgroundColor = messagePackage.data;
        this.circlesViewerRef.changeBgColor(messagePackage.data);
        break;

      case MessageTypes.changeFGColor:
        this.circlesViewerRef.changeFrontColor(messagePackage.data);
        break;

      case MessageTypes.changeGravityCircles:
        this.circlesViewerRef.updateGravity(messagePackage.data);
        break;

      case MessageTypes.changeGravityText:
        this.textViewerRef.updateGravity(messagePackage.data);
        break;

      case MessageTypes.changeFrictionCircles:
        this.circlesViewerRef.updateFriction(messagePackage.data);
        break;
      case MessageTypes.changeFrictionText:
        this.textViewerRef.updateFriction(messagePackage.data);
        break;

      case MessageTypes.changeRestitutionCircles:
        this.circlesViewerRef.updateRestitution(messagePackage.data);
        break;
      case MessageTypes.changeRestitutionText:
        this.textViewerRef.updateRestitution(messagePackage.data);
        break;

      case MessageTypes.updateLayoutConfig:
        this.circlesViewerRef.updateLayoutConfig(messagePackage.data);
        break;

      case MessageTypes.setBottomCircles:
        if (messagePackage.data === true) {
          this.circlesViewerRef.closeBottom();
        } else {
          this.circlesViewerRef.openBottom();
        }
        break;

      case MessageTypes.setBottomText:
        if (messagePackage.data === true) {
          this.textViewerRef.closeBottom();
        } else {
          this.textViewerRef.openBottom();
        }
        break;

      case MessageTypes.updateTextSize:
        this.textViewerRef.updateTextSize(parseInt(messagePackage.data, 10));
        break;
      case MessageTypes.updateTextStrokeColor:
        this.textViewerRef.updateStrokeColor(messagePackage.data);
        break;
      case MessageTypes.updateTextFillColor:
        this.textViewerRef.updateFillColor(messagePackage.data);
        break;
      case MessageTypes.updateTextShowFill:
        this.textViewerRef.updateTextShowFill(messagePackage.data);
        break;

      case MessageTypes.toggleLogoVisibility:
        if (messagePackage.data === true) {
          this.logoRef.show();
        } else {
          this.logoRef.hide();
        }
        break;

      case MessageTypes.toggleLinesVisibility:
        if (messagePackage.data === true) {
          this.linesRef.show();
        } else {
          this.linesRef.hide();
        }
        break;
    }
  }

  public render() {
    return (
      <Global>
        <Head>
          <title>Vienna Design Week 2018</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        </Head>

        <div
          style={{
            // width: "100vw",
            // height: "100vh",
            width: "700px",
            height: "700px",
            position: "relative",
          }}
        >
          <div className="webGLContainer">
            <CirclesViewer
              ref={(ref) => {this.circlesViewerRef = ref; }}
            />
          </div>

          <TextViewer
            ref={(ref) => {this.textViewerRef = ref; }}
          />

          <DividerLines
            dividerScale={3}
            ref={(ref) => {this.linesRef = ref; }}
          />

          <Logo
            ref={(ref) => {this.logoRef = ref; }}
          />

          <div
            className="fullscreenButton"
            onClick={this.toggleFullscreen}
            ref={(ref) => {this.fullscreenButtonRef = ref; }}
          >click to fullscreen</div>
        </div>

        <style jsx>{`
          .webGLContainer {
            width: 100%;
            height: 100%;
          }

          .fullscreenButton {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            background: rgba(0, 0, 0, 0.8);
            color: white;

            justify-content: center;
            align-items: center;
            font-size: 10vmin;

            display: none;
          }
        `}</style>
      </Global>
    );
  }
}
