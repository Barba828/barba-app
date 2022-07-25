/**
 * 向量
 */
export class Vector {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static add(vector1: Vector, vector2: Vector) {
    return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
  }
  static sub(vector1: Vector, vector2: Vector) {
    return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
  }
  static clone(vector: Vector) {
    return new Vector(vector.x, vector.y);
  }
  static fromAngle(theta: number, d: number) {
    return new Vector(d * Math.cos(theta), d * Math.sin(theta));
  }

  clone() {
    return new Vector(this.x, this.y);
  }
  /**
   * 与向量求和
   */
  add(vector: Vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }
  /**
   * 与向量求差
   */
  sub(vector: Vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }
  /**
   * 与标量做乘法求积
   */
  mult(scale: number) {
    this.x *= scale;
    this.y *= scale;
    return this;
  }
  /**
   * 与标量做除法求商
   */
  div(scale: number) {
    this.x /= scale;
    this.y /= scale;
    return this;
  }
  /**
   * 向量的模 magnitude 即计算向量的长度
   * @returns |vector|
   */
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  /**
   * 设置模长
   */
  setMag(mag: number) {
    this.normalize();
    this.mult(mag);
    return this;
  }

  /**
   * 设置单位向量 即方向 vector ->
   */
  normalize() {
    let m = this.mag();
    if (m !== 0) {
      return this.div(m);
    }
    return this;
  }
  limit(max: number) {
    if (this.mag() > max) {
      this.normalize();
      this.mult(max);
    }
    return this;
  }
  heading() {
    return -Math.atan2(this.x, this.y);
  }
}
