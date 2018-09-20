import {
  Component,
} from "react";

export default class DividerLines extends Component<any, any> {

  private containerRef: HTMLDivElement;

  public show = () => {
    this.containerRef.style.display = "flex";
  }

  public hide = () => {
    this.containerRef.style.display = "none";
  }

  public render() {
    return (
      <div
        className="container"
        ref={(ref) => {this.containerRef = ref; }}
      >

        <div
          style={{
            flexGrow: this.props.dividerScale,
          }}
        />
        <div>
          <div/>
          <div
            style={{
              flexGrow: this.props.dividerScale,
            }}
          />
        </div>

        <style jsx>{`
          .container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            display: flex;
            align-items: stretch;

            pointer-events: none;
          }

          .container div {
            flex-grow: 1;
            border-color: black;
            border-style: solid;
            border-width: 0;

            transition: flex-grow 0.8s ease;
          }

          .container > div {
            border-right-width: 2px;
            display: flex;
            flex-direction: column;
            align-items: stretch;
          }

          .container > div:last-child {
            border: 0;
          }

          .container > div:last-child > div:first-child {
            border: 0;
          }
          .container > div:last-child > div:last-child {
            border-top-width: 2px;
          }
        `}</style>
      </div>
    );
  }
}
