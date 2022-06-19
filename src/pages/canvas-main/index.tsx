import React, { FC } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

export const CanvasMain: FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        justifyContent: "center",
        marginTop: "2rem",
      }}
      display="flex"
    >
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="180"
          image="https://avatars.githubusercontent.com/u/29791171?v=4"
          alt="green iguana"
          sx={{ objectPosition: "0px -20px;" }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Fun Basic Canvas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A simple native Canvas-based web application. Just a personal Demo
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={() => {
              window.open("https://github.com/Barba828");
            }}
          >
            Barba828
          </Button>
          <Button
            size="small"
            onClick={() => {
              window.open("https://github.com/Barba828/fun-canvas");
            }}
          >
            Github Source
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};
