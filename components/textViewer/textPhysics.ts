import decomp from "poly-decomp";
import {
  Engine,
  Render,
  World,
  Bodies,
  Common,
  Body,
  Svg,
  Vertices,
  Composites,
  Composite,
  Constraint,
  Vector,
} from "matter-js";

const getPathBounds = require("svg-path-bounds");

let pathseg = null;

const borderWidth = 100;
const heightBorderDistance = 500 + borderWidth * 0.5;

const worldBounds = {
  width: 100,
  height: heightBorderDistance * 2 - borderWidth,
};

export default class CirclePhysics {

  private engine: Engine;
  private world: World;
  private render: Render;

  private topBorder: Body;
  private leftBorder: Body;
  private rightBorder: Body;
  private bottomBorder: Body;

  private composites: Composite[] = [];
  private textBodies: Body[];
  private ropeConstraints: Constraint[][] = [];
  private xOffsets: number[];
  private yOffsets: number[];

  public setup(
    aspectRatio: number,
  ) {
    if (pathseg === null) {
      pathseg = require("pathseg");
      window.decomp = decomp;
    }

    this.engine = Engine.create();
    this.world = this.engine.world;

    this.topBorder = Bodies.rectangle(
      0,
      -heightBorderDistance,
      10000,
      borderWidth,
      {
        isStatic: true,
      },
    );
    this.leftBorder = Bodies.rectangle(
      -heightBorderDistance,
      0,
      borderWidth,
      10000,
      {
        isStatic: true,
      },
    );
    this.rightBorder = Bodies.rectangle(
      heightBorderDistance,
      0,
      borderWidth,
      10000,
      {
        isStatic: true,
      },
    );
    this.bottomBorder = Bodies.rectangle(
      0,
      heightBorderDistance,
      10000,
      borderWidth,
      {
        isStatic: true,
      },
    );

    this.onResize(aspectRatio);

    World.add(
      this.world,
      [
        this.topBorder,
        this.leftBorder,
        this.rightBorder,
        this.bottomBorder,
      ],
    );

    this.textBodies = [];

    this.xOffsets = [];
    this.yOffsets = [];

    if (true) {
      this.render = Render.create({
        element: document.body,
        engine: this.engine,
        options: {
          width: 2000,
          height: 1200,
          // showAngleIndicator: true,
        },
      });

      Render.run(this.render);

      Render.lookAt(
        this.render,
        {
          min: { x: -900, y: -900 },
          max: { x: 900, y: 900 },
        },
      );

      this.render.canvas.style.position = "absolute";
      this.render.canvas.style.top = "10px";
      this.render.canvas.style.left = "10px";
      this.render.canvas.style.opacity = "0.6";
      this.render.canvas.style.transformOrigin = "left top";
      this.render.canvas.style.transform = "scale(0.5)";
      document.body.appendChild(this.render.canvas);
    }
  }

  public getWorldBounds = () => {
    return worldBounds;
  }

  public onResize(aspectRatio) {
    worldBounds.width = Math.round(heightBorderDistance * aspectRatio * 2 - borderWidth);

    Body.setPosition(
      this.leftBorder,
      {
        x: heightBorderDistance * -aspectRatio,
        y: 0,
      },
    );

    Body.setPosition(
      this.rightBorder,
      {
        x: heightBorderDistance * aspectRatio,
        y: 0,
      },
    );
  }

  public clearBodies = () => {
    for (let i = 0, l = this.composites.length; i < l; i++) {
      World.remove(
        this.world,
        this.composites[i],
      );
    }

    this.composites.length = 0;
    this.textBodies.length = 0;

    this.xOffsets.length = 0;
    this.yOffsets.length = 0;
  }

