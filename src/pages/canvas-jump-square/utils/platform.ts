import { Rect } from "./rect";
import { ExportedStage } from "./stage";
import { Vector } from "./vector";

/**
 * 平台障碍物块 Rect
 */
export class Platform extends Rect {
  prevPosition!: Vector;

  update(stage: ExportedStage) {
    const { horizontalVelocity } = stage;
    this.prevPosition = this.position.clone();
    this.position.add(horizontalVelocity);
  }
}
