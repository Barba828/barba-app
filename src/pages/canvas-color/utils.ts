import { quantize } from "~/quantize/src";
import { getPxInfo } from "@/pages/canvas-lego/utils";

/**
 * 获取图片颜色分区
 * @param canvas
 * @param options
 * @returns
 */
export const getQuantize = (
  canvas: HTMLCanvasElement = document.createElement("canvas"),
  options: {
    /**
     * 图片地址
     */
    imgSrc: string;
    /**
     * 近似颜色数量
     */
    number?: number;
  }
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return Promise.reject(false);
  }

  const { imgSrc, number = 4 } = options;
  const image = new Image();
  image.src = imgSrc;

  return new Promise<ReturnType<typeof quantize>>((resolve, reject) => {
    image.onload = () => {
      const heightRate = image.height / image.width;
      canvas.height = canvas.width * heightRate;

      const imageData = draw();
      const rgbaList = getColorList(imageData);

      const colorMap = quantize(rgbaList, number);
      resolve(colorMap);
    };

    /**
     * 获取 imageData
     */
    const draw = () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return imageData;
    };

    /**
     * 获取全部 RGBA 列表
     */
    const getColorList = (imageData: ImageData) => {
      const rgbaList = [];

      for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height; j++) {
          const rgba = getPxInfo(imageData, i, j);
          rgbaList.push(rgba);
        }
      }
      return rgbaList;
    };
  });
};

/**
 * 获取固定像素点
 * @param canvas
 * @param x
 * @param y
 * @returns
 */
export const getPixelData = (
  canvas: HTMLCanvasElement,
  x: number,
  y: number
): RGBA => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return [255, 255, 255, 0];
  }
  const imageData = ctx.getImageData(x, y, 1, 1).data;
  return [
    imageData[0],
    imageData[1],
    imageData[2],
    Number((imageData[3] / 255).toFixed(2)),
  ];
};

/**
 * 获取从前到深的关联颜色
 * @param color 原始颜色
 * @param length 关联颜色数量
 * @param ratio 关联倍率
 * @returns
 */
export const getRelateColor = (
  color: RGBA,
  length: number = 10,
  ratio: number = 0.5
) => {
  const colors = new Array<RGBA>(length);
  const originColor = color.slice(0, 3);
  const mid = Math.round(length / 2);
  let max = 0,
    maxIndex = -1;
  originColor.forEach((val, index) => {
    if (val > max) {
      max = val;
      maxIndex = index;
    }
  });

  for (let index = 0; index < length; index++) {
    const relateColor: RGBA = [0, 0, 0, 1];
    if (index === mid) {
      colors[index] = [...originColor, 1] as RGBA;
      continue;
    }
    // eslint-disable-next-line no-loop-func
    originColor.forEach((referColor, rgbIndex) => {
      if (rgbIndex === maxIndex) {
        relateColor[rgbIndex] = referColor; // 最深色不变
      } else {
        const rate = ((index - mid) / mid) * ratio;
        const trich =
          rate > 0
            ? referColor + (255 - referColor) * rate
            : referColor * (1 + rate);
        relateColor[rgbIndex] = Math.round(trich);
      }
    });
    colors[index] = relateColor;
  }
  return colors.reverse();
};

export const drawCanvasImage = (
  canvas: HTMLCanvasElement,
  options: {
    /**
     * 图片地址
     */
    imgSrc: string;
    callback?(imageData?: ImageData): void;
  }
) => {
  const ctx = canvas.getContext("2d");
  const { imgSrc, callback } = options;

  if (!ctx || !imgSrc) {
    return;
  }

  const image = new Image();
  image.src = imgSrc;
  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    callback?.(imageData);
  };
};
