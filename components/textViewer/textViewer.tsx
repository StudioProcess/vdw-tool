import {
  Component,
} from "react";
import {
  Clock,
} from "three";

import * as OpenType from "opentype.js";

import TextPhysics from "./textPhysics";

export default class StatueViewer extends Component<any, any> {
    private clock: Clock;
    private textPhysics: TextPhysics;

    private frameId: number;

    private font: any;

    private containerRef: HTMLDivElement;

    private svgs: SVGElement[][];

  constructor(props: any) {
    super(props);
  }

  public shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    return false;
  }

  public componentDidMount() {

    this.clock = new Clock();
    this.clock.start();

    this.svgs = [];

    OpenType.load(
      "/static/fonts/Linotype - NHaasGroteskTXPro-55Rg.otf",
      (err, font) => {
        if (err) {
          console.error("could not load font", err);
        } else {
          this.font = font;

          this.svgs.push([]);

          this.generateSVGs(
            "TestXHg890ijxe",
            this.font,
            this.containerRef,
            this.svgs[0],
          );

          this.textPhysics.setFromSVGs(this.svgs[0]);

          this.textPhysics.update(
            this.svgs[0],
          );
        }
      },
    );

    this.textPhysics = new TextPhysics();
    this.textPhysics.setup(window.innerWidth / window.innerHeight);
    this.textPhysics.clearBodies();

    window.addEventListener("resize", this.onResize);
    this.onResize();

    this.animate();
  }

  public componentWillUnmount() {
    cancelAnimationFrame(this.frameId);

    window.removeEventListener("resize", this.onResize);
  }

  private generateSVGs(
    text: string,
    font: any,
    container: HTMLDivElement,
    svgs: SVGElement[],
  ) {
    const fontPath = this.font.getPath(text);
    const pathBounds = fontPath.getBoundingBox();
    // const viewBox = `${0} ${0} ${pathBounds.x2 - pathBounds.x1 + 6} ${pathBounds.y2 - pathBounds.y1 + 12}`;

    let leftDistance = 0.0;

    const physicsBounds = this.textPhysics.getWorldBounds();

    for (let i = 0, l = text.length; i < l; i++) {
      const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      svg.style.position = "absolute";
      svg.style.top = "0";
      svg.style.left = "0";
      svg.style.width = "100vw";
      svg.style.height = "100vh";

      if (i > 0) {
        leftDistance = font.getAdvanceWidth(text.substring(0, i + 1));
        leftDistance -= font.getAdvanceWidth(text[i]);
      }

      const charPath = this.font.getPath(text[i], 0, 60);

      // svg.setAttribute("viewBox", viewBox);
      svg.setAttribute("viewBox", `${
        physicsBounds.width * -0.5
      } ${
        physicsBounds.height * -0.5
      } ${
        physicsBounds.width
      } ${
        physicsBounds.height
      }`);

      svg.innerHTML = `<g><path
          fill="none"
          stroke-width="1"
          stroke="black"
          leftoffset="${leftDistance}"
          d="${charPath.toPathData(2)}"
        /></g>`;
      svgs.push(svg);
      container.appendChild(svg);
    }
  }

  private onResize = () => {
    this.textPhysics.onResize(
      window.innerWidth / window.innerHeight,
    );
    // this.circlePhysics.onResize(
    //   window.innerWidth / window.innerHeight,
    // );
  }

  private animate = () => {
    const delta = Math.min(1.0 / 20.0, this.clock.getDelta());

    this.textPhysics.update(
      this.svgs[0],
    );

    this.draw();

    this.frameId = requestAnimationFrame(this.animate);
  }

  private draw = () => {
  }

  public render() {
    return (
      <div
        className="container"
        ref={(ref) => {this.containerRef = ref!; }}
      >
        <style jsx>{`
          .container {
            width: 100%;
            height: 100%;

            position: absolute;
            top: 0;
            left: 0;
          }

          svg path {
            stroke: red;
            fill: black;
          }
        `}</style>
      </div>
    );
  }
}
