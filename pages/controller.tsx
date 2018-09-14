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
      <Global>
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

          <div ref={(ref) => {this.debugContainerRef = ref; }}/>
        </div>

        <style jsx>{`
          .container {
            width: 200px;
            margin: 0 auto;
            margin-top: 10px;

            display: flex;
            flex-direction: column;

            color: #333;
          }

          .button {
            background: black;
            color: white;
            padding: 5px 10px;

            margin-bottom: 10px;

            user-select: none;
            cursor: pointer;
          }
        `}</style>
      </Global>
    );
  }
}
