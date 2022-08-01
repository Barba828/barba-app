/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useRef } from "react";
import { addListener } from "./utils/game-controller";
import { Hero } from "./utils/hero";
import { Particle } from "./utils/particle";
import { Platform } from "./utils/platform";
import { PlatformManager } from "./utils/platform-manager";
import { Rect } from "./utils/rect";
import { Stage } from "./utils/stage";
import { random, randomOne } from "./utils/utils";
import { Vector } from "./utils/vector";
// import "./utils/game-controller";

export const CanvasJumpSquare: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hero = new Hero({
    position: new Vector(160, 300),
    height: 24,
    width: 24,
    color: "#222f3e",
  });
  const pm = new PlatformManager({
    colors: ["#1dd1a1", "#ff6b6b", "#feca57", "#54a0ff", "#9c88ff"],
  });

  let particles: Particle[] = [];
  const maxParticleLength = 40;
  let particleId = 0;
  let hasIntersect = false;
  let prevHasIntersect = false;
  let stage: Stage;

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    stage = new Stage({
      verticalAcceleration: new Vector(0, 0.6),
      initialHorizontalVelocity: new Vector(-4, 0),
      horizontalAcceleration: new Vector(-0.001, 0),
      onResize: init,
      ele: canvasRef.current,
    });

    addListener(() => {
      // hero.jump();
      stage.play((raf: number) => {
        collideDetect(hero, pm.platforms, raf);
        for (const particle of particles) {
          particle.update(stage);
          particle.draw(stage);
        }
      });
    });

    init();
  }, [canvasRef.current]);

  const init = () => {
    stage.reset();
    console.log("lnz init", hero.position.y, stage.height);

    stage.play((raf: number) => {
      collideDetect(hero, pm.platforms, raf);
      for (const particle of particles) {
        particle.update(stage);
        particle.draw(stage);
      }
    });
    stage.add(hero, pm);
  };

  /**
   * 碰撞判断：在 platfrom 左侧
   * @param hero
   * @param platform
   * @returns
   */
  const isIntersectLeft = (hero: Hero, platform: Platform) => {
    if (hero.prevPosition.x + hero.width >= platform.prevPosition.x) {
      return false;
    }
    if (hero.prevPosition.y + hero.height >= platform.prevPosition.y) {
      return true;
    }
    const { x, y } = platform.prevPosition;
    const prevRightBottomX = hero.width + hero.prevPosition.x;
    const prevRightBottomY = hero.height + hero.prevPosition.y;
    const tx = (x - prevRightBottomX) / -stage.horizontalVelocity.x;
    const ty = (y - prevRightBottomY) / hero.prevVelocity.y;
    return ty < tx;
  };

  const isIntersectBottom = (hero: Hero, stage: Stage) => {
    return hero.position.y > stage.height;
  };

  const collideDetect = (hero: Hero, platforms: Platform[], raf: number) => {
    console.log("lnz collideDetect", hero.position.y, stage.height);
    if (isIntersectBottom(hero, stage)) {
      // cancelAnimationFrame(raf)
      stage.stop();
      // init();
      return;
    }

    let tempHasIntersect = false;
    for (let i = 0; i < platforms.length; i++) {
      if (Rect.isIntersect(hero, platforms[i])) {
        tempHasIntersect = true;
        const platform = platforms[i];
        hero.velocity = new Vector(0, 0);
        hero.curConJump = 0;

        // 下一帧碰撞在 platfrom 块左侧 => 死亡 => 重启游戏
        if (isIntersectLeft(hero, platform)) {
          init();
          return;
        }

        hero.position.y = platform.position.y - hero.height;

        // const particleSize = 8;

        // if (!prevHasIntersect) {
        //   for (let i = 0; i < 10; i++) {
        //     const left = Math.random() > 0.5;
        //     particles[particleId % maxParticleLength] = new Particle({
        //       velocity: left
        //         ? new Vector(random(-4, -2), random(-6, -1))
        //         : new Vector(random(10, 16), random(-6, -1)),
        //       mass: 1,
        //       position: left
        //         ? new Vector(
        //             hero.position.x - particleSize,
        //             hero.position.y + hero.height - particleSize
        //           )
        //         : new Vector(
        //             hero.position.x + hero.width,
        //             hero.position.y + hero.height - particleSize
        //           ),
        //       width: particleSize,
        //       height: particleSize,
        //       color: randomOne([hero.color, platform.color]),
        //     });
        //     particles[particleId++ % maxParticleLength].applyForce(
        //       new Vector(0, -2)
        //     );
        //   }
        // } else {
        //   particles[particleId % maxParticleLength] = new Particle({
        //     velocity: new Vector(0, random(-6, -1)),
        //     mass: 1,
        //     position: new Vector(
        //       hero.position.x - particleSize,
        //       hero.position.y + hero.height - particleSize
        //     ),
        //     width: particleSize,
        //     height: particleSize,
        //     color: platform.color,
        //   });
        //   particles[particleId++ % maxParticleLength].applyForce(
        //     new Vector(0, -2)
        //   );
        // }
      }
    }
    hasIntersect = tempHasIntersect;
    if (!prevHasIntersect && hasIntersect) {
      stage.horizontalVelocity.add(new Vector(-2, 0));
    }
    if (prevHasIntersect && !hasIntersect) {
      stage.horizontalVelocity.add(new Vector(2, 0));
    }
    prevHasIntersect = hasIntersect;
  };

  return (
    <div className="canvas-mosaic" style={{ width: 800, height: 600 }}>
      <canvas ref={canvasRef} id="jump-square"></canvas>
    </div>
  );
};
