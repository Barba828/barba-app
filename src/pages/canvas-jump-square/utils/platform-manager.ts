import { Platform } from "./platform";
import { ExportedStage } from "./stage";
import { random, randomOne } from "./utils";
import { Vector } from "./vector";

interface Props {
  colors: string[];
}

export class PlatformManager {
  platforms: Platform[];
  colors: string[];
  lastPlatform: Platform | null;

  constructor({ colors }: Props) {
    this.colors = colors;
    this.platforms = [];
    this.lastPlatform = null;
  }

  /**
   * 获取随机平台尺寸
   * @param stage
   * @returns
   */
  static getRandomProperties(stage: ExportedStage) {
    const width = random(80, 680);
    const height = random(50, 200);
    const gap = random(
      (80 * Math.abs(stage.horizontalVelocity.x)) / 3,
      (180 * Math.abs(stage.horizontalVelocity.x)) / 3
    );

    return {
      width,
      height,
      /**
       * 空格宽度
       */
      gap,
    };
  }

  // init = () => {
  //   const newPlatform = new Platform({
  //     position: new Vector(x, y),
  //     width: random(stage.width * 0.8, stage.width),
  //     height,
  //     color: randomOne(this.colors),
  //   });
  // }

  update = (stage: ExportedStage) => {
    // 如果所有平台不能铺满画布，创建新的平台，标记最后一个平台
    while (
      !this.platforms.length ||
      (this.lastPlatform && this.lastPlatform.position.x < stage.width)
    ) {
      const { width, height, gap } = PlatformManager.getRandomProperties(stage);
      const x = !this.platforms.length
        ? 0
        : this.lastPlatform!.position.x + this.lastPlatform!.width + gap;
      const y = stage.height - height;

      const newPlatform = new Platform({
        position: new Vector(x, y),
        width: !this.platforms.length
          ? random(stage.width * 0.8, stage.width)
          : width,
        height,
        color: randomOne(this.colors),
      });

      this.lastPlatform = newPlatform;
      this.platforms.push(newPlatform);
    }

    for (let i = 0; i < this.platforms.length; i++) {
      const platform = this.platforms[i];
      // 调用每个平台自身的 update方法
      platform.update(stage);

      // 如果已经走过屏幕左边
      if (platform.position.x + platform.width < 0) {
        const { width, height, gap } =
          PlatformManager.getRandomProperties(stage);

        // 重新随机生成平台, 标记最后一个平台
        platform.position = new Vector(
          this.lastPlatform!.position.x + this.lastPlatform!.width + gap,
          stage.height - height
        );
        platform.color = randomOne(this.colors);
        platform.width = width;
        platform.height = height;
        this.lastPlatform = platform;
      }
    }
  };

  draw = (stage: Pick<ExportedStage, "ctx">) => {
    this.platforms.forEach((platform) => platform.draw(stage));
  };
}
