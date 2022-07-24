import React, { FC, useState, useEffect } from "react";
import { useUploader } from "@/hooks";
import { Button, Card, Slider, Typography } from "@mui/material";

import "@/pages/canvas-lego/canvas-lego.component.css";
import "./canvas-color.component.css";
import { getQuantize } from "./utils";
import { copyText } from "@/utils/clipboard";
import { RGB2String } from "@/utils/color";

export const CanvasColor: FC = () => {
  const [colors, setColors] = useState<RGBA[]>([]);
  const [mainColor, setMainColor] = useState<RGBA>();
  const [number, setNumber] = useState<number>(4);

  const { src: imgSrc, openFile } = useUploader();

  useEffect(() => {
    // Closed Color
    getQuantize(undefined, {
      imgSrc,
      number,
    }).then((colorMap) => {
      setColors(colorMap.palette() as RGBA[]);
    });
  }, [imgSrc, number]);

  useEffect(() => {
    // Main Color
    getQuantize(undefined, {
      imgSrc,
      number: 1,
    }).then((colorMap) => {
      setMainColor((colorMap.palette() as RGBA[])[0]);
    });
  }, [imgSrc]);

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
            min={1}
            max={12}
            value={number}
            onChange={handleChangeNumber}
          />
        </Card>
      </div>
      {imgSrc && (
        <Card sx={{ minWidth: 800 }} className="lego-setting color-card">
          <img src={imgSrc} alt="pic" width={"100%"} />
          <h3>主题色</h3>
          {mainColor && (
            <div className="color-container">
              <Card
                sx={{ minWidth: 100 }}
                className="color-view"
                onClick={() => copyText(RGB2String(mainColor))}
              >
                <div
                  style={{ background: `rgb(${mainColor.join(",")})` }}
                  className="color-item"
                ></div>
                <Button>{RGB2String(mainColor)}</Button>
              </Card>
            </div>
          )}
          <h3>相关色</h3>
          <div className="color-container">
            {colors.map((rgba, index) => {
              const color = `rgb(${rgba.join(",")})`;
              const colorString = RGB2String(rgba);
              return (
                <Card
                  sx={{ minWidth: 100 }}
                  className="color-view"
                  key={index}
                  onClick={() => copyText(colorString)}
                >
                  <div
                    style={{ background: color }}
                    className="color-item"
                  ></div>
                  <Button>{colorString}</Button>
                </Card>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
