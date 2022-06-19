import React, { FC, useEffect } from "react";
import { fillLegoRectFactory, toMosaic } from "./utils";
import { useUploader, useDebounce } from "@/hooks";
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
import { fileSave } from "browser-fs-access";

const defautWidth =
  window.innerWidth > 1920 ? 1920 : Math.ceil(window.innerWidth * 0.8);

export const CanvasToLego: FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [size, setSize] = React.useState<number>(20);
  const [width, setWidth] = React.useState<number>(defautWidth);
  const [radiu, setRadiu] = React.useState<number>(3);

  const [type, setType] = React.useState<MosaicType>("lego");
  const [shadow, setShadow] = React.useState<ShadowType>("front");

  const { src: imgSrc, blob, onOpenFile } = useUploader();

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
      });
    },
    300,
    [imgSrc, size, width, type, shadow, radiu]
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

  const handleDownload = async () => {
    if (!canvasRef.current) {
      return;
    }
    canvasRef.current.toBlob(async (canvasBlob) => {
      if (!canvasBlob) {
        return;
      }

      await fileSave(canvasBlob, {
        fileName: `barba_${blob?.name}`,
        extensions: [".png"],
      });
    });
  };

  return (
    <div className="lego-container">
      <div className="lego-input">
        <Card sx={{ minWidth: 200 }} className="lego-setting">
          <div className="controller">
            <Button className="button" variant="outlined" onClick={onOpenFile}>
              选择
            </Button>
            <Button
              disabled={!imgSrc || !canvasRef.current}
              className="button"
              onClick={handleDownload}
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

          <FormControl fullWidth>
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
        <canvas
          ref={canvasRef}
          id="mosaic"
          width={width}
          height={width}
        ></canvas>
      </div>
    </div>
  );
};
