import React, { FC, useEffect, useRef } from "react";
import { useDebounce, useDownloader, useUploader } from "@/hooks";
import {
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { fillApproximateRectFactory } from "./utils";
import { toMosaic } from "@/pages/canvas-lego/utils";

import "@/pages/canvas-lego/canvas-lego.component.css";
import { type } from "@testing-library/user-event/dist/type";
import { cubeColors } from "./cube-colors";

const defautWidth =
  window.innerWidth > 1920 ? 1920 : Math.ceil(window.innerWidth * 0.8);

export const CanvasToCube: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [width, setWidth] = React.useState<number>(defautWidth);
  const [colorIndex, setColorIndex] = React.useState<number>(0);
  const [colorRange, setColorRange] = React.useState<string[]>(
    cubeColors[0].colors
  );

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
        // size,
        // colorType,
      });
    },
    300,
    [imgSrc, colorRange]
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
