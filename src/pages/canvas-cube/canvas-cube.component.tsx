import React, { FC, useState, useEffect, useRef } from "react";
import { useDebounce, useDownloader, useUploader } from "@/hooks";
import {
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Typography,
} from "@mui/material";
import { fillApproximateRectFactory } from "./utils";
import { defautCanvasWidth, toMosaic } from "@/pages/canvas-lego/utils";

import "@/pages/canvas-lego/canvas-lego.component.css";
import { cubeColors } from "./cube-colors";

export const CanvasToCube: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [size, setSize] = useState<number>(20);
  const [width, setWidth] = useState<number>(defautCanvasWidth);
  const [colorIndex, setColorIndex] = useState<number>(0);
  const [colorRange, setColorRange] = useState<string[]>(cubeColors[0].colors);

  const { src: imgSrc, blob, openFile } = useUploader();
  const { downloadFile } = useDownloader(canvasRef.current, blob);

  const debounceToCube = useDebounce(
    () => {
      if (!canvasRef.current) {
        return;
      }

      const fillMosaicRect = fillApproximateRectFactory({ colorRange });

      toMosaic(canvasRef.current, {
        imgSrc,
        fillMosaicRect,
        size,
        colorType: "avg",
      });
    },
    300,
    [imgSrc, size, width, colorRange]
  );

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    debounceToCube();
  }, [canvasRef, debounceToCube]);

  const handleChangeColorRange = ({ target }: SelectChangeEvent) => {
    setColorIndex(Number(target.value));
    setColorRange(cubeColors[Number(target.value)].colors);
  };

  const handleChangeSize = (_e: Event, value: number | number[]) => {
    setSize(value as number);
  };

  const handleChangeWidth = (_e: Event, value: number | number[]) => {
    setWidth(value as number);
  };

  return (
    <div className="lego-container">
      <div className="lego-input">
        <Card sx={{ minWidth: 200 }} className="lego-setting">
          <div className="controller">
            <Button className="button" variant="outlined" onClick={openFile}>
              选择
            </Button>
            <Button
              disabled={!imgSrc || !canvasRef.current}
              className="button"
              onClick={downloadFile}
            >
              保存
            </Button>
          </div>
          <FormControl className="controller" fullWidth>
            <InputLabel id="cube-type">魔方贴纸风格</InputLabel>
            <Select
              labelId="cube-type"
              value={colorIndex.toString()}
              label="魔方贴纸风格"
              onChange={handleChangeColorRange}
            >
              {cubeColors.map((item, index) => (
                <MenuItem key={index} value={index}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography sx={{ fontSize: 14 }} color="text.secondary">
            画布尺寸 {width}
          </Typography>
          <Slider
            min={200}
            max={2000}
            value={width}
            onChange={handleChangeWidth}
          />
          <Typography sx={{ fontSize: 14 }} color="text.secondary">
            颗粒尺寸 {size}
          </Typography>
          <Slider min={10} max={100} value={size} onChange={handleChangeSize} />
        </Card>
        {imgSrc && (
          <img src={imgSrc} className="lego-preview" alt="pic" height={220} />
        )}
      </div>
      <div className="canvas-mosaic">
        <canvas ref={canvasRef} id="mosaic" width={width}></canvas>
      </div>
    </div>
  );
};
