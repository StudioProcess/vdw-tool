import {
  Engine,
  Render,
  World,
  Bodies,
  Common,
  Body,
} from "matter-js";

import {
  BufferAttribute,
} from "three";

import {ILayoutItem} from "../types";

const borderWidth = 100;
const heightBorderDistance = 1000 + borderWidth * 0.5;

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

  private bodies: Body[];

  public setup(
    numCircles: number,
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

    this.bodies = [];
    this.bodies.push(
      Bodies.circle(0, 0, 500, { restitution: 0.6, friction: 0.1 }),
    );

    World.add(
      this.world,
      this.bodies,
    );

    if (false) {
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
          min: { x: -1500, y: -1300 },
          max: { x: 1500, y: 1300 },
        },
      );

      this.render.canvas.style.position = "absolute";
      this.render.canvas.style.top = "10px";
      this.render.canvas.style.left = "10px";
      this.render.canvas.style.opacity = "0.8";
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

  public setFromLayout(layout: ILayoutItem[]) {
    for (let i = 0, l = this.bodies.length; i < l; i++) {
      World.remove(
        this.world,
        this.bodies[i],
      );
    }

    this.bodies.length = 0;

    const aspectRatio = window.innerWidth / window.innerHeight;

    for (let i = 0, l = layout.length; i < l; i++) {
      this.bodies.push(
        Bodies.circle(
          layout[i].x,
          layout[i].y,
          layout[i].radius,
          { restitution: 0.6, friction: 0.1, isStatic: true },
        ),
      );
    }

    World.add(
      this.world,
      this.bodies,
    );
  }

  public makeNonStatic() {
    for (let i = 0, l = this.bodies.length; i < l; i++) {
      Body.setStatic(
        this.bodies[i],
        false,
      );
    }
  }

  public update(
    circlesDataBuffer: BufferAttribute,
  ) {
    Engine.update(this.engine);

    let baseIndex = 0;
    for (let i = 0, l = this.bodies.length; i < l; i++) {
      baseIndex = i * 3;
      circlesDataBuffer.array[baseIndex] = this.bodies[i].position.x * 0.001;
      circlesDataBuffer.array[baseIndex + 1] = this.bodies[i].position.y * -0.001;
      circlesDataBuffer.array[baseIndex + 2] = this.bodies[i].circleRadius * 0.001;
    }

    for (let i = this.bodies.length, l = circlesDataBuffer.count; i < l; i++) {
      baseIndex = i * 3;
      circlesDataBuffer.array[baseIndex + 2] = 0.0;
    }

    circlesDataBuffer.needsUpdate = true;
  }
}
