import React from "react";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

import InboxIcon from "@mui/icons-material/MoveToInbox";
import { StarBorder } from "@mui/icons-material";

import { CanvasToLego } from "@/pages/canvas-lego";
import { CanvasMain } from "@/pages/canvas-main";
import { CanvasToCube } from "@/pages/canvas-cube";

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
    path: "/",
    title: "Main Page",
    Icon: InboxIcon,
    Component: CanvasMain,
  },
  {
    path: "/to-lego",
    title: "Canvas to Lego",
    Icon: StarBorder,
    Component: CanvasToLego,
  },
  {
    path: "/to-cube",
    title: "Canvas to Cube",
    Icon: StarBorder,
    Component: CanvasToCube,
  },
];
