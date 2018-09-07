import {
  Engine,
  Render,
  World,
  Bodies,
  Runner,
  Common,
  Composites,
  Composite,
  Body,
} from "matter-js";

import {
  BufferAttribute,
} from "three";

const borderWidth = 100;
const heightBorderDistance = 1000 + borderWidth * 0.5;

export default class CirclePhysics {

  private engine: Engine;
  private world: World;
  private render: Render;

  private stack: Composite;

  private topBorder: Body;
  private leftBorder: Body;
  private rightBorder: Body;
  private bottomBorder: Body;

  public setup(
    numCircles: number,
    aspectRatio: number,
  ) {
    this.engine = Engine.create();
    this.world = this.engine.world;

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

    this.stack = Composites.stack(0, 0, 10, 10, 10, 10,
      (x, y) => {
      return Bodies.circle(x, y, Common.random(15, 30), { restitution: 0.6, friction: 0.1 });
    });

    World.add(
      this.world,
      this.stack,
    );

    Render.lookAt(
      this.render,
      {
        min: { x: -1500, y: -1300 },
        max: { x: 1500, y: 1300 },
      },
    );

    if (true) {
      this.render.canvas.style.position = "absolute";
      this.render.canvas.style.top = "10px";
      this.render.canvas.style.left = "10px";
      this.render.canvas.style.opacity = "0.5";
      this.render.canvas.style.transformOrigin = "left top";
      this.render.canvas.style.transform = "scale(0.5)";
      document.body.appendChild(this.render.canvas);
    }
  }

  public onResize(aspectRatio) {
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

  public update(
    circlesDataBuffer: BufferAttribute,
  ) {
    Engine.update(this.engine);

    let baseIndex = 0;
    for (let i = 0, l = this.stack.bodies.length; i < l; i++) {
      baseIndex = i * 3;
      circlesDataBuffer.array[baseIndex] = this.stack.bodies[i].position.x * 0.001;
      circlesDataBuffer.array[baseIndex + 1] = this.stack.bodies[i].position.y * -0.001;
      circlesDataBuffer.array[baseIndex + 2] = this.stack.bodies[i].circleRadius * 0.001;
    }

    for (let i = this.stack.bodies.length, l = circlesDataBuffer.count; i < l; i++) {
      baseIndex = i * 3;
      circlesDataBuffer.array[baseIndex + 2] = 0.0;
    }

    circlesDataBuffer.needsUpdate = true;
  }
}
