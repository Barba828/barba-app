type CubeColorType = {
  name: string;
  /**
   * 魔方十六进制颜色
   * [ 白, 蓝, 绿, 黄, 橙, 红 ]
   */
  colors: string[];
};

export const cubeColors: CubeColorType[] = [
  {
    name: "GAN 249 v2",
    colors: ["#ffffff", "#0285f7", "#02c700", "#fcff00", "#ffa300", "#ff1300"],
  },
  {
    name: "GAN 365",
    colors: ["#ffffff", "#00fa02", "#02c700", "#fff239", "#ff8117", "#f32e2c"],
  },
  {
    name: "GAN 彩",
    colors: ["#ffffff", "#0080cc", "#009040", "#fdd001", "#ea5303", "#d6003e"],
  },
  {
    name: "黑白",
    colors: ["#ffffff", "#000000"],
  },
  {
    name: "魔域 MF3s",
    colors: ["#fbfbfa", "#007ce0", "#007ce0", "#fff600", "#ff720d", "#f20c21"],
  },
];
