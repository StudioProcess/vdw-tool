import {
  Component,
} from "react";
import Head from "next/head";

import * as screenfull from "screenfull";

import Global from "./global";

import Logo from "../components/logo";
import DividerLines from "../components/dividerLines";

import {
  MessageTypes,
  IMessagePackage,
} from "../components/types";

import CirclesViewer from "../components/circleViewer/circleViewer";

export default class Index extends Component<any, any> {

  private controllerWindow: Window;
  private circlesViewerRef: CirclesViewer;

  private fullscreenButtonRef: HTMLDivElement;

  public componentDidMount() {
    this.controllerWindow = window.open(
      "/controller",
      "controller",
      "titlebar=0,close=0,menubar=0,location=0,status=0,width=300,height=500,left=10,top=10,dependent=1,resizable=1,scrollbars=1",
    );

    window.addEventListener("message", this.onReceiveMessage);
  }

  public componentWillUnmount() {
    window.removeEventListener("message", this.onReceiveMessage);
    this.controllerWindow.close();
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
        this.circlesViewerRef.newRandomLayout();
        break;

      case MessageTypes.makeNonStatic:
        this.circlesViewerRef.makeCirclesNonStatic();
        break;

      case MessageTypes.makeFullscreen:
        this.fullscreenButtonRef.style.display = "flex";
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

        <DividerLines
          dividerScale={3}
        />

        <Logo />

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
