import { colorDistance, stringToRGB } from "@/utils/color";
import { cubeColors } from "./cube-colors";

/**
 * 柯里化 通过 options 获取填充近似颜色马赛克块方法
 * @param options
 * @returns
 */
export const fillApproximateRectFactory = (options: {
  colorRange?: string[];
  edgeWidth?: number;
}): FillMosaicRect => {
  const { colorRange = cubeColors[0].colors, edgeWidth = 1 } = options;
  const ranges = colorRange.map(stringToRGB);
  return (ctx, rgba, x, y, w, h) => {
    rgba = getApproximateColor(rgba, ranges);
    // 背景色
    ctx.fillStyle = `rgb(${rgba.join(",")})`;
    ctx.fillRect(
      x + edgeWidth,
      y + edgeWidth,
      w - 2 * edgeWidth, // 贴纸厚度
      h - 2 * edgeWidth
    );
  };
};

/**
 * 从可选项中获取近似颜色
 * @param rgba
 * @param ranges 可选颜色数组
 * @returns
 */
const getApproximateColor = (rgba: RGBA, ranges: RGBA[]) => {
  return ranges.reduce((prevColor, tempColor) => {
    const preDistance = colorDistance(rgba, prevColor);
    const tmpDistance = colorDistance(rgba, tempColor);
    return preDistance < tmpDistance ? prevColor : tempColor;
  });
};
