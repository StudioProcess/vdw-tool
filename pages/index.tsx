import {
  Component,
} from "react";
import Head from "next/head";

import * as screenfull from "screenfull";

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
  private textViewer: TextViewer;

  private fullscreenButtonRef: HTMLDivElement;

  public componentDidMount() {
    this.openControllerWindow();

    window.addEventListener("message", this.onReceiveMessage);

    window.addEventListener("keydown", (e) => {
      // h
      if (e.keyCode === 72) {
        this.openControllerWindow();
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
      "titlebar=0,close=0,menubar=0,location=0,status=0,width=300,height=600,left=10,top=10,dependent=1,resizable=1,scrollbars=1",
    );
  }

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
        this.circlesViewerRef.newRandomLayout(messagePackage.data);
        break;

      case MessageTypes.makeNonStatic:
        this.circlesViewerRef.makeCirclesNonStatic();
        break;

      case MessageTypes.newText:
        this.textViewer.newText(messagePackage.data);
        break;

      case MessageTypes.dropText:
        this.textViewer.dropText();
        break;

      case MessageTypes.closeBounds:
        this.circlesViewerRef.closeWorldBounds();
        this.textViewer.closeWorldBounds();
        break;

      case MessageTypes.makeFullscreen:
        this.fullscreenButtonRef.style.display = "flex";
        break;

      case MessageTypes.changeBGColor:
        document.body.style.backgroundColor = messagePackage.data;
        this.circlesViewerRef.changeBgColor(messagePackage.data);
        break;

      case MessageTypes.changeFGColor:
        this.circlesViewerRef.changeFrontColor(messagePackage.data);
        break;

      case MessageTypes.updateLayoutConfig:
        this.circlesViewerRef.updateLayoutConfig(messagePackage.data);
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

        <div className="webGLContainer">
          <CirclesViewer
            ref={(ref) => {this.circlesViewerRef = ref; }}
          />
        </div>

        <TextViewer
          ref={(ref) => {this.textViewer = ref; }}
        />

        <DividerLines
          dividerScale={3}
        />

        {/* <Logo /> */}

        <div
          className="fullscreenButton"
          onClick={() => {
            if (screenfull.enabled) {
              screenfull.request(document.body);
              this.fullscreenButtonRef.style.display = "none";
            }
          }}
          ref={(ref) => {this.fullscreenButtonRef = ref; }}
        >click to fullscreen</div>

        <style jsx>{`
          .webGLContainer {
            width: 100vw;
            height: 100vh;
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
