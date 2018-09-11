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
} from "matter-js";

let pathseg = null;

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

    this.bodies = [];
    this.bodies.push(
      Bodies.circle(0, 0, 500, { restitution: 0.6, friction: 0.1 }),
    );

    this.xOffsets = [];
    this.yOffsets = [];

    World.add(
      this.world,
      this.bodies,
    );

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
          min: { x: -1500, y: -1300 },
          max: { x: 1500, y: 1300 },
        },
      );

      this.render.canvas.style.position = "absolute";
      this.render.canvas.style.top = "10px";
      this.render.canvas.style.left = "10px";
      this.render.canvas.style.opacity = "0.5";
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
    for (let i = 0, l = this.bodies.length; i < l; i++) {
      World.remove(
        this.world,
        this.bodies[i],
      );
    }

    this.bodies.length = 0;

    this.xOffsets.length = 0;
    this.yOffsets.length = 0;
  }

  public setFromSVGs(svgs: SVGElement[]) {
    const composite = Composite.create();

    for (let i = 0, l = svgs.length; i < l; i++) {
      const path = (svgs[i].childNodes[0] as SVGGElement).cloneNode(true).childNodes[0] as SVGPathElement;

      const leftOffset = parseFloat(path.getAttribute("leftoffset"));

      let vertices = Svg.pathToVertices(path, 5);

      let minX = Number.POSITIVE_INFINITY;
      let minY = Number.POSITIVE_INFINITY;

      for (let j = 0, l2 = vertices.length; j < l2; j++) {
          if (vertices[j].x < minX) {
            minX = vertices[j].x;
          }
          if (vertices[j].y < minY) {
            minY = vertices[j].y;
          }
      }
      minX += leftOffset;

      let body = Bodies.fromVertices(
        0,
        0,
        vertices,
        {
          // isStatic: true,
        },
        true,
      );

      if (body === undefined) {
        // remove all but first vertex line, so there aren't holes
        const matches = path.getAttribute("d").match(/M[0-9A-Z.\s]*?[ZM]/);
        matches.sort((a, b) => {
          return b.length - a.length;
        });
        const pathD = matches[0];
        path.setAttribute("d", pathD);
        vertices = Svg.pathToVertices(path, 5);

        minX = Number.POSITIVE_INFINITY;
        minY = Number.POSITIVE_INFINITY;

        for (let j = 0, l2 = vertices.length; j < l2; j++) {
            if (vertices[j].x < minX) {
              minX = vertices[j].x;
            }
            if (vertices[j].y < minY) {
              minY = vertices[j].y;
            }
        }
        minX += leftOffset;

        body = Bodies.fromVertices(
          0,
          0,
          vertices,
          {
            // isStatic: true,
          },
          true,
        );
      }

      this.bodies.push(body);

      const xOffset = this.bodies[this.bodies.length - 1].bounds.min.x - minX;
      const yOffset = this.bodies[this.bodies.length - 1].bounds.min.y - minY;
      Body.setPosition(this.bodies[this.bodies.length - 1], {x: -xOffset, y: -yOffset});

      Composite.add(composite, body);

      svgs[i].childNodes[0].childNodes[0].setAttribute(
        "transform",
        `translate(${leftOffset + xOffset} ${yOffset})`,
      );
    }

    Composite.add(composite, Constraint.create({
      pointA: { x: -heightBorderDistance, y: 0.0 },
      bodyB: this.bodies[0],
      stiffness: 0.999,
    }));

    for (let i = 0, l = this.bodies.length - 1; i < l; i++) {
      Composite.add(composite, Constraint.create({
        bodyA: this.bodies[i],
        bodyB: this.bodies[i + 1],
        stiffness: 0.999,
      }));
    }

    Composite.add(composite, Constraint.create({
      bodyA: this.bodies[this.bodies.length - 1],
      pointB: { x: heightBorderDistance, y: 0.0 },
      stiffness: 0.999,
    }));

    World.add(
      this.world,
      composite,
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

  public update(svgs: SVGElement[]) {
    Engine.update(this.engine);

    // let baseIndex = 0;
    // for (let i = 0, l = this.bodies.length; i < l; i++) {
    //   baseIndex = i * 3;
    //   circlesDataBuffer.array[baseIndex] = this.bodies[i].position.x * 0.001;
    //   circlesDataBuffer.array[baseIndex + 1] = this.bodies[i].position.y * -0.001;
    //   circlesDataBuffer.array[baseIndex + 2] = this.bodies[i].circleRadius * 0.001;
    // }

    for (let i = 0, l = this.bodies.length; i < l; i++) {
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
          this.bodies[i].position.x
        } ${
          this.bodies[i].position.y
        }) rotate(${
          this.bodies[i].angle * 57.2958
        })`,
      );
    }

    // circlesDataBuffer.needsUpdate = true;
  }
}
