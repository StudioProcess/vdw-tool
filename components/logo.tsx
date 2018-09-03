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
            left: 3vmin;
            bottom: 3vmin;

            width: 30vmin;
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
