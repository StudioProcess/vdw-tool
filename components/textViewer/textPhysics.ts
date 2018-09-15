import {
  Engine,
  Render,
  World,
  Bodies,
  Common,
  Body,
  Composites,
  Composite,
  Constraint,
  Sleeping,
} from "matter-js";

import {PhysicsLayers, TextLayers} from "../physicsLayers";

const borderWidth = 100;
const heightBorderDistance = 500 + borderWidth * 0.5;

const funnelEdgeAngle = Math.PI * 0.35;
const funnelBottomNormOffsetY = 0.2;

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

  private funnelLeft: Body;
  private funnelBottom: Body;
  private funnelRight: Body;

  private bottomBodies: Body[];

  private composites: Composite[] = [];
  private textBodies: Body[];
  private ropeConstraints: Constraint[][] = [];
  private xOffsets: number[];
  private yOffsets: number[];

  public setup(
    aspectRatio: number,
  ) {

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

    this.funnelLeft = Bodies.rectangle(
      -heightBorderDistance,
      -heightBorderDistance,
      10000,
      borderWidth,
      {
        isStatic: true,
      },
    );
    Body.setAngle(this.funnelLeft, funnelEdgeAngle);

    this.funnelBottom = Bodies.rectangle(
      0,
      heightBorderDistance * funnelBottomNormOffsetY,
      10000,
      borderWidth,
      {
        isStatic: true,
      },
    );

    this.funnelRight = Bodies.rectangle(
      heightBorderDistance,
      -heightBorderDistance,
      10000,
      borderWidth,
      {
        isStatic: true,
      },
    );
    Body.setAngle(this.funnelRight, -funnelEdgeAngle);

    this.onResize(aspectRatio);

    World.add(
      this.world,
      [
        this.topBorder,
        this.leftBorder,
        this.rightBorder,
        this.bottomBorder,

        this.funnelLeft,
        this.funnelBottom,
        this.funnelRight,
      ],
    );

    this.bottomBodies = [
      this.bottomBorder,
      this.funnelLeft,
      this.funnelBottom,
      this.funnelRight,
    ];

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
          showAngleIndicator: true,
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

    Body.setPosition(
      this.funnelLeft,
      {
        x: heightBorderDistance * -aspectRatio,
        y: -heightBorderDistance,
      },
    );

    Body.setPosition(
      this.funnelRight,
      {
        x: heightBorderDistance * aspectRatio,
        y: -heightBorderDistance,
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
        x: ((Math.random() - 0.5) * 0.4) * worldBounds.width,
        y: worldBounds.height * -0.6,
      },
    );

    World.add(
      this.world,
      composite,
    );

    this.composites.push(composite);
  }

  public openTop = () => {
    this.topBorder.collisionFilter.mask = PhysicsLayers.noCollision;
  }

  public closeTop = () => {
    this.topBorder.collisionFilter.mask = PhysicsLayers.default;
  }

  public openBottom = () => {
    this.bottomBodies.forEach((body) => {
      body.collisionFilter.mask = PhysicsLayers.noCollision;
    });
  }

  public closeBottom = () => {
    this.bottomBodies.forEach((body) => {
      body.collisionFilter.mask = PhysicsLayers.default;
    });
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
