import {
  Engine,
  Render,
  World,
  Bodies,
  Runner,
  Common,
  Composites,
  Composite,
} from "matter-js";

import {
  BufferAttribute,
} from "three";

export default class CirclePhysics {

  private engine: Engine;
  private world: World;
  private render: Render;
  private runner: Runner;

  private stack: Composite;

  public setup(
    numCircles: number,
  ) {
    this.engine = Engine.create();
    this.world = this.engine.world;

    this.render = Render.create({
      element: document.body,
      engine: this.engine,
      options: {
        width: 800,
        height: 600,
        showAngleIndicator: true,
      },
    });

    Render.run(this.render);

    World.add(
      this.world,
      [
        Bodies.rectangle(
          400,
          600,
          1200,
          50.5,
          {
            isStatic: true,
          }),
      ],
    );

    this.stack = Composites.stack(100, 0, 10, 8, 10, 10,
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
        min: { x: -100, y: -100 },
        max: { x: 900, y: 700 },
      },
    );

    this.render.canvas.style.position = "absolute";
    this.render.canvas.style.top = "10px";
    this.render.canvas.style.left = "10px";
    this.render.canvas.style.opacity = "0.5";
    document.body.appendChild(this.render.canvas);

    // console.log(this.stack);
    console.log(this.stack.bodies[0]);
    console.log("radius", this.stack.bodies[0].circleRadius);
    console.log("position", this.stack.bodies[0].position.x, this.stack.bodies[0].position.y);
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

    circlesDataBuffer.needsUpdate = true;
  }
}
