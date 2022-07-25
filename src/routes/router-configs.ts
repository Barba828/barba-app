import React from "react";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

import InboxIcon from "@mui/icons-material/MoveToInbox";
import { StarBorder } from "@mui/icons-material";

import { CanvasToLego } from "@/pages/canvas-lego";
import { CanvasMain } from "@/pages/canvas-main";
import { CanvasToRubic, CanvasToPixel } from "@/pages/canvas-cube";
import { CanvasColor, CanvasColorPicker } from "@/pages/canvas-color";
import { CanvasJumpSquare } from "@/pages/canvas-jump-square";

export type RouteProps = {
  path: string;
  title: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  Component: React.FC;
};

export const configs: RouteProps[] = [
  {
    path: "/fun-canvas",
    title: "主页",
    Icon: InboxIcon,
    Component: CanvasMain,
  },
  {
    path: "/fun-canvas/to-lego",
    title: "乐高风格",
    Icon: StarBorder,
    Component: CanvasToLego,
  },
  {
    path: "/fun-canvas/to-pixel",
    title: "像素风格",
    Icon: StarBorder,
    Component: CanvasToPixel,
  },
  {
    path: "/fun-canvas/to-rubik",
    title: "魔方墙风格",
    Icon: StarBorder,
    Component: CanvasToRubic,
  },
  {
    path: "/fun-canvas/color-thief",
    title: "主题色提取",
    Icon: StarBorder,
    Component: CanvasColor,
  },
  {
    path: "/fun-canvas/color-picker",
    title: "相关色获取",
    Icon: StarBorder,
    Component: CanvasColorPicker,
  },
  {
    path: "/fun-canvas/jump-square",
    title: "跳跃方块",
    Icon: StarBorder,
    Component: CanvasJumpSquare,
  },
];
