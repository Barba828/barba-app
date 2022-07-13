import { quantize } from "ts-color-quantize";
import { getPxInfo } from "@/pages/canvas-lego/utils";

/**
 * 获取图片颜色分区
 * @param canvas
 * @param options
 * @returns
 */
export const getQuantize = (
  canvas: HTMLCanvasElement,
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

  return new Promise((resolve, reject) => {
    let colorMap: any = null;

    image.onload = function () {
      const heightRate = image.height / image.width;
      canvas.height = canvas.width * heightRate;

      const imageData = draw();
      const rgbaList = getColorList(imageData);

      colorMap = quantize(rgbaList, number);
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