  public setFromSVG(
    svg: SVGElement,
    relX: number,
    relY: number,
  ) {
    const composite = Composite.create();

    const bounds = svg.getAttribute("boxsize").split(" ").map((value) => parseInt(value, 10));

    const body = Bodies.rectangle(
      worldBounds.width * (relX - 0.5),
      worldBounds.height * (relY - 0.5),
      bounds[2],
      bounds[3],
      {
        // isStatic: true,
      },
    );

    svg.childNodes[0].childNodes[0].setAttribute(
      "transform",
      `translate(${bounds[2] * -0.5} ${bounds[3] * -0.5})`,
    );

    Body.setAngle(
      body,
      Math.random() - 0.5,
    );

    this.textBodies.push(body);

    Composite.add(composite, body);

    Body.setPosition(
      body,
      {
        x: (Math.random() - 0.2) * worldBounds.width,
        y: worldBounds.height * -0.6,
      },
    );

    const leftConstraint = Constraint.create({
      pointA: { x: -heightBorderDistance, y: heightBorderDistance * -(Math.random() * 0.25 + 1.0) },
      bodyB: body,
      stiffness: 0.01,
      damping: 0.01,
    });
    // leftConstraint.
    // leftConstraint.length *= 2.0;

    const rightConstraint = Constraint.create({
      bodyA: body,
      pointB: { x: heightBorderDistance, y: heightBorderDistance * -(Math.random() * 0.25 + 1.0) },
      stiffness: 0.01,
      damping: 0.01,
    });
    // rightConstraint.length *= 2.0;

    // window.setTimeout(
    //   () => {
    Composite.add(composite, leftConstraint);
    Composite.add(composite, rightConstraint);
    //   },
    //   2000,
    // );

    this.ropeConstraints.push(
      [
        leftConstraint,
        rightConstraint,
      ],
    );

    World.add(
      this.world,
      composite,
    );

    this.composites.push(composite);

    // window.setTimeout(
    //   () => {
    //     Composite.remove(composite, leftConstraint);
    //   },
    //   3000,
    // );
  }

  public makeNonStatic() {
    for (let i = 0, l = this.textBodies.length; i < l; i++) {
      Body.setStatic(
        this.textBodies[i],
        false,
      );
    }
  }

  public openTop = () => {
    Body.set(
      this.topBorder,
      "isSensor",
      true,
    );
  }

  public closeTop = () => {
    Body.set(
      this.topBorder,
      "isSensor",
      false,
    );
  }

  public openBottom = () => {
    Body.set(
      this.bottomBorder,
      "isSensor",
      true,
    );
  }

  public closeBottom = () => {
    Body.set(
      this.bottomBorder,
      "isSensor",
      false,
    );
  }

  public update(svgs: SVGElement[]) {
    Engine.update(this.engine);

    // let baseIndex = 0;
    // for (let i = 0, l = this.bodies.length; i < l; i++) {
    //   baseIndex = i * 3;
    //   circlesDataBuffer.array[baseIndex] = this.bodies[i].position.x * 0.001;
    //   circlesDataBuffer.array[baseIndex + 1] = this.bodies[i].position.y * -0.001;
    //   circlesDataBuffer.array[baseIndex + 2] = this.bodies[i].circleRadius * 0.001;
    // }

    for (let i = 0, l = this.textBodies.length; i < l; i++) {
      // (svgs[i].childNodes[0] as SVGPathElement).style.transform = `translateX(${
      //   ((this.bodies[i].position.x + this.xOffsets[i]) / worldBounds.width + 0.5) * 100
      // }vw) translateY(${
      //   ((this.bodies[i].position.y + this.yOffsets[i]) / worldBounds.height + 0.5) * 100
      // }vh) rotate(${
      //   this.bodies[i].angle * 57.2958
      // }deg)`;
      (svgs[i].childNodes[0] as SVGPathElement).setAttribute(
        "transform",
        `translate(${
          this.textBodies[i].position.x
        } ${
          this.textBodies[i].position.y
        }) rotate(${
          this.textBodies[i].angle * 57.2958
        })`,
      );
    }

    // circlesDataBuffer.needsUpdate = true;
  }
}
