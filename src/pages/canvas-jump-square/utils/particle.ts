import { Rect, RectProps } from "./rect";
import { Vector } from "./vector";
import { ExportedStage } from "./stage";

interface ParticleProps extends RectProps {
  velocity: Vector;
  mass: number;
}

/**
 * 粒子块 Rect
 */
export class Particle extends Rect implements ParticleProps {
  velocity: Vector;
  isFirstTime: boolean;
  mass: number;

  constructor({ velocity, mass, ...props }: ParticleProps) {
    super(props);
    this.isFirstTime = true;
    this.velocity = velocity;
    this.mass = mass;
  }

  update = (stage: ExportedStage) => {
    if (!this.isFirstTime) {
      this.opacity -= 0.05; // 每次修改一点透明度，产生逐渐消失的视觉效果
      const { verticalAcceleration, horizontalVelocity } = stage;
      this.velocity.add(verticalAcceleration);
      this.position.add(Vector.add(this.velocity, horizontalVelocity));
      this.opacity = Math.max(this.opacity, 0);
    }
    this.isFirstTime = false;
  };

  applyForce = (force: Vector) => {
    this.velocity.add(force.clone().div(this.mass));
  };
}
