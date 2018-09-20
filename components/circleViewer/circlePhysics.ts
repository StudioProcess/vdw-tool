import {
  Engine,
  Render,
  World,
  Bodies,
  Common,
  Body,
} from "matter-js";

import {
  BufferAttribute, FileLoader,
} from "three";

import {PhysicsLayers} from "../physicsLayers";

import {ILayoutItem, IGravityConfig} from "../types";

const shuffle = require("array-shuffle");

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

  public updateGravity = (gravityConfig: IGravityConfig) => {
    this.world.gravity.x = gravityConfig.x;
    this.world.gravity.y = gravityConfig.y;
    this.world.gravity.scale = gravityConfig.scale;
  }

  public resetGravity = () => {
    this.world.gravity.x = 0.0;
    this.world.gravity.y = 1.0;
    this.world.gravity.scale = 0.001;
  }

  public updateFriction = (value: number) => {
    this.bodies.forEach((body) => {
      body.friction = value;
    });
  }

  public updateRestitution = (value: number) => {
    this.bodies.forEach((body) => {
      body.restitution = value;
    });
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

  public setFromLayout(
    layout: ILayoutItem[],
    circlesSizesBuffer: BufferAttribute,
  ) {
    
    // limit number of bodies by max possible instances -> so we don't get invisible circles
    layout = layout.slice(0, circlesSizesBuffer.count);
    
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

      circlesSizesBuffer.array[i] = layout[i].radius;
    }

    for (let i = layout.length, l = circlesSizesBuffer.count; i < l; i++) {
      circlesSizesBuffer.array[i] = 0.0;
    }

    circlesSizesBuffer.needsUpdate = true;

    World.add(
      this.world,
      this.bodies,
    );
  }

  private chunkArray = (myArray, chunkSize) => {
    const results = [];

    while (myArray.length > 0) {
        results.push(myArray.splice(0, Math.min(chunkSize, myArray.length)));
    }

    return results;
  }

  private setChunkNonStatic = (indices, delay) => {
    window.setTimeout(
      () => {
        for (let i = 0, l = indices.length; i < l; i++) {
          Body.setStatic(
            this.bodies[indices[i]],
            false,
          );
        }
      },
      delay,
    );
  }

  public makeNonStatic() {
    const indexArray = [];
    for (let i = 0, l = this.bodies.length; i < l; i++) {
      indexArray.push(i);
    }

    shuffle(indexArray);

    const chunkSize = 3;

    const chunks = this.chunkArray(indexArray, chunkSize);

    const delays = [];
    let baseDelay = 0.0;
    for (let i = 0, l = chunks.length; i < l; i++) {
      delays.push(baseDelay);
      baseDelay += Math.ceil(20 + Math.random() * 100);
    }

    for (let i = 0, l = chunks.length; i < l; i++) {
      this.setChunkNonStatic(chunks[i], delays[i]);
    }
  }

  public openTop = () => {
    this.topBorder.collisionFilter.mask = PhysicsLayers.noCollision;
  }

  public closeTop = () => {
    this.topBorder.collisionFilter.mask = PhysicsLayers.default;
  }

  public openBottom = () => {
   this.bottomBorder.collisionFilter.mask = PhysicsLayers.noCollision;
  }

  public closeBottom = () => {
    this.bottomBorder.collisionFilter.mask = PhysicsLayers.default;
  }

  public update(
    circlesPositionsBuffer: BufferAttribute,
  ) {
    Engine.update(this.engine);

    let baseIndex = 0;
    for (let i = 0, l = this.bodies.length; i < l; i++) {
      baseIndex = i * 2;
      circlesPositionsBuffer.array[baseIndex] = this.bodies[i].position.x;
      circlesPositionsBuffer.array[baseIndex + 1] = this.bodies[i].position.y;
    }

    circlesPositionsBuffer.needsUpdate = true;
  }
}
