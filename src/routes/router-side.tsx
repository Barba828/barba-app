import React, { FC, forwardRef } from "react";
import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { configs, RouteProps } from "./router-configs";

export const RouterSide = forwardRef(
  ({ onChecked }: { onChecked: () => void }, ref) => {
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
      setOpen(!open);
    };

    return (
      <List
        ref={ref as any}
        sx={{
          width: 300,
          height: "100vh",
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
      >
        <RouteLinks configs={configs} onClick={onChecked} />

        {/* <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Starred" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Starred" />
            </ListItemButton>
          </List>
        </Collapse> */}
      </List>
    );
  }
);

const RouteLinks: FC<{ configs: RouteProps[]; onClick?(): void }> = ({
  configs,
  onClick,
}) => {
  return (
    <>
      {configs.map((config, index) => {
        const { path, title, Icon } = config;
        return (
          <RouterLink
            key={index}
            to={path}
            style={{ color: "inherit", textDecoration: "none" }}
            onClick={onClick}
          >
            <ListItemButton>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={title} />
            </ListItemButton>
          </RouterLink>
        );
      })}
    </>
  );
};
