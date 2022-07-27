import { Rect, RectProps } from "./rect";
import { ExportedStage } from "./stage";
import { Vector } from "./vector";

interface HeroProps extends RectProps {
  mass?: number;
  velocity?: Vector;
}

/**
 * 角色块 Rect
 */
export class Hero extends Rect implements HeroProps {
  mass: number;
  velocity: Vector;
  prevPosition!: Vector;
  prevVelocity!: Vector;
  maxConJump: number;
  curConJump: number;

  constructor({ mass = 1, velocity = new Vector(), ...props }: HeroProps) {
    super(props);
    this.mass = mass;
    this.velocity = velocity;
    this.maxConJump = 2;
    this.curConJump = 999;
  }

  update(stage: ExportedStage) {
    const { verticalAcceleration } = stage;
    // 暂存上一帧位置
    this.prevPosition = this.position.clone();
    this.prevVelocity = this.velocity.clone();
    // this.velocity.add(verticalAcceleration);
    this.position.add(
      Vector.add(this.velocity, verticalAcceleration.clone().mult(0.5))
    );
    this.velocity.add(verticalAcceleration);
  }

  applyForce = (force: Vector) => {
    this.velocity.add(force.clone().div(this.mass));
  };

  jump = () => {
    if (this.curConJump < this.maxConJump) {
      this.velocity = new Vector();
      this.applyForce?.(new Vector(0, -12));
      this.curConJump++;
    } else if (this.curConJump === this.maxConJump) {
      this.velocity.add(new Vector(0, 30));
      this.curConJump++;
    }
  };
}
