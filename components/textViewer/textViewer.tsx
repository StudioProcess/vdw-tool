import {
  Component,
} from "react";
import {
  Clock,
} from "three";

import * as OpenType from "opentype.js";

import TextPhysics from "./textPhysics";

import {IGravityConfig} from "../types";

import {overrideWidth, overrideHeight} from "../../overrideSize";

export default class StatueViewer extends Component<any, any> {
    private clock: Clock;
    private textPhysics: TextPhysics;

    private frameId: number;

    private font: any;

    private containerRef: HTMLDivElement;

    private svgs: SVGElement[];
    
    private bottom = false;

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

          this.svgs = [];

          this.newText("A City\nFull of\nDesign");
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

  public updateTextSize = (size) => {
    this.textPhysics.updateTextSize(size);
    this.onResize();
    const physicsBounds = this.textPhysics.getWorldBounds();

    const svgs = this.containerRef.querySelectorAll("svg");

    svgs.forEach((svg) => {
      svg.setAttribute("viewBox", `${
        physicsBounds.width * -0.5
      } ${
        physicsBounds.height * -0.5
      } ${
        physicsBounds.width
      } ${
        physicsBounds.height
      }`);
    });
  }

  public componentWillUnmount() {
    cancelAnimationFrame(this.frameId);

    window.removeEventListener("resize", this.onResize);
  }

  public newText = (text) => {
    for (let i = 0, l = this.svgs.length; i < l; i++) {
      this.containerRef.removeChild(this.svgs[i]);
    }

    this.svgs = [];

    this.generateSVGs(
      text,
      this.font,
      this.containerRef,
      this.svgs,
    );

    this.onResize();

    // this.textPhysics.resetGravity();
    this.textPhysics.openTop();
    this.textPhysics.closeBottom();
    this.textPhysics.clearBodies();
    if (this.bottom) {
      this.textPhysics.closeBottomBorder();
    } else {
      this.textPhysics.openBottomBorder();
    }

    for (let i = 0, l = this.svgs.length; i < l; i++) {
      this.textPhysics.setFromSVG(
        this.svgs[i],
        i,
        0.6,
        0.5 - i * 0.1,
      );
    }
  }

  public updateGravity = (config: IGravityConfig) => {
    this.textPhysics.updateGravity(config);
  }

  public updateFriction = (value: number) => {
    this.textPhysics.updateFriction(value);
  }
  
  public updateRestitution = (value: number) => {
    this.textPhysics.updateRestitution(value);
  }

  public closeWorldBounds = () => {
    this.textPhysics.closeTop();
    this.textPhysics.closeBottom();
  }

  public openBottom = () => {
    this.bottom = false;
    this.textPhysics.openBottomBorder();
  }

  public closeBottom = () => {
    this.bottom = true;
    this.textPhysics.closeBottomBorder();
  }

  public dropText = () => {
    // this.textPhysics.resetGravity();
    this.textPhysics.openBottom();
    this.textPhysics.closeTop();
  }

  private generateSVGs(
    text: string,
    font: any,
    container: HTMLDivElement,
    svgs: SVGElement[],
  ) {
    const physicsBounds = this.textPhysics.getWorldBounds();

    const lines = text.split("\n");

    for (let i = 0, l = lines.length; i < l; i++) {
      const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      svg.style.position = "absolute";
      svg.style.top = "0";
      svg.style.left = "0";
      svg.style.width = "100%";
      svg.style.height = "100%";

      svg.style.transform = "";

      if (overrideWidth > 0) {
        svg.style.width = `${overrideWidth}px`;
        svg.style.left = "50vw";
        svg.style.transform += "translateX(-50%)";
      }
      if (overrideHeight > 0) {
        svg.style.width = `${overrideHeight}px`;
        svg.style.top = "50vh";
        svg.style.transform += "translateY(-50%)";
      }

      const charPath = font.getPath(lines[i], 0, 60);
      const pathBounds = charPath.getBoundingBox();

      // console.log(pathBounds);
      // console.log(pathBounds.x2 - pathBounds.x1, pathBounds.y2 - pathBounds.y1);

      svg.setAttribute(
        "boxsize",
        // `${0} ${0} ${pathBounds.x2 - pathBounds.x1} ${(pathBounds.y2 - pathBounds.y1) * 0.82}`,
        `${0} ${0} ${pathBounds.x2 - pathBounds.x1} ${58}`,
      );
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
          stroke-width="2"
          stroke="black"
          d="${charPath.toPathData(3)}"
        /></g>`;
      svgs.push(svg);

      container.appendChild(svg);
    }
  }

  private onResize = () => {
    if (overrideWidth > 0 && overrideHeight > 0) {
      this.textPhysics.onResize(
        overrideWidth / overrideHeight,
      );

      const svgs = this.containerRef.querySelectorAll("svg");

      const windowAspectRatio = window.innerWidth / window.innerHeight;
      const aspectRatio = overrideWidth / overrideHeight;

      svgs.forEach((svg) => {
        if (aspectRatio < windowAspectRatio) {
          // window is wider
          svg.style.width = "auto";
          svg.style.height = "100%";
        } else {
          // window is higher
          svg.style.width = "100%";
          svg.style.height = "auto";
        }
      });
    } else {
      this.textPhysics.onResize(
        window.innerWidth / window.innerHeight,
      );
    }
  }

  private animate = () => {
    const delta = Math.min(1.0 / 20.0, this.clock.getDelta());

    this.textPhysics.update(
      this.svgs,
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
