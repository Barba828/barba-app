type RGBA = [number, number, number, number];
type MosaicType = "lego" | "spherical" | "flat";
type ShadowType = "front" | "side" | "none";
type FillMosaicRectOptions = {
  shadow?: ShadowType;
  type?: MosaicType;
  r?: number;
};

interface FillMosaicRect {
  (
    ctx: CanvasRenderingContext2D,
    rgba: RGBA,
    x: number,
    y: number,
    w: number,
    h: number,
    r?: number
  ): void;
}
