import React from "react";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

import InboxIcon from "@mui/icons-material/MoveToInbox";
import { StarBorder } from "@mui/icons-material";

import { CanvasToLego } from "@/pages/canvas-lego";
import { CanvasMain } from "@/pages/canvas-main";
import { CanvasToCube } from "@/pages/canvas-cube";
import { CanvasColor } from "@/pages/canvas-color";

export type RouteProps = {
  path: string;
  title: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  Component: React.FC;
};

export const configs: RouteProps[] = [
  // {
  //   path: "/",
  //   title: "Main Page",
  //   Icon: InboxIcon,
  //   Component: CanvasMain,
  // },
  {
    path: "/fun-canvas",
    title: "主页",
    Icon: InboxIcon,
    Component: CanvasMain,
  },
  {
    path: "/fun-canvas/to-lego",
    title: "乐高转换",
    Icon: StarBorder,
    Component: CanvasToLego,
  },
  {
    path: "/fun-canvas/to-cube",
    title: "魔方转换",
    Icon: StarBorder,
    Component: CanvasToCube,
  },
  {
    path: "/fun-canvas/color-thief",
    title: "颜色提取",
    Icon: StarBorder,
    Component: CanvasColor,
  },
];
