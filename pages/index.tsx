import {
  Component,
} from "react";
import Head from "next/head";
import Global from "./global";

import {
  MessageTypes,
  IMessagePackage,
} from "../components/types";

import WebGLViewer from "../components/webGLViewer/webGLViewer";

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
          <title>Title</title>
          {/* <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" sizes="192x192" href="/static/touch-icon.png" />
          <link rel="apple-touch-icon" href="/static/touch-icon.png" />
          <link rel="mask-icon" href="/static/favicon-mask.svg" color="#49B882" />
          <link rel="icon" href="/static/favicon.ico" />
          <meta property="og:url" content={props.url || defaultOGURL} />
          <meta property="og:title" content={props.title || ''} />
          <meta property="og:description" content={props.description || defaultDescription} />
          <meta name="twitter:site" content={props.url || defaultOGURL} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={props.ogImage || defaultOGImage} />
          <meta property="og:image" content={props.ogImage || defaultOGImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" /> */}
        </Head>

        <div className="hero">
          <h1 className="title">Welcome to Next!</h1>
          <p className="description">To get started, edit <code>pages/index.js</code> and save to reload.</p>
        </div>

        <div className="webGLContainer">
          <WebGLViewer />
        </div>

        <style jsx>{`
          .hero {
            width: 100%;
            color: #333;
          }
          .title {
            margin: 0;
            width: 100%;
            padding-top: 80px;
            line-height: 1.15;
            font-size: 48px;
          }
          .title, .description {
            text-align: center;
          }

          .webGLContainer {
            width: 100vw;
            height: 50vh;
          }
        `}</style>
      </Global>
    );
  }
}
