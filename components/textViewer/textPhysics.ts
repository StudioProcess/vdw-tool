import {
  Engine,
  Render,
  World,
  Bodies,
  Common,
  Body,
  Composite,
} from "matter-js";

import {PhysicsLayers, TextLayers} from "../physicsLayers";
import {IGravityConfig} from "../types";

import {randomRange} from "../../utilities/mathUtils";

const borderWidth = 200;
const borderPositionOffset = borderWidth / 2 - 15; // the subtraction is there to shift the border sligthly inward
const borderPositionOffsetLR = borderWidth / 2 - 5; // for left and right edges

// const heightBorderDistance = 350 + borderWidth * 0.5; // decrease heightBorderDistance for bigger text
let heightBorderDistance = 350; // decrease heightBorderDistance for bigger text

const funnelEdgeAngle = Math.PI * 0.35;
const funnelBottomNormOffsetY = 0.3;
const funnelSizesMinApectRatio = 1.5;

const worldBounds = {
  width: 100,
  height: heightBorderDistance,
};

const halfWorldBounds = {
  width: worldBounds.width * 0.5,
  height: worldBounds.height * 0.5,
};

export default class TextPhysics {

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

  private textColliders: Body[] = [];

  private bottomBodies: Body[];

  private composites: Composite[] = [];
  private textBodies: Body[];
  
  private friction = 0.1;
  private restitution = 0.0;

