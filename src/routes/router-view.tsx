import { Routes, Route } from "react-router";

import { configs } from "./router-configs";

export const RouterView = () => {
  return (
    <Routes>
      {configs.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </Routes>
  );
};
