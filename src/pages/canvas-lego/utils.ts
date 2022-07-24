import { getAreaPixelByImgData, getPixelByImgData } from "@/utils/image";
import { quantize } from "~/quantize/src";

/**
 * 将图片转换为马赛克
 * @param canvas
 * @param options
 * @returns
 */
export const toMosaic = (
  canvas: HTMLCanvasElement,
  options: {
    /**
     * 图片地址
     */
    imgSrc: string;
    /**
     * 转换回调方法
     */
    fillMosaicRect?: FillMosaicRect;
    /**
     * 马赛克大小
     */
    size?: number;
    /**
     * 马赛克块颜色计算方式 随机｜平均
     */
    colorType?: ColorType;
  }
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  const { imgSrc, fillMosaicRect, size = 10, colorType = "random" } = options;
  const image = new Image();

  image.src = imgSrc;
  image.onload = () => {
    const heightRate = image.height / image.width;
    canvas.height = canvas.width * heightRate;
    draw();
  };

  const draw = () => {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // 获取图片像素数据后清空 ctx
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 生成 i * j 的马赛克块
    for (let i = 0; i < Math.ceil(canvas.width / size); i++) {
      for (let j = 0; j < Math.ceil(canvas.height / size); j++) {
        let rgba: RGBA = [0, 0, 0, 0];
        if (colorType === "random") {
          // 从马赛克块中随机抽出一个像素点 RGBA 信息
          rgba = getPixelByImgData(
            imageData,
            i * size + Math.floor(Math.random() * size),
            j * size + Math.floor(Math.random() * size)
          );
        } else if (colorType === "avg") {
          // 从马赛克块中全部像素点获取平均 RGBA 信息
          const rgbaList = getAreaPixelByImgData(
            imageData,
            i * size,
            j * size,
            size,
            size
          );
          // 将 RGBA 数组求和再除以数组长度
          rgba = rgbaList
            .reduce(
              // eslint-disable-next-line no-loop-func
              (pre, tmp) =>
                tmp.map((_t, index) => pre[index] + tmp[index]) as RGBA
            )
            .map((item) => (item /= size * size)) as RGBA;
        } else if (colorType === "main") {
          // 从马赛克块中获取全部 RGBA 信息并获取主题色
          const rgbaList = getAreaPixelByImgData(
            imageData,
            i * size,
            j * size,
            size,
            size
          );
          const colorMap = quantize(rgbaList, 1);
          rgba = (colorMap.palette() as RGBA[])[0];
        }

        // 填充马赛克块
        if (fillMosaicRect) {
          fillMosaicRect(ctx, rgba, i * size, j * size, size, size);
        } else {
          setRectBackground(ctx, rgba, i * size, j * size, size, size);
        }
      }
    }
  };
};

/**
 * 柯里化 通过 options 获取填充乐高马赛克块方法
 * @param options
 * @returns
 */
export const fillLegoRectFactory = (
  options: FillMosaicRectOptions = {}
): FillMosaicRect => {
  const { shadow = "front", type = "lego", r = 3 } = options;

  let drawButton: FillMosaicRect;
  switch (type) {
    case "lego":
      drawButton = standardButton;
      break;
    case "spherical":
      drawButton = sphericalButton;
      break;
    case "flat":
      drawButton = flatButton;
      break;
    default:
      drawButton = standardButton;
      break;
  }

  return (ctx, rgba, x, y, w, h) => {
    if (shadow !== "none") {
      const shadowOffset = shadow === "front" ? 0 : 2;
      setShadows(ctx, rgba, shadowOffset, shadowOffset, w, h);
    }

    setRectBackground(ctx, rgba, x, y, w, h);
    drawButton(ctx, rgba, x, y, w, h, r);
  };
};

/**
 * 默认马赛克块背景色
 */
const setRectBackground: FillMosaicRect = (ctx, rgba, x, y, w, h) => {
  // 背景色
  ctx.fillStyle = `rgb(${rgba.join(",")})`;
  ctx.fillRect(x, y, w, h);
};

/**
 * 设置阴影效果
 */
const setShadows: FillMosaicRect = (ctx, rgba, x, y, w, h) => {
  // 阴影效果
  ctx.shadowOffsetX = x;
  ctx.shadowOffsetY = y;
  ctx.shadowBlur = w / 4;
  ctx.shadowColor = `rgb(${rgba.map((color) => color * 0.6).join(",")})`;
};

/**
 * 标准乐高积木颗粒
 */
const standardButton: FillMosaicRect = (ctx, rgba, x, y, w, h, r = 3) => {
  // 浮雕背景色
  const lineargradient = ctx.createLinearGradient(x, y, x, y + h);
  lineargradient.addColorStop(0, `#ffffff`);
  lineargradient.addColorStop(0.5, `rgb(${rgba.join(",")})`);
  lineargradient.addColorStop(1, `#000000`);
  ctx.fillStyle = lineargradient;

  const circleFore = new Path2D();
  circleFore.arc(x + w / 2, y + h / 2, w / r, 0, 2 * Math.PI);
  ctx.fill(circleFore);

  // 浮雕前景色
  ctx.fillStyle = `rgb(${rgba.join(",")})`;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "";

  const circleBack = new Path2D();
  circleBack.arc(x + w / 2, y + h / 2, (w / r) * 0.8, 0, 2 * Math.PI);
  ctx.fill(circleBack);
};

/**
 * 半球型颗粒
 */
const sphericalButton: FillMosaicRect = (ctx, rgba, x, y, w, h, r = 3) => {
  const radgrad = ctx.createRadialGradient(
    x + w / 2,
    y + h / 2,
    w / r,
    x + w / 2,
    y + h / 2,
    0
  );
  radgrad.addColorStop(1, `rgb(${rgba.map((color) => color * 1.3).join(",")})`);
  radgrad.addColorStop(0, `rgb(${rgba.join(",")})`);
  ctx.fillStyle = radgrad;

  const circle = new Path2D();
  circle.arc(x + w / 2, y + h / 2, w / r, 0, 2 * Math.PI);
  ctx.fill(circle);
};

/**
 * 平面颗粒
 */
const flatButton: FillMosaicRect = (ctx, rgba, x, y, w, h, r = 3) => {
  const circle = new Path2D();
  circle.arc(x + w / 2, y + h / 2, w / r, 0, 2 * Math.PI);
  ctx.fill(circle);
};

export const mosaicType: MosaicType[] = ["lego", "spherical", "flat"];
