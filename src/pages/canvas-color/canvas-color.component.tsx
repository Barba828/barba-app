import React, { FC, useState, useEffect, useRef } from "react";
import { useUploader } from "@/hooks";
import { Button, Card, Slider, Typography } from "@mui/material";

import "@/pages/canvas-lego/canvas-lego.component.css";
import "./canvas-color.component.css";
import { getQuantize } from "./utils";
import { defautCanvasWidth } from "@/pages/canvas-lego/utils";
import { copyText } from "@/utils/clipboard";
import { RGB2String } from "@/utils/color";

export const CanvasColor: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [colors, setColors] = useState<RGBA[]>([]);
  const [number, setNumber] = useState<number>(4);

  const { src: imgSrc, openFile } = useUploader();

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    getQuantize(canvasRef.current, {
      imgSrc,
      number,
    }).then((colorMap) => {
      setColors((colorMap as any).palette());
    });
  }, [canvasRef, imgSrc, number]);

  const handleChangeNumber = (_e: Event, value: number | number[]) => {
    setNumber(value as number);
  };

  return (
    <div className="lego-container">
      <div className="lego-input">
        <Card sx={{ minWidth: 200 }} className="lego-setting">
          <div className="controller">
            <Button className="button" variant="outlined" onClick={openFile}>
              选择
            </Button>
          </div>
          <Typography sx={{ fontSize: 14 }} color="text.secondary">
            色彩数 {number}
          </Typography>
          <Slider
            min={3}
            max={10}
            value={number}
            onChange={handleChangeNumber}
          />
        </Card>
      </div>
      <Card sx={{ minWidth: 200 }} className="lego-setting color-card">
        <div className="canvas-mosaic">
          <canvas
            ref={canvasRef}
            id="mosaic"
            width={defautCanvasWidth}
          ></canvas>
        </div>
        <div className="color-container">
          {colors.map((rgba, index) => {
            const color = `rgb(${rgba.join(",")})`;
            const colorString = RGB2String(rgba);
            return (
              <Card
                className="color-view"
                key={index}
                onClick={() => copyText(colorString)}
              >
                <div style={{ background: color }} className="color-item"></div>
                <Button>{colorString}</Button>
              </Card>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
