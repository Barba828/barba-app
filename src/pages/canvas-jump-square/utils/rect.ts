import { Vector } from "./vector";

export interface RectProps {
  position: Vector;
  width: number;
  height: number;
  color: string;
  opacity?: number;
}

export interface DrawProps {
  ctx: CanvasRenderingContext2D;
}

export class Rect implements RectProps {
  /**
   * (x, y)左上角坐标
   */
  position: Vector;
  width: number;
  height: number;
  color: string;
  opacity: number;

  constructor({ position, width, height, color, opacity = 1 }: RectProps) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.color = color;
    this.opacity = opacity;
  }

  /**
   * 判断矩形相交
   * @returns 相交
   */
  static isIntersect(r1: Rect, r2: Rect) {
    return !(
      r2.position.x > r1.position.x + r1.width ||
      r2.position.x + r2.width < r1.position.x ||
      r2.position.y > r1.position.y + r1.height ||
      r2.position.y + r2.height < r1.position.y
    );
  }

  draw = ({ ctx }: DrawProps) => {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.restore();
  };
}