  public setup(
    aspectRatio: number,
  ) {

    this.engine = Engine.create();
    this.world = this.engine.world;

    // console.log(this.world.gravity);

    this.topBorder = Bodies.rectangle(
      0,
      -heightBorderDistance - borderPositionOffset,
      10000,
      borderWidth,
      {
        isStatic: true,
      },
    );
    this.leftBorder = Bodies.rectangle(
      -heightBorderDistance - borderPositionOffsetLR,
      0,
      borderWidth,
      10000,
      {
        isStatic: true,
      },
    );
    this.rightBorder = Bodies.rectangle(
      heightBorderDistance + borderPositionOffsetLR,
      0,
      borderWidth,
      10000,
      {
        isStatic: true,
      },
    );
    this.bottomBorder = Bodies.rectangle(
      0,
      heightBorderDistance + borderPositionOffset,
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
      // this.bottomBorder,
      this.funnelLeft,
      this.funnelBottom,
      this.funnelRight,
    ];

    this.textBodies = [];

    if (false) { // debug render window: true: visible, false: hidden
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
    this.friction = value;
    this.textBodies.forEach((body) => {
      body.friction = value;
    });
  }

  public updateRestitution = (value: number) => {
    this.restitution = value;
    this.textBodies.forEach((body) => {
      body.restitution = value;
    });
  }

  public getWorldBounds = () => {
    return worldBounds;
  }

  public updateTextSize = (size: number) => {
    // size / window.innerHeight === 72 / (heightBorderDistance * 2.0);
    heightBorderDistance = (size / window.innerHeight) / 72;
    heightBorderDistance = 1.0 / heightBorderDistance;
    heightBorderDistance /= 2;
    heightBorderDistance = heightBorderDistance;
  }

  public onResize(aspectRatio) {
    worldBounds.height = heightBorderDistance * 2;

    if (aspectRatio < funnelSizesMinApectRatio) {
      // disable funnel sides, since the widow is too
      this.funnelLeft.collisionFilter.mask = PhysicsLayers.noCollision;
      this.funnelRight.collisionFilter.mask = PhysicsLayers.noCollision;
    } else {
      this.funnelLeft.collisionFilter.mask = PhysicsLayers.default;
      this.funnelRight.collisionFilter.mask = PhysicsLayers.default;
    }

    worldBounds.width = Math.round(heightBorderDistance * aspectRatio * 2);
    halfWorldBounds.width = worldBounds.width * 0.5;

    Body.setPosition(
      this.topBorder,
      {
        x: 0,
        y: -heightBorderDistance - borderPositionOffset,
      },
    );

    Body.setPosition(
      this.leftBorder,
      {
        x: heightBorderDistance * -aspectRatio - borderPositionOffsetLR,
        y: 0,
      },
    );

    Body.setPosition(
      this.rightBorder,
      {
        x: heightBorderDistance * aspectRatio + borderPositionOffsetLR,
        y: 0,
      },
    );

    Body.setPosition(
      this.bottomBorder,
      {
        x: 0,
        y: heightBorderDistance + borderPositionOffset,
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

    this.textColliders.forEach((body) => {
      World.remove(
        this.world,
        body,
      );
    });

    this.composites.length = 0;
    this.textBodies.length = 0;
    this.textColliders.length = 0;
  }

  public setFromSVG(
    svg: SVGElement,
    index: number,
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
    body.collisionFilter.mask = TextLayers[index];

    // add per line blockers
    // const colliderArea = worldBounds.width * halfWorldBounds.height;
    const numColliders = 0; // Math.ceil(colliderArea / 120000);

    for (let i = 0, l = numColliders; i < l; i++) {
      const collider = Bodies.circle(
        randomRange(halfWorldBounds.width * -0.8, halfWorldBounds.width * 0.8),
        randomRange(halfWorldBounds.height * -0.2, halfWorldBounds.height * -0.9),
        10,
        {
          isStatic: true,
        },
      );
      collider.collisionFilter.mask = TextLayers[index];

      this.textColliders.push(collider);
      World.add(
        this.world,
        collider,
      );

      window.setTimeout(() => {
        this.textColliders.splice(
          this.textColliders.findIndex((item) => item.label === collider.label),
          1,
        );
        World.remove(
          this.world,
          collider,
        );
      }, 1000 + Math.random() * 2000);
    }

    svg.childNodes[0].childNodes[0].setAttribute(
      "transform",
      `translate(${bounds[2] * -0.5} ${bounds[3] * -0.5})`,
    );

    Body.setAngle(
      body,
      Math.random() - 0.5,
    );
    
    body.friction = this.friction;
    body.restitution = this.restitution;
    this.textBodies.push(body);

    Composite.add(composite, body);

    Body.setPosition(
      body,
      {
        // x: ((Math.random() - 0.5) * 0.4) * worldBounds.width,
        // y: worldBounds.height * -0.6,
        x: ((Math.random() - 0.5) * 0.4),
        y: -600 - ((Math.random() - 0.5) * 0.4),
      },
    );

    World.add(
      this.world,
      composite,
    );

    this.composites.push(composite);
    
    this.enableColliders(false);
  }

  public openTop = () => {
    this.topBorder.collisionFilter.mask = PhysicsLayers.noCollision;
  }

  public closeTop = () => {
    this.topBorder.collisionFilter.mask = PhysicsLayers.default;
  }
  
  public openBottomBorder = () => {
    this.bottomBorder.collisionFilter.mask = PhysicsLayers.noCollision;
  }
  
  public closeBottomBorder = () => {
    this.bottomBorder.collisionFilter.mask = PhysicsLayers.default;
  }

  public openBottom = () => {
    this.addBottomColliders();

    this.bottomBodies.forEach((body) => {
      body.collisionFilter.mask = PhysicsLayers.noCollision;
    });
  }

  public closeBottom = () => {
    this.bottomBodies.forEach((body) => {
      body.collisionFilter.mask = PhysicsLayers.default;
    });
  }
  
  public openBottomBodies() {
    this.bottomBodies.forEach((body) => {
      body.collisionFilter.mask = PhysicsLayers.noCollision;
    });
  }
  
  public enableFunnel(on = true) {
    if (on) {
      this.funnelLeft.collisionFilter.mask = PhysicsLayers.default;
      this.funnelRight.collisionFilter.mask = PhysicsLayers.default;
      this.funnelBottom.collisionFilter.mask = PhysicsLayers.default;
    } else {
      this.funnelLeft.collisionFilter.mask = PhysicsLayers.noCollision;
      this.funnelRight.collisionFilter.mask = PhysicsLayers.noCollision;
      this.funnelBottom.collisionFilter.mask = PhysicsLayers.noCollision;
    }
  }
  
  public enableColliders(on = true) {
    this.textColliders.forEach((body) => {
      if (on) {
        body.collisionFilter.mask = PhysicsLayers.default;
      } else {
        body.collisionFilter.mask = PhysicsLayers.noCollision;
      }
    });
  }

  private addBottomColliders = () => {
    const colliderArea = worldBounds.width * halfWorldBounds.height;
    const numColliders = Math.ceil(colliderArea / 120000);

    this.textBodies.forEach((body, index) => {
      for (let i = 0, l = numColliders; i < l; i++) {
        const collider = Bodies.circle(
          randomRange(halfWorldBounds.width * -0.8, halfWorldBounds.width * 0.8),
          randomRange(heightBorderDistance * funnelBottomNormOffsetY, halfWorldBounds.height * 0.8),
          10,
          {
            isStatic: true,
          },
        );
        collider.collisionFilter.mask = TextLayers[index];

        this.textColliders.push(collider);
        World.add(
          this.world,
          collider,
        );

        window.setTimeout(() => {
          this.textColliders.splice(
            this.textColliders.findIndex((item) => item.label === collider.label),
            1,
          );
          World.remove(
            this.world,
            collider,
          );
        }, 1000 + Math.random() * 3000);
      }
    });
  }

  public update(svgs: SVGElement[]) {
    Engine.update(this.engine);
    for (let i = 0, l = this.textBodies.length; i < l; i++) {
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
  }
}
