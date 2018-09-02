import {
  Component,
} from "react";
import {
  Clock,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
} from "three";

import SceneHandler from "./sceneHandler";

// import GLTFLoader from "../../services/GLTFLoader.js";
import CheckWebGLSupport from "../../utilities/checkWebGLSupport/CheckWebGLSupport";

// import {lerp, clamp, inverseLerpUnclamped} from "../../utilities/mathUtils";

const fixedFrameRate: number = 1.0 / 30.0;

export default class StatueViewer extends Component<any, any> {
  private sceneHandler: SceneHandler;

  // #region mouse data
    private rect: ClientRect;

    private pointerStartPositionAbs: MousePosition;
    private pointerPositionGL: MousePosition;
    private pointerNormDragDelta: MousePosition;
    private pointerPositionNorm: MousePosition;
    private pointerPositionNormOld: MousePosition;

    private windowWidth: number;
    private windowHeight: number;

    private isDragging: boolean;

    private isClick: boolean;
  // #endregion

  // #region three
    private clock: Clock;
    private deltaCounter: number = 9999.9;

    private renderer: WebGLRenderer;
    private scene: Scene;
    private camera: PerspectiveCamera;

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

    this.animate = this.animate.bind(this);
    this.renderLoop = this.renderLoop.bind(this);
    this.onResize = this.onResize.bind(this);

    this.onClick = this.onClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    // this.statueHandler = new StatueHandler();
    this.windowWidth = 2;
    this.windowHeight = 2;

    this.pointerStartPositionAbs = {x: 0.0, y: 0.0};
    this.pointerPositionGL = {x: 0.0, y: 0.0};
    this.pointerNormDragDelta = {x: 0.0, y: 0.0};
    this.pointerPositionNorm = {x: 0.0, y: 0.0};
    this.pointerPositionNormOld = {x: 0.0, y: 0.0};

    this.isDragging = false;
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
      antialias: true,
      // alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1.0);
    this.renderer.setClearColor(0xffffff, 1.0);

    this.uniforms = {
      time: {type: "f", value: 0.0},
      screenParams: {type: "4fv", value: [1.0, 1.0, 0.0, 0.0]},
    };

    this.camera = new PerspectiveCamera(
      50,
      1.0,
      1.0,
      100.0
    );
    this.camera.position.z = 2.5;

    this.scene = new Scene();

    this.sceneHandler = new SceneHandler();
    this.sceneHandler.setup(
      this.scene,
      this.uniforms
    );

    window.addEventListener("resize", this.onResize);
    this.onResize();

    this.animate();

    // const gltfLoader = new GLTFLoader();
    // gltfLoader.load("../../static/meshes/uv_gen.gltf", (object: any) => {});
  }

  public componentWillUnmount() {
    cancelAnimationFrame(this.frameId);

    window.removeEventListener("resize", this.onResize);
  }

  private onClick(x: number, y: number) {
    this.pointerPositionNorm.x = (x - this.rect.left) / this.rect.width;
    this.pointerPositionNorm.y = (y - this.rect.top) / this.rect.height;
  }

  private onMouseDown(x: number, y: number) {
    this.pointerStartPositionAbs.x = x;
    this.pointerStartPositionAbs.y = y;

    this.isDragging = true;

    this.pointerPositionNormOld.x = (x - this.rect.left) / this.rect.width;
    this.pointerPositionNormOld.y = (y - this.rect.top) / this.rect.height;

    this.pointerPositionNorm.x = this.pointerPositionNormOld.x;
    this.pointerPositionNorm.y = this.pointerPositionNormOld.y;

    this.isClick = true;
    window.clearTimeout(this.isClickCheckerId);
    this.isClickCheckerId = window.setTimeout(
      () => {
        this.isClick = false;
      },
      400
    );
  }

  private onMouseMove(x: number, y: number) {
    this.pointerPositionNorm.x = (x - this.rect.left) / this.rect.width;
    this.pointerPositionNorm.y = (y - this.rect.top) / this.rect.height;

    if (this.isDragging) {
      this.pointerNormDragDelta.x = this.pointerPositionNorm.x - this.pointerPositionNormOld.x;
      this.pointerNormDragDelta.y = this.pointerPositionNorm.y - this.pointerPositionNormOld.y;

      this.sceneHandler.onDrag(this.pointerNormDragDelta);
    } else {
      this.pointerNormDragDelta.x = 0.0;
      this.pointerNormDragDelta.y = 0.0;
    }

    this.pointerPositionNormOld.x = (x - this.rect.left) / this.rect.width;
    this.pointerPositionNormOld.y = (y - this.rect.top) / this.rect.height;
  }

  private onMouseUp(x: number, y: number) {
    if (
      this.isClick &&
      Math.abs(this.pointerStartPositionAbs.x - x) < 20 &&
      Math.abs(this.pointerStartPositionAbs.y - y) < 20
    ) {
      this.onClick(x, y);
    }

    this.onMouseLeave();
  }

  private onMouseLeave() {
    this.pointerNormDragDelta.x = 0.0;
    this.pointerNormDragDelta.y = 0.0;

    this.isDragging = false;
  }

  private onResize() {
    this.rect = this.containerRef.getBoundingClientRect();

    this.windowWidth = this.rect.width;
    this.windowHeight = this.rect.height;

    this.renderer.setSize(this.windowWidth, this.windowHeight);

    this.camera.aspect = this.windowWidth / this.windowHeight;
    this.camera.updateProjectionMatrix();

    this.uniforms.screenParams.value[0] = this.windowWidth;
    this.uniforms.screenParams.value[1] = this.windowHeight;
    this.uniforms.screenParams.value[2] = 1.0 / this.windowWidth;
    this.uniforms.screenParams.value[3] = 1.0 / this.windowHeight;
  }

  private animate() {
    const delta = Math.min(1.0 / 20.0, this.clock.getDelta());

    if (this.deltaCounter > fixedFrameRate) {
      this.uniforms.time.value += fixedFrameRate;
      this.uniforms.time.value %= 100.0;

      this.sceneHandler.update(delta);

      this.renderLoop();

      this.deltaCounter %= fixedFrameRate;
    }

    this.deltaCounter += delta;
    this.frameId = requestAnimationFrame(this.animate);
  }

  private renderLoop() {
    this.renderer.render(this.scene, this.camera);
  }

  public render() {
    return (
      <div
        ref={(ref) => {this.containerRef = ref!; }}
      >
        <canvas
          // onClick={(e) => {
          //   this.onClick(e.clientX, e.clientY);
          // }}

          onMouseDown={(e) => {this.onMouseDown(e.clientX, e.clientY); }}
          onMouseMove={(e) => {this.onMouseMove(e.clientX, e.clientY); }}
          onMouseLeave={(e) => {this.onMouseLeave(); }}
          onMouseUp={(e) => {this.onMouseUp(e.clientX, e.clientY); }}

          onWheel={(e) => {e.preventDefault(); this.onZoom(e.deltaY); }}

          onTouchStart={(e) => {this.onMouseDown(e.touches[0].clientX, e.touches[0].clientY); }}
          onTouchMove={(e) => {this.onMouseMove(e.touches[0].clientX, e.touches[0].clientY); }}
          onTouchEnd={(e) => {this.onMouseUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY); }}

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
