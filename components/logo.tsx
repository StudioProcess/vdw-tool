import {
  Component,
} from "react";

export default class Logo extends Component<any, any> {

  public render() {
    return (
      <div>
        <img src="/static/vdw_logo.svg" />

        <style jsx>{`
          div {
            position: absolute;
            left: 3%;
            bottom: 3%;

            width: 20%;
          }

          img {
            width: 100%;
            height: auto
          }
        `}</style>
      </div>
    );
  }
}
