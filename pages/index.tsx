import {
  Component,
} from "react";
import Head from "next/head";
import Global from "./global";

import Logo from "../components/logo";
import DividerLines from "../components/dividerLines";

import {
  MessageTypes,
  IMessagePackage,
} from "../components/types";

import WebGLViewer from "../components/circleViewer/circleViewer";

export default class Index extends Component<any, any> {

  private controllerWindow: Window;

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
  }

  public render() {
    return (
      <Global>
        <Head>
          <title>Vienna Design Week 2018</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        </Head>

        <div className="webGLContainer">
          <WebGLViewer />
        </div>

        <DividerLines
          dividerScale={3}
        />

        <Logo />

        <style jsx>{`
          .webGLContainer {
            width: 100vw;
            height: 100vh;
          }
        `}</style>
      </Global>
    );
  }
}
