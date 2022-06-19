/**
 * 六位数十六进制颜色值转换为RGB格式
 * @param color
 * @returns
 */
export const stringToRGB = (color: string): RGBA => {
  const reg = /^#[0-9a-fA-f]{6}$/;
  if (reg.test(color)) {
    return H2RGB(parseInt(color.slice(1), 16));
  }
  return [0, 0, 0, 0];
};

/**
 * 十六进制数字转换为RGB格式
 * @param h
 * @returns
 */
export const H2RGB = (h: number): RGBA => {
  const r = (h & 0xff0000) >> 16;
  const g = (h & 0x00ff00) >> 8;
  const b = h & 0x0000ff;
  return [r, g, b, 255];
};

/**
 * 色彩相对距离
 * @param arrRGB1
 * @param arrRGB2
 * @returns
 */
export const colorDistance = (arrRGB1: RGBA, arrRGB2: RGBA) => {
  let [r1, g1, b1] = arrRGB1;
  let [r2, g2, b2] = arrRGB2;

  let rmean = (r1 + r2) / 2;

  let r = r1 - r2;
  let g = g1 - g2;
  let b = b1 - b2;

  return Math.sqrt(
    (2 + rmean / 256) * r * r + 4 * g * g + (2 + (255 - rmean) / 256) * b * b
  );
};
