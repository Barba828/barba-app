/**
 * canvas绘制图片
 * @param canvas
 * @param options
 * @returns
 */
export const drawCanvasImage = (
  canvas: HTMLCanvasElement,
  options: {
    /**
     * 图片地址
     */
    imgSrc: string;
    /**
     * 渲染图片后 callback
     * @param imageData
     */
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

/**
 * 获取像素点 rgba
 * @param canvas
 * @param x
 * @param y
 * @returns
 */
export const getPixelByCanvas = (
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
 * 获取范围内像素 rgba[]
 * @param canvas
 * @param x
 * @param y
 * @returns
 */
export const getAreaPixelByCanvas = (
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number
): RGBA[] => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return [];
  }
  const rgba = [];
  const imageData = ctx.getImageData(x, y, width, height).data;
  for (let i = 0; i < imageData.length; i += 4) {
    rgba.push([
      imageData[i],
      imageData[i + 1],
      imageData[i + 2],
      Number((imageData[i + 3] / 255).toFixed(2)),
    ] as RGBA);
  }
  return rgba;
};

/**
 * 获取图片(x, y)位置的像素点RGBA值
 * @param imgData
 * @param x
 * @param y
 * @returns RGBA[]
 */
export const getPixelByImgData = (
  imgData: ImageData,
  x: number,
  y: number
): RGBA => {
  const color = [];
  const data = imgData.data;
  const w = imgData.width;
  const h = imgData.height;
  if (x >= w || y >= h) {
    return [255, 255, 255, 0];
  }
  color[0] = data[(y * w + x) * 4];
  color[1] = data[(y * w + x) * 4 + 1];
  color[2] = data[(y * w + x) * 4 + 2];
  color[3] = Math.floor((data[(y * w + x) * 4 + 3] / 255) * 100) / 100; // 第 4 位是透明度，取 0～1 两位小数
  return color as RGBA;
};

/**
 * 获取图片(x, y)位置的像素点RGBA值
 * @param imgData
 * @param x
 * @param y
 * @returns RGBA[]
 */
export const getAreaPixelByImgData = (
  imgData: ImageData,
  x: number,
  y: number,
  width?: number,
  height?: number
): RGBA[] => {
  const rgbaList = [];
  width = width ?? imgData.width;
  height = height ?? imgData.height;
  let i, j;
  for (i = 0; i < width; i++) {
    for (j = 0; j < height; j++) {
      rgbaList.push(getPixelByImgData(imgData, x + i, y + j));
    }
  }
  return rgbaList;
};

export const defautCanvasWidth =
  window.innerWidth > 1920 ? 1920 : Math.ceil(window.innerWidth * 0.8);
