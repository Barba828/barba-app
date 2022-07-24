import React, { FC, useState, useEffect, useRef } from "react";
import { useUploader } from "@/hooks";
import { Button, Card } from "@mui/material";

import "@/pages/canvas-lego/canvas-lego.component.css";
import "./canvas-color.component.css";
import { getRelateColor } from "./utils";
import { RGB2String } from "@/utils/color";
import {
  defautCanvasWidth,
  drawCanvasImage,
  getPixelByCanvas,
} from "@/utils/image";

export const CanvasColorPicker: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [overColor, setOverColor] = useState<RGBA>();
  const [relateColor, setRelateColor] = useState<RGBA[]>([]);

  const { src: imgSrc, openFile } = useUploader();

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    drawCanvasImage(canvasRef.current, { imgSrc });
  }, [imgSrc]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const listener = (e: MouseEvent) => {
      const x =
        (e.offsetX * canvasRef.current!.width) / canvasRef.current!.offsetWidth;
      const y =
        (e.offsetY * canvasRef.current!.height) /
        canvasRef.current!.offsetHeight;
      const color = getPixelByCanvas(canvasRef.current!, x, y);

      if (color) {
        setOverColor(color);
        setRelateColor(getRelateColor(color));
      }
    };
    canvasRef.current.addEventListener("mousedown", listener);
    return () => canvasRef.current?.removeEventListener("mousedown", listener);
  }, [canvasRef.current]);

  return (
    <div className="lego-container">
      <div className="lego-input">
        <Card sx={{ minWidth: 200 }} className="lego-setting">
          <div className="controller">
            <Button className="button" variant="outlined" onClick={openFile}>
              选择
            </Button>
          </div>
        </Card>
      </div>

      <div className="canvas-mosaic">
        <canvas
          ref={canvasRef}
          id="mosaic"
          width={defautCanvasWidth}
          style={{ width: defautCanvasWidth + "px" }}
        ></canvas>
      </div>

      {overColor && (
        <div className="color-container">
          <Card className="color-view">
            <div
              style={{ background: `rgb(${overColor.join(",")})` }}
              className="color-item"
            ></div>
            <Button>{RGB2String(overColor)}</Button>
          </Card>
        </div>
      )}
      <div className="color-container">
        {relateColor.map((c, index) => (
          <Card className="color-view" key={index}>
            <div
              style={{ background: `rgb(${c.join(",")})` }}
              className="color-item"
            ></div>
            <Button>{RGB2String(c)}</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
