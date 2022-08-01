import { DrawProps } from "./rect";
import { Vector } from "./vector";

let test = -1;
export interface ExportedStage extends DrawProps {
  width: number;
  height: number;
  /**
   * 垂直加速度
   */
  verticalAcceleration: Vector;
  /**
   * 水平速度
   */
  horizontalVelocity: Vector;
}

export interface StageProps {
  /**
   * 垂直加速度
   */
  verticalAcceleration: Vector;
  /**
   * 水平初速度
   */
  initialHorizontalVelocity: Vector;
  /**
   * 水平加速度
   */
  horizontalAcceleration: Vector;
  /**
   * 渲染 canvas 元素
   */
  ele: HTMLCanvasElement;
  /**
   * resize 回调
   */
  onResize?(): void;
}

interface Entity {
  update: (stage: ExportedStage) => void;
  draw: (stage: ExportedStage) => void;
}

/**
 * 游戏舞台
 */
export class Stage implements StageProps {
  ele: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  width!: number;
  height!: number;
  /**
   * AnimationFrame 帧动画句柄
   */
  raf: number = 0;

  verticalAcceleration: Vector;
  horizontalAcceleration: Vector;
  initialHorizontalVelocity: Vector;
  horizontalVelocity: Vector;
  onResize: () => void;

  /**
   * 舞台元素
   */
  entities: Entity[] = [];

  constructor({
    verticalAcceleration,
    horizontalAcceleration,
    initialHorizontalVelocity,
    ele,
    onResize = () => void 0,
  }: StageProps) {
    this.ele = ele;
    this.verticalAcceleration = verticalAcceleration;
    this.horizontalAcceleration = horizontalAcceleration;
    this.horizontalVelocity = initialHorizontalVelocity.clone();
    this.initialHorizontalVelocity = initialHorizontalVelocity;
    this.onResize = onResize;

    this.init();
    window.addEventListener("resize", this.handleResize, false);
  }

  handleResize = () => {
    this.init();
    this.onResize();
  };

  /**
   * 防模糊初始化画布
   */
  init() {
    const { devicePixelRatio } = window;
    const { clientWidth, clientHeight } = this.ele.parentElement || this.ele;
    this.ele.width = clientWidth * devicePixelRatio;
    this.ele.height = clientHeight * devicePixelRatio;
    this.width = clientWidth;
    this.height = clientHeight;
    this.ele.style.width = this.width + "px";
    this.ele.style.height = this.height + "px";
    this.ctx = this.ele.getContext("2d")!;
    this.ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  /**
   * 帧动画
   */
  tick = (callback?: Function) => {
    // 下一帧动画
    this.raf = requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.width, this.height); // 清理画布
      this.horizontalVelocity.add(this.horizontalAcceleration); // 更新速度
      test = this.raf;
      this.tick(callback);
    });
    test = this.raf;

    // setTimeout(() => {
    //   this.ctx.clearRect(0, 0, this.width, this.height); // 清理画布
    //   this.horizontalVelocity.add(this.horizontalAcceleration); // 更新速度
    //   this.tick(callback);
    // }, 1000);
    // 更新舞台属性到所有元素
    const stage = {
      width: this.width,
      height: this.height,
      verticalAcceleration: this.verticalAcceleration,
      horizontalVelocity: this.horizontalVelocity,
      ctx: this.ctx,
    };
    for (const entity of this.entities) {
      entity.update(stage);
    }
    // 重绘舞台
    callback?.(this.raf);
    for (const entity of this.entities) {
      entity.draw(stage);
    }
  };

  /**
   * 播放动画
   */
  play = (callback?: Function) => {
    this.stop();
    this.tick(callback);
  };

  /**
   * 停止动画
   */
  stop = () => {
    cancelAnimationFrame(test);
    cancelAnimationFrame(this.raf);
  };

  /**
   * 添加舞台元素
   * @param entity 元素，支持 update、draw 方法
   */
  add = (...entity: Entity[]) => {
    for (let i = 0; i < entity.length; i++) {
      this.entities.push(entity[i]);
    }
  };

  /**
   * 重置水平速度和舞台元素
   */
  reset = () => {
    this.stop();
    this.horizontalVelocity = this.initialHorizontalVelocity.clone();
    this.entities = [];
  };
}
