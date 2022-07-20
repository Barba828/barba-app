import React, { FC, useEffect, useState, useRef } from "react";
import { defautCanvasWidth, fillLegoRectFactory, toMosaic } from "./utils";
import { useUploader, useDebounce, useDownloader } from "@/hooks";
import "./canvas-lego.component.css";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Card,
  Typography,
} from "@mui/material";

export const CanvasToLego: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [size, setSize] = useState<number>(20);
  const [width, setWidth] = useState<number>(defautCanvasWidth);
  const [radiu, setRadiu] = useState<number>(3);

  const [type, setType] = useState<MosaicType>("lego");
  const [shadow, setShadow] = useState<ShadowType>("front");
  const [colorType, setColorType] = useState<ColorType>("avg");

  const { src: imgSrc, blob, openFile } = useUploader();
  const { downloadFile } = useDownloader(canvasRef.current, blob);

  const debounceToMosaic = useDebounce(
    () => {
      if (!canvasRef.current) {
        return;
      }

      const fillMosaicRect = fillLegoRectFactory({
        type,
        shadow,
        r: radiu,
      });

      toMosaic(canvasRef.current, {
        imgSrc,
        fillMosaicRect,
        size,
        colorType,
      });
    },
    300,
    [imgSrc, size, width, type, shadow, radiu, colorType]
  );

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    debounceToMosaic();
  }, [canvasRef, debounceToMosaic]);

  const handleChangeSize = (_e: Event, value: number | number[]) => {
    setSize(value as number);
  };

  const handleChangeWidth = (_e: Event, value: number | number[]) => {
    setWidth(value as number);
  };

  const handleChangeRadiu = (_e: Event, value: number | number[]) => {
    setRadiu(value as number);
  };

  const handleChangeType = ({ target }: SelectChangeEvent) => {
    setType(target.value as MosaicType);
  };

  const handleChangeShadow = ({ target }: SelectChangeEvent) => {
    setShadow(target.value as ShadowType);
  };

  const handleChangeColorType = ({ target }: SelectChangeEvent) => {
    setColorType(target.value as ColorType);
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
            <InputLabel id="mosaic-type">颗粒风格</InputLabel>
            <Select
              labelId="mosaic-type"
              value={type}
              label="颗粒风格"
              onChange={handleChangeType}
            >
              <MenuItem value={"lego"}>乐高</MenuItem>
              <MenuItem value={"spherical"}>球型</MenuItem>
              <MenuItem value={"flat"}>扁平</MenuItem>
            </Select>
          </FormControl>

          <FormControl className="controller" fullWidth>
            <InputLabel id="mosaic-shadow">颗粒阴影</InputLabel>
            <Select
              labelId="mosaic-shadow"
              value={shadow}
              label="颗粒阴影"
              onChange={handleChangeShadow}
            >
              <MenuItem value={"none"}>无</MenuItem>
              <MenuItem value={"front"}>正角</MenuItem>
              <MenuItem value={"side"}>偏角</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="mosaic-color-type">色彩范围</InputLabel>
            <Select
              labelId="mosaic-color-type"
              value={colorType}
              label="色彩范围"
              onChange={handleChangeColorType}
            >
              <MenuItem value={"random"}>随机</MenuItem>
              <MenuItem value={"avg"}>平均值</MenuItem>
            </Select>
          </FormControl>
        </Card>
        <Card sx={{ minWidth: 300 }} className="lego-setting">
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
          <Typography sx={{ fontSize: 14 }} color="text.secondary">
            颗粒半径比 {radiu}
          </Typography>
          <Slider
            min={2}
            max={5}
            value={radiu}
            step={0.01}
            onChange={handleChangeRadiu}
          />
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
