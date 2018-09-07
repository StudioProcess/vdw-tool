import {
  Component,
} from "react";
import {
  Clock,
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  BufferAttribute,
} from "three";

import SceneHandler from "./sceneHandler";
import CirclePhysics from "./circlePhysics";

import CheckWebGLSupport from "../../utilities/checkWebGLSupport/CheckWebGLSupport";

// import {lerp, clamp, inverseLerpUnclamped} from "../../utilities/mathUtils";

const fixedFrameRate: number = 1.0 / 30.0;
const maxNumCircles = 256;

export default class StatueViewer extends Component<any, any> {
  private sceneHandler: SceneHandler;
  private circlePhysics: CirclePhysics;

  private circlesDataBuffer: BufferAttribute;

  // #region mouse data
    private rect: ClientRect;

    private windowWidth: number;
    private windowHeight: number;
  // #endregion

  // #region three
    private clock: Clock;
    private deltaCounter: number = 9999.9;

    private renderer: WebGLRenderer;
    private scene: Scene;
    private camera: OrthographicCamera;

    private uniforms: Uniforms;

    private webGLSupport: IWebGLData;
  // #endregion

  // #region dom
    private containerRef: HTMLDivElement;
    private canvasRef: HTMLCanvasElement;
  // #endregion

  // #region timers
    private frameId: number;
    private isClickCheckerId: number;
  // #endregion

  constructor(props: any) {
    super(props);

    this.windowWidth = 2;
    this.windowHeight = 2;
  }

  public shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    return false;
  }

  public componentDidMount() {
    this.webGLSupport = CheckWebGLSupport();

    this.clock = new Clock();
    this.clock.start();

    this.renderer = new WebGLRenderer({
      canvas: this.canvasRef,
      // antialias: true,
      // alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1.0);
    this.renderer.setClearColor(0xeb582f, 1.0);

    this.uniforms = {
      time: {type: "f", value: 0.0},
      screenParams: {type: "4fv", value: [1.0, 1.0, 0.0, 0.0]},
    };

    this.camera = new OrthographicCamera(
      - 2, 2, 1, -1,
      1.0,
      100.0,
    );
    this.camera.position.z = 2.5;

    this.scene = new Scene();

    this.sceneHandler = new SceneHandler();
    this.sceneHandler.setup(
      this.scene,
      this.uniforms,
      maxNumCircles,
    );
    this.circlesDataBuffer = this.sceneHandler.getDataBuffer();

    this.circlePhysics = new CirclePhysics();
    this.circlePhysics.setup(
      10,
      window.innerWidth / window.innerHeight,
    );

    window.addEventListener("resize", this.onResize);
    this.onResize();

    this.animate();
  }

  public componentWillUnmount() {
    cancelAnimationFrame(this.frameId);

    window.removeEventListener("resize", this.onResize);
  }

  private onResize = () => {
    this.rect = this.containerRef.getBoundingClientRect();

    this.windowWidth = this.rect.width;
    this.windowHeight = this.rect.height;

    this.renderer.setSize(this.windowWidth, this.windowHeight);

    const aspectRatio = this.windowWidth / this.windowHeight;

    this.camera.left = -aspectRatio;
    this.camera.right = aspectRatio;
    this.camera.updateProjectionMatrix();

    this.uniforms.screenParams.value[0] = this.windowWidth;
    this.uniforms.screenParams.value[1] = this.windowHeight;
    this.uniforms.screenParams.value[2] = 1.0 / this.windowWidth;
    this.uniforms.screenParams.value[3] = 1.0 / this.windowHeight;

    this.circlePhysics.onResize(
      window.innerWidth / window.innerHeight,
    );
  }

  private animate = () => {
    const delta = Math.min(1.0 / 20.0, this.clock.getDelta());

    // if (this.deltaCounter > fixedFrameRate) {
    this.uniforms.time.value += delta;
    this.uniforms.time.value %= 1000.0;

    // this.sceneHandler.update(
    //   this.uniforms.time.value,
    //   delta,
    // );

    this.circlePhysics.update(
      this.circlesDataBuffer,
    );

    this.draw();

    this.deltaCounter %= fixedFrameRate;
    // }

    this.deltaCounter += delta;
    this.frameId = requestAnimationFrame(this.animate);
  }

  private draw = () => {
    this.renderer.render(this.scene, this.camera);
  }

  public render() {
    return (
      <div
        ref={(ref) => {this.containerRef = ref!; }}
      >
        <canvas
          ref={(ref) => {this.canvasRef = ref!; }}
        >
        </canvas>

        <style jsx>{`
          div {
            width: 100%;
            height: 100%;
          }
        `}</style>
      </div>
    );
  }
}
