import React, { FC, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Box,
  Fade,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";
import { BrowserRouter } from "react-router-dom";
import { RouterSide } from "./routes/router-side";
import { RouterView } from "./routes/router-view";

import "./App.css";

export function toGithub() {
  window.location.href = "https://github.com/Barba828/fun-canvas";
}

const App = () => {
  const [checked, setChecked] = useState(false);
  const handleVisible = () => {
    setChecked(!checked);
  };
  return (
    <BrowserRouter>
      <HeaderBar onMenuVisible={handleVisible} />
      <SideBar onMenuVisible={handleVisible} visible={checked} />
      <RouterView />
    </BrowserRouter>
  );
};

const HeaderBar: FC<{ onMenuVisible: () => void }> = ({ onMenuVisible }) => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={onMenuVisible}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Fun Canvas
        </Typography>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toGithub}
        >
          <GitHubIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

const SideBar: FC<{ onMenuVisible: () => void; visible: boolean }> = ({
  onMenuVisible,
  visible,
}) => {
  return (
    <Box
      sx={{
        zIndex: 99,
        position: "fixed",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <Fade in={visible}>
        <Box
          onClick={onMenuVisible}
          position="fixed"
          sx={{
            width: "100%",
            height: "100vh",
            bgcolor: "#222222aa",
          }}
        ></Box>
      </Fade>
      <Slide direction="right" in={visible}>
        <RouterSide onChecked={onMenuVisible} />
      </Slide>
    </Box>
  );
};

export default App;
