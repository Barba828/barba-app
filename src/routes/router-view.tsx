import { CanvasToLego } from "@/pages/canvas-lego";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";

export const RouterView = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Main Page</div>} />
        <Route path="/to-lego" element={<CanvasToLego />} />
      </Routes>
    </BrowserRouter>
  );
};
